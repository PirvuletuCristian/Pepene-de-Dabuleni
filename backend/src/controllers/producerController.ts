import { pool } from "../config/database.js";
import { Request, Response } from "express";

export const createProducer = async (req: Request, res: Response) => {
    const { name, product, latitude, longitude } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO producers (name, product, location)
            VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326))
            RETURNING *`,
            [name, product, longitude, latitude]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Failed to add producer" });
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
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Failed to fetch producers" })
    }
};