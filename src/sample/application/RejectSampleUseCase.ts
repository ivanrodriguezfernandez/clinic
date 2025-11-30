import { ISampleRepository } from '../domain/ISampleRepository';

export interface RejectSampleRequest {
  id: string;
  reason: string;
}

export interface RejectSampleResponse {
  id: string;
  patientId: string;
  sampleType: string;
  status: string;
  notes: string;
  updatedAt: Date;
}

export class RejectSampleUseCase {
  constructor(private sampleRepository: ISampleRepository) {}

  async execute(request: RejectSampleRequest): Promise<RejectSampleResponse> {
    const sample = await this.sampleRepository.findById(request.id);

    if (!sample) {
      throw new Error(`Sample with id ${request.id} not found`);
    }

    sample.reject(request.reason);
    await this.sampleRepository.update(sample);

    return {
      id: sample.getId(),
      patientId: sample.getPatientId(),
      sampleType: sample.getSampleType(),
      status: sample.getStatus(),
      notes: sample.getNotes(),
      updatedAt: sample.getUpdatedAt(),
    };
  }
}
