import { ValidationError } from '../../../shared';

export class ClinicPhone {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValidPhone(value)) {
      throw new ValidationError('Invalid phone format');
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ClinicPhone): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    return phoneRegex.test(phone);
  }
}
