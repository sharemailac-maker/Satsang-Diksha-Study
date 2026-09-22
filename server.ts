import express from "express";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === "production";

  // In Cloud Run production deployment, listen on process.env.PORT (typically 8080).
  // In development, listen on port 3000 (behind the Nginx proxy).
  const primaryPort = isProd ? (Number(process.env.PORT) || 8080) : 3000;

  // Health check endpoints for Cloud Run, Kubernetes, and load balancers
  app.get(["/api/health", "/health", "/_health"], (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Vite middleware for development (lazy-loaded so production doesn't require Vite)
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = fs.existsSync(path.join(process.cwd(), "dist"))
      ? path.join(process.cwd(), "dist")
      : __dirname;
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind primary port
  const primaryServer = app.listen(primaryPort, "0.0.0.0", () => {
    console.log(`Server running in ${isProd ? "production" : "development"} mode on http://0.0.0.0:${primaryPort}`);
  });

  primaryServer.on("error", (err: any) => {
    console.error(`Fatal: Failed to bind primary port ${primaryPort}:`, err);
    process.exit(1);
  });

  // In production, also bind auxiliary port 3000 if different from primaryPort,
  // ensuring backwards compatibility if an internal proxy routes to 3000.
  if (isProd && primaryPort !== 3000) {
    try {
      const auxServer = app.listen(3000, "0.0.0.0", () => {
        console.log(`Auxiliary server listening on http://0.0.0.0:3000`);
      });
      auxServer.on("error", (err: any) => {
        console.warn(`Auxiliary port 3000 not bound (${err.code || err.message}), ignoring.`);
      });
    } catch (err: any) {
      console.warn("Could not bind auxiliary port 3000:", err?.message || err);
    }
  }
}

startServer();
