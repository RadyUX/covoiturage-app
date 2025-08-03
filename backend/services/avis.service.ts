import { AvisRepository } from "../repositories/avis.repository";

export class AvisService {
  private avisRepository: AvisRepository;

  constructor(avisRepository: AvisRepository) {
    this.avisRepository = avisRepository;
  }

  async getTripOwner(covoiturageId: number): Promise<number> {
    return await this.avisRepository.getCibleId(covoiturageId);
  }

  async addAvis(avis: {
    commentaire: string;
    note: number;
    auteur_id: number;
    cible_id: number;
    status: string;
  }): Promise<void> {
    await this.avisRepository.addAvis(avis);
  }
}