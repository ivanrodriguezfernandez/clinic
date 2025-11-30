import { InMemoryPatientRepository } from './InMemoryPatientRepository';
import { CreatePatientUseCase } from '../application/CreatePatientUseCase';
import { GetPatientUseCase } from '../application/GetPatientUseCase';
import { ListPatientsByClinicUseCase } from '../application/ListPatientsByClinicUseCase';
import { UpdatePatientUseCase } from '../application/UpdatePatientUseCase';
import { DeletePatientUseCase } from '../application/DeletePatientUseCase';
import { ActivatePatientUseCase } from '../application/ActivatePatientUseCase';
import { DeactivatePatientUseCase } from '../application/DeactivatePatientUseCase';
import { PatientController } from '../presentation/PatientController';

export class PatientContainer {
  private patientRepository: InMemoryPatientRepository;

  constructor() {
    this.patientRepository = new InMemoryPatientRepository();
  }

  getCreatePatientUseCase(clinicRepository: any): CreatePatientUseCase {
    return new CreatePatientUseCase(this.patientRepository, clinicRepository);
  }

  getGetPatientUseCase(): GetPatientUseCase {
    return new GetPatientUseCase(this.patientRepository);
  }

  getListPatientsByClinicUseCase(): ListPatientsByClinicUseCase {
    return new ListPatientsByClinicUseCase(this.patientRepository);
  }

  getUpdatePatientUseCase(): UpdatePatientUseCase {
    return new UpdatePatientUseCase(this.patientRepository);
  }

  getDeletePatientUseCase(): DeletePatientUseCase {
    return new DeletePatientUseCase(this.patientRepository);
  }

  getActivatePatientUseCase(): ActivatePatientUseCase {
    return new ActivatePatientUseCase(this.patientRepository);
  }

  getDeactivatePatientUseCase(): DeactivatePatientUseCase {
    return new DeactivatePatientUseCase(this.patientRepository);
  }

  getPatientController(clinicRepository: any): PatientController {
    return new PatientController(
      this.getCreatePatientUseCase(clinicRepository),
      this.getGetPatientUseCase(),
      this.getListPatientsByClinicUseCase(),
      this.getUpdatePatientUseCase(),
      this.getDeletePatientUseCase(),
      this.getActivatePatientUseCase(),
      this.getDeactivatePatientUseCase(),
    );
  }

  getPatientRepository() {
    return this.patientRepository;
  }
}
