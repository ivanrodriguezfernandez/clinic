import { Request, Response } from 'express';
import { ValidationError, NotFoundError } from '../../shared';
import { CreateSampleUseCase } from '../../sample/application/CreateSampleUseCase';
import { GetSampleUseCase } from '../../sample/application/GetSampleUseCase';
import { ListSamplesByPatientUseCase } from '../../sample/application/ListSamplesByPatientUseCase';
import { UpdateSampleNotesUseCase } from '../../sample/application/UpdateSampleNotesUseCase';
import { StartProcessingSampleUseCase } from '../../sample/application/StartProcessingSampleUseCase';
import { CompleteSampleUseCase } from '../../sample/application/CompleteSampleUseCase';
import { RejectSampleUseCase } from '../../sample/application/RejectSampleUseCase';
import { DeleteSampleUseCase } from '../../sample/application/DeleteSampleUseCase';

export class SampleController {
  constructor(
    private createSampleUseCase: CreateSampleUseCase,
    private getSampleUseCase: GetSampleUseCase,
    private listSamplesByPatientUseCase: ListSamplesByPatientUseCase,
    private updateSampleNotesUseCase: UpdateSampleNotesUseCase,
    private startProcessingSampleUseCase: StartProcessingSampleUseCase,
    private completeSampleUseCase: CompleteSampleUseCase,
    private rejectSampleUseCase: RejectSampleUseCase,
    private deleteSampleUseCase: DeleteSampleUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const { patientId, clinicId, sampleType, collectionDate } = req.body;

    if (!patientId || !clinicId || !sampleType || !collectionDate) {
      throw new ValidationError('Missing required fields: patientId, clinicId, sampleType, collectionDate');
    }

    const response = await this.createSampleUseCase.execute({
      patientId,
      clinicId,
      sampleType,
      collectionDate: new Date(collectionDate),
    });

    res.status(201).json(response);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.getSampleUseCase.execute(id);

    if (!response) {
      throw new NotFoundError('Sample not found');
    }

    res.status(200).json(response);
  }

  async listByPatient(req: Request, res: Response): Promise<void> {
    const { patientId } = req.params;
    const response = await this.listSamplesByPatientUseCase.execute(patientId);
    res.status(200).json(response);
  }

  async updateNotes(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { notes } = req.body;

    if (notes === undefined) {
      throw new ValidationError('Notes field is required');
    }

    const response = await this.updateSampleNotesUseCase.execute({
      id,
      notes,
    });

    res.status(200).json(response);
  }

  async startProcessing(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.startProcessingSampleUseCase.execute(id);
    res.status(200).json(response);
  }

  async complete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.completeSampleUseCase.execute(id);
    res.status(200).json(response);
  }

  async reject(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      throw new ValidationError('Reason field is required');
    }

    const response = await this.rejectSampleUseCase.execute({
      id,
      reason,
    });

    res.status(200).json(response);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.deleteSampleUseCase.execute(id);
    res.status(204).send();
  }
}
