import { ValidationError } from '../../../shared';

export class PatientLastName {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Last name cannot be empty');
    }
    if (value.trim().length < 2) {
      throw new ValidationError('Last name must be at least 2 characters long');
    }
    if (value.trim().length > 50) {
      throw new ValidationError('Last name cannot exceed 50 characters');
    }
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PatientLastName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
