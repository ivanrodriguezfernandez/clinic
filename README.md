# Clean Architecture API

Node.js + TypeScript API with clean architecture, separated use cases, and rich domain models.

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
├── domain/                    # Business logic
│   ├── entities/             # Rich entities (Clinic, Patient, Sample)
│   ├── valueobjects/         # Value objects (ClinicName, PatientEmail, etc.)
│   └── repositories/         # Repository interfaces
├── application/              # Use cases
│   └── usecases/
│       ├── clinic/          # Clinic use cases
│       ├── patient/         # Patient use cases
│       └── sample/          # Sample use cases
├── infrastructure/           # Technical implementations
│   ├── repositories/        # In-memory repositories
│   └── container/           # Dependency injection
├── presentation/             # HTTP API
│   ├── controllers/         # Controllers
│   └── routes/              # Express routes
└── index.ts                 # Entry point
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

## Future Improvements

- [ ] Database integration (MongoDB, PostgreSQL)
- [ ] Authentication and authorization
- [ ] Input validation with decorators
- [ ] Centralized logging
- [ ] Improved error handling
- [ ] Unit and integration tests
- [ ] Swagger/OpenAPI documentation
