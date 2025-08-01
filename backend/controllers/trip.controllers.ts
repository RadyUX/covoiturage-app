import { TripDetails } from "../models/trip.model";
import { CreditService } from "../services/credit.service";
import { tripService } from "../services/trip.service";
import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";

export class TripController {
  private tripservice = new tripService();
  private creditService = new CreditService();
  private userService: UserService;

  constructor(userRepository: UserRepository) {
    this.userService = new UserService(userRepository);
  }


 getTrips = async (req: Request, res: Response) => {
    const filters = {
  prix_max: req.query.prix_max ? Number(req.query.prix_max) : undefined,
  note_min: req.query.note_min ? Number(req.query.note_min) : undefined,
  est_ecologique: req.query.est_ecologique === "true",
  duree_max: req.query.duree_max ? Number(req.query.duree_max) : undefined,
};
  try {
    const { lieu_depart, lieu_arrivee, date, est_ecologique, prix_max, duree_max, note_min} = req.query;

    if (!lieu_depart || !lieu_arrivee || !date) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const trips = await this.tripservice.searchTrip({
      lieu_depart: String(lieu_depart),
      lieu_arrivee: String(lieu_arrivee),
      date: new Date(date as string),
      filters
    });

    

    if (!trips || trips.length === 0) {
  return res.status(200).json({ trips: [] }); 
}

return res.status(200).json({ trips });

   


  } catch (error) {
    console.error("❌ Erreur dans getTrips :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


getTripDetails = async(req: Request, res: Response) =>{
  try{
    const tripId = Number(req.params.id);
    if(!tripId){
      return res.status(400).json({error: "id invalide"});

    }
    const tripDetails: TripDetails | null = await this.tripservice.getTripDetails(tripId);
    if(!tripDetails) return res.status(404).json({error: "trajet non trouvé"});

    return res.status(200).json({tripDetails})
  }catch(error){
  console.error("err dans getTripDetails",error)
  res.status(500).json({error:"erreur serveur"})
}
}
  async bookTrip(req: Request, res: Response){
    try{
      const userId = req.body.userId;
      const {montant} = req.body;
      const covoiturage_id = Number(req.params.id)

      if(!userId || !montant){
        return res.status(400).json({error: 'les champs sont requis'})
      }
    
      const alreadyBooked = await this.tripservice.alreadyBooked(covoiturage_id, userId)
      if(alreadyBooked){
        return res.status(400).json({error: "vous avez deja reserver ce trajet"})
      }else{
          await this.creditService.bookTrip(userId, montant)
     await this.tripservice.bookTrip(covoiturage_id, userId, montant);
     
      console.log(`Déduction de ${montant} crédits pour l'utilisateur ${userId}`);
      
      res.status(200).json({message: "reservation effectué avec succés"})
      }
     
 
    }catch(error){
      console.error("err dans bookTrip",error)
      res.status(500).json({error:"erreur serveur"})
    }
  }

  async cancelTrip(req: Request, res: Response){
   const userId = req.body.userId;
   const covoiturageId = parseInt(req.params.id, 10);
   const credits = req.body.credits
   try{
    const userRoles = await this.userService.userGetRoles(userId)
    const isChauffeur = userRoles.includes("chauffeur")
      // Si l'utilisateur est un chauffeur, envoie un mail aux participants
   if(isChauffeur){
    console.log("chauufeur")
   }

     await this.tripservice.abortTrip(covoiturageId, userId);
     await this.creditService.addCredits(userId, credits)
     res.status(200).json({message: "Annulation réussie"});
   }catch(error){
     console.error("err dans cancelTrip",error)
     res.status(500).json({error:"erreur serveur"})
   }
  }
  async createTrip(req: Request, res: Response){
    try{
      const trip = req.body;
      const userId = req.body.userId;
        if (!userId || !trip) {
      return res.status(400).json({ error: "Les champs sont requis" });
    }

    console.log(req.body)
    const createdTrip = await this.tripservice.createTrip(trip);

    // Ajoute automatiquement le chauffeur au trajet pour l'historique
    await this.tripservice.bookTrip(createdTrip.id, userId, 0); // Montant = 0 car le chauffeur ne paie pas

      res.status(201).json({message: "Trajet créé avec succès"});
      
    }catch(error){
      console.error("err dans createTrip",error)
       console.log(req.body)
      res.status(500).json({error:"erreur serveur"})
    }
  }



 async getHistory(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId, 10);
    console.log("Requête reçue pour l'historique avec userId :", userId);

    if (isNaN(userId)) {
      console.error("ID utilisateur invalide :", req.params.userId);
      return res.status(400).json({ error: "ID utilisateur invalide" });
    }

    const trips = await this.tripservice.getHistory(userId);
    console.log("Historique des trajets :", trips);

    res.status(200).json(trips);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique des trajets :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

}
