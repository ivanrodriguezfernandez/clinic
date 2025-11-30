import { NotFoundError } from '../../shared/errors/NotFoundError';
import { IClinicRepository } from '../domain/IClinicRepository';

export class DeleteClinicUseCase {
  constructor(private clinicRepository: IClinicRepository) {}

  async execute(id: string): Promise<void> {
    const clinic = await this.clinicRepository.findById(id);

    if (!clinic) {
      throw new NotFoundError(`Clinic with id ${id} not found`);
    }

    await this.clinicRepository.delete(id);
  }
}
