import type { Response, NextFunction } from "express";

import type { AuthenticatedRequest } from "../types/index.js";

export const isTeacher = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {

  if (req.user?.role !== "teacher") {

    res.status(403).json({
      message: "Only teachers allowed",
    });

    return;
  }

  next();
};