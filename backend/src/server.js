import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import ticketRoutes from "./routes/ticketRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "AI customer Support API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "backend",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
