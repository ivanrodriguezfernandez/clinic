import { ClinicContainer } from '../../../src/clinic/infrastructure/Container';
import { CreateClinicUseCase } from '../../../src/clinic/application/CreateClinicUseCase';
import { GetClinicUseCase } from '../../../src/clinic/application/GetClinicUseCase';

describe('GetClinicUseCase', () => {
  let createClinicUseCase: CreateClinicUseCase;
  let getClinicUseCase: GetClinicUseCase;

  beforeEach(() => {
    const container = new ClinicContainer();
    createClinicUseCase = container.getCreateClinicUseCase();
    getClinicUseCase = container.getGetClinicUseCase();
  });

  test('should get a clinic by id', async () => {
    const createdClinic = await createClinicUseCase.execute({
      name: 'Central Clinic',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });

    const retrievedClinic = await getClinicUseCase.execute(createdClinic.id);

    expect(retrievedClinic).not.toBeNull();
    expect(retrievedClinic?.id).toBe(createdClinic.id);
    expect(retrievedClinic?.name).toBe('Central Clinic');
    expect(retrievedClinic?.address).toBe('Main Street 123');
    expect(retrievedClinic?.phone).toBe('+34 912345678');
    expect(retrievedClinic?.isActive).toBe(true);
  });

  test('should return null for non-existent clinic', async () => {
    const result = await getClinicUseCase.execute('non-existent-id');
    expect(result).toBeNull();
  });
});
