import { ClinicContainer } from './clinic/infrastructure/Container';
import { PatientContainer } from './patient/infrastructure/Container';
import { SampleContainer } from './sample/infrastructure/Container';

export class Container {
  private clinicContainer: ClinicContainer;
  private patientContainer: PatientContainer;
  private sampleContainer: SampleContainer;

  constructor() {
    this.clinicContainer = new ClinicContainer();
    this.patientContainer = new PatientContainer();
    this.sampleContainer = new SampleContainer();
  }

  // Controllers
  getClinicController() {
    return this.clinicContainer.getClinicController();
  }

  getPatientController() {
    return this.patientContainer.getPatientController(this.clinicContainer.getClinicRepository());
  }

  getSampleController() {
    return this.sampleContainer.getSampleController(
      this.patientContainer.getPatientRepository(),
      this.clinicContainer.getClinicRepository(),
    );
  }
}
