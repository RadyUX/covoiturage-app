import { db } from "../config/db";
import { Car } from "../models/car.models";
import { CarRepository } from "../repositories/car.repository";

const carRepository = new CarRepository(db)
export class CarService {
    async findCarByUserId(userId: number): Promise<Car[]>{
        return carRepository.findCarByUserId(userId);
    }

    async createCar(car: Car): Promise<void>{
        return carRepository.createCar(car);
    }

    async deleteCar(userId: number, car_id: number): Promise<void>{
        return carRepository.deleteCar(userId, car_id);
    }
     async getMarque(): Promise<{ marque_id: number; libellé: string }[]> {
    return carRepository.getAllMarques(); 
  }

}