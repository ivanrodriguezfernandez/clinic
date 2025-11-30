import { NotFoundError } from '../../shared/errors/NotFoundError';
import { ISampleRepository } from '../domain/ISampleRepository';

export interface UpdateSampleNotesRequest {
  id: string;
  notes: string;
}

export interface UpdateSampleNotesResponse {
  id: string;
  sampleType: string;
  status: string;
  notes: string;
  updatedAt: Date;
}

export class UpdateSampleNotesUseCase {
  constructor(private sampleRepository: ISampleRepository) {}

  async execute(request: UpdateSampleNotesRequest): Promise<UpdateSampleNotesResponse> {
    const sample = await this.sampleRepository.findById(request.id);

    if (!sample) {
      throw new NotFoundError(`Sample with id ${request.id} not found`);
    }

    sample.updateNotes(request.notes);
    await this.sampleRepository.update(sample);

    return {
      id: sample.getId(),
      sampleType: sample.getSampleType(),
      status: sample.getStatus(),
      notes: sample.getNotes(),
      updatedAt: sample.getUpdatedAt(),
    };
  }
}
