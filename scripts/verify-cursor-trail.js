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
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-cursor-monochrome-"));
  console.log(`[Cursor Test] Launching Chrome to verify monochrome refinement & subtle glow...`);

  const chromeProcess = spawn(
    CHROME_PATH,
    [
      "--headless=new",
      "--disable-extensions",
      "--enable-webgl",
      `--window-size=1280,800`,
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
      // Retrying
    }
  }

  if (!targetWsUrl) {
    console.error("[Cursor Test] Failed to connect to CDP.");
    chromeProcess.kill();
    process.exit(1);
  }

  const ws = new WebSocket(targetWsUrl);
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

  await send("Page.enable");
  await send("Runtime.enable");
  await wait(2000); // Allow initial hydration

  console.log("[Cursor Test] Step 1: Simulating horizontal sweep across dark background...");
  for (let x = 200; x <= 650; x += 15) {
    await send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x,
      y: 300,
    });
    await wait(16);
  }

  // Sample RGB channels to mathematically confirm ZERO tint (R == G == B on trail)
  const colorAudit = await send("Runtime.evaluate", {
    expression: `(() => {
      const canvas = document.getElementById('custom-cursor-canvas');
      if (!canvas) return { error: "Canvas not found" };
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      
      // Sample head, wake, and tail pixels on the canvas
      const head = ctx.getImageData(Math.round(650 * dpr), Math.round(300 * dpr), 1, 1).data;
      const wake = ctx.getImageData(Math.round(610 * dpr), Math.round(300 * dpr), 1, 1).data;
      const tail = ctx.getImageData(Math.round(570 * dpr), Math.round(300 * dpr), 1, 1).data;

      const isMonochrome = (p) => Math.abs(p[0] - p[1]) <= 2 && Math.abs(p[1] - p[2]) <= 2;

      return {
        head: { r: head[0], g: head[1], b: head[2], a: head[3], monochrome: isMonochrome(head) },
        wake: { r: wake[0], g: wake[1], b: wake[2], a: wake[3], monochrome: isMonochrome(wake) },
        tail: { r: tail[0], g: tail[1], b: tail[2], a: tail[3], monochrome: isMonochrome(tail) },
      };
    })()`,
    returnByValue: true,
  });

  console.log("[Cursor Test] Color Audit Result (RGB Equality Check):", JSON.stringify(colorAudit?.result?.value, null, 2));

  // Capture screenshot of refined subtle monochrome cursor & trail over dark section
  const screenshotDark = await send("Page.captureScreenshot", { format: "png" });
  if (screenshotDark && screenshotDark.data) {
    const screenshotPath = "C:\\Users\\dipay\\.gemini\\antigravity\\brain\\d0eb6ebe-0a57-4c72-b26c-bc4b9f8d8de4\\cursor-monochrome-dark.png";
    fs.writeFileSync(screenshotPath, Buffer.from(screenshotDark.data, "base64"));
    console.log(`[Cursor Test] Saved dark section screenshot: ${screenshotPath}`);
  }

  // Scroll to research section (with cards and lighter elements) and test sweep
  console.log("[Cursor Test] Step 2: Scrolling to content cards and testing sweep...");
  await send("Runtime.evaluate", {
    expression: `window.scrollTo({ top: 900, behavior: 'instant' });`,
  });
  await wait(600);

  for (let x = 250; x <= 600; x += 15) {
    await send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x,
      y: 400,
    });
    await wait(16);
  }

  const screenshotCards = await send("Page.captureScreenshot", { format: "png" });
  if (screenshotCards && screenshotCards.data) {
    const screenshotPath = "C:\\Users\\dipay\\.gemini\\antigravity\\brain\\d0eb6ebe-0a57-4c72-b26c-bc4b9f8d8de4\\cursor-monochrome-cards.png";
    fs.writeFileSync(screenshotPath, Buffer.from(screenshotCards.data, "base64"));
    console.log(`[Cursor Test] Saved content cards screenshot: ${screenshotPath}`);
  }

  // Verify decay when stopping
  console.log("[Cursor Test] Step 3: Verifying smooth natural decay upon mouse stop...");
  await wait(450);

  const decayStatus = await send("Runtime.evaluate", {
    expression: `(() => {
      const canvas = document.getElementById('custom-cursor-canvas');
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const wakePixelAfterDecay = ctx.getImageData(Math.round(570 * dpr), Math.round(400 * dpr), 1, 1).data;
      const headPixel = ctx.getImageData(Math.round(600 * dpr), Math.round(400 * dpr), 1, 1).data;
      return {
        wakePixelAlphaAfterDecay: wakePixelAfterDecay[3], // should be 0 or 1 (decayed)
        headPixelAlpha: headPixel[3], // should remain visible at cursor position
      };
    })()`,
    returnByValue: true,
  });

  console.log("[Cursor Test] Natural Decay Verification:", JSON.stringify(decayStatus?.result?.value, null, 2));

  ws.close();
  chromeProcess.kill();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
