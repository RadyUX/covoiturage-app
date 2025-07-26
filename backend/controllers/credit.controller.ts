import { CreditService } from "../services/credit.service";
import { Request, Response } from "express";




export class CreditController {
    private creditService = new CreditService();

    async getCredits(req: Request, res: Response){
        try{
            const userId = parseInt(req.params.userId, 10);
               if (isNaN(userId)) {
      return res.status(400).json({ error: "ID utilisateur invalide" });
    }

      const credit = await this.creditService.getCredits(userId);
      res.status(200).json({credit});
    } catch(err){
         console.error("Erreur lors de la récupération des crédits :", err);
    return res.status(500).json({ error: "Erreur interne du serveur" });
    }
        }
    }
