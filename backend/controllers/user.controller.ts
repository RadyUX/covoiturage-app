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
        console.error("Erreur lors de l'enregistrement  de l'utilisateur:", err.message);
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

        const { token, user } = await this.userService.login(email, password);
        console.log(user);
// S’assure que password est absent


res.status(200).json({
  token,
  user
});
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

async updateUserRoles(req: Request, res: Response): Promise<Response> {
    try {
        const userId = parseInt(req.params.userId, 10);
        const { roles } = req.body; // { roles: ["chauffeur", "passager"] }

        if (!Array.isArray(roles)) {
            return res.status(400).json({ error: "Le champ 'roles' doit être un tableau" });
        }

    if (!roles.includes("passager")) {
        roles.push("passager");
        }

        await this.userService.updateRoles(userId, roles);
        return res.status(200).json({ message: "Rôles mis à jour avec succès" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour des rôles :", err);
        const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
        return res.status(500).json({ error: errorMessage });
    }
}
  async userGetRoles(req: Request, res: Response): Promise<Response>{
    try{
        const userId= parseInt(req.params.userId, 10);
        const userRoles = await this.userService.userGetRoles(userId);

        const idAdmin = userRoles.includes("admin")
        return res.status(200).json({roles: userRoles, isAdmin: idAdmin})

    }catch(err){
        console.error("erreur lors de la récuperation des roles", err)
        return res.status(500).json({error: "erreur interne du serveur"})
    }
  }

 
}
