import { ValidationError } from '../../../shared';

export class PatientDateOfBirth {
  private readonly value: Date;

  constructor(value: Date) {
    if (value > new Date()) {
      throw new ValidationError('Date of birth cannot be in the future');
    }
    this.value = value;
  }

  getValue(): Date {
    return this.value;
  }

  getAge(): number {
    const today = new Date();
    let age = today.getFullYear() - this.value.getFullYear();
    const monthDiff = today.getMonth() - this.value.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.value.getDate())) {
      age--;
    }
    return age;
  }

  equals(other: PatientDateOfBirth): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  toString(): string {
    return this.value.toISOString();
  }
}
