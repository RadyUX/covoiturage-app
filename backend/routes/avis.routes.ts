import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { AvisController } from "../controllers/avis.controller";
import { AvisService } from "../services/avis.service";
import { AvisRepository } from "../repositories/avis.repository";
import { db } from "../config/db";
const avisRepository = new AvisRepository(db);
const router = express.Router();
const avisService = new AvisService(avisRepository);
const avisController = new AvisController(avisService);

router.post("/add", authMiddleware, avisController.addAvis.bind(avisController));

export default router;