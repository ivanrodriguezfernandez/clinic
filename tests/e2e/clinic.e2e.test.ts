import request from 'supertest';
import express from 'express';
import { Container } from '../../src/Container';
import { createClinicRoutes } from '../../src/clinic/presentation/clinicRoutes';
import { errorHandler } from '../../src/shared';

describe('Clinic E2E Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    const container = new Container();
    const clinicController = container.getClinicController();

    app.use('/api/clinics', createClinicRoutes(clinicController));
    app.use(errorHandler);
  });

  describe('POST /api/clinics', () => {
    test('should create a clinic', async () => {
      const response = await request(app)
        .post('/api/clinics')
        .send({
          name: 'Central Clinic',
          address: 'Main Street 123',
          phone: '+34 912345678',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Central Clinic');
      expect(response.body.address).toBe('Main Street 123');
      expect(response.body.phone).toBe('+34 912345678');
      expect(response.body.isActive).toBe(true);
    });

    test('should fail with invalid phone', async () => {
      const response = await request(app)
        .post('/api/clinics')
        .send({
          name: 'Central Clinic',
          address: 'Main Street 123',
          phone: '123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toContain('Invalid phone format');
    });

    test('should fail with empty name', async () => {
      const response = await request(app)
        .post('/api/clinics')
        .send({
          name: '',
          address: 'Main Street 123',
          phone: '+34 912345678',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/clinics', () => {
    test('should list all clinics', async () => {
      // Create two clinics
      await request(app)
        .post('/api/clinics')
        .send({
          name: 'Clinic 1',
          address: 'Main Street 123',
          phone: '+34 912345678',
        });

      await request(app)
        .post('/api/clinics')
        .send({
          name: 'Clinic 2',
          address: 'Secondary Street 456',
          phone: '+34 987654321',
        });

      const response = await request(app)
        .get('/api/clinics')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/clinics/:id', () => {
    test('should get a clinic by id', async () => {
      const createResponse = await request(app)
        .post('/api/clinics')
        .send({
          name: 'Central Clinic',
          address: 'Main Street 123',
          phone: '+34 912345678',
        });

      const clinicId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/clinics/${clinicId}`)
        .expect(200);

      expect(response.body.id).toBe(clinicId);
      expect(response.body.name).toBe('Central Clinic');
    });

    test('should return 404 for non-existent clinic', async () => {
      await request(app)
        .get('/api/clinics/non-existent-id')
        .expect(404);
    });
  });

  describe('PUT /api/clinics/:id', () => {
    test('should update a clinic', async () => {
      const createResponse = await request(app)
        .post('/api/clinics')
        .send({
          name: 'Central Clinic',
          address: 'Main Street 123',
          phone: '+34 912345678',
        });

      const clinicId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/clinics/${clinicId}`)
        .send({
          name: 'Updated Clinic',
        })
        .expect(200);

      expect(response.body.name).toBe('Updated Clinic');
      expect(response.body.address).toBe('Main Street 123');
    });

    test('should fail to update non-existent clinic', async () => {
      const response = await request(app)
        .put('/api/clinics/non-existent-id')
        .send({
          name: 'Updated Clinic',
        })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/clinics/:id', () => {
    test('should delete a clinic', async () => {
      const createResponse = await request(app)
        .post('/api/clinics')
        .send({
          name: 'Central Clinic',
          address: 'Main Street 123',
          phone: '+34 912345678',
        });

      const clinicId = createResponse.body.id;

      await request(app)
        .delete(`/api/clinics/${clinicId}`)
        .expect(204);

      // Verify it's deleted
      await request(app)
        .get(`/api/clinics/${clinicId}`)
        .expect(404);
    });
  });

  describe('PATCH /api/clinics/:id/activate', () => {
    test('should activate a deactivated clinic', async () => {
      const createResponse = await request(app)
        .post('/api/clinics')
        .send({
          name: 'Central Clinic',
          address: 'Main Street 123',
          phone: '+34 912345678',
        });

      const clinicId = createResponse.body.id;

      // Deactivate
      await request(app)
        .patch(`/api/clinics/${clinicId}/deactivate`)
        .expect(200);

      // Activate
      const response = await request(app)
        .patch(`/api/clinics/${clinicId}/activate`)
        .expect(200);

      expect(response.body.isActive).toBe(true);
    });
  });

  describe('PATCH /api/clinics/:id/deactivate', () => {
    test('should deactivate an active clinic', async () => {
      const createResponse = await request(app)
        .post('/api/clinics')
        .send({
          name: 'Central Clinic',
          address: 'Main Street 123',
          phone: '+34 912345678',
        });

      const clinicId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/clinics/${clinicId}/deactivate`)
        .expect(200);

      expect(response.body.isActive).toBe(false);
    });
  });
});
