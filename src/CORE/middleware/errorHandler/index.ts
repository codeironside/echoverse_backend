import { Request, Response, NextFunction } from "express";
import chalk from "chalk";

export function errorHandler(
  err: Error & { statusCode?: number; details?: any },
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const time = chalk.gray(new Date().toISOString());
  const status = chalk.bold.red(String(err.statusCode || 500));
  const msg = chalk.red(err.message);

  console.error(
    `${time} [${status}] ${msg} — ${req.method} ${req.originalUrl}`,
    err.details || ""
  );

  if (res.headersSent) return next(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
