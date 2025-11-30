import { NotFoundError } from '../../shared/errors/NotFoundError';
import { ISampleRepository } from '../domain/ISampleRepository';

export class DeleteSampleUseCase {
  constructor(private sampleRepository: ISampleRepository) {}

  async execute(id: string): Promise<void> {
    const sample = await this.sampleRepository.findById(id);

    if (!sample) {
      throw new NotFoundError(`Sample with id ${id} not found`);
    }

    await this.sampleRepository.delete(id);
  }
}
