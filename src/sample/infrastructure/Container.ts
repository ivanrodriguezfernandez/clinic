import { InMemorySampleRepository } from './InMemorySampleRepository';
import { CreateSampleUseCase } from '../application/CreateSampleUseCase';
import { GetSampleUseCase } from '../application/GetSampleUseCase';
import { ListSamplesByPatientUseCase } from '../application/ListSamplesByPatientUseCase';
import { UpdateSampleNotesUseCase } from '../application/UpdateSampleNotesUseCase';
import { StartProcessingSampleUseCase } from '../application/StartProcessingSampleUseCase';
import { CompleteSampleUseCase } from '../application/CompleteSampleUseCase';
import { RejectSampleUseCase } from '../application/RejectSampleUseCase';
import { DeleteSampleUseCase } from '../application/DeleteSampleUseCase';
import { SampleController } from '../presentation/SampleController';

export class SampleContainer {
  private sampleRepository: InMemorySampleRepository;

  constructor() {
    this.sampleRepository = new InMemorySampleRepository();
  }

  getCreateSampleUseCase(patientRepository: any, clinicRepository: any): CreateSampleUseCase {
    return new CreateSampleUseCase(this.sampleRepository, patientRepository, clinicRepository);
  }

  getGetSampleUseCase(): GetSampleUseCase {
    return new GetSampleUseCase(this.sampleRepository);
  }

  getListSamplesByPatientUseCase(): ListSamplesByPatientUseCase {
    return new ListSamplesByPatientUseCase(this.sampleRepository);
  }

  getUpdateSampleNotesUseCase(): UpdateSampleNotesUseCase {
    return new UpdateSampleNotesUseCase(this.sampleRepository);
  }

  getStartProcessingSampleUseCase(): StartProcessingSampleUseCase {
    return new StartProcessingSampleUseCase(this.sampleRepository);
  }

  getCompleteSampleUseCase(): CompleteSampleUseCase {
    return new CompleteSampleUseCase(this.sampleRepository);
  }

  getRejectSampleUseCase(): RejectSampleUseCase {
    return new RejectSampleUseCase(this.sampleRepository);
  }

  getDeleteSampleUseCase(): DeleteSampleUseCase {
    return new DeleteSampleUseCase(this.sampleRepository);
  }

  getSampleController(patientRepository: any, clinicRepository: any): SampleController {
    return new SampleController(
      this.getCreateSampleUseCase(patientRepository, clinicRepository),
      this.getGetSampleUseCase(),
      this.getListSamplesByPatientUseCase(),
      this.getUpdateSampleNotesUseCase(),
      this.getStartProcessingSampleUseCase(),
      this.getCompleteSampleUseCase(),
      this.getRejectSampleUseCase(),
      this.getDeleteSampleUseCase()
    );
  }

  getSampleRepository() {
    return this.sampleRepository;
  }
}
