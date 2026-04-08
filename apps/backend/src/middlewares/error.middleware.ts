import { Request, Response, NextFunction } from "express";

/**
 * Standard API Error Shape
 */
interface ApiError extends Error {
  status?: number;
  code?: string;
}

/**
 * Central error handler
 */
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;

  // Log full error internally (dev + prod logging ready)
  console.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Clean response for client
  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Something went wrong on our side"
        : err.message,
  });
};