import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Custom Request Interface
export interface AuthenticatedRequest extends Request {
    user?: any;
    token?: string;
}

export const isAuth = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        // Check Authorization Header
        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        // Split header
        const parts = authHeader.split(" ");
        const token = parts[1];

        if (!token) {
             res.status(401).json({
                message: "Token missing"
            });
            return;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        req.user = decoded;
        req.token = token;

        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid token",
        });
    }
};