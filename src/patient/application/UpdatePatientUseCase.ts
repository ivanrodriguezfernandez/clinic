import { NotFoundError } from '../../shared/errors/NotFoundError';
import { IPatientRepository } from '../domain/IPatientRepository';
import { PatientFirstName } from '../domain/valueobjects/PatientFirstName';
import { PatientLastName } from '../domain/valueobjects/PatientLastName';
import { PatientEmail } from '../domain/valueobjects/PatientEmail';
import { PatientPhone } from '../domain/valueobjects/PatientPhone';

export interface UpdatePatientRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface UpdatePatientResponse {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  isActive: boolean;
  updatedAt: Date;
}

export class UpdatePatientUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(request: UpdatePatientRequest): Promise<UpdatePatientResponse> {
    const patient = await this.patientRepository.findById(request.id);

    if (!patient) {
      throw new NotFoundError(`Patient with id ${request.id} not found`);
    }

    const firstName = request.firstName ? new PatientFirstName(request.firstName) : patient.getFirstName();
    const lastName = request.lastName ? new PatientLastName(request.lastName) : patient.getLastName();
    const email = request.email ? new PatientEmail(request.email) : patient.getEmail();
    const phone = request.phone ? new PatientPhone(request.phone) : patient.getPhone();

    patient.update(firstName, lastName, email, phone);

    await this.patientRepository.update(patient);

    return {
      id: patient.getId(),
      firstName: patient.getFirstName().getValue(),
      lastName: patient.getLastName().getValue(),
      fullName: patient.getFullName(),
      email: patient.getEmail().getValue(),
      phone: patient.getPhone().getValue(),
      age: patient.getAge(),
      isActive: patient.isPatientActive(),
      updatedAt: patient.getUpdatedAt(),
    };
  }
}
