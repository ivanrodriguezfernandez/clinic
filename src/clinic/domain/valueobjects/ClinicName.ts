import { ValidationError } from '../../../shared';

export class ClinicName {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Clinic name cannot be empty');
    }
    if (value.trim().length < 2) {
      throw new ValidationError('Clinic name must be at least 2 characters long');
    }
    if (value.trim().length > 100) {
      throw new ValidationError('Clinic name cannot exceed 100 characters');
    }
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ClinicName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
