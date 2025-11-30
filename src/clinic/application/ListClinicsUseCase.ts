import { IClinicRepository } from '../domain/IClinicRepository';

export interface ListClinicsResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ListClinicsUseCase {
  constructor(private clinicRepository: IClinicRepository) {}

  async execute(): Promise<ListClinicsResponse[]> {
    const clinics = await this.clinicRepository.findAll();

    return clinics.map((clinic) => ({
      id: clinic.getId(),
      name: clinic.getName().getValue(),
      address: clinic.getAddress().getValue(),
      phone: clinic.getPhone().getValue(),
      isActive: clinic.isClinicActive(),
      createdAt: clinic.getCreatedAt(),
      updatedAt: clinic.getUpdatedAt(),
    }));
  }
}
