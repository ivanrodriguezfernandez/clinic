import { SampleContainer } from '../../../src/sample/infrastructure/Container';
import { ClinicContainer } from '../../../src/clinic/infrastructure/Container';
import { PatientContainer } from '../../../src/patient/infrastructure/Container';
import { CreateClinicUseCase } from '../../../src/clinic/application/CreateClinicUseCase';
import { CreatePatientUseCase } from '../../../src/patient/application/CreatePatientUseCase';
import { CreateSampleUseCase } from '../../../src/sample/application/CreateSampleUseCase';
import { GetSampleUseCase } from '../../../src/sample/application/GetSampleUseCase';
import { ListSamplesByPatientUseCase } from '../../../src/sample/application/ListSamplesByPatientUseCase';
import { DeleteSampleUseCase } from '../../../src/sample/application/DeleteSampleUseCase';

describe('Sample Use Cases', () => {
  let clinicContainer: ClinicContainer;
  let patientContainer: PatientContainer;
  let sampleContainer: SampleContainer;
  let createClinicUseCase: CreateClinicUseCase;
  let createPatientUseCase: CreatePatientUseCase;
  let createSampleUseCase: CreateSampleUseCase;
  let clinicId: string;
  let patientId: string;

  beforeEach(async () => {
    clinicContainer = new ClinicContainer();
    patientContainer = new PatientContainer();
    sampleContainer = new SampleContainer();

    createClinicUseCase = clinicContainer.getCreateClinicUseCase();
    createPatientUseCase = patientContainer.getCreatePatientUseCase(clinicContainer.getClinicRepository());
    createSampleUseCase = sampleContainer.getCreateSampleUseCase(
      patientContainer.getPatientRepository(),
      clinicContainer.getClinicRepository(),
    );

    const clinic = await createClinicUseCase.execute({
      name: 'Central Clinic',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });
    clinicId = clinic.id;

    const patient = await createPatientUseCase.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+34 912345678',
      dateOfBirth: new Date('1990-01-01'),
      clinicId,
    });
    patientId = patient.id;
  });

  test('should create a sample with valid data', async () => {
    const response = await createSampleUseCase.execute({
      patientId,
      sampleType: 'blood',
      clinicId,
      collectionDate: new Date(),
    });

    expect(response).toHaveProperty('id');
    expect(response.patientId).toBe(patientId);
  });
});
