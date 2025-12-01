# Clinic Management API

Node.js + TypeScript API for managing clinics, patients, and medical samples with clean architecture and domain-driven design.

## Features

- **Clean Architecture**: Clear separation between layers (Domain, Application, Infrastructure, Presentation)
- **Rich Domain**: Entities with business logic and validations
- **Separated Use Cases**: Each operation has its own use case
- **In-Memory Repositories**: No database dependency (for now)
- **Dependency Injection**: Centralized container
- **Strict TypeScript**: Strong and safe typing
- **Value Objects**: Avoid primitive obsession with domain-driven design

## Project Structure

```
src/
├── clinic/                    # Clinic module (vertical slice)
│   ├── domain/               # Business logic
│   │   ├── Clinic.ts         # Entity
│   │   ├── IClinicRepository.ts  # Repository interface
│   │   └── valueobjects/     # Value objects
│   │       ├── ClinicName.ts
│   │       ├── ClinicAddress.ts
│   │       └── ClinicPhone.ts
│   ├── application/          # Use cases
│   │   ├── CreateClinicUseCase.ts
│   │   ├── UpdateClinicUseCase.ts
│   │   ├── DeleteClinicUseCase.ts
│   │   ├── GetClinicUseCase.ts
│   │   ├── ListClinicsUseCase.ts
│   │   ├── ActivateClinicUseCase.ts
│   │   └── DeactivateClinicUseCase.ts
│   ├── infrastructure/       # Technical implementations
│   │   ├── InMemoryClinicRepository.ts
│   │   └── Container.ts      # Dependency injection
│   ├── presentation/         # HTTP API
│   │   ├── ClinicController.ts
│   │   └── clinicRoutes.ts
│   └── index.ts
├── patient/                   # Patient module (vertical slice)
│   ├── domain/               # Business logic
│   │   ├── Patient.ts        # Entity
│   │   ├── IPatientRepository.ts  # Repository interface
│   │   └── valueobjects/     # Value objects
│   │       ├── PatientFirstName.ts
│   │       ├── PatientLastName.ts
│   │       ├── PatientEmail.ts
│   │       ├── PatientPhone.ts
│   │       └── PatientDateOfBirth.ts
│   ├── application/          # Use cases
│   │   ├── CreatePatientUseCase.ts
│   │   ├── UpdatePatientUseCase.ts
│   │   ├── DeletePatientUseCase.ts
│   │   ├── GetPatientUseCase.ts
│   │   ├── ListPatientsByClinicUseCase.ts
│   │   ├── ActivatePatientUseCase.ts
│   │   └── DeactivatePatientUseCase.ts
│   ├── infrastructure/       # Technical implementations
│   │   ├── InMemoryPatientRepository.ts
│   │   └── Container.ts      # Dependency injection
│   ├── presentation/         # HTTP API
│   │   ├── PatientController.ts
│   │   └── patientRoutes.ts
│   └── index.ts
├── sample/                    # Sample module (vertical slice)
│   ├── domain/               # Business logic
│   │   ├── Sample.ts         # Entity
│   │   └── ISampleRepository.ts  # Repository interface
│   ├── application/          # Use cases
│   │   ├── CreateSampleUseCase.ts
│   │   ├── UpdateSampleNotesUseCase.ts
│   │   ├── DeleteSampleUseCase.ts
│   │   ├── GetSampleUseCase.ts
│   │   ├── ListSamplesByPatientUseCase.ts
│   │   ├── StartProcessingSampleUseCase.ts
│   │   ├── CompleteSampleUseCase.ts
│   │   └── RejectSampleUseCase.ts
│   ├── infrastructure/       # Technical implementations
│   │   ├── InMemorySampleRepository.ts
│   │   └── Container.ts      # Dependency injection
│   ├── presentation/         # HTTP API
│   │   ├── SampleController.ts
│   │   └── sampleRoutes.ts
│   └── index.ts
├── shared/                    # Shared utilities
│   ├── errors/               # Custom error classes
│   │   ├── ValidationError.ts
│   │   ├── NotFoundError.ts
│   │   ├── ConflictError.ts
│   │   ├── UnauthorizedError.ts
│   │   ├── ForbiddenError.ts
│   │   ├── InternalServerError.ts
│   │   └── index.ts
│   ├── middleware/           # Express middleware
│   │   └── errorHandler.ts
│   └── index.ts
├── Container.ts              # Global dependency injection
└── index.ts                  # Entry point
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Server will be available at `http://localhost:3000`

## Build

```bash
npm run build
```

## Run

```bash
npm start
```

## API Endpoints

### Clinics

- `POST /api/clinics` - Create clinic
- `GET /api/clinics` - List all clinics
- `GET /api/clinics/:id` - Get clinic by ID
- `PUT /api/clinics/:id` - Update clinic
- `DELETE /api/clinics/:id` - Delete clinic
- `PATCH /api/clinics/:id/activate` - Activate clinic
- `PATCH /api/clinics/:id/deactivate` - Deactivate clinic

### Patients

- `POST /api/patients` - Create patient
- `GET /api/patients/clinic/:clinicId` - List patients by clinic
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `PATCH /api/patients/:id/activate` - Activate patient
- `PATCH /api/patients/:id/deactivate` - Deactivate patient

### Samples

- `POST /api/samples` - Create sample
- `GET /api/samples/patient/:patientId` - List samples by patient
- `GET /api/samples/:id` - Get sample by ID
- `PATCH /api/samples/:id/notes` - Update sample notes
- `PATCH /api/samples/:id/start-processing` - Start processing sample
- `PATCH /api/samples/:id/complete` - Complete sample
- `PATCH /api/samples/:id/reject` - Reject sample
- `DELETE /api/samples/:id` - Delete sample

## Usage Examples

### Create a clinic

```bash
curl -X POST http://localhost:3000/api/clinics \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Central Clinic",
    "address": "Main Street 123",
    "phone": "+34 912345678"
  }'
```

### Create a patient

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com",
    "phone": "+34 987654321",
    "dateOfBirth": "1990-01-15",
    "clinicId": "<clinic-id>"
  }'
```

### Create a sample

```bash
curl -X POST http://localhost:3000/api/samples \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "<patient-id>",
    "clinicId": "<clinic-id>",
    "sampleType": "Blood",
    "collectionDate": "2024-01-15"
  }'
```

## Architecture

### Domain Layer
- **Entities**: Contain business logic and validations
- **Value Objects**: Represent domain values with built-in validation
- **Repositories**: Interfaces that define how entities are persisted

### Application Layer
- **Use Cases**: Orchestrate business logic
- **DTOs**: Data transfer objects

### Infrastructure Layer
- **Repositories**: In-memory implementations
- **Container**: Dependency injection

### Presentation Layer
- **Controllers**: Handle HTTP requests
- **Routes**: Define endpoints

## Domain Validations

### Clinic
- Name cannot be empty (2-100 characters)
- Address cannot be empty (5-255 characters)
- Phone must be valid format

### Patient
- First name cannot be empty (2-50 characters)
- Last name cannot be empty (2-50 characters)
- Email must be valid
- Phone must be valid format
- Date of birth cannot be in the future
- Must belong to a clinic

### Sample
- Patient and clinic must exist
- Patient must belong to the clinic
- Sample type cannot be empty
- Collection date cannot be in the future
- States: PENDING → PROCESSING → COMPLETED or REJECTED

## Testing

```bash
npm run test
npm run test:watch
```

## Linting

```bash
npm run lint
npm run lint:fix
```

## NPM Dependencies

### Production
- **express** (^4.18.2) - Web framework for Node.js
- **uuid** (^9.0.0) - Generate unique identifiers

### Development
- **@types/express** (^4.17.17) - TypeScript types for Express
- **@types/jest** (^29.5.2) - TypeScript types for Jest
- **@types/node** (^20.3.1) - TypeScript types for Node.js
- **@types/supertest** (^2.0.12) - TypeScript types for Supertest
- **@types/uuid** (^9.0.2) - TypeScript types for UUID
- **@typescript-eslint/eslint-plugin** (^8.48.0) - ESLint plugin for TypeScript
- **@typescript-eslint/parser** (^8.48.0) - TypeScript parser for ESLint
- **eslint** (^9.39.1) - Code linting tool
- **jest** (^29.5.0) - Testing framework
- **supertest** (^6.3.3) - HTTP assertion library
- **ts-jest** (^29.1.0) - Jest transformer for TypeScript
- **ts-node** (^10.9.1) - TypeScript execution for Node.js
- **typescript** (^5.1.3) - TypeScript compiler

## Future Improvements

- [ ] Database integration (MongoDB, PostgreSQL)
- [ ] Authentication and authorization
- [ ] Input validation with decorators
- [ ] Centralized logging
- [ ] Improved error handling
- [ ] Unit and integration tests
- [ ] Swagger/OpenAPI documentation
