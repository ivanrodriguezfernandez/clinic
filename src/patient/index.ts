// Domain
export { Patient } from './domain/Patient';

// Application
export { CreatePatientUseCase } from './application/CreatePatientUseCase';
export { GetPatientUseCase } from './application/GetPatientUseCase';
export { ListPatientsByClinicUseCase } from './application/ListPatientsByClinicUseCase';
export { UpdatePatientUseCase } from './application/UpdatePatientUseCase';
export { DeletePatientUseCase } from './application/DeletePatientUseCase';
export { ActivatePatientUseCase } from './application/ActivatePatientUseCase';
export { DeactivatePatientUseCase } from './application/DeactivatePatientUseCase';

// Presentation
export { PatientController } from './presentation/PatientController';
