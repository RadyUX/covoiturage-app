import express from "express";
import { CreditController } from "../controllers/credit.controller";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();
const creditController = new CreditController();

router.get("/:userId", authMiddleware, creditController.getCredits.bind(creditController));

export default router;