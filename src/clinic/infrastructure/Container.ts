import { InMemoryClinicRepository } from './InMemoryClinicRepository';
import { CreateClinicUseCase } from '../application/CreateClinicUseCase';
import { GetClinicUseCase } from '../application/GetClinicUseCase';
import { ListClinicsUseCase } from '../application/ListClinicsUseCase';
import { UpdateClinicUseCase } from '../application/UpdateClinicUseCase';
import { DeleteClinicUseCase } from '../application/DeleteClinicUseCase';
import { ActivateClinicUseCase } from '../application/ActivateClinicUseCase';
import { DeactivateClinicUseCase } from '../application/DeactivateClinicUseCase';
import { ClinicController } from '../presentation/ClinicController';

export class ClinicContainer {
  private clinicRepository: InMemoryClinicRepository;

  constructor() {
    this.clinicRepository = new InMemoryClinicRepository();
  }

  getCreateClinicUseCase(): CreateClinicUseCase {
    return new CreateClinicUseCase(this.clinicRepository);
  }

  getGetClinicUseCase(): GetClinicUseCase {
    return new GetClinicUseCase(this.clinicRepository);
  }

  getListClinicsUseCase(): ListClinicsUseCase {
    return new ListClinicsUseCase(this.clinicRepository);
  }

  getUpdateClinicUseCase(): UpdateClinicUseCase {
    return new UpdateClinicUseCase(this.clinicRepository);
  }

  getDeleteClinicUseCase(): DeleteClinicUseCase {
    return new DeleteClinicUseCase(this.clinicRepository);
  }

  getActivateClinicUseCase(): ActivateClinicUseCase {
    return new ActivateClinicUseCase(this.clinicRepository);
  }

  getDeactivateClinicUseCase(): DeactivateClinicUseCase {
    return new DeactivateClinicUseCase(this.clinicRepository);
  }

  getClinicController(): ClinicController {
    return new ClinicController(
      this.getCreateClinicUseCase(),
      this.getGetClinicUseCase(),
      this.getListClinicsUseCase(),
      this.getUpdateClinicUseCase(),
      this.getDeleteClinicUseCase(),
      this.getActivateClinicUseCase(),
      this.getDeactivateClinicUseCase(),
    );
  }

  getClinicRepository() {
    return this.clinicRepository;
  }
}
