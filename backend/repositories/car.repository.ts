import { Pool } from "mysql2/promise";
import { Car } from "../models/car.models";

interface ICarRepository{
      createCar(
    car: Car): Promise<void>;
  findCarByUserId(userId: number): Promise<Car[]>;
  updateCar(
     userId: number,
    couleur: string,
    modele: string,
    energie: boolean,
    immatriculation: string,
    premiereImmatriculationDate: string,
    marqueId?: number
  ): Promise<void>;
  deleteCar(userId: number, car_id: number): Promise<void>
  getAllMarques(): Promise<{ marque_id: number; libellé: string }[]>
}


export class CarRepository implements ICarRepository{

    private database: Pool;

    constructor(database: Pool){
        this.database = database
    }

     async getAllMarques(): Promise<{ marque_id: number; libellé: string }[]> {
    const [rows] = await this.database.execute(`SELECT marque_id, libellé FROM marque`);
    return rows as { marque_id: number; libellé: string }[];
  }
     async createCar(car: Car): Promise<void> {
    const {
      user_id,
      modele,
      couleur,
      energie,
      immatriculation,
      premiere_immatriculation_date,
      marque_id
    } = car;
     console.log("Données reçues :", {
    user_id,
    modele,
    couleur,
    energie,
    immatriculation,
    premiere_immatriculation_date,
    marque_id,
  });

    await this.database.execute(
      `INSERT INTO voiture (user_id, modele, couleur, energie, immatriculation, premiere_immatriculation_date, marque_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, modele, couleur, energie, immatriculation, premiere_immatriculation_date, marque_id]
    );
  }

    async findCarByUserId(userId: number): Promise<Car[]> {
        const [rows] = await this.database.execute(
    `SELECT v.*, m.libellé
     FROM voiture v
     JOIN marque m ON v.marque_id = m.marque_id
     WHERE v.user_id = ?`,
    [userId]
  );
        return rows as Car[];
        
    }

    async deleteCar(userId: number, car_id: number): Promise<void> {
        await this.database.execute("DELETE from voiture WHERE user_id = ? AND voiture_id = ?", [userId, car_id])
    }

    async updateCar(userId: number, couleur: string, modele: string, energie: boolean, immatriculation: string, premiereImmatriculationDate: string, marqueId: number): Promise<void> {
       await this.database.execute("UPDATE voiture SET couleur = ?, modele = ?, energie = ?, immatriculation= ?, premiere_immatriculation_date = ?, marque_id = ? WHERE user_id = ?",
       [couleur, modele, energie, immatriculation, premiereImmatriculationDate, marqueId, userId])
    }


}