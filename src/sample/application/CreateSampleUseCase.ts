import { Sample } from '../domain/Sample';
import { ISampleRepository } from '../domain/ISampleRepository';
import { IPatientRepository } from '../../patient/domain/IPatientRepository';
import { IClinicRepository } from '../../clinic/domain/IClinicRepository';
import { ValidationError } from '../../shared';

export interface CreateSampleRequest {
  patientId: string;
  clinicId: string;
  sampleType: string;
  collectionDate: Date;
}

export interface CreateSampleResponse {
  id: string;
  patientId: string;
  clinicId: string;
  sampleType: string;
  status: string;
  collectionDate: Date;
  notes: string;
  createdAt: Date;
}

export class CreateSampleUseCase {
  constructor(
    private sampleRepository: ISampleRepository,
    private patientRepository: IPatientRepository,
    private clinicRepository: IClinicRepository
  ) {}

  async execute(request: CreateSampleRequest): Promise<CreateSampleResponse> {
    const patient = await this.patientRepository.findById(request.patientId);
    if (!patient) {
      throw new ValidationError(`Patient with id ${request.patientId} not found`);
    }

    const clinic = await this.clinicRepository.findById(request.clinicId);
    if (!clinic) {
      throw new ValidationError(`Clinic with id ${request.clinicId} not found`);
    }

    if (patient.getClinicId() !== request.clinicId) {
      throw new ValidationError('Patient does not belong to the specified clinic');
    }

    const sample = new Sample(
      request.patientId,
      request.clinicId,
      request.sampleType,
      request.collectionDate
    );

    await this.sampleRepository.save(sample);

    return {
      id: sample.getId(),
      patientId: sample.getPatientId(),
      clinicId: sample.getClinicId(),
      sampleType: sample.getSampleType(),
      status: sample.getStatus(),
      collectionDate: sample.getCollectionDate(),
      notes: sample.getNotes(),
      createdAt: sample.getCreatedAt(),
    };
  }
}
