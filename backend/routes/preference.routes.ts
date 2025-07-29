import express from "express"
import { PreferenceController } from "../controllers/preference.controller"
import { authMiddleware } from "../middlewares/auth"

const router = express.Router()
import { PreferenceService } from "../services/preference.service"

const preferenceService = new PreferenceService()
const preferenceController = new PreferenceController(preferenceService)

router.get("/:userId", authMiddleware, preferenceController.userGetPreferences.bind(preferenceController))
router.put("/:userId", authMiddleware, preferenceController.userUpdatePreferences.bind(preferenceController))
export default router;