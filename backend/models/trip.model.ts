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


export interface Avis {
  note: number;
  commentaire: string;
}

export interface TripDetails {
  covoiturage_id: number;
  lieu_depart: string;
  lieu_arrivee: string;
  date_depart: string;
  heure_depart: string;
  arrive_date: string;
  arrive_heure: string;
  nb_place: number;
  prix: number;
  pseudo: string;
  photo: string;
  voiture_modele: string;
  voiture_energie: string;
  voiture_couleur: string;
  note_moyenne: number;
  animaux: boolean;
  fumeur: boolean;
  texte_libre: string;
   preferences: string[];
  avis: Avis[];
}