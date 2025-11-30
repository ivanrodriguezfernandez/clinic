# Testing Guide

## Overview

The project includes comprehensive tests organized in three levels:

1. **Unit Tests**: Test individual use cases in isolation
2. **Integration Tests**: Test interactions between use cases
3. **E2E Tests**: Test the complete API via HTTP requests

## Test Structure

```
src/__tests__/
├── usecases/                    # Unit tests (64 tests)
│   ├── clinic/
│   │   ├── CreateClinicUseCase.test.ts
│   │   ├── GetClinicUseCase.test.ts
│   │   ├── ListClinicsUseCase.test.ts
│   │   ├── UpdateClinicUseCase.test.ts
│   │   ├── DeleteClinicUseCase.test.ts
│   │   └── ActivateDeactivateClinicUseCase.test.ts
│   ├── patient/
│   │   ├── CreatePatientUseCase.test.ts
│   │   ├── GetPatientUseCase.test.ts
│   │   ├── ListPatientsByClinicUseCase.test.ts
│   │   ├── UpdatePatientUseCase.test.ts
│   │   ├── DeletePatientUseCase.test.ts
│   │   └── ActivateDeactivatePatientUseCase.test.ts
│   ├── sample/
│   │   ├── CreateSampleUseCase.test.ts
│   │   ├── GetSampleUseCase.test.ts
│   │   ├── ListSamplesByPatientUseCase.test.ts
│   │   ├── SampleStateTransitionsUseCase.test.ts
│   │   └── DeleteSampleUseCase.test.ts
│   └── integration.test.ts      # Integration tests (2 tests)
├── e2e/                         # E2E tests (31 tests)
│   ├── clinic.e2e.test.ts
│   ├── patient.e2e.test.ts
│   └── sample.e2e.test.ts
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run specific test file
```bash
npm test -- CreateClinicUseCase.test.ts
```

### Run tests with coverage
```bash
npm test -- --coverage
```

## Test Categories

### 1. Clinic Tests

#### CreateClinicUseCase.test.ts
- ✅ Create clinic with valid data
- ✅ Fail with empty name
- ✅ Fail with name too short
- ✅ Fail with empty address
- ✅ Fail with address too short
- ✅ Fail with invalid phone format
- ✅ Trim whitespace from name and address

#### GetClinicUseCase.test.ts
- ✅ Get clinic by ID
- ✅ Return null for non-existent clinic

#### ListClinicsUseCase.test.ts
- ✅ List all clinics
- ✅ Return empty list when no clinics exist

#### UpdateClinicUseCase.test.ts
- ✅ Update clinic name
- ✅ Update clinic address
- ✅ Update clinic phone
- ✅ Fail to update non-existent clinic
- ✅ Fail with invalid name

#### DeleteClinicUseCase.test.ts
- ✅ Delete a clinic
- ✅ Fail to delete non-existent clinic

#### ActivateDeactivateClinicUseCase.test.ts
- ✅ Deactivate an active clinic
- ✅ Activate an inactive clinic
- ✅ Fail to deactivate already inactive clinic
- ✅ Fail to activate already active clinic

### 2. Patient Tests

#### CreatePatientUseCase.test.ts
- ✅ Create patient with valid data
- ✅ Fail with invalid clinic
- ✅ Fail with invalid email
- ✅ Fail with empty first name
- ✅ Fail with empty last name
- ✅ Fail with invalid phone
- ✅ Fail with future date of birth
- ✅ Normalize email to lowercase

#### GetPatientUseCase.test.ts
- ✅ Get patient by ID
- ✅ Return null for non-existent patient

#### ListPatientsByClinicUseCase.test.ts
- ✅ List all patients by clinic
- ✅ Return empty list when no patients in clinic

#### UpdatePatientUseCase.test.ts
- ✅ Update patient first name
- ✅ Update patient email
- ✅ Fail to update non-existent patient
- ✅ Fail with invalid email

#### DeletePatientUseCase.test.ts
- ✅ Delete a patient
- ✅ Fail to delete non-existent patient

#### ActivateDeactivatePatientUseCase.test.ts
- ✅ Deactivate an active patient
- ✅ Activate an inactive patient
- ✅ Fail to deactivate already inactive patient
- ✅ Fail to activate already active patient

### 3. Sample Tests

#### CreateSampleUseCase.test.ts
- ✅ Create sample with valid data
- ✅ Fail with invalid patient
- ✅ Fail with invalid clinic
- ✅ Fail with patient from different clinic
- ✅ Fail with future collection date

#### GetSampleUseCase.test.ts
- ✅ Get sample by ID
- ✅ Return null for non-existent sample

#### ListSamplesByPatientUseCase.test.ts
- ✅ List all samples by patient
- ✅ Return empty list when no samples for patient

#### SampleStateTransitionsUseCase.test.ts
- ✅ Transition from PENDING to PROCESSING
- ✅ Transition from PROCESSING to COMPLETED
- ✅ Transition from PENDING to REJECTED
- ✅ Update sample notes
- ✅ Fail to start processing already processing sample
- ✅ Fail to complete non-processing sample
- ✅ Fail to reject completed sample

#### DeleteSampleUseCase.test.ts
- ✅ Delete a sample
- ✅ Fail to delete non-existent sample

### 4. Integration Tests

#### integration.test.ts
- ✅ Complete full workflow: create clinic, patient, and sample
- ✅ Validate relationships between entities

## Test Statistics

- **Total Test Suites**: 21
- **Total Tests**: 97
- **Unit Tests**: 64 tests across 18 suites
- **Integration Tests**: 2 tests
- **E2E Tests**: 31 tests across 3 suites
- **Coverage**: All use cases, error scenarios, and HTTP endpoints

## Best Practices

### 1. Test Isolation
Each test is independent and uses `beforeEach` to set up fresh data:
```typescript
beforeEach(async () => {
  const container = new Container();
  useCase = container.getUseCase();
});
```

### 2. Clear Test Names
Test names describe what is being tested:
```typescript
test('should create a clinic with valid data', async () => {
  // ...
});
```

### 3. Arrange-Act-Assert Pattern
```typescript
test('should update clinic name', async () => {
  // Arrange
  const createdClinic = await createClinicUseCase.execute({...});
  
  // Act
  const updated = await updateClinicUseCase.execute({...});
  
  // Assert
  expect(updated.name).toBe('Updated Clinic');
});
```

### 4. Error Testing
Tests verify that errors are thrown with correct messages:
```typescript
test('should fail with invalid email', async () => {
  await expect(
    createPatientUseCase.execute({
      email: 'invalid-email',
      // ...
    })
  ).rejects.toThrow('Invalid email format');
});
```

### 5. Dependency Setup
Tests create necessary dependencies in `beforeEach`:
```typescript
beforeEach(async () => {
  const clinic = await createClinicUseCase.execute({...});
  clinicId = clinic.id;
});
```

## Adding New Tests

When adding a new use case:

1. Create a new test file: `src/__tests__/usecases/{entity}/{UseCase}.test.ts`
2. Import the use case and container
3. Set up dependencies in `beforeEach`
4. Write tests following the existing pattern
5. Run tests to verify: `npm test`

Example:
```typescript
import { Container } from '../../../infrastructure/container/Container';
import { MyUseCase } from '../../../application/usecases/entity/MyUseCase';

describe('MyUseCase', () => {
  let myUseCase: MyUseCase;

  beforeEach(() => {
    const container = new Container();
    myUseCase = container.getMyUseCase();
  });

  test('should do something', async () => {
    const result = await myUseCase.execute({...});
    expect(result).toBeDefined();
  });
});
```

## E2E Testing with Supertest

E2E tests use **Supertest** to make HTTP requests to the Express app without starting a server:

```typescript
import request from 'supertest';
import express from 'express';

describe('Clinic E2E Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    const container = new Container();
    const clinicController = container.getClinicController();
    app.use('/api/clinics', createClinicRoutes(clinicController));
  });

  test('should create a clinic', async () => {
    const response = await request(app)
      .post('/api/clinics')
      .send({
        name: 'Central Clinic',
        address: 'Main Street 123',
        phone: '+34 912345678',
      })
      .expect(201);

    expect(response.body.name).toBe('Central Clinic');
  });
});
```

### E2E Test Coverage

#### Clinic E2E Tests (clinic.e2e.test.ts)
- ✅ POST /api/clinics - Create clinic
- ✅ GET /api/clinics - List all clinics
- ✅ GET /api/clinics/:id - Get clinic by ID
- ✅ PUT /api/clinics/:id - Update clinic
- ✅ DELETE /api/clinics/:id - Delete clinic
- ✅ PATCH /api/clinics/:id/activate - Activate clinic
- ✅ PATCH /api/clinics/:id/deactivate - Deactivate clinic
- ✅ Error handling for invalid inputs

#### Patient E2E Tests (patient.e2e.test.ts)
- ✅ POST /api/patients - Create patient
- ✅ GET /api/patients/clinic/:clinicId - List patients by clinic
- ✅ GET /api/patients/:id - Get patient by ID
- ✅ PUT /api/patients/:id - Update patient
- ✅ DELETE /api/patients/:id - Delete patient
- ✅ PATCH /api/patients/:id/activate - Activate patient
- ✅ PATCH /api/patients/:id/deactivate - Deactivate patient
- ✅ Error handling for invalid clinic/email

#### Sample E2E Tests (sample.e2e.test.ts)
- ✅ POST /api/samples - Create sample
- ✅ GET /api/samples/patient/:patientId - List samples by patient
- ✅ GET /api/samples/:id - Get sample by ID
- ✅ PATCH /api/samples/:id/notes - Update sample notes
- ✅ PATCH /api/samples/:id/start-processing - Start processing
- ✅ PATCH /api/samples/:id/complete - Complete sample
- ✅ PATCH /api/samples/:id/reject - Reject sample
- ✅ DELETE /api/samples/:id - Delete sample
- ✅ Error handling for invalid relationships

## Continuous Integration

Tests should pass before merging:
```bash
npm run build
npm test
```

All 97 tests must pass with 0 failures:
- 64 unit tests
- 2 integration tests
- 31 E2E tests
