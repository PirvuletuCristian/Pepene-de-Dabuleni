import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger.ts";
import { producerSchema } from "../validators/producerValidator.ts";

export function validateProducer(req: Request, res: Response, next: NextFunction) {
    try {
        req.body = producerSchema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            logger.error("Validation error:", err);
            res.status(400).json({ error: "Invalid producer data", details: err.issues });
        } else {
            next(err);
        }
    }
}