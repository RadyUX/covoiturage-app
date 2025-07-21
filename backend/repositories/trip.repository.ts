import { Trip } from "../models/trip.model"
import { Pool } from "mysql2/promise";
 
  
 
 

// interface
interface ItripRepository {
  findTripByRequest(lieu_depart: string, lieu_arrivee: string, date: Date, filters?: {
    prix_max?: number;
    note_min?: number;
    est_ecologique?: boolean;
    duree_max?: number;
  }): Promise<Trip[]>;
}

// implémentation
export class TripRepository implements ItripRepository {
  private database: Pool;

  constructor(database: Pool) {
    this.database = database;
  }

  async findTripByRequest(lieu_depart: string, lieu_arrivee: string, date: Date,filters?: {
    prix_max?: number;
    note_min?: number;
    est_ecologique?: boolean;
    duree_max?: number;
  }): Promise<Trip[]> {
    const formattedDate = date.toISOString().slice(0, 10);
    let query =  `
  SELECT 
    c.covoiturage_id,
    c.lieu_depart,
    c.lieu_arrivee,
    c.date_depart,
    c.heure_depart,
    c.arrive_date,
    c.arrive_heure,
    c.nb_place,
    c.prix,
    u.pseudo,
    u.photo,
    v.energie AS est_ecologique,
    ROUND(AVG(a.note), 1) AS note_moyenne
  FROM covoiturage c
  JOIN voiture v ON v.voiture_id = c.voiture_id
  JOIN utilisateur u ON u.user_id = v.user_id
  LEFT JOIN avis a ON a.cible_id = u.user_id
  WHERE 
    c.lieu_depart = ? AND 
    c.lieu_arrivee = ? AND 
    c.date_depart = ? AND 
    c.nb_place > 0
  GROUP BY 
    c.covoiturage_id, u.pseudo, u.photo, v.energie
`;

const params: any[] = [lieu_depart, lieu_arrivee, formattedDate];

if (filters?.prix_max) {
  query += ` AND c.prix <= ?`;
  params.push(filters.prix_max);
}
if (filters?.note_min) {
  query += ` HAVING note_moyenne >= ?`;
  params.push(filters.note_min);
}
if (filters?.est_ecologique === true) {
  query += ` AND v.energie = "électrique"`;
}
if (filters?.duree_max) {
  query += ` AND TIMESTAMPDIFF(MINUTE, c.heure_depart, c.arrive_heure) <= ?`;
  params.push(filters.duree_max);
}


   const [rows] = await this.database.execute(query, params);
    return rows as Trip[];
  }
}
