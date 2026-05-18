import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { login, logout, checkSession } from "../controllers/authController.ts";

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { error: "Too many login attempts. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = Router();

router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.get("/check", checkSession);

export default router;
