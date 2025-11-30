import { NotFoundError } from '../../shared/errors/NotFoundError';
import { Patient } from '../domain/Patient';
import { IPatientRepository } from '../domain/IPatientRepository';

export class InMemoryPatientRepository implements IPatientRepository {
  private patients: Map<string, Patient> = new Map();

  async save(patient: Patient): Promise<void> {
    this.patients.set(patient.getId(), patient);
  }

  async findById(id: string): Promise<Patient | null> {
    return this.patients.get(id) || null;
  }

  async findByClinicId(clinicId: string): Promise<Patient[]> {
    return Array.from(this.patients.values()).filter((p) => p.getClinicId() === clinicId);
  }

  async findAll(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async update(patient: Patient): Promise<void> {
    if (!this.patients.has(patient.getId())) {
      throw new NotFoundError(`Patient with id ${patient.getId()} not found`);
    }
    this.patients.set(patient.getId(), patient);
  }

  async delete(id: string): Promise<void> {
    if (!this.patients.has(id)) {
      throw new NotFoundError(`Patient with id ${id} not found`);
    }
    this.patients.delete(id);
  }
}
