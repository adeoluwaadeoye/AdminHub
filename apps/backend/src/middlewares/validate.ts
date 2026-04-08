import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

type ValidateSchema = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export const validate =
  (schemas: ValidateSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as unknown as ParsedQs;
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as unknown as ParamsDictionary;
      }

      next();
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors || err.message,
      });
    }
  };