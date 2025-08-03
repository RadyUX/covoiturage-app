import { Pool } from "mysql2/promise";
import { RowDataPacket } from "mysql2/promise";
  

  export class AvisRepository{
    private database: Pool

     constructor(database: Pool) {
    this.database = database;
  }


  async getCibleId(covoiturageId: number): Promise<number>{
     const [rows] = await this.database.execute(
      `SELECT u.user_id
       FROM utilisateur u
       JOIN voiture v ON u.user_id = v.user_id
       JOIN covoiturage c ON v.voiture_id = c.voiture_id
       WHERE c.covoiturage_id = ?`,
      [covoiturageId]
    ) as [RowDataPacket[], any];

    if (rows.length === 0) {
      throw new Error("Propriétaire du trajet introuvable");
    }

    return rows[0].user_id; 

  }
  
   async addAvis(avis: {
    commentaire: string;
    note: number;
    auteur_id: number;
    cible_id: number;
    status: string;
  }): Promise<void> {
    await this.database.execute(
      `INSERT INTO avis (commentaire, note, auteur_id, cible_id, status)
       VALUES (?, ?, ?, ?, ?)`,
      [avis.commentaire, avis.note, avis.auteur_id, avis.cible_id, avis.status]
    );
  }


  }