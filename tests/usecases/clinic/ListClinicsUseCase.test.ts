import { ClinicContainer } from '../../../src/clinic/infrastructure/Container';
import { CreateClinicUseCase } from '../../../src/clinic/application/CreateClinicUseCase';
import { ListClinicsUseCase } from '../../../src/clinic/application/ListClinicsUseCase';

describe('ListClinicsUseCase', () => {
  let createClinicUseCase: CreateClinicUseCase;
  let listClinicsUseCase: ListClinicsUseCase;

  beforeEach(() => {
    const container = new ClinicContainer();
    createClinicUseCase = container.getCreateClinicUseCase();
    listClinicsUseCase = container.getListClinicsUseCase();
  });

  test('should list all clinics', async () => {
    await createClinicUseCase.execute({
      name: 'Clinic 1',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });

    await createClinicUseCase.execute({
      name: 'Clinic 2',
      address: 'Secondary Street 456',
      phone: '+34 987654321',
    });

    const clinics = await listClinicsUseCase.execute();

    expect(clinics).toHaveLength(2);
    expect(clinics[0].name).toBe('Clinic 1');
    expect(clinics[1].name).toBe('Clinic 2');
  });

  test('should return empty list when no clinics exist', async () => {
    const clinics = await listClinicsUseCase.execute();
    expect(clinics).toHaveLength(0);
  });
});
