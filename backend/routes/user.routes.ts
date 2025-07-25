import express from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { db } from "../config/db"; // Ton pool de connexion MySQL

const router = express.Router();

// Instancie les dépendances
const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Définis les routes
router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));
router.get("/:userId/roles", userController.userGetRoles.bind(userController))
router.put("/:userId/roles", userController.updateUserRoles.bind(userController))
export default router;