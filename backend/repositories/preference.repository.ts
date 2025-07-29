import { Pool } from "mysql2/promise";
import { Preference } from "../models/preference.models";

interface IPreferenceRepository{
    getByUserId(userId: number): Promise<Preference[]>;
    update(userId: number, preference: Preference): Promise<void>;
}


export class PreferenceRepository implements IPreferenceRepository{
    private database: Pool;

    constructor(database: Pool){
        this.database = database
    }
      async getByUserId(userId: number): Promise<Preference[]> {
    const [rows] = await this.database.execute(
      "SELECT * FROM preference WHERE user_id = ?",
      [userId]
    );
    return rows as Preference[];
  }

  async update(userId: number, preference: Preference): Promise<void> {
      await this.database.execute("UPDATE preference SET animaux = ?, fumeur = ?, texte_libre = ? WHERE user_id = ?", [
          preference.animaux,
          preference.fumeur,
          preference.texte_libre,
          userId
      ]);
  }
}