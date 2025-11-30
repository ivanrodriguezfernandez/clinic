import { v4 as uuidv4 } from 'uuid';
import { ValidationError } from '../../shared/errors/ValidationError';
import { ConflictError } from '../../shared/errors/ConflictError';
import { PatientFirstName } from '../domain/valueobjects/PatientFirstName';
import { PatientLastName } from '../domain/valueobjects/PatientLastName';
import { PatientEmail } from '../domain/valueobjects/PatientEmail';
import { PatientPhone } from '../domain/valueobjects/PatientPhone';
import { PatientDateOfBirth } from '../domain/valueobjects/PatientDateOfBirth';

export class Patient {
  private id: string;
  private firstName: PatientFirstName;
  private lastName: PatientLastName;
  private email: PatientEmail;
  private phone: PatientPhone;
  private dateOfBirth: PatientDateOfBirth;
  private clinicId: string;
  private isActive: boolean;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    firstName: PatientFirstName,
    lastName: PatientLastName,
    email: PatientEmail,
    phone: PatientPhone,
    dateOfBirth: PatientDateOfBirth,
    clinicId: string,
    id?: string,
    isActive?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    if (!clinicId || clinicId.trim().length === 0) {
      throw new ValidationError('Clinic ID cannot be empty');
    }

    this.id = id || uuidv4();
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;
    this.clinicId = clinicId;
    this.isActive = isActive ?? true;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getFirstName(): PatientFirstName {
    return this.firstName;
  }

  getLastName(): PatientLastName {
    return this.lastName;
  }

  getFullName(): string {
    return `${this.firstName.getValue()} ${this.lastName.getValue()}`;
  }

  getEmail(): PatientEmail {
    return this.email;
  }

  getPhone(): PatientPhone {
    return this.phone;
  }

  getDateOfBirth(): PatientDateOfBirth {
    return this.dateOfBirth;
  }

  getAge(): number {
    return this.dateOfBirth.getAge();
  }

  getClinicId(): string {
    return this.clinicId;
  }

  isPatientActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  changeFirstName(newFirstName: PatientFirstName): void {
    this.firstName = newFirstName;
    this.updatedAt = new Date();
  }

  changeLastName(newLastName: PatientLastName): void {
    this.lastName = newLastName;
    this.updatedAt = new Date();
  }

  changeEmail(newEmail: PatientEmail): void {
    this.email = newEmail;
    this.updatedAt = new Date();
  }

  changePhone(newPhone: PatientPhone): void {
    this.phone = newPhone;
    this.updatedAt = new Date();
  }

  activate(): void {
    if (this.isActive) {
      throw new ConflictError('Patient is already active');
    }
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    if (!this.isActive) {
      throw new ConflictError('Patient is already inactive');
    }
    this.isActive = false;
    this.updatedAt = new Date();
  }

  toPrimitives() {
    return {
      id: this.id,
      firstName: this.firstName.getValue(),
      lastName: this.lastName.getValue(),
      email: this.email.getValue(),
      phone: this.phone.getValue(),
      dateOfBirth: this.dateOfBirth.getValue(),
      clinicId: this.clinicId,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
