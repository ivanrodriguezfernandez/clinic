import { IPatientRepository } from '../domain/IPatientRepository';

export class DeletePatientUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(id: string): Promise<void> {
    const patient = await this.patientRepository.findById(id);

    if (!patient) {
      throw new Error(`Patient with id ${id} not found`);
    }

    await this.patientRepository.delete(id);
  }
}
