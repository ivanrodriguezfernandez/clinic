import { Sample } from '../domain/Sample';
import { ISampleRepository } from '../domain/ISampleRepository';

export class InMemorySampleRepository implements ISampleRepository {
  private samples: Map<string, Sample> = new Map();

  async save(sample: Sample): Promise<void> {
    this.samples.set(sample.getId(), sample);
  }

  async findById(id: string): Promise<Sample | null> {
    return this.samples.get(id) || null;
  }

  async findByPatientId(patientId: string): Promise<Sample[]> {
    return Array.from(this.samples.values()).filter((s) => s.getPatientId() === patientId);
  }

  async findByClinicId(clinicId: string): Promise<Sample[]> {
    return Array.from(this.samples.values()).filter((s) => s.getClinicId() === clinicId);
  }

  async findAll(): Promise<Sample[]> {
    return Array.from(this.samples.values());
  }

  async update(sample: Sample): Promise<void> {
    if (!this.samples.has(sample.getId())) {
      throw new Error(`Sample with id ${sample.getId()} not found`);
    }
    this.samples.set(sample.getId(), sample);
  }

  async delete(id: string): Promise<void> {
    if (!this.samples.has(id)) {
      throw new Error(`Sample with id ${id} not found`);
    }
    this.samples.delete(id);
  }
}
