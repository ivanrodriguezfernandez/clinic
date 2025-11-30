import { Router, Request, Response } from 'express';
import { PatientController } from './PatientController';
import { asyncHandler } from '../../shared';

export function createPatientRoutes(patientController: PatientController): Router {
  const router = Router();

  router.post('/', asyncHandler((req: Request, res: Response) => patientController.create(req, res)));
  router.get('/clinic/:clinicId', asyncHandler((req: Request, res: Response) =>
    patientController.listByClinic(req, res)
  ));
  router.get('/:id', asyncHandler((req: Request, res: Response) => patientController.getById(req, res)));
  router.put('/:id', asyncHandler((req: Request, res: Response) => patientController.update(req, res)));
  router.delete('/:id', asyncHandler((req: Request, res: Response) => patientController.delete(req, res)));
  router.patch('/:id/activate', asyncHandler((req: Request, res: Response) => patientController.activate(req, res)));
  router.patch('/:id/deactivate', asyncHandler((req: Request, res: Response) =>
    patientController.deactivate(req, res)
  ));

  return router;
}
