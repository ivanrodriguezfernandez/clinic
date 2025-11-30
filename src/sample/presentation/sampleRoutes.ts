import { Router, Request, Response } from 'express';
import { SampleController } from './SampleController';
import { asyncHandler } from '../../shared';

export function createSampleRoutes(sampleController: SampleController): Router {
  const router = Router();

  router.post('/', asyncHandler((req: Request, res: Response) => sampleController.create(req, res)));
  router.get('/patient/:patientId', asyncHandler((req: Request, res: Response) =>
    sampleController.listByPatient(req, res),
  ));
  router.get('/:id', asyncHandler((req: Request, res: Response) => sampleController.getById(req, res)));
  router.patch('/:id/notes', asyncHandler((req: Request, res: Response) => sampleController.updateNotes(req, res)));
  router.patch('/:id/start-processing', asyncHandler((req: Request, res: Response) =>
    sampleController.startProcessing(req, res),
  ));
  router.patch('/:id/complete', asyncHandler((req: Request, res: Response) => sampleController.complete(req, res)));
  router.patch('/:id/reject', asyncHandler((req: Request, res: Response) => sampleController.reject(req, res)));
  router.delete('/:id', asyncHandler((req: Request, res: Response) => sampleController.delete(req, res)));

  return router;
}
