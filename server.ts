import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();

  // In sandbox/container environment behind Nginx proxy, bind to port 3000.
  // In standalone Cloud Run production deployment, bind to process.env.PORT.
  const isSandbox = Boolean(process.env.CONTROL_PLANE_PORT || process.env.DEFAULT_APP_PORT);
  const PORT = isSandbox ? 3000 : (Number(process.env.PORT) || 3000);

  // Health check endpoint for Cloud Run and load balancers
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
