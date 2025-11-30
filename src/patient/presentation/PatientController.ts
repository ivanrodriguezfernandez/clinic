import { Request, Response } from 'express';
import { ValidationError, NotFoundError } from '../../shared';
import { CreatePatientUseCase } from '../../patient/application/CreatePatientUseCase';
import { GetPatientUseCase } from '../../patient/application/GetPatientUseCase';
import { ListPatientsByClinicUseCase } from '../../patient/application/ListPatientsByClinicUseCase';
import { UpdatePatientUseCase } from '../../patient/application/UpdatePatientUseCase';
import { DeletePatientUseCase } from '../../patient/application/DeletePatientUseCase';
import { ActivatePatientUseCase } from '../../patient/application/ActivatePatientUseCase';
import { DeactivatePatientUseCase } from '../../patient/application/DeactivatePatientUseCase';

export class PatientController {
  constructor(
    private createPatientUseCase: CreatePatientUseCase,
    private getPatientUseCase: GetPatientUseCase,
    private listPatientsByClinicUseCase: ListPatientsByClinicUseCase,
    private updatePatientUseCase: UpdatePatientUseCase,
    private deletePatientUseCase: DeletePatientUseCase,
    private activatePatientUseCase: ActivatePatientUseCase,
    private deactivatePatientUseCase: DeactivatePatientUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const { firstName, lastName, email, phone, dateOfBirth, clinicId } = req.body;

    if (!firstName || !lastName || !email || !phone || !dateOfBirth || !clinicId) {
      throw new ValidationError('Missing required fields: firstName, lastName, email, phone, dateOfBirth, clinicId');
    }

    const response = await this.createPatientUseCase.execute({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth: new Date(dateOfBirth),
      clinicId,
    });

    res.status(201).json(response);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.getPatientUseCase.execute(id);

    if (!response) {
      throw new NotFoundError('Patient not found');
    }

    res.status(200).json(response);
  }

  async listByClinic(req: Request, res: Response): Promise<void> {
    const { clinicId } = req.params;
    const response = await this.listPatientsByClinicUseCase.execute(clinicId);
    res.status(200).json(response);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { firstName, lastName, email, phone } = req.body;

    const response = await this.updatePatientUseCase.execute({
      id,
      firstName,
      lastName,
      email,
      phone,
    });

    res.status(200).json(response);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.deletePatientUseCase.execute(id);
    res.status(204).send();
  }

  async activate(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.activatePatientUseCase.execute(id);
    res.status(200).json(response);
  }

  async deactivate(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.deactivatePatientUseCase.execute(id);
    res.status(200).json(response);
  }
}
