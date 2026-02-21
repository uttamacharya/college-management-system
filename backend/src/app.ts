import express from 'express'
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

// Health check route
app.get("/", (req, res) => {
  res.send("College Management System API running...");
});

export default app;