import type { ErrorRequestHandler } from "express";
import * as zod from "zod";

const { ZodError } = zod;

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    req.log.warn({ issues: err.issues }, "Validation failed");
    res.status(400).json({
      message: "Validation failed",
      issues: err.issues,
    });
    return;
  }

  req.log.error({ err }, "Unhandled error");
  res.status(500).json({ message: "Internal server error" });
};
