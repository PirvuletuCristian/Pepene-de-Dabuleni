import { Router } from "express";
import { createProducer, getProducers } from "../controllers/producerController.js";

const router = Router();

router.post("/", createProducer);
router.get("/", getProducers);

export default router;