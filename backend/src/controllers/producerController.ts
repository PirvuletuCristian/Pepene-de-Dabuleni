import { pool } from "../config/database.js";
import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";
import id from "zod/v4/locales/id.js";

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

export const deleteProducer = async (req: Request, res: Response, next: NextFunction) => {
    const producerId = Number(req.params.id);

    //Validate producedID
    if (!producerId || isNaN(producerId) || producerId <= 0) {
        return 
        res.status(400).json({ error: "Invalid producer ID" });
    }

    try {
        const result = await pool.query(
            `DELETE FROM producers WHERE id = $1 RETURNING *`,
            [producerId]
        );
        
        if (result.rows.length === 0) {
            logger.warn(`Producer with id ${producerId} not found`);
            return res.status(404).json({ error: "Producer not found" });
        }
        
        logger.info(`Producer deleted: id ${producerId} (${result.rows[0].name})`);
        res.status(200).json({ message: "Producer deleted successfully", producer: result.rows[0] });
    } catch (err) {
        logger.error("Failed to delete producer:", err);
        next(err);
    }
};