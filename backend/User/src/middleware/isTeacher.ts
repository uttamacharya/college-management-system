import type { Request, Response, NextFunction } from "express";

export const isTeacher = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user?.role !== "teacher") {
    return res.status(403).json({
      message: "Only teacher allowed",
    });
  }
  next();
};