  import { Credit } from "../models/credit.models";

  interface ICreditRepository{
    addCredits(userId: number, amount: number): Promise<void>;
    getCredits(userId: number): Promise<number>;
    deductCredits(userId: number, amount: number): Promise<void>;
  }

  export class CreditRepository implements ICreditRepository{
    async  deductCredits(userId: number, amount: number): Promise<void> {
        await Credit.findByIdAndUpdate(userId, {
            $inc: {credits: -amount}
        })
    }
    async addCredits(userId: number, amount: number): Promise<void> {
        await Credit.findByIdAndUpdate(userId, {
            $inc: {credits: amount}
        })
    }

    async getCredits(userId: number): Promise<number> {
        const user = await Credit.findById(userId)
        return user?.credits || 0
    }

    
  }