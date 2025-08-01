import express from "express"
import { TripController } from "../controllers/trip.controllers"
import { authMiddleware } from "../middlewares/auth"
import { UserService } from "../services/user.service"
import { UserRepository } from "../repositories/user.repository"
import { db } from "../config/db"

const router = express.Router()
const userRepository = new UserRepository(db);
const tripController = new TripController(userRepository)

router.get("/", tripController.getTrips)
router.get("/:id", tripController.getTripDetails)
router.post("/:id/book", authMiddleware, tripController.bookTrip.bind(tripController))
router.get("/:userId/history", authMiddleware, tripController.getHistory.bind(tripController))
router.post("/create", authMiddleware, tripController.createTrip.bind(tripController))
router.delete("/:id/cancel", authMiddleware, tripController.cancelTrip.bind(tripController))
export default router;