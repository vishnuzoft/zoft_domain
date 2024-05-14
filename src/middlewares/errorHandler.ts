import { NextFunction, Request, Response } from "express";

import { customError } from "../utility";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("error from the middleware: ", err);

  if (err instanceof customError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      details: err.details,
    });
  } else {
    res.status(500).json({
      error: `Internal Server Error: ${err.message}`,
      status: 500,
      message: "failed",
    });
  }
}
