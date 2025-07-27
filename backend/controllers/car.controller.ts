import { Request, Response } from "express"
import { CarService } from "../services/car.service";
import { Car } from "../models/car.models";


const carService = new CarService();


export class CarController {
    async findCarByUserId(req: Request, res: Response){
     try {
        const userId = parseInt(req.params.userId, 10)
       
        const car = await carService.findCarByUserId(userId);
        if (!car) {
            return res.status(400).json({ error: "aucune bagnole pour cette utilisateur" })
        }
        return res.status(200).json({ car })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Erreur serveur" })
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
