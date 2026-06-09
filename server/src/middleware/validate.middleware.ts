import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';

export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, params: req.params, query: req.query });
      next();
    } catch (error: any) {
      const message = error.errors ? error.errors.map((err: any) => err.message).join(', ') : error.message;
      res.status(400).json({ status: 'error', message });
    }
  };
}
