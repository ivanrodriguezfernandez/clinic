import { ISampleRepository } from '../domain/ISampleRepository';

export interface ListSamplesByPatientResponse {
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

export class ListSamplesByPatientUseCase {
  constructor(private sampleRepository: ISampleRepository) {}

  async execute(patientId: string): Promise<ListSamplesByPatientResponse[]> {
    const samples = await this.sampleRepository.findByPatientId(patientId);

    return samples.map((sample) => ({
      id: sample.getId(),
      patientId: sample.getPatientId(),
      clinicId: sample.getClinicId(),
      sampleType: sample.getSampleType(),
      status: sample.getStatus(),
      collectionDate: sample.getCollectionDate(),
      notes: sample.getNotes(),
      createdAt: sample.getCreatedAt(),
      updatedAt: sample.getUpdatedAt(),
    }));
  }
}
