import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { appDB } from "../config/db.js";

export interface AuthRequest extends Request {
  user?: any;
}

export const isAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "No token provided",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: "Invalid token format",
      });
      return;
    }

    //verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    if (!decoded?.id) {
      res.status(401).json({
        message: "Invalid token payload",
      });
      return;
    }

    // DB से fresh user fetch करो
    const result = await appDB.query(
      "SELECT id, email, name, role FROM users WHERE id = $1",
      [decoded.id]
    );

    const user = result.rows[0];

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    // attach to request
    req.user = user;

    next();

  } catch (error) {
    res.status(401).json({
      message: "Unauthorized - token failed",
    });
  }
};