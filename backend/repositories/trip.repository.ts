import { promises } from "dns";
import { Avis, Trip, TripDetails } from "../models/trip.model"
import { Pool } from "mysql2/promise";
 import { RowDataPacket } from "mysql2/promise";
import { User } from "../models/user.models";
  import { CreditRepository } from "./credit.repository";
 
 

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
  abortTrip(covoiturage_id: number,userId: number): Promise<void>;
  createTrip(trip: Trip): Promise<{ id: number }>;
  startTrip(covoiturage_id: number, ownerId: number): Promise<void>;
  endTrip(covoiturage_id: number, ownerId: number): Promise<void>;
  tripHistory(userId: number): Promise<Trip[]>;
  getTripParticipants(covoiturageId: number): Promise<User[]>

}


export class TripRepository implements ItripRepository {
  
  private database: Pool;
  private creditRepository: CreditRepository;

  constructor(database: Pool) {
    this.database = database;
    this.creditRepository = new CreditRepository();
  }
 async getTripParticipants(covoiturageId: number): Promise<User[]> {
     const [rows] = await this.database
       .execute("SELECT u.* FROM utilisateur u JOIN participe p ON u.user_id = p.user_id WHERE p.covoiturage_id = ?", [covoiturageId]);
     return rows as User[];
 }

// Met à jour le statut d’un participant
async updateParticipantStatus(covoiturageId: number, userId: number, status: string): Promise<void> {
  await this.database.execute(
    `UPDATE participe
     SET statut = ?
     WHERE covoiturage_id = ? AND user_id = ?`,
    [status, covoiturageId, userId]
  );

  // Après MAJ du participant, on met à jour le statut global du trajet
  await this.updateTripStatus(covoiturageId);
}

// Met à jour le statut global du covoiturage selon les retours des participants
async updateTripStatus(covoiturageId: number): Promise<void> {
 const [ownerRows] = await this.database.execute(
    `SELECT u.user_id
     FROM covoiturage c
     JOIN voiture v ON c.voiture_id = v.voiture_id
     JOIN utilisateur u ON v.user_id = u.user_id
     WHERE c.covoiturage_id = ?`,
    [covoiturageId]
  ) as [RowDataPacket[], any];

  const ownerId = ownerRows[0]?.user_id;
  console.log("Owner ID:", ownerId);

  // Calcule les validations des participants en excluant le propriétaire
 const [rows] = await this.database.execute(
  `SELECT COUNT(*) AS totalParticipants,
          SUM(CASE WHEN statut = 'validated' THEN 1 ELSE 0 END) AS validatedParticipants,
          SUM(CASE WHEN statut = 'problem' THEN 1 ELSE 0 END) AS problemParticipants
   FROM participe
   WHERE covoiturage_id = ? AND user_id != ?`, // Exclut le propriétaire
  [covoiturageId, ownerId]
) as [RowDataPacket[], any];

  console.log("Validation rows:", rows);

 
const totalParticipants = Number(rows[0]?.totalParticipants || 0);
const validatedParticipants = Number(rows[0]?.validatedParticipants || 0);
const problemParticipants = Number(rows[0]?.problemParticipants || 0);
let newStatus: string;

if (problemParticipants > 0) {
  newStatus = 'problem'; // Un problème est signalé
} else if (validatedParticipants === totalParticipants) {
  newStatus = 'validated'; // Tous les participants (sauf le propriétaire) ont validé
} else {
  newStatus = 'pending'; // Il manque des validations
}
console.log("Owner ID:", ownerId);
console.log("Validation rows après correction:", rows);
console.log("Total participants (sans propriétaire):", totalParticipants);
console.log("Validated participants:", validatedParticipants);
console.log("Problem participants:", problemParticipants);
console.log("New status:", newStatus);

  // Mise à jour effective du statut du trajet
  await this.database.execute(
    `UPDATE covoiturage
     SET statut_trajet = ?
     WHERE covoiturage_id = ?`,
    [newStatus, covoiturageId]
  );
  // Si le trajet est validé, calcule le total des crédits dépensés et crédite le propriétaire
  if (newStatus === "validated") {
    const [creditRow] = await this.database.execute(
      `SELECT SUM(montant_debite) AS totalCredits
       FROM participe
       WHERE covoiturage_id = ?`,
      [covoiturageId]
    ) as [RowDataPacket[], any];

    const totalCredits = Number(creditRow[0]?.totalCredits || 0);
    console.log("Total credits to be added to owner:", totalCredits);

    if (ownerId) {
      await this.creditRepository.addCredits(ownerId, totalCredits);
    }
  }
}

async tripHistory(userId: number): Promise<Trip[]> {
  const [rows] = await this.database.execute(
    `SELECT c.*, 
            CASE WHEN c.statut_trajet = 'en_cours' THEN true ELSE false END AS isStarted,
            CASE WHEN c.statut_trajet = 'termine' THEN true ELSE false END AS isEnded,
            CASE WHEN u.user_id = ? THEN true ELSE false END AS isOwner
     FROM covoiturage c
     JOIN voiture v ON c.voiture_id = v.voiture_id
     JOIN utilisateur u ON v.user_id = u.user_id
     JOIN participe p ON p.covoiturage_id = c.covoiturage_id
     WHERE p.user_id = ?`,
    [userId, userId]
  ) as [RowDataPacket[], any];
  return rows as Trip[];
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
   // Décrémente le nombre de places disponibles
  await this.database.execute(
    "UPDATE covoiturage SET nb_place = nb_place - 1 WHERE covoiturage_id = ? AND nb_place > 0",
    [covoiturage_id]
  );
  
    }


    async abortTrip(covoiturage_id: number, userId: number): Promise<void>{
      await this.database.execute("DELETE FROM participe WHERE covoiturage_id = ? AND user_id = ?", [covoiturage_id, userId]);
      // incremente nb_place
      await this.database.execute("UPDATE covoiturage SET nb_place = nb_place + 1 WHERE covoiturage_id = ?", [covoiturage_id])

      
    }

  async findReservation(covoiturage_id: number, userId: number): Promise<any>{
    const [rows] = await this.database.execute("SELECT * FROM participe WHERE covoiturage_id = ? AND user_id = ?", [covoiturage_id, userId]) as [RowDataPacket[], any];
    return rows.length > 0 ? rows[0] : null
  }

  async createTrip(trip: Trip): Promise<{ id: number }> {
    const [result] = await this.database.execute(
    `INSERT INTO covoiturage (lieu_depart, lieu_arrivee,arrive_date, date_depart, heure_depart, arrive_heure, prix, nb_place, voiture_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      trip.lieu_depart,
      trip.lieu_arrivee,
      trip.arrive_date,
      trip.date_depart,
      trip.heure_depart,
      trip.heure_arrivee,
      trip.prix,
      trip.nb_place,
      trip.voiture_id,
    ]
  ) as [import("mysql2/promise").ResultSetHeader, any];

  return { id: result.insertId };
}


async startTrip(covoiturage_id: number, ownerId: number): Promise<void> {
  // Vérifie que l'utilisateur est le propriétaire légitime du trajet
  const [ownerRows] = await this.database.execute(
    `SELECT u.user_id
     FROM covoiturage c
     JOIN voiture v ON c.voiture_id = v.voiture_id
     JOIN utilisateur u ON v.user_id = u.user_id
     WHERE c.covoiturage_id = ? AND u.user_id = ?`,
    [covoiturage_id, ownerId]
  ) as [RowDataPacket[], any];

  if (ownerRows.length === 0) {
    throw new Error("Vous n'êtes pas autorisé à démarrer ce trajet.");
  }

  // Met à jour le statut du trajet
  await this.database.execute(
    "UPDATE covoiturage SET statut_trajet = 'en_cours' WHERE covoiturage_id = ? AND statut_trajet = 'attente'",
    [covoiturage_id]
  );
}

async endTrip(covoiturageId: number, ownerId: number): Promise<void> {
 const [ownerRows] = await this.database.execute(
    `SELECT u.user_id
     FROM covoiturage c
     JOIN voiture v ON c.voiture_id = v.voiture_id
     JOIN utilisateur u ON v.user_id = u.user_id
     WHERE c.covoiturage_id = ? AND u.user_id = ?`,
    [covoiturageId, ownerId]
  ) as [RowDataPacket[], any];

  if (ownerRows.length === 0) {
    throw new Error("Vous n'êtes pas autorisé à démarrer ce trajet.");
  }

  // Met à jour le statut du trajet
  await this.database.execute(
    "UPDATE covoiturage SET statut_trajet = 'termine' WHERE covoiturage_id = ? AND statut_trajet = 'en_cours'",
    [covoiturageId]
  );
}
}
