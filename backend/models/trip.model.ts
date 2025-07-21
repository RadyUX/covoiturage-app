export interface TripInput {
  date_depart: Date;
  heure_depart: string;
  lieu_depart: string;
  arrive_date: Date;
  arrive_heure: string;
  status: string;
  nb_place: number;
  prix: number;
  voiture_id: number;
}

export interface Trip {
  covoiturage_id: number;
  date_depart: Date; 
  heure_depart: string; 
  lieu_depart: string;
  arrive_date: Date;
  arrive_heure: string;
  status: string;
  nb_place: number;
  prix: number;
  voiture_id: number;
}
