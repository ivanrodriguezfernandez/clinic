import { IClinicRepository } from '../domain/IClinicRepository';

export interface GetClinicResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class GetClinicUseCase {
  constructor(private clinicRepository: IClinicRepository) {}

  async execute(id: string): Promise<GetClinicResponse | null> {
    const clinic = await this.clinicRepository.findById(id);

    if (!clinic) {
      return null;
    }

    return {
      id: clinic.getId(),
      name: clinic.getName().getValue(),
      address: clinic.getAddress().getValue(),
      phone: clinic.getPhone().getValue(),
      isActive: clinic.isClinicActive(),
      createdAt: clinic.getCreatedAt(),
      updatedAt: clinic.getUpdatedAt(),
    };
  }
}
