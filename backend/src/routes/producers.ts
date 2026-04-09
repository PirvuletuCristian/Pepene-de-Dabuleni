import { Router } from "express";
import { createProducer, getProducers } from "../controllers/producerController.js";
import { validateProducer } from "../middleware/validation.js";

const router = Router();

router.post("/", validateProducer, createProducer);
router.get("/", getProducers);

export default router;