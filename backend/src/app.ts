import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import pool from "./db";

dotenv.config();
const app = express();
pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err: unknown) => console.error("PostgreSQL connection error", err));
app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Mount your routes under /api
app.use("/api/auth", authRoutes);

export default app;
