import { ValidationError } from '../../../shared';

export class PatientEmail {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValidEmail(value)) {
      throw new ValidationError('Invalid email format');
    }
    this.value = value.toLowerCase();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PatientEmail): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
