import { Request, Response } from 'express';
import { CreateClinicUseCase } from '../application/CreateClinicUseCase';
import { GetClinicUseCase } from '../application/GetClinicUseCase';
import { ListClinicsUseCase } from '../application/ListClinicsUseCase';
import { UpdateClinicUseCase } from '../application/UpdateClinicUseCase';
import { DeleteClinicUseCase } from '../application/DeleteClinicUseCase';
import { ActivateClinicUseCase } from '../application/ActivateClinicUseCase';
import { DeactivateClinicUseCase } from '../application/DeactivateClinicUseCase';
import { ValidationError, NotFoundError } from '../../shared';

export class ClinicController {
  constructor(
    private createClinicUseCase: CreateClinicUseCase,
    private getClinicUseCase: GetClinicUseCase,
    private listClinicsUseCase: ListClinicsUseCase,
    private updateClinicUseCase: UpdateClinicUseCase,
    private deleteClinicUseCase: DeleteClinicUseCase,
    private activateClinicUseCase: ActivateClinicUseCase,
    private deactivateClinicUseCase: DeactivateClinicUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const { name, address, phone } = req.body;

    if (!name || !address || !phone) {
      throw new ValidationError('Missing required fields: name, address, phone');
    }

    const response = await this.createClinicUseCase.execute({
      name,
      address,
      phone,
    });

    res.status(201).json(response);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.getClinicUseCase.execute(id);

    if (!response) {
      throw new NotFoundError('Clinic not found');
    }

    res.status(200).json(response);
  }

  async list(req: Request, res: Response): Promise<void> {
    const response = await this.listClinicsUseCase.execute();
    res.status(200).json(response);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, address, phone } = req.body;

    const response = await this.updateClinicUseCase.execute({
      id,
      name,
      address,
      phone,
    });

    res.status(200).json(response);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.deleteClinicUseCase.execute(id);
    res.status(204).send();
  }

  async activate(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.activateClinicUseCase.execute(id);
    res.status(200).json(response);
  }

  async deactivate(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.deactivateClinicUseCase.execute(id);
    res.status(200).json(response);
  }
}
