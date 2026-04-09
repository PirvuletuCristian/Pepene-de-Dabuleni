import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";
import { producerSchema } from "../validators/producerValidator.js";

export function validateProducer(req: Request, res: Response, next: NextFunction) {
    try {
        req.body = producerSchema.parse(req.body);
        next();
    } catch (err) {
        logger.error("Validation error:", err);
        res.status(400).json({ error: "Invalid producer data", details: err });
    }
}