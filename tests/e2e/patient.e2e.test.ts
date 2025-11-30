import request from 'supertest';
import express from 'express';
import { Container } from '../../src/Container';
import { createClinicRoutes } from '../../src/clinic/presentation/clinicRoutes';
import { errorHandler } from '../../src/shared';
import { createPatientRoutes } from '../../src/patient/presentation/patientRoutes';

describe('Patient E2E Tests', () => {
  let app: express.Application;
  let clinicId: string;

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    const container = new Container();
    const clinicController = container.getClinicController();
    const patientController = container.getPatientController();

    app.use('/api/clinics', createClinicRoutes(clinicController));
    app.use('/api/patients', createPatientRoutes(patientController));
    app.use(errorHandler);

    // Create a clinic for testing
    const clinicResponse = await request(app)
      .post('/api/clinics')
      .send({
        name: 'Central Clinic',
        address: 'Main Street 123',
        phone: '+34 912345678',
      });

    clinicId = clinicResponse.body.id;
  });

  describe('POST /api/patients', () => {
    test('should create a patient', async () => {
      const response = await request(app)
        .post('/api/patients')
        .send({
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@example.com',
          phone: '+34 987654321',
          dateOfBirth: '1990-01-15',
          clinicId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe('John');
      expect(response.body.lastName).toBe('Smith');
      expect(response.body.fullName).toBe('John Smith');
      expect(response.body.email).toBe('john@example.com');
      expect(response.body.isActive).toBe(true);
    });

    test('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/patients')
        .send({
          firstName: 'John',
          lastName: 'Smith',
          email: 'invalid-email',
          phone: '+34 987654321',
          dateOfBirth: '1990-01-15',
          clinicId,
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should fail with invalid clinic', async () => {
      const response = await request(app)
        .post('/api/patients')
        .send({
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@example.com',
          phone: '+34 987654321',
          dateOfBirth: '1990-01-15',
          clinicId: 'invalid-clinic-id',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/patients/clinic/:clinicId', () => {
    test('should list patients by clinic', async () => {
      // Create two patients
      await request(app)
        .post('/api/patients')
        .send({
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@example.com',
          phone: '+34 987654321',
          dateOfBirth: '1990-01-15',
          clinicId,
        });

      await request(app)
        .post('/api/patients')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          phone: '+34 987654322',
          dateOfBirth: '1992-03-20',
          clinicId,
        });

      const response = await request(app)
        .get(`/api/patients/clinic/${clinicId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/patients/:id', () => {
    test('should get a patient by id', async () => {
      const createResponse = await request(app)
        .post('/api/patients')
        .send({
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@example.com',
          phone: '+34 987654321',
          dateOfBirth: '1990-01-15',
          clinicId,
        });

      const patientId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/patients/${patientId}`)
        .expect(200);

      expect(response.body.id).toBe(patientId);
      expect(response.body.firstName).toBe('John');
    });

    test('should return 404 for non-existent patient', async () => {
      await request(app)
        .get('/api/patients/non-existent-id')
        .expect(404);
    });
  });

  describe('PUT /api/patients/:id', () => {
    test('should update a patient', async () => {
      const createResponse = await request(app)
        .post('/api/patients')
        .send({
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@example.com',
          phone: '+34 987654321',
          dateOfBirth: '1990-01-15',
          clinicId,
        });

      const patientId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/patients/${patientId}`)
        .send({
          firstName: 'Jonathan',
        })
        .expect(200);

      expect(response.body.firstName).toBe('Jonathan');
      expect(response.body.lastName).toBe('Smith');
    });
  });

  describe('DELETE /api/patients/:id', () => {
    test('should delete a patient', async () => {
      const createResponse = await request(app)
        .post('/api/patients')
        .send({
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@example.com',
          phone: '+34 987654321',
          dateOfBirth: '1990-01-15',
          clinicId,
        });

      const patientId = createResponse.body.id;

      await request(app)
        .delete(`/api/patients/${patientId}`)
        .expect(204);

      // Verify it's deleted
      await request(app)
        .get(`/api/patients/${patientId}`)
        .expect(404);
    });
  });

  describe('PATCH /api/patients/:id/activate', () => {
    test('should activate a deactivated patient', async () => {
      const createResponse = await request(app)
        .post('/api/patients')
        .send({
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@example.com',
          phone: '+34 987654321',
          dateOfBirth: '1990-01-15',
          clinicId,
        });

      const patientId = createResponse.body.id;

      // Deactivate
      await request(app)
        .patch(`/api/patients/${patientId}/deactivate`)
        .expect(200);

      // Activate
      const response = await request(app)
        .patch(`/api/patients/${patientId}/activate`)
        .expect(200);

      expect(response.body.isActive).toBe(true);
    });
  });

  describe('PATCH /api/patients/:id/deactivate', () => {
    test('should deactivate an active patient', async () => {
      const createResponse = await request(app)
        .post('/api/patients')
        .send({
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@example.com',
          phone: '+34 987654321',
          dateOfBirth: '1990-01-15',
          clinicId,
        });

      const patientId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/patients/${patientId}/deactivate`)
        .expect(200);

      expect(response.body.isActive).toBe(false);
    });
  });
});
