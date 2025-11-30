import { Clinic } from './Clinic';

export interface IClinicRepository {
  save(clinic: Clinic): Promise<void>;
  findById(id: string): Promise<Clinic | null>;
  findAll(): Promise<Clinic[]>;
  delete(id: string): Promise<void>;
  update(clinic: Clinic): Promise<void>;
}
