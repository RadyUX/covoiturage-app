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

}
