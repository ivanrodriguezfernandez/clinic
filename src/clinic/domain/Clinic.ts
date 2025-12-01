import { v4 as uuidv4 } from 'uuid';
import { ConflictError } from '../../shared/errors/ConflictError';
import { ClinicName } from '../domain/valueobjects/ClinicName';
import { ClinicAddress } from '../domain/valueobjects/ClinicAddress';
import { ClinicPhone } from '../domain/valueobjects/ClinicPhone';

export class Clinic {
  private id: string;
  private name: ClinicName;
  private address: ClinicAddress;
  private phone: ClinicPhone;
  private isActive: boolean;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    name: ClinicName,
    address: ClinicAddress,
    phone: ClinicPhone,
    id?: string,
    isActive?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || uuidv4();
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.isActive = isActive ?? true;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getName(): ClinicName {
    return this.name;
  }

  getAddress(): ClinicAddress {
    return this.address;
  }

  getPhone(): ClinicPhone {
    return this.phone;
  }

  isClinicActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  update(name: ClinicName, address: ClinicAddress, phone: ClinicPhone): void {
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.updatedAt = new Date();
  }

  activate(): void {
    if (this.isActive) {
      throw new ConflictError('Clinic is already active');
    }
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    if (!this.isActive) {
      throw new ConflictError('Clinic is already inactive');
    }
    this.isActive = false;
    this.updatedAt = new Date();
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name.getValue(),
      address: this.address.getValue(),
      phone: this.phone.getValue(),
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
