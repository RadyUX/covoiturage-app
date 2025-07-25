import { Avis, Trip, TripDetails } from "../models/trip.model"
import { Pool } from "mysql2/promise";
 import { RowDataPacket } from "mysql2/promise";
  
 
 

// interface
interface ItripRepository {
  findTripByRequest(lieu_depart: string, lieu_arrivee: string, date: Date, filters?: {
    prix_max?: number;
    note_min?: number;
    est_ecologique?: boolean;
    duree_max?: number;
  }): Promise<Trip[]>;
  findTripDetailsById(covoiturage_id: number):Promise<TripDetails | null>;
  bookTrip(covoiturage_id: number, userId: number, montant: number): Promise<void>;
  
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
    console.log('filters.est_ecologique:', filters?.est_ecologique, typeof filters?.est_ecologique);
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
`;


const params: any[] = [lieu_depart, lieu_arrivee, formattedDate];

    if (filters?.prix_max) {
      query += ` AND c.prix <= ?`;
      params.push(filters.prix_max);
    }

if (filters?.est_ecologique !== undefined) {
  const eco = String(filters.est_ecologique).toLowerCase() === "true" || String(filters.est_ecologique) === "1";
  query += ` AND v.energie = ?`;
  params.push(eco ? 1 : 0);
}

    if (filters?.duree_max) {
      query += ` AND TIMESTAMPDIFF(MINUTE, c.heure_depart, c.arrive_heure) <= ?`;
      params.push(filters.duree_max);
    }

    query += `
  GROUP BY 
    c.covoiturage_id, u.pseudo, u.photo, v.energie
`;

    if (filters?.note_min) {
      query += ` HAVING note_moyenne >= ?`;
      params.push(filters.note_min);
    }

   const [rows] = await this.database.execute(query, params);
    return rows as Trip[];
  }

  async findTripDetailsById(covoiturage_id: number): Promise<TripDetails | null> {
      const [rows] = await this.database.execute(
    `
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
  v.couleur AS voiture_couleur,
  v.modele AS voiture_modele,
  v.energie AS voiture_energie,
  ROUND(AVG(a.note), 1) AS note_moyenne,
  p.animaux,
  p.fumeur,
  p.texte_libre
  
FROM covoiturage c

JOIN voiture v ON v.voiture_id = c.voiture_id
JOIN utilisateur u ON u.user_id = v.user_id
LEFT JOIN avis a ON a.cible_id = u.user_id
LEFT JOIN preference p ON p.user_id = u.user_id
WHERE c.covoiturage_id = ?
GROUP BY c.covoiturage_id;


    `,
    [covoiturage_id]
  ) as unknown as [RowDataPacket[]];

 const trip = rows[0] as TripDetails ;
  if(!trip) return null;
  const [avisRows] = await this.database.execute(
    `
    SELECT note, commentaire 
    FROM avis 
    WHERE cible_id = (
      SELECT u.user_id 
      FROM covoiturage c 
      JOIN voiture v ON v.voiture_id = c.voiture_id 
      JOIN utilisateur u ON u.user_id = v.user_id 
      WHERE c.covoiturage_id = ?
    )
    `,
    [covoiturage_id]
  ) as unknown as [Avis[]];
  return {
    ...trip,
  preferences: [
    trip.animaux ? "animaux" : undefined,
    trip.fumeur ? "fumeur" : undefined,
    trip.texte_libre ? trip.texte_libre : undefined,
  ].filter((v): v is string => typeof v === "string"),

    avis: avisRows,
  }

  }

  async bookTrip(covoiturage_id: number, userId: number, montant: number): Promise<void> {
      const [existing] = await this.database.execute("SELECT * FROM participe WHERE user_id = ? AND covoiturage_id = ?", [userId, covoiturage_id]) as [RowDataPacket[], any];

      if ((existing as RowDataPacket[]).length > 0) {
        throw new Error("vous avez deja reserver ce trajet")
      }
//inscription
      await this.database.execute("INSERT INTO participe (user_id, covoiturage_id, date_reservation,montant_debite, statut) VALUES (?,?,NOW(),?, ?)", [userId, covoiturage_id, montant, "confirmed"]);
  }
}
