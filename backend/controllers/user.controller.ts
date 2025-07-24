import { Request, Response } from "express";
import { User } from "../models/user.models";
import { UserService } from "../services/user.service";


export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

async register(req: Request, res: Response) {
    try {
        const user = await this.userService.register(req.body);
        res.status(201).json(user);
    } catch (err: any) {
        console.error("Erreur lors de l'enregistrement :", err.message);
        if (err.message.includes("Duplicate entry")) {
            return res.status(400).json({ error: "Un utilisateur avec cet email existe déjà" });
        }
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
}
 async login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        // Vérifie que les champs requis sont présents
        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe sont requis" });
        }

        const user = await this.userService.login(email, password);
        res.status(200).json(user);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}
}
