import { Sample } from './Sample';

export interface ISampleRepository {
  save(sample: Sample): Promise<void>;
  findById(id: string): Promise<Sample | null>;
  findByPatientId(patientId: string): Promise<Sample[]>;
  update(sample: Sample): Promise<void>;
  delete(id: string): Promise<void>;
  update(sample: Sample): Promise<void>;
}
