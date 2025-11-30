import { ClinicContainer } from '../../../src/clinic/infrastructure/Container';
import { CreateClinicUseCase } from '../../../src/clinic/application/CreateClinicUseCase';
import { ActivateClinicUseCase } from '../../../src/clinic/application/ActivateClinicUseCase';
import { DeactivateClinicUseCase } from '../../../src/clinic/application/DeactivateClinicUseCase';

describe('ActivateClinicUseCase and DeactivateClinicUseCase', () => {
  let createClinicUseCase: CreateClinicUseCase;
  let activateClinicUseCase: ActivateClinicUseCase;
  let deactivateClinicUseCase: DeactivateClinicUseCase;

  beforeEach(() => {
    const container = new ClinicContainer();
    createClinicUseCase = container.getCreateClinicUseCase();
    activateClinicUseCase = container.getActivateClinicUseCase();
    deactivateClinicUseCase = container.getDeactivateClinicUseCase();
  });

  test('should deactivate an active clinic', async () => {
    const createdClinic = await createClinicUseCase.execute({
      name: 'Central Clinic',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });

    expect(createdClinic.isActive).toBe(true);

    const deactivated = await deactivateClinicUseCase.execute(createdClinic.id);
    expect(deactivated.isActive).toBe(false);
  });

  test('should activate an inactive clinic', async () => {
    const createdClinic = await createClinicUseCase.execute({
      name: 'Central Clinic',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });

    await deactivateClinicUseCase.execute(createdClinic.id);
    const activated = await activateClinicUseCase.execute(createdClinic.id);
    expect(activated.isActive).toBe(true);
  });

  test('should fail to deactivate already inactive clinic', async () => {
    const createdClinic = await createClinicUseCase.execute({
      name: 'Central Clinic',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });

    await deactivateClinicUseCase.execute(createdClinic.id);

    await expect(
      deactivateClinicUseCase.execute(createdClinic.id),
    ).rejects.toThrow('Clinic is already inactive');
  });

  test('should fail to activate already active clinic', async () => {
    const createdClinic = await createClinicUseCase.execute({
      name: 'Central Clinic',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });

    await expect(
      activateClinicUseCase.execute(createdClinic.id),
    ).rejects.toThrow('Clinic is already active');
  });
});
