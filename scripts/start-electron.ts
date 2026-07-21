import { spawn, type ChildProcess } from "node:child_process";
import electronPath from "electron";
import { createServer, type ViteDevServer } from "vite";
import { startServer } from "../server/index.js";

let electronProcess: ChildProcess | undefined;
let viteServer: ViteDevServer | undefined;
let apiServer: Awaited<ReturnType<typeof startServer>> | undefined;
let shuttingDown = false;

async function shutdown(exitCode: number): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;

  electronProcess?.kill();
  await Promise.allSettled([
    viteServer?.close(),
    new Promise<void>((resolve, reject) => {
      if (!apiServer?.listening) {
        resolve();
        return;
      }

      apiServer.close((error) => (error ? reject(error) : resolve()));
    }),
  ]);
  process.exit(exitCode);
}

async function start(): Promise<void> {
  apiServer = await startServer(process.env.PORT || 3001);
  viteServer = await createServer({ configFile: "./vite.config.js" });
  await viteServer.listen();

  electronProcess = spawn(electronPath, ["."], { stdio: "inherit" });
  electronProcess.once("error", (error) => {
    console.error("Failed to start Electron:", error);
    void shutdown(1);
  });
  electronProcess.once("exit", (code) => void shutdown(code ?? 0));
}

process.once("SIGINT", () => void shutdown(0));
process.once("SIGTERM", () => void shutdown(0));

start().catch((error) => {
  console.error("Failed to start Gaia Core AI:", error);
  void shutdown(1);
});
