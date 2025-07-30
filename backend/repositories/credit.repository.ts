  import { ObjectId } from "mongodb";
import { Credit } from "../models/credit.models";

  interface ICreditRepository{
    addCredits(userId: number, amount: number): Promise<void>;
    getCredits(userId: number): Promise<number>;
    deductCredits(userId: number, amount: number): Promise<void>;
    createInitialCredits(userId: number, amount: number): Promise<void>;
  }

  export class CreditRepository implements ICreditRepository{
    async  deductCredits(userId: number, amount: number): Promise<void> {
        await Credit.findOneAndUpdate({ user_id: userId }, {
            $inc: {credits: -amount}
        })
    }
    async addCredits(userId: number, amount: number): Promise<void> {
        await Credit.findOneAndUpdate({ user_id: userId }, {
            $inc: {credits: amount}
        })
    }

    async getCredits(userId: number): Promise<number> {
        const user = await Credit.findOne({user_id: userId})
        return user?.credits || 0
    }

   async createInitialCredits(userId: number, amount: number): Promise<void> {
    console.log(`Tentative d'ajout de crédits pour l'utilisateur ${userId} avec montant ${amount}`);
  const newCredit = new Credit({
    user_id: userId, //  comme clé primaire
    credits: amount,
  });
  await newCredit.save();
}
    
  }