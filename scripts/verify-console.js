const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");
const os = require("os");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;
const TARGET_URL = "http://localhost:3000";

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

async function run() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-clean-interactive-"));
  console.log(`[Verifier] Launching clean headless Chrome (with WebGL enabled, no extensions)...`);

  const chromeProcess = spawn(
    CHROME_PATH,
    [
      "--headless=new",
      "--disable-extensions",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${tmpDir}`,
      TARGET_URL,
    ],
    { stdio: "ignore" }
  );

  let targetWsUrl = null;
  for (let i = 0; i < 30; i++) {
    await wait(300);
    try {
      const list = await fetchJson(`http://127.0.0.1:${PORT}/json`);
      if (list && list.length > 0) {
        const page = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
        if (page) {
          targetWsUrl = page.webSocketDebuggerUrl;
          break;
        }
      }
    } catch {
      // Chrome starting
    }
  }

  if (!targetWsUrl) {
    console.error("[Verifier] Could not connect to Chrome CDP.");
    chromeProcess.kill();
    process.exit(1);
  }

  const ws = new WebSocket(targetWsUrl);
  const consoleMessages = [];
  const exceptions = [];

  let nextId = 1;
  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const id = nextId++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener("message", handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.consoleAPICalled") {
      const text = msg.params.args.map((a) => a.value || a.description || "").join(" ");
      consoleMessages.push({
        type: msg.params.type,
        text,
      });
      console.log(`[Browser ${msg.params.type.toUpperCase()}] ${text}`);
    } else if (msg.method === "Runtime.exceptionThrown") {
      const desc = msg.params.exceptionDetails.text || msg.params.exceptionDetails.exception?.description || "";
      exceptions.push(desc);
      console.log(`[Browser EXCEPTION] ${desc}`);
    }
  };

  await send("Runtime.enable");
  await send("Page.enable");
  await send("DOM.enable");

  console.log("[Verifier] Step 1: Initial load complete. Scrolling through all sections to activate 3D & observers...");
  await send("Runtime.evaluate", {
    expression: `window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' })`,
  });
  await wait(2000);

  console.log("[Verifier] Step 2: Scrolling to contact section...");
  await send("Runtime.evaluate", {
    expression: `
      const contactSection = document.getElementById('contact');
      if (contactSection) contactSection.scrollIntoView();
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    `,
  });
  await wait(2000);

  console.log("[Verifier] Step 3: Interacting with ContactForm inputs...");
  const formInteraction = await send("Runtime.evaluate", {
    expression: `(() => {
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      if (nameInput) {
        nameInput.focus();
        nameInput.value = "Dr. Jane Doe";
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (emailInput) {
        emailInput.focus();
        emailInput.value = "jane.doe@university.edu";
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (messageInput) {
        messageInput.focus();
        messageInput.value = "We are interested in collaborating on computer vision research.";
        messageInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      return {
        emailValue: emailInput ? emailInput.value : null,
        dataTempMail: emailInput ? emailInput.getAttribute('data-temp-mail-org') : null,
        style: emailInput ? emailInput.getAttribute('style') : null,
      };
    })()`,
    returnByValue: true,
  });

  console.log("[Verifier] ContactForm Interaction Result:", JSON.stringify(formInteraction?.result?.value, null, 2));

  console.log("[Verifier] Step 4: Refreshing page to verify hydration idempotency on reload...");
  await send("Page.reload");
  await wait(3000);

  ws.close();
  chromeProcess.kill();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}

  console.log("\n================ FULL VERIFICATION AUDIT ================");
  const hydrationErrors = consoleMessages.filter(
    (m) =>
      m.text.toLowerCase().includes("hydration") ||
      m.text.toLowerCase().includes("did not match")
  );
  const threeClockWarnings = consoleMessages.filter((m) =>
    m.text.includes("THREE.Clock") || m.text.includes("Clock: This module has been deprecated")
  );

  console.log(`Total console messages logged: ${consoleMessages.length}`);
  console.log(`React Hydration Warnings/Errors: ${hydrationErrors.length}`);
  console.log(`THREE.Clock Deprecation Warnings: ${threeClockWarnings.length}`);
  console.log(`Unhandled Browser Exceptions: ${exceptions.length}`);

  if (hydrationErrors.length > 0) {
    console.log("Hydration Errors:", hydrationErrors);
  }
  if (threeClockWarnings.length > 0) {
    console.log("THREE.Clock Warnings:", threeClockWarnings);
  }
  console.log("=========================================================\n");
}

run().catch((err) => {
  console.error("Verification script failed:", err);
  process.exit(1);
});
