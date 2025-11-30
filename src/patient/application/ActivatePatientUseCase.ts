import { NotFoundError } from '../../shared/errors/NotFoundError';
import { IPatientRepository } from '../domain/IPatientRepository';

export interface ActivatePatientResponse {
  id: string;
  fullName: string;
  isActive: boolean;
  updatedAt: Date;
}

export class ActivatePatientUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(id: string): Promise<ActivatePatientResponse> {
    const patient = await this.patientRepository.findById(id);

    if (!patient) {
      throw new NotFoundError(`Patient with id ${id} not found`);
    }

    patient.activate();
    await this.patientRepository.update(patient);

    return {
      id: patient.getId(),
      fullName: patient.getFullName(),
      isActive: patient.isPatientActive(),
      updatedAt: patient.getUpdatedAt(),
    };
  }
}
