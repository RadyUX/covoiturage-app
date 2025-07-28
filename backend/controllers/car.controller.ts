import { Request, Response } from "express"
import { CarService } from "../services/car.service";
import { Car } from "../models/car.models";


const carService = new CarService();


export class CarController {
   async findCarByUserId(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId, 10);

    // Appelle le service pour récupérer toutes les voitures
    const cars = await carService.findCarByUserId(userId);

    if (!cars || cars.length === 0) {
      return res.status(404).json({ error: "Aucune voiture trouvée pour cet utilisateur" });
    }

    return res.status(200).json({ cars });
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

    

    async createCar(req: Request, res: Response) {
    try {
      const car: Car = req.body; // Récupère l'objet `Car` depuis le corps de la requête
      await carService.createCar(car);
      return res.status(201).json({ message: "Voiture créée avec succès" });
    } catch (error) {
      console.error("Erreur lors de la création de la voiture :", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  async getMarques(req: Request, res: Response) {
  try {
    const marques = await carService.getMarque();
     console.log("Requête reçue :", req.body, req.query, req.params);
    res.status(200).json({ marques });
  } catch (error) {
    console.error("Erreur lors de la récupération des marques :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }}
}
