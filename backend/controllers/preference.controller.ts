
import { Request, Response } from "express";
import { PreferenceService } from "../services/preference.service";

export class PreferenceController{
 private preferenceService: PreferenceService;

  constructor(preferenceService: PreferenceService) {
    this.preferenceService = preferenceService;
  }

     async userGetPreferences(req: Request, res: Response): Promise<Response>{
    try{
        const userId = parseInt(req.params.userId, 10);
        const preferences = await this.preferenceService.getUserPreferences(userId);
        return res.status(200).json({ preferences });
    }catch(err){
        console.error("Erreur lors de la récupération des préférences :", err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  async userUpdatePreferences(req: Request, res: Response): Promise<Response>{
    try{
            const userId = parseInt(req.params.userId, 10);
            const updatedPreferences = req.body;
             await this.preferenceService.updateUserPreferences(userId, updatedPreferences);
            return res.status(200).json({message : "preference mise a jour avec succés"})

    }catch(err){
        console.error("Erreur lors de la mise à jour des préférences :", err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }
}