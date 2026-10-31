import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth";
import habitRoutes from "./routes/habits";
import entryRoutes from "./routes/entries";
import overviewRoutes from "./routes/overview";
import authRoutes from "./routes/auth";

const app = express();

app.use(helmet());
const allowedOrigins = process.env.WEB_ORIGIN
  ? process.env.WEB_ORIGIN.includes(",")
    ? process.env.WEB_ORIGIN.split(",").map((s) => s.trim())
    : process.env.WEB_ORIGIN
  : "http://localhost:3000";

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Public
app.use("/api/auth", authRoutes);
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Protected (JWT required)
app.use("/api/habits", authMiddleware, habitRoutes);
app.use("/api/entries", authMiddleware, entryRoutes);
app.use("/api/overview", authMiddleware, overviewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT ?? 4000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
}

export default app;
