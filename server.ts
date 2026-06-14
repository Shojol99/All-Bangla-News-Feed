import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { getLiveStreams } from "./src/api/liveTv.ts";

dotenv.config();

// Fallback for AI Studio environment if .env is not picked up
if (!process.env.YOUTUBE_API_KEY) {
  process.env.YOUTUBE_API_KEY = "AIzaSyCVrAkr7nOyKrkgNUBA03MY-armVaYHKVY";
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route - FIRST
  app.get("/api/live-tv", async (req, res) => {
    console.log("Received request for /api/live-tv");
    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      console.log("API Key loaded:", apiKey ? "Yes (starts with " + apiKey.substring(0, 5) + ")" : "No");
      const data = await getLiveStreams(apiKey);
      res.json(data);
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // SPA Fallback for development
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
