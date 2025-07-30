import { TripRepository } from "../repositories/trip.repository"
import { db
 } from "../config/db";

import { Trip, TripDetails } from "../models/trip.model";
import { CreditRepository } from "../repositories/credit.repository";

 const tripRepository = new TripRepository(db)

export class tripService {

  

 async searchTrip(criteria: {
  lieu_depart: string;
  lieu_arrivee: string;
  date: Date;
  filters?: {
    prix_max?: number;
    note_min?: number;
    est_ecologique?: boolean;
    duree_max?: number;
  };
}): Promise<Trip[]>  {
  return await tripRepository.findTripByRequest(
    criteria.lieu_depart,
    criteria.lieu_arrivee,
    criteria.date,
    criteria.filters
  );
}


async getHistory(userId: number): Promise<Trip[]> {
  return await tripRepository.tripHistory(userId);
}
async getTripDetails(id: number): Promise<TripDetails | null>{
  return await tripRepository.findTripDetailsById(id);
}


async bookTrip(covoiturage_id: number, userId: number, montant: number): Promise<void>{
 
  return await tripRepository.bookTrip(covoiturage_id, userId, montant)
 
}

async abortTrip(covoiturage_id: number, userId: number): Promise<void>{
  return await tripRepository.abortTrip(covoiturage_id, userId)
  
}


async alreadyBooked(covoiturage_id: number, userId: number): Promise<boolean>{
  const existingReservation = await tripRepository.findReservation(covoiturage_id, userId)
  return !!existingReservation 

}

async createTrip(trip: Trip): Promise<{ id: number }>{
  return await tripRepository.createTrip(trip)
}
}