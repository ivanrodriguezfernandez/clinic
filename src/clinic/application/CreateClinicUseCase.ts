import { Clinic } from '../domain/Clinic';
import { IClinicRepository } from '../domain/IClinicRepository';
import { ClinicName } from '../domain/valueobjects/ClinicName';
import { ClinicAddress } from '../domain/valueobjects/ClinicAddress';
import { ClinicPhone } from '../domain/valueobjects/ClinicPhone';

export interface CreateClinicRequest {
  name: string;
  address: string;
  phone: string;
}

export interface CreateClinicResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
}

export class CreateClinicUseCase {
  constructor(private clinicRepository: IClinicRepository) {}

  async execute(request: CreateClinicRequest): Promise<CreateClinicResponse> {
    const clinicName = new ClinicName(request.name);
    const clinicAddress = new ClinicAddress(request.address);
    const clinicPhone = new ClinicPhone(request.phone);

    const clinic = new Clinic(clinicName, clinicAddress, clinicPhone);
    await this.clinicRepository.save(clinic);

    return {
      id: clinic.getId(),
      name: clinic.getName().getValue(),
      address: clinic.getAddress().getValue(),
      phone: clinic.getPhone().getValue(),
      isActive: clinic.isClinicActive(),
      createdAt: clinic.getCreatedAt(),
    };
  }
}
