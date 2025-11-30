import request from 'supertest';
import express from 'express';
import { Container } from '../../src/Container';
import { createClinicRoutes } from '../../src/clinic/presentation/clinicRoutes';
import { createPatientRoutes } from '../../src/patient/presentation/patientRoutes';
import { errorHandler } from '../../src/shared';
import { createSampleRoutes } from '../../src/sample/presentation/sampleRoutes';

describe('Sample E2E Tests', () => {
  let app: express.Application;
  let clinicId: string;
  let patientId: string;

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    const container = new Container();
    const clinicController = container.getClinicController();
    const patientController = container.getPatientController();
    const sampleController = container.getSampleController();

    app.use('/api/clinics', createClinicRoutes(clinicController));
    app.use('/api/patients', createPatientRoutes(patientController));
    app.use('/api/samples', createSampleRoutes(sampleController));
    app.use(errorHandler);

    // Create a clinic
    const clinicResponse = await request(app)
      .post('/api/clinics')
      .send({
        name: 'Central Clinic',
        address: 'Main Street 123',
        phone: '+34 912345678',
      });

    clinicId = clinicResponse.body.id;

    // Create a patient
    const patientResponse = await request(app)
      .post('/api/patients')
      .send({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        phone: '+34 987654321',
        dateOfBirth: '1990-01-15',
        clinicId,
      });

    patientId = patientResponse.body.id;
  });

  describe('POST /api/samples', () => {
    test('should create a sample', async () => {
      const response = await request(app)
        .post('/api/samples')
        .send({
          patientId,
          clinicId,
          sampleType: 'Blood',
          collectionDate: '2024-01-15',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.patientId).toBe(patientId);
      expect(response.body.clinicId).toBe(clinicId);
      expect(response.body.sampleType).toBe('Blood');
      expect(response.body.status).toBe('PENDING');
    });

    test('should fail with invalid patient', async () => {
      const response = await request(app)
        .post('/api/samples')
        .send({
          patientId: 'invalid-patient-id',
          clinicId,
          sampleType: 'Blood',
          collectionDate: '2024-01-15',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should fail with invalid clinic', async () => {
      const response = await request(app)
        .post('/api/samples')
        .send({
          patientId,
          clinicId: 'invalid-clinic-id',
          sampleType: 'Blood',
          collectionDate: '2024-01-15',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/samples/patient/:patientId', () => {
    test('should list samples by patient', async () => {
      // Create two samples
      await request(app)
        .post('/api/samples')
        .send({
          patientId,
          clinicId,
          sampleType: 'Blood',
          collectionDate: '2024-01-15',
        });

      await request(app)
        .post('/api/samples')
        .send({
          patientId,
          clinicId,
          sampleType: 'Urine',
          collectionDate: '2024-01-16',
        });

      const response = await request(app)
        .get(`/api/samples/patient/${patientId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/samples/:id', () => {
    test('should get a sample by id', async () => {
      const createResponse = await request(app)
        .post('/api/samples')
        .send({
          patientId,
          clinicId,
          sampleType: 'Blood',
          collectionDate: '2024-01-15',
        });

      const sampleId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/samples/${sampleId}`)
        .expect(200);

      expect(response.body.id).toBe(sampleId);
      expect(response.body.sampleType).toBe('Blood');
    });

    test('should return 404 for non-existent sample', async () => {
      await request(app)
        .get('/api/samples/non-existent-id')
        .expect(404);
    });
  });

  describe('PATCH /api/samples/:id/notes', () => {
    test('should update sample notes', async () => {
      const createResponse = await request(app)
        .post('/api/samples')
        .send({
          patientId,
          clinicId,
          sampleType: 'Blood',
          collectionDate: '2024-01-15',
        });

      const sampleId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/samples/${sampleId}/notes`)
        .send({
          notes: 'Sample collected successfully',
        })
        .expect(200);

      expect(response.body.notes).toBe('Sample collected successfully');
    });
  });

  describe('PATCH /api/samples/:id/start-processing', () => {
    test('should start processing a sample', async () => {
      const createResponse = await request(app)
        .post('/api/samples')
        .send({
          patientId,
          clinicId,
          sampleType: 'Blood',
          collectionDate: '2024-01-15',
        });

      const sampleId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/samples/${sampleId}/start-processing`)
        .expect(200);

      expect(response.body.status).toBe('PROCESSING');
    });
  });

  describe('PATCH /api/samples/:id/complete', () => {
    test('should complete a processing sample', async () => {
      const createResponse = await request(app)
        .post('/api/samples')
        .send({
          patientId,
          clinicId,
          sampleType: 'Blood',
          collectionDate: '2024-01-15',
        });

      const sampleId = createResponse.body.id;

      // Start processing
      await request(app)
        .patch(`/api/samples/${sampleId}/start-processing`)
        .expect(200);

      // Complete
      const response = await request(app)
        .patch(`/api/samples/${sampleId}/complete`)
        .expect(200);

      expect(response.body.status).toBe('COMPLETED');
    });
  });

  describe('PATCH /api/samples/:id/reject', () => {
    test('should reject a pending sample', async () => {
      const createResponse = await request(app)
        .post('/api/samples')
        .send({
          patientId,
          clinicId,
          sampleType: 'Blood',
          collectionDate: '2024-01-15',
        });

      const sampleId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/samples/${sampleId}/reject`)
        .send({
          reason: 'Contaminated sample',
        })
        .expect(200);

      expect(response.body.status).toBe('REJECTED');
    });

    test('should fail without reason', async () => {
      const createResponse = await request(app)
        .post('/api/samples')
        .send({
          patientId,
          clinicId,
          sampleType: 'Blood',
          collectionDate: '2024-01-15',
        });

      const sampleId = createResponse.body.id;

      await request(app)
        .patch(`/api/samples/${sampleId}/reject`)
        .send({})
        .expect(400);
    });
  });

  describe('DELETE /api/samples/:id', () => {
    test('should delete a sample', async () => {
      const createResponse = await request(app)
        .post('/api/samples')
        .send({
          patientId,
          clinicId,
          sampleType: 'Blood',
          collectionDate: '2024-01-15',
        });

      const sampleId = createResponse.body.id;

      await request(app)
        .delete(`/api/samples/${sampleId}`)
        .expect(204);

      // Verify it's deleted
      await request(app)
        .get(`/api/samples/${sampleId}`)
        .expect(404);
    });
  });
});
