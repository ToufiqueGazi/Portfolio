#!/usr/bin/env node

/**
 * Built-in Zero-Dependency Static File Server for Production Export.
 * Serves the statically exported 'out/' directory on http://localhost:3000.
 * Eliminates "next start does not work with output: export" crashes.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.env.PORT || "3000", 10);
const OUT_DIR = path.join(__dirname, "..", "out");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".glb": "model/gltf-binary",
};

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error(`\n[Static Server] Directory "${OUT_DIR}" not found.`);
    console.error(`[Static Server] Please run "npm run build" first to export the static site, or run "npm run dev" for development.\n`);
    process.exit(1);
  }

  const server = http.createServer((req, res) => {
    let cleanUrl = (req.url || "/").split("?")[0];
    try {
      cleanUrl = decodeURIComponent(cleanUrl);
    } catch {
      // bad URI
    }

    let filePath = path.join(OUT_DIR, cleanUrl);

    // If requesting a directory, look for index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    // If file doesn't exist, try appending .html (Next.js trailingSlash/clean URL fallback)
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + ".html")) {
      filePath = filePath + ".html";
    }

    // If still doesn't exist, fallback to 404.html or out/index.html (SPA/Client router)
    if (!fs.existsSync(filePath)) {
      const notFoundPath = path.join(OUT_DIR, "404.html");
      const fallbackIndex = path.join(OUT_DIR, "index.html");
      filePath = fs.existsSync(notFoundPath) ? notFoundPath : fallbackIndex;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error: " + err.message);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`\n▲ Static Production Server`);
    console.log(`- Local:         http://localhost:${PORT}`);
    console.log(`- Directory:     ${OUT_DIR}`);
    console.log(`✓ Serving pre-rendered static export ready for GitHub Pages\n`);
  });
}

main();
