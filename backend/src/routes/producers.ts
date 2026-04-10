import { Router } from "express";
import { createProducer, getProducers, deleteProducer } from "../controllers/producerController.js";
import { validateProducer } from "../middleware/validation.js";

const router = Router();

router.post("/", validateProducer, createProducer);
router.get("/", getProducers);
router.delete("/:id", deleteProducer);

export default router;