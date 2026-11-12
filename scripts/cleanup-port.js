#!/usr/bin/env node

/**
 * Safe process cleanup utility for development port.
 * Inspects any process listening on the target port.
 * Does NOT terminate unknown processes.
 * Only terminates stale Node.js development servers belonging to this environment.
 */

const { execSync } = require("child_process");

const PORT = process.env.PORT || 3000;

function getListeningPid(port) {
  try {
    if (process.platform === "win32") {
      const output = execSync(`netstat -ano | findstr :${port}`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
      const lines = output.trim().split("\n");
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        // Ensure state is explicitly LISTENING and local port matches target
        if (parts.length >= 5 && parts[3] === "LISTENING") {
          const localAddr = parts[1];
          if (localAddr.endsWith(`:${port}`)) {
            const pid = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(pid) && pid > 0) {
              return pid;
            }
          }
        }
      }
    } else {
      const pidStr = execSync(`lsof -ti :${port} -sTCP:LISTEN`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (pidStr) {
        return parseInt(pidStr.split("\n")[0], 10);
      }
    }
  } catch {
    return null;
  }
  return null;
}

function getProcessInfo(pid) {
  if (!pid) return null;
  try {
    if (process.platform === "win32") {
      const output = execSync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (output && !output.includes("No tasks")) {
        const match = output.match(/^"([^"]+)"/);
        return match ? match[1] : "unknown";
      }
    } else {
      const name = execSync(`ps -p ${pid} -o comm=`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      return name || "unknown";
    }
  } catch {
    return null;
  }
  return null;
}

function safeKill(pid, procName) {
  if (!pid) return;
  try {
    if (process.platform === "win32") {
      execSync(`taskkill /F /PID ${pid} 2>nul`, { stdio: "ignore" });
    } else {
      process.kill(pid, "SIGTERM");
    }
    console.log(`[cleanup] Successfully cleared stale ${procName} (PID: ${pid}) on port ${PORT}.`);
  } catch {
    console.log(`[cleanup] Process ${pid} on port ${PORT} was already terminated.`);
  }
}

function main() {
  const pid = getListeningPid(PORT);
  if (!pid) {
    console.log(`[cleanup] Port ${PORT} is clear. Ready for Next.js development server.`);
    return;
  }

  const procName = getProcessInfo(pid);
  const isNode = procName && (procName.toLowerCase() === "node.exe" || procName.toLowerCase() === "node");

  if (!isNode) {
    console.warn(`[cleanup] Port ${PORT} is occupied by unknown process "${procName}" (PID: ${pid}).`);
    console.warn(`[cleanup] Preserving unknown process. Next.js will offer an alternate port or configure PORT=3001.`);
    return;
  }

  console.log(`[cleanup] Found stale Node.js development server (${procName}, PID: ${pid}) listening on port ${PORT}. Clearing...`);
  safeKill(pid, procName);
}

main();
