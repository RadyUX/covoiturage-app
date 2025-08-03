import { AvisService } from "../services/avis.service";
import { Request, Response } from "express";
export class AvisController {
  private avisService: AvisService;

  constructor(avisService: AvisService) {
    this.avisService = avisService;
  }

  async addAvis(req: Request, res: Response): Promise<Response> {
    const { commentaire, note, auteur_id, covoiturage_id } = req.body;

    try {
      // Récupère le propriétaire du trajet
      const tripOwnerId = await this.avisService.getTripOwner(covoiturage_id);
console.log("Requête reçue :", { commentaire, note, auteur_id, covoiturage_id });
      // Enregistre l'avis dans la table
      await this.avisService.addAvis({
        commentaire,
        note,
        auteur_id,
        cible_id: tripOwnerId, // Le propriétaire du trajet
        status: "pending", // Par défaut, l'avis est en attente de validation
      });

      return res.status(200).json({ message: "Avis enregistré avec succès" });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis :", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }
}