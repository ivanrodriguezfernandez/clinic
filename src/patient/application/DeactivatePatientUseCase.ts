import { IPatientRepository } from '../domain/IPatientRepository';

export interface DeactivatePatientResponse {
  id: string;
  fullName: string;
  isActive: boolean;
  updatedAt: Date;
}

export class DeactivatePatientUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(id: string): Promise<DeactivatePatientResponse> {
    const patient = await this.patientRepository.findById(id);

    if (!patient) {
      throw new Error(`Patient with id ${id} not found`);
    }

    patient.deactivate();
    await this.patientRepository.update(patient);

    return {
      id: patient.getId(),
      fullName: patient.getFullName(),
      isActive: patient.isPatientActive(),
      updatedAt: patient.getUpdatedAt(),
    };
  }
}
