import { Router, Request, Response } from 'express';
import { ClinicController } from './ClinicController';
import { asyncHandler } from '../../shared';

export function createClinicRoutes(clinicController: ClinicController): Router {
  const router = Router();

  router.post('/', asyncHandler((req: Request, res: Response) => clinicController.create(req, res)));
  router.get('/', asyncHandler((req: Request, res: Response) => clinicController.list(req, res)));
  router.get('/:id', asyncHandler((req: Request, res: Response) => clinicController.getById(req, res)));
  router.put('/:id', asyncHandler((req: Request, res: Response) => clinicController.update(req, res)));
  router.delete('/:id', asyncHandler((req: Request, res: Response) => clinicController.delete(req, res)));
  router.patch('/:id/activate', asyncHandler((req: Request, res: Response) => clinicController.activate(req, res)));
  router.patch('/:id/deactivate', asyncHandler((req: Request, res: Response) =>
    clinicController.deactivate(req, res),
  ));

  return router;
}
