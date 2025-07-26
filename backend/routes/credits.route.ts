import express from "express";
import { CreditController } from "../controllers/credit.controller";

const router = express.Router();
const creditController = new CreditController();

router.get("/:userId", creditController.getCredits.bind(creditController));

export default router;