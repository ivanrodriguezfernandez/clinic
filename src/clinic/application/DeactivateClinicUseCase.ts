import { NotFoundError } from '../../shared/errors/NotFoundError';
import { IClinicRepository } from '../domain/IClinicRepository';

export interface DeactivateClinicResponse {
  id: string;
  name: string;
  isActive: boolean;
  updatedAt: Date;
}

export class DeactivateClinicUseCase {
  constructor(private clinicRepository: IClinicRepository) {}

  async execute(id: string): Promise<DeactivateClinicResponse> {
    const clinic = await this.clinicRepository.findById(id);

    if (!clinic) {
      throw new NotFoundError(`Clinic with id ${id} not found`);
    }

    clinic.deactivate();
    await this.clinicRepository.update(clinic);

    return {
      id: clinic.getId(),
      name: clinic.getName().getValue(),
      isActive: clinic.isClinicActive(),
      updatedAt: clinic.getUpdatedAt(),
    };
  }
}
