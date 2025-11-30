import { Patient } from './Patient';

export interface IPatientRepository {
  save(patient: Patient): Promise<void>;
  findById(id: string): Promise<Patient | null>;
  findByClinicId(clinicId: string): Promise<Patient[]>;
  update(patient: Patient): Promise<void>;
  delete(id: string): Promise<void>;
  update(patient: Patient): Promise<void>;
}
