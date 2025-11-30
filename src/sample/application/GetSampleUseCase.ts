import { ISampleRepository } from '../domain/ISampleRepository';

export interface GetSampleResponse {
  id: string;
  patientId: string;
  clinicId: string;
  sampleType: string;
  status: string;
  collectionDate: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetSampleUseCase {
  constructor(private sampleRepository: ISampleRepository) {}

  async execute(id: string): Promise<GetSampleResponse | null> {
    const sample = await this.sampleRepository.findById(id);

    if (!sample) {
      return null;
    }

    return {
      id: sample.getId(),
      patientId: sample.getPatientId(),
      clinicId: sample.getClinicId(),
      sampleType: sample.getSampleType(),
      status: sample.getStatus(),
      collectionDate: sample.getCollectionDate(),
      notes: sample.getNotes(),
      createdAt: sample.getCreatedAt(),
      updatedAt: sample.getUpdatedAt(),
    };
  }
}
