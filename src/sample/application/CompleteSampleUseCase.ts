import { ISampleRepository } from '../domain/ISampleRepository';

export interface CompleteSampleResponse {
  id: string;
  patientId: string;
  sampleType: string;
  status: string;
  updatedAt: Date;
}

export class CompleteSampleUseCase {
  constructor(private sampleRepository: ISampleRepository) {}

  async execute(id: string): Promise<CompleteSampleResponse> {
    const sample = await this.sampleRepository.findById(id);

    if (!sample) {
      throw new Error(`Sample with id ${id} not found`);
    }

    sample.complete();
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
