import { ClinicContainer } from '../../../src/clinic/infrastructure/Container';
import { CreateClinicUseCase } from '../../../src/clinic/application/CreateClinicUseCase';

describe('CreateClinicUseCase', () => {
  let createClinicUseCase: CreateClinicUseCase;

  beforeEach(() => {
    const container = new ClinicContainer();
    createClinicUseCase = container.getCreateClinicUseCase();
  });

  test('should create a clinic with valid data', async () => {
    const response = await createClinicUseCase.execute({
      name: 'Central Clinic',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });

    expect(response).toHaveProperty('id');
    expect(response.name).toBe('Central Clinic');
    expect(response.address).toBe('Main Street 123');
    expect(response.phone).toBe('+34 912345678');
    expect(response.isActive).toBe(true);
    expect(response.createdAt).toBeInstanceOf(Date);
  });

  test('should fail with empty name', async () => {
    await expect(
      createClinicUseCase.execute({
        name: '',
        address: 'Main Street 123',
        phone: '+34 912345678',
      }),
    ).rejects.toThrow('Clinic name cannot be empty');
  });

  test('should fail with name too short', async () => {
    await expect(
      createClinicUseCase.execute({
        name: 'A',
        address: 'Main Street 123',
        phone: '+34 912345678',
      }),
    ).rejects.toThrow('Clinic name must be at least 2 characters long');
  });

  test('should fail with empty address', async () => {
    await expect(
      createClinicUseCase.execute({
        name: 'Central Clinic',
        address: '',
        phone: '+34 912345678',
      }),
    ).rejects.toThrow('Clinic address cannot be empty');
  });

  test('should fail with address too short', async () => {
    await expect(
      createClinicUseCase.execute({
        name: 'Central Clinic',
        address: 'Main',
        phone: '+34 912345678',
      }),
    ).rejects.toThrow('Clinic address must be at least 5 characters long');
  });

  test('should fail with invalid phone format', async () => {
    await expect(
      createClinicUseCase.execute({
        name: 'Central Clinic',
        address: 'Main Street 123',
        phone: '123',
      }),
    ).rejects.toThrow('Invalid phone format');
  });

  test('should trim whitespace from name and address', async () => {
    const response = await createClinicUseCase.execute({
      name: '  Central Clinic  ',
      address: '  Main Street 123  ',
      phone: '+34 912345678',
    });

    expect(response.name).toBe('Central Clinic');
    expect(response.address).toBe('Main Street 123');
  });
});
