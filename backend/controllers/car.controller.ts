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
  
  async deleteCar(req: Request, res: Response){
    try{
        const userId = parseInt(req.params.userId, 10);
        const carId = parseInt(req.params.carId, 10)
        await carService.deleteCar(userId, carId)


        
    }catch(error){
        console.error("erreur lors de la suppression de la voiture", error)
         if (
      typeof error === "object" &&
      error !== null &&
      "sqlMessage" in error &&
      typeof (error as any).sqlMessage === "string" &&
      (error as any).sqlMessage.includes(
        "Cannot delete or update a parent row: a foreign key constraint fails"
      )
    ) {
      return res
        .status(400)
        .json({
          error:
            "Vous ne pouvez pas supprimer une voiture qui participe actuellement à un trajet.",
        });
    }
    res.status(500).json({ message: error });
  }}
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
