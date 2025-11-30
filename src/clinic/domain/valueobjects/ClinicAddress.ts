import { ValidationError } from '../../../shared';

export class ClinicAddress {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Clinic address cannot be empty');
    }
    if (value.trim().length < 5) {
      throw new ValidationError('Clinic address must be at least 5 characters long');
    }
    if (value.trim().length > 255) {
      throw new ValidationError('Clinic address cannot exceed 255 characters');
    }
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ClinicAddress): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
