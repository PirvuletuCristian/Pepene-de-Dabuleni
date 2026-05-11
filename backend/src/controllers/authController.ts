import { pool } from "../config/database.ts";
import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.ts";

declare module "express-session" {
    interface SessionData {
        userId: number;
        username: string;
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
    }

    try {
        const result = await pool.query(
            "SELECT id, username, password_hash FROM admin_users WHERE username = $1",
            [username]
        );

        if (result.rows.length === 0) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        req.session.userId = user.id;
        req.session.username = user.username;

        logger.info(`Admin logged in: ${user.username}`);
        res.json({ message: "Login successful", username: user.username });
    } catch (err) {
        logger.error("Login error:", err);
        next(err);
    }
};

export const logout = async (req: Request, res: Response) => {
    const username = req.session.username;
    req.session.destroy((err) => {
        if (err) {
            logger.error("Logout error:", err);
            res.status(500).json({ error: "Failed to logout" });
            return;
        }
        res.clearCookie("connect.sid");
        logger.info(`Admin logged out: ${username}`);
        res.json({ message: "Logout successful" });
    });
};

export const checkSession = async (req: Request, res: Response) => {
    if (req.session.userId) {
        res.json({ authenticated: true, username: req.session.username });
    } else {
        res.json({ authenticated: false });
    }
};
