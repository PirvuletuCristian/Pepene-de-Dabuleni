import { pool } from "../config/database.js";
import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";

export const createProducer = async (req: Request, res: Response, next: NextFunction) => {
    const { name, product, latitude, longitude } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO producers (name, product, location)
            VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326))
            RETURNING *`,
            [name, product, longitude, latitude]
        );
        logger.info(`Producer created: ${name}`);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        logger.error("Failed to create producer:", err);
        next(err);
    }
};

export const getProducers = async (_: Request, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT id, name, product,
                ST_Y(location::geometry) as latitude,
                ST_X(location::geometry) as longitude,
                created_at
            FROM producers`
        );
        logger.info(`Fetched ${result.rows.length} producers`);
        res.json(result.rows);
    } catch (err) {
        logger.error("Failed to fetch producers:", err);
        res.status(500).json({ error: "Failed to fetch producers" })
    }
};