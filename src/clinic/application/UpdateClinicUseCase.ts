import { NotFoundError } from '../../shared/errors/NotFoundError';
import { IClinicRepository } from '../domain/IClinicRepository';
import { ClinicName } from '../domain/valueobjects/ClinicName';
import { ClinicAddress } from '../domain/valueobjects/ClinicAddress';
import { ClinicPhone } from '../domain/valueobjects/ClinicPhone';

export interface UpdateClinicRequest {
  id: string;
  name?: string;
  address?: string;
  phone?: string;
}

export interface UpdateClinicResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  updatedAt: Date;
}

export class UpdateClinicUseCase {
  constructor(private clinicRepository: IClinicRepository) {}

  async execute(request: UpdateClinicRequest): Promise<UpdateClinicResponse> {
    const clinic = await this.clinicRepository.findById(request.id);

    if (!clinic) {
      throw new NotFoundError(`Clinic with id ${request.id} not found`);
    }

    const name = request.name ? new ClinicName(request.name) : clinic.getName();
    const address = request.address ? new ClinicAddress(request.address) : clinic.getAddress();
    const phone = request.phone ? new ClinicPhone(request.phone) : clinic.getPhone();

    clinic.update(name, address, phone);

    await this.clinicRepository.update(clinic);

    return {
      id: clinic.getId(),
      name: clinic.getName().getValue(),
      address: clinic.getAddress().getValue(),
      phone: clinic.getPhone().getValue(),
      isActive: clinic.isClinicActive(),
      updatedAt: clinic.getUpdatedAt(),
    };
  }
}
