import { IPatientRepository } from '../domain/IPatientRepository';

export interface GetPatientResponse {
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
  updatedAt: Date;
}

export class GetPatientUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(id: string): Promise<GetPatientResponse | null> {
    const patient = await this.patientRepository.findById(id);

    if (!patient) {
      return null;
    }

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
      updatedAt: patient.getUpdatedAt(),
    };
  }
}
