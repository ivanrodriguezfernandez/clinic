import { IPatientRepository } from '../domain/IPatientRepository';

export interface ListPatientsByClinicResponse {
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

export class ListPatientsByClinicUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(clinicId: string): Promise<ListPatientsByClinicResponse[]> {
    const patients = await this.patientRepository.findByClinicId(clinicId);

    return patients.map((patient) => ({
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
    }));
  }
}
