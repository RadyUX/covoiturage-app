import { CreditRepository } from "../repositories/credit.repository";


export class CreditService {
    private creditRepository = new CreditRepository();

    addInitalCredits(userId: number){
        return this.creditRepository.addCredits(userId, 20)
    }

    bookTrip(userId: number, cost: number){
        return this.creditRepository.deductCredits(userId, cost)
    }

    getCredits(userId: number){
        return this.creditRepository.getCredits(userId)
    }
}