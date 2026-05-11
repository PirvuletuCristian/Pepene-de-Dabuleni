import { Router } from "express";
import { createProducer, getProducers, deleteProducer, updateProducer } from "../controllers/producerController.ts";
import { validateProducer } from "../middleware/validation.ts";
import { requireAuth } from "../middleware/auth.ts";

const router = Router();

router.get("/", getProducers);
router.post("/", requireAuth, validateProducer, createProducer);
router.put("/:id", requireAuth, validateProducer, updateProducer);
router.delete("/:id", requireAuth, deleteProducer);

export default router;