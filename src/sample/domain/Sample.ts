import { v4 as uuidv4 } from 'uuid';
import { ValidationError } from '../../shared/errors/ValidationError';
import { ConflictError } from '../../shared/errors/ConflictError';

export enum SampleStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export class Sample {
  private id: string;
  private patientId: string;
  private clinicId: string;
  private sampleType: string;
  private status: SampleStatus;
  private collectionDate: Date;
  private notes: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    patientId: string,
    clinicId: string,
    sampleType: string,
    collectionDate: Date,
    id?: string,
    status?: SampleStatus,
    notes?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    if (!patientId || patientId.trim().length === 0) {
      throw new ValidationError('Patient ID cannot be empty');
    }
    if (!clinicId || clinicId.trim().length === 0) {
      throw new ValidationError('Clinic ID cannot be empty');
    }
    if (!sampleType || sampleType.trim().length === 0) {
      throw new ValidationError('Sample type cannot be empty');
    }
    if (collectionDate > new Date()) {
      throw new ValidationError('Collection date cannot be in the future');
    }

    this.id = id || uuidv4();
    this.patientId = patientId;
    this.clinicId = clinicId;
    this.sampleType = sampleType;
    this.status = status || SampleStatus.PENDING;
    this.collectionDate = collectionDate;
    this.notes = notes || '';
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getPatientId(): string {
    return this.patientId;
  }

  getClinicId(): string {
    return this.clinicId;
  }

  getSampleType(): string {
    return this.sampleType;
  }

  getStatus(): SampleStatus {
    return this.status;
  }

  getCollectionDate(): Date {
    return this.collectionDate;
  }

  getNotes(): string {
    return this.notes;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  changeSampleType(newSampleType: string): void {
    if (!newSampleType || newSampleType.trim().length === 0) {
      throw new ValidationError('Sample type cannot be empty');
    }
    this.sampleType = newSampleType;
    this.updatedAt = new Date();
  }

  updateNotes(newNotes: string): void {
    this.notes = newNotes;
    this.updatedAt = new Date();
  }

  startProcessing(): void {
    if (this.status !== SampleStatus.PENDING) {
      throw new ConflictError('Only pending samples can start processing');
    }
    this.status = SampleStatus.PROCESSING;
    this.updatedAt = new Date();
  }

  complete(): void {
    if (this.status !== SampleStatus.PROCESSING) {
      throw new ConflictError('Only processing samples can be completed');
    }
    this.status = SampleStatus.COMPLETED;
    this.updatedAt = new Date();
  }

  reject(reason: string): void {
    if (this.status === SampleStatus.COMPLETED || this.status === SampleStatus.REJECTED) {
      throw new ConflictError('Cannot reject a completed or already rejected sample');
    }
    this.status = SampleStatus.REJECTED;
    this.notes = `Rejected: ${reason}`;
    this.updatedAt = new Date();
  }

  toPrimitives() {
    return {
      id: this.id,
      patientId: this.patientId,
      clinicId: this.clinicId,
      sampleType: this.sampleType,
      status: this.status,
      collectionDate: this.collectionDate,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
