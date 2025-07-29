import { db } from "../config/db";
import { Preference } from "../models/preference.models";
import { PreferenceRepository } from "../repositories/preference.repository";


const preferenceRepository = new PreferenceRepository(db);
export class PreferenceService{
  async getUserPreferences(userId: number): Promise<Preference[]>{
    return await preferenceRepository.getByUserId(userId)
  }

  async updateUserPreferences(userId: number, updatedPreferences: Preference): Promise<void>{
    return await preferenceRepository.update(userId, updatedPreferences)
  }
}