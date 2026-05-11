import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.ts";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.userId) {
        next();
    } else {
        logger.warn("Unauthorized access attempt");
        res.status(401).json({ error: "Authentication required" });
    }
}
