import { NotFoundError } from '../../shared/errors/NotFoundError';
import { Clinic } from '../domain/Clinic';
import { IClinicRepository } from '../domain/IClinicRepository';

export class InMemoryClinicRepository implements IClinicRepository {
  private clinics: Map<string, Clinic> = new Map();

  async save(clinic: Clinic): Promise<void> {
    this.clinics.set(clinic.getId(), clinic);
  }

  async findById(id: string): Promise<Clinic | null> {
    return this.clinics.get(id) || null;
  }

  async findAll(): Promise<Clinic[]> {
    return Array.from(this.clinics.values());
  }

  async update(clinic: Clinic): Promise<void> {
    if (!this.clinics.has(clinic.getId())) {
      throw new NotFoundError(`Clinic with id ${clinic.getId()} not found`);
    }
    this.clinics.set(clinic.getId(), clinic);
  }

  async delete(id: string): Promise<void> {
    if (!this.clinics.has(id)) {
      throw new NotFoundError(`Clinic with id ${id} not found`);
    }
    this.clinics.delete(id);
  }
}
