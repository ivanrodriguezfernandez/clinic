import { Patient } from '../domain/Patient';
import { IPatientRepository } from '../domain/IPatientRepository';
import { IClinicRepository } from '../../clinic/domain/IClinicRepository';
import { PatientFirstName } from '../domain/valueobjects/PatientFirstName';
import { PatientLastName } from '../domain/valueobjects/PatientLastName';
import { PatientEmail } from '../domain/valueobjects/PatientEmail';
import { PatientPhone } from '../domain/valueobjects/PatientPhone';
import { PatientDateOfBirth } from '../domain/valueobjects/PatientDateOfBirth';
import { ValidationError } from '../../shared';

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  clinicId: string;
}

export interface CreatePatientResponse {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  age: number;
  clinicId: string;
  isActive: boolean;
  createdAt: Date;
}

export class CreatePatientUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private clinicRepository: IClinicRepository
  ) {}

  async execute(request: CreatePatientRequest): Promise<CreatePatientResponse> {
    const clinic = await this.clinicRepository.findById(request.clinicId);
    if (!clinic) {
      throw new ValidationError(`Clinic with id ${request.clinicId} not found`);
    }

    const firstName = new PatientFirstName(request.firstName);
    const lastName = new PatientLastName(request.lastName);
    const email = new PatientEmail(request.email);
    const phone = new PatientPhone(request.phone);
    const dateOfBirth = new PatientDateOfBirth(request.dateOfBirth);

    const patient = new Patient(
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      request.clinicId
    );

    await this.patientRepository.save(patient);

    return {
      id: patient.getId(),
      firstName: patient.getFirstName().getValue(),
      lastName: patient.getLastName().getValue(),
      fullName: patient.getFullName(),
      email: patient.getEmail().getValue(),
      phone: patient.getPhone().getValue(),
      dateOfBirth: patient.getDateOfBirth().getValue(),
      age: patient.getAge(),
      clinicId: patient.getClinicId(),
      isActive: patient.isPatientActive(),
      createdAt: patient.getCreatedAt(),
    };
  }
}
