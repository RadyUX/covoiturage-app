import express from "express"
import { TripController } from "../controllers/trip.controllers"

const router = express.Router()
const tripController = new TripController()

router.get("/", tripController.getTrips)

export default router;