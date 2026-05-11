import { Router } from "express";
import { login, logout, checkSession } from "../controllers/authController.ts";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/check", checkSession);

export default router;
