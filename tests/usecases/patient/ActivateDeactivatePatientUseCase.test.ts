import { PatientContainer } from '../../../src/patient/infrastructure/Container';
import { ClinicContainer } from '../../../src/clinic/infrastructure/Container';
import { CreateClinicUseCase } from '../../../src/clinic/application/CreateClinicUseCase';
import { CreatePatientUseCase } from '../../../src/patient/application/CreatePatientUseCase';

describe('Patient Use Cases', () => {
  let clinicContainer: ClinicContainer;
  let patientContainer: PatientContainer;
  let createClinicUseCase: CreateClinicUseCase;
  let createPatientUseCase: CreatePatientUseCase;
  let clinicId: string;

  beforeEach(async () => {
    clinicContainer = new ClinicContainer();
    patientContainer = new PatientContainer();
    createClinicUseCase = clinicContainer.getCreateClinicUseCase();
    createPatientUseCase = patientContainer.getCreatePatientUseCase(clinicContainer.getClinicRepository());

    const clinic = await createClinicUseCase.execute({
      name: 'Central Clinic',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });
    clinicId = clinic.id;
  });

  test('should create a patient with valid data', async () => {
    const response = await createPatientUseCase.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+34 912345678',
      dateOfBirth: new Date('1990-01-01'),
      clinicId,
    });

    expect(response).toHaveProperty('id');
    expect(response.firstName).toBe('John');
    expect(response.lastName).toBe('Doe');
  });
});
