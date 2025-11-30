import { NotFoundError } from '../../shared/errors/NotFoundError';
import { ISampleRepository } from '../domain/ISampleRepository';

export interface StartProcessingSampleResponse {
  id: string;
  patientId: string;
  sampleType: string;
  status: string;
  updatedAt: Date;
}

export class StartProcessingSampleUseCase {
  constructor(private sampleRepository: ISampleRepository) {}

  async execute(id: string): Promise<StartProcessingSampleResponse> {
    const sample = await this.sampleRepository.findById(id);

    if (!sample) {
      throw new NotFoundError(`Sample with id ${id} not found`);
    }

    sample.startProcessing();
    await this.sampleRepository.update(sample);

    return {
      id: sample.getId(),
      patientId: sample.getPatientId(),
      sampleType: sample.getSampleType(),
      status: sample.getStatus(),
      updatedAt: sample.getUpdatedAt(),
    };
  }
}
