import { ClinicContainer } from '../../../src/clinic/infrastructure/Container';
import { CreateClinicUseCase } from '../../../src/clinic/application/CreateClinicUseCase';
import { UpdateClinicUseCase } from '../../../src/clinic/application/UpdateClinicUseCase';

describe('UpdateClinicUseCase', () => {
  let createClinicUseCase: CreateClinicUseCase;
  let updateClinicUseCase: UpdateClinicUseCase;

  beforeEach(() => {
    const container = new ClinicContainer();
    createClinicUseCase = container.getCreateClinicUseCase();
    updateClinicUseCase = container.getUpdateClinicUseCase();
  });

  test('should update clinic name', async () => {
    const createdClinic = await createClinicUseCase.execute({
      name: 'Central Clinic',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });

    const updated = await updateClinicUseCase.execute({
      id: createdClinic.id,
      name: 'Updated Clinic',
    });

    expect(updated.name).toBe('Updated Clinic');
    expect(updated.address).toBe('Main Street 123');
  });

  test('should update clinic address', async () => {
    const createdClinic = await createClinicUseCase.execute({
      name: 'Central Clinic',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });

    const updated = await updateClinicUseCase.execute({
      id: createdClinic.id,
      address: 'New Street 456',
    });

    expect(updated.name).toBe('Central Clinic');
    expect(updated.address).toBe('New Street 456');
  });

  test('should update clinic phone', async () => {
    const createdClinic = await createClinicUseCase.execute({
      name: 'Central Clinic',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });

    const updated = await updateClinicUseCase.execute({
      id: createdClinic.id,
      phone: '+34 111111111',
    });

    expect(updated.phone).toBe('+34 111111111');
  });

  test('should fail to update non-existent clinic', async () => {
    await expect(
      updateClinicUseCase.execute({
        id: 'non-existent-id',
        name: 'Updated Clinic',
      })
    ).rejects.toThrow('Clinic with id non-existent-id not found');
  });

  test('should fail with invalid name', async () => {
    const createdClinic = await createClinicUseCase.execute({
      name: 'Central Clinic',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });

    await expect(
      updateClinicUseCase.execute({
        id: createdClinic.id,
        name: 'A',
      })
    ).rejects.toThrow('Clinic name must be at least 2 characters long');
  });
});
