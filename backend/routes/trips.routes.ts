import express from "express"
import { TripController } from "../controllers/trip.controllers"
import { authMiddleware } from "../middlewares/auth"

const router = express.Router()
const tripController = new TripController()

router.get("/", tripController.getTrips)
router.get("/:id", tripController.getTripDetails)
router.post("/:id/book", authMiddleware,tripController.bookTrip)
export default router;