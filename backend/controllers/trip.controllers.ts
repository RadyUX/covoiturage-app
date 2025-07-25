import { TripDetails } from "../models/trip.model";
import { tripService } from "../services/trip.service";
import { Request, Response } from "express";

export class TripController {
  private tripservice = new tripService();

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
      await this.tripservice.bookTrip(covoiturage_id, userId, montant);
      res.status(200).json({message: "reservation effectué avec succés"})
    }catch(error){
      console.error("err dans bookTrip",error)
      res.status(500).json({error:"erreur serveur"})
    }
  }

}
