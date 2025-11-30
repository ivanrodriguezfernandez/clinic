import { ClinicContainer } from '../../../src/clinic/infrastructure/Container';
import { CreateClinicUseCase } from '../../../src/clinic/application/CreateClinicUseCase';
import { DeleteClinicUseCase } from '../../../src/clinic/application/DeleteClinicUseCase';
import { GetClinicUseCase } from '../../../src/clinic/application/GetClinicUseCase';

describe('DeleteClinicUseCase', () => {
  let createClinicUseCase: CreateClinicUseCase;
  let deleteClinicUseCase: DeleteClinicUseCase;
  let getClinicUseCase: GetClinicUseCase;

  beforeEach(() => {
    const container = new ClinicContainer();
    createClinicUseCase = container.getCreateClinicUseCase();
    deleteClinicUseCase = container.getDeleteClinicUseCase();
    getClinicUseCase = container.getGetClinicUseCase();
  });

  test('should delete a clinic', async () => {
    const createdClinic = await createClinicUseCase.execute({
      name: 'Central Clinic',
      address: 'Main Street 123',
      phone: '+34 912345678',
    });

    await deleteClinicUseCase.execute(createdClinic.id);

    const result = await getClinicUseCase.execute(createdClinic.id);
    expect(result).toBeNull();
  });

  test('should fail to delete non-existent clinic', async () => {
    await expect(
      deleteClinicUseCase.execute('non-existent-id')
    ).rejects.toThrow('Clinic with id non-existent-id not found');
  });
});
