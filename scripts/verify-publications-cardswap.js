const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");
const os = require("os");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9226;
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
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

async function run() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-cardswap-test-"));
  console.log(`[CDP] Launching clean headless Chrome...`);

  const chromeProcess = spawn(
    CHROME_PATH,
    [
      "--headless=new",
      "--disable-extensions",
      "--disable-component-extensions-with-background-pages",
      "--disable-default-apps",
      "--no-first-run",
      `--window-size=1280,900`,
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${tmpDir}`,
      TARGET_URL,
    ],
    { stdio: "ignore" }
  );

  let targetWsUrl = null;
  for (let i = 0; i < 30; i++) {
    await wait(350);
    try {
      const list = await fetchJson(`http://127.0.0.1:${PORT}/json`);
      if (list && list.length > 0) {
        const page = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
        if (page) { targetWsUrl = page.webSocketDebuggerUrl; break; }
      }
    } catch {}
  }

  if (!targetWsUrl) {
    console.error("FAIL: Could not connect to Chrome DevTools port.");
    chromeProcess.kill();
    process.exit(1);
  }

  const ws = new WebSocket(targetWsUrl);
  const consoleMessages = [];
  let nextId = 1;

  const send = (method, params = {}) => new Promise((resolve) => {
    const id = nextId++;
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) { ws.removeEventListener("message", handler); resolve(msg.result); }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.consoleAPICalled") {
      const text = msg.params.args.map((a) => a.value || a.description || "").join(" ");
      consoleMessages.push({ type: msg.params.type, text });
    }
  });

  await send("Runtime.enable");
  await send("Page.enable");
  await wait(2500);

  console.log("\n--- TEST 1: Inspect Publications Track Dimensions ---");
  const trackInfo = await send("Runtime.evaluate", {
    expression: `(() => {
      const sec = document.getElementById('publications');
      if (!sec) return { found: false };
      const track = sec.querySelector('div[style*="calc"]');
      const sticky = sec.querySelector('.sticky');
      return {
        found: true,
        trackFound: Boolean(track),
        trackHeight: track ? track.style.height : null,
        trackClientHeight: track ? track.clientHeight : null,
        stickyFound: Boolean(sticky),
      };
    })()`,
    returnByValue: true,
  });
  console.log("Track Info:", JSON.stringify(trackInfo?.result?.value, null, 2));

  console.log("\n--- TEST 2: Step-by-Step Scroll Through All 8 Cards ---");
  const scrollResults = [];
  
  // Position directly at start of sticky track
  await send("Runtime.evaluate", {
    expression: `(() => {
      const track = document.getElementById('publications').querySelector('div[style*="calc"]');
      const rect = track.getBoundingClientRect();
      const stickyTop = window.innerWidth >= 768 ? 96 : 80;
      window.scrollTo({ top: window.scrollY + rect.top - stickyTop, behavior: 'instant' });
    })()`,
  });
  await wait(400);

  for (let cardIdx = 0; cardIdx < 8; cardIdx++) {
    // Scroll to exact position for cardIdx
    await send("Runtime.evaluate", {
      expression: `(() => {
        const track = document.getElementById('publications').querySelector('div[style*="calc"]');
        const rect = track.getBoundingClientRect();
        const stickyTop = window.innerWidth >= 768 ? 96 : 80;
        const target = window.scrollY + rect.top - stickyTop + ${cardIdx} * 380;
        window.scrollTo({ top: target, behavior: 'instant' });
      })()`,
    });
    await wait(300);

    const stepState = await send("Runtime.evaluate", {
      expression: `(() => {
        const stack = document.querySelector('[aria-label="Academic Works 3D Card Stack"]');
        const counter = stack ? stack.innerText.match(/Entry (\\d+) of (\\d+)/)?.[0] : null;
        
        // Find front card
        const cardDivs = Array.from(stack.querySelectorAll('div[style*="position: absolute"]'));
        const frontCard = cardDivs.find(d => {
          const z = parseInt(d.style.zIndex || '0');
          return z >= 18 && d.style.display !== 'none';
        });
        const title = frontCard ? frontCard.querySelector('h3')?.innerText : null;
        
        return {
          step: ${cardIdx + 1},
          counter,
          frontTitle: title ? title.substring(0, 45) + '...' : null,
        };
      })()`,
      returnByValue: true,
    });
    scrollResults.push(stepState?.result?.value);
  }
  console.log("All 8 Cards Progress:", JSON.stringify(scrollResults, null, 2));

  console.log("\n--- TEST 3: Mid-Transition Falling Animation State ---");
  // Scroll to halfway between card 1 and 2 (e.g. scrolled = 190px)
  await send("Runtime.evaluate", {
    expression: `(() => {
      const track = document.getElementById('publications').querySelector('div[style*="calc"]');
      const rect = track.getBoundingClientRect();
      const stickyTop = window.innerWidth >= 768 ? 96 : 80;
      window.scrollTo({ top: window.scrollY + rect.top - stickyTop + 190, behavior: 'instant' });
    })()`,
  });
  await wait(300);

  const bgInspect = await send("Runtime.evaluate", {
    expression: `(() => {
      const stack = document.querySelector('[aria-label="Academic Works 3D Card Stack"]');
      const cards = Array.from(stack.querySelectorAll('div[style*="position: absolute"]'));
      return cards.slice(0, 4).map((c, i) => {
        const inner = c.firstElementChild;
        return {
          i,
          wrapperBg: getComputedStyle(c).backgroundColor,
          wrapperOpacity: getComputedStyle(c).opacity,
          innerBg: inner ? getComputedStyle(inner).backgroundColor : null,
          innerOpacity: inner ? getComputedStyle(inner).opacity : null,
        };
      });
    })()`,
    returnByValue: true,
  });
  console.log("Card Backgrounds & Opacities:", JSON.stringify(bgInspect?.result?.value, null, 2));

  const midState = await send("Runtime.evaluate", {
    expression: `(() => {
      const stack = document.querySelector('[aria-label="Academic Works 3D Card Stack"]');
      const cardDivs = Array.from(stack.querySelectorAll('div[style*="position: absolute"]'));
      
      // Card 0 (falling)
      const card0 = cardDivs[0];
      // Card 1 (advancing)
      const card1 = cardDivs[1];

      return {
        card0Transform: card0 ? card0.style.transform : null,
        card0ZIndex: card0 ? card0.style.zIndex : null,
        card0Opacity: card0 ? card0.style.opacity : null,
        card1Transform: card1 ? card1.style.transform : null,
        card1ZIndex: card1 ? card1.style.zIndex : null,
      };
    })()`,
    returnByValue: true,
  });
  console.log("Mid-transition Falling State:", JSON.stringify(midState?.result?.value, null, 2));

  // Capture Screenshot of mid-transition falling card
  const ss1 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join("C:\\Users\\dipay\\.gemini\\antigravity\\brain\\d0eb6ebe-0a57-4c72-b26c-bc4b9f8d8de4", "publications-scroll-falling-card.png"),
    Buffer.from(ss1.data, "base64")
  );
  console.log("Captured: publications-scroll-falling-card.png");

  console.log("\n--- TEST 4: Reverse Scroll Verification ---");
  // Scroll from card 8 back to card 4
  await send("Runtime.evaluate", {
    expression: `(() => {
      const track = document.getElementById('publications').querySelector('div[style*="calc"]');
      const rect = track.getBoundingClientRect();
      const stickyTop = window.innerWidth >= 768 ? 96 : 80;
      window.scrollTo({ top: window.scrollY + rect.top - stickyTop + 3 * 380, behavior: 'instant' });
    })()`,
  });
  await wait(300);
  const reverseState = await send("Runtime.evaluate", {
    expression: `(() => {
      const stack = document.querySelector('[aria-label="Academic Works 3D Card Stack"]');
      return stack ? stack.innerText.match(/Entry (\\d+) of (\\d+)/)?.[0] : null;
    })()`,
    returnByValue: true,
  });
  console.log("Reverse Scroll to Card 4 Result:", reverseState?.result?.value);

  console.log("\n--- TEST 5: Manual Navigation & Page Scroll Synchronization ---");
  // Test clicking Next Card button
  const manualNextResult = await send("Runtime.evaluate", {
    expression: `(async () => {
      const nextBtn = document.querySelector('button[aria-label="Swap to next card"]');
      const scrollBefore = window.scrollY;
      nextBtn.click();
      await new Promise(r => setTimeout(r, 600));
      const scrollAfter = window.scrollY;
      const counter = document.querySelector('[aria-label="Academic Works 3D Card Stack"]')?.innerText.match(/Entry (\\d+) of (\\d+)/)?.[0];
      return {
        scrollBefore,
        scrollAfter,
        scrolledDown: scrollAfter > scrollBefore,
        counter,
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  console.log("Manual Next Click Result:", JSON.stringify(manualNextResult?.result?.value, null, 2));

  // Test clicking Dot 1
  const dotClickResult = await send("Runtime.evaluate", {
    expression: `(async () => {
      const dots = document.querySelectorAll('button[aria-label*="Jump to entry"]');
      const dot0 = dots[0];
      dot0.click();
      await new Promise(r => setTimeout(r, 600));
      const counter = document.querySelector('[aria-label="Academic Works 3D Card Stack"]')?.innerText.match(/Entry (\\d+) of (\\d+)/)?.[0];
      return {
        counter,
        scrollAfter: window.scrollY,
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  console.log("Dot Click Result:", JSON.stringify(dotClickResult?.result?.value, null, 2));

  console.log("\n--- TEST 6: Category Filter Tabs Verification ---");
  const tabFilterResult = await send("Runtime.evaluate", {
    expression: `(async () => {
      const buttons = Array.from(document.querySelectorAll('#publications button'));
      const patentTab = buttons.find(b => b.innerText.trim() === 'Patents');
      patentTab.click();
      await new Promise(r => setTimeout(r, 400));

      const patentCounter = document.querySelector('[aria-label="Academic Works 3D Card Stack"]')?.innerText.match(/Entry (\\d+) of (\\d+)/)?.[0];
      const trackHeightPatent = document.getElementById('publications').querySelector('div[style*="height"]')?.style.height;

      // Switch back to All Works
      const allTab = buttons.find(b => b.innerText.trim() === 'All Works');
      allTab.click();
      await new Promise(r => setTimeout(r, 400));
      const allCounter = document.querySelector('[aria-label="Academic Works 3D Card Stack"]')?.innerText.match(/Entry (\\d+) of (\\d+)/)?.[0];

      return {
        patentCounter,
        trackHeightPatent,
        allCounter,
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  console.log("Tab Filter Result:", JSON.stringify(tabFilterResult?.result?.value, null, 2));

  console.log("\n--- TEST 7: Clean Release into Next Section (Experiences) ---");
  const exitSectionResult = await send("Runtime.evaluate", {
    expression: `(async () => {
      const track = document.getElementById('publications').querySelector('div[style*="calc"]');
      const rect = track.getBoundingClientRect();
      const stickyTop = window.innerWidth >= 768 ? 96 : 80;
      // Scroll past the end of the publications track (e.g. 7 * 380 + 300)
      window.scrollTo({ top: window.scrollY + rect.top - stickyTop + 7 * 380 + 300, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 400));

      const expSection = document.getElementById('experience') || document.querySelector('section[id*="exp"]');
      const expRect = expSection ? expSection.getBoundingClientRect() : null;

      return {
        expFound: Boolean(expSection),
        expTop: expRect ? expRect.top : null,
        inViewport: expRect ? expRect.top < window.innerHeight && expRect.bottom > 0 : false,
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  console.log("Natural Release into Next Section Result:", JSON.stringify(exitSectionResult?.result?.value, null, 2));

  // Capture Screenshot of natural release into next section
  const ss2 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join("C:\\Users\\dipay\\.gemini\\antigravity\\brain\\d0eb6ebe-0a57-4c72-b26c-bc4b9f8d8de4", "publications-natural-release-verified.png"),
    Buffer.from(ss2.data, "base64")
  );
  console.log("Captured: publications-natural-release-verified.png");

  // Check console errors
  const errors = consoleMessages.filter((m) => m.type === "error");
  console.log(`\nTotal Console Errors Detected: ${errors.length}`);
  errors.forEach(e => console.log(`  ERROR: ${e.text}`));

  ws.close();
  chromeProcess.kill();
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}

  console.log("\n=== ALL TEST CHECKS FINISHED SUCCESSFULLY ===");
}

run().catch((err) => {
  console.error("FAIL:", err);
  process.exit(1);
});
