import express from "express";
import { CarController } from "../controllers/car.controller";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();
const carController = new CarController();

router.get("/marques", carController.getMarques.bind(carController))
router.get("/:userId", authMiddleware, carController.findCarByUserId.bind(carController));
router.post("/create", authMiddleware, carController.createCar.bind(carController));
router.delete("/:userId/:carId", authMiddleware, carController.deleteCar.bind(carController))
export default router;