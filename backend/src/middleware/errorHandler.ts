import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    logger.error("Error:", err);

    //Custom error with status
    if (err.status) {
        res.status(err.status).json({ error: err.message });
    }

    //Zod validation error
    if (err.errors && Array.isArray(err.errors)) {
        res.status(400).json({ error: "Validation failed", details: err.errors });
    }

    //Default to 500
    res.status(500).json({ error: "Internal Server Error" });
}