import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';
import { connectRedis } from './config/redis.js';

// Load environment variables
dotenv.config();

// Express App
const app: Application = express();

// Environment Variables
const PORT: number = Number(process.env.PORT) || 5000;

// MIDDLEWARES

// Enable CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Parse JSON requests
app.use(express.json());

// ROUTES

app.use('/api/ai', aiRoutes);

// Health Check Route
app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: '🤖 AI Microservice is running!'
    });
});

// GLOBAL ERROR HANDLER

app.use((err: Error, _req: Request, res: Response) => {
    console.error("❌ Global Error:", err.message);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

// SERVER START FUNCTION

const startServer = async (): Promise<void> => {
    try {
        // Connect Redis
        await connectRedis();

        // Start Server
        app.listen(PORT, () => {
            console.log(`🚀 AI Microservice running at http://localhost:${PORT}`);
        });

    } catch (error: unknown) {

        if (error instanceof Error) {
            console.error("❌ Server initialization error:", error.message);
        }

        process.exit(1);
    }
};

// HANDLE UNCAUGHT ERRORS

process.on("uncaughtException", (error: Error) => {
    console.error("❌ Uncaught Exception:", error.message);
});

process.on("unhandledRejection", (reason: unknown) => {
    console.error("❌ Unhandled Rejection:", reason);
});

// START SERVER

startServer();