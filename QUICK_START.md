# Quick Start

## Installation and Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Run in development
```bash
npm run dev
```

Server will be available at `http://localhost:3000`

### 3. Build for production
```bash
npm run build
npm start
```

## First Steps

### 1. Create a clinic

```bash
curl -X POST http://localhost:3000/api/clinics \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Central Clinic",
    "address": "Main Street 123",
    "phone": "+34 912345678"
  }'
```

**Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Central Clinic",
  "address": "Main Street 123",
  "phone": "+34 912345678",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

Save the clinic `id` for the next steps.

### 2. Create a patient

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com",
    "phone": "+34 987654321",
    "dateOfBirth": "1990-01-15",
    "clinicId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Response**:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "firstName": "John",
  "lastName": "Smith",
  "fullName": "John Smith",
  "email": "john@example.com",
  "phone": "+34 987654321",
  "dateOfBirth": "1990-01-15T00:00:00.000Z",
  "age": 34,
  "clinicId": "550e8400-e29b-41d4-a716-446655440000",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

Save the patient `id` for the next step.

### 3. Create a sample

```bash
curl -X POST http://localhost:3000/api/samples \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "660e8400-e29b-41d4-a716-446655440001",
    "clinicId": "550e8400-e29b-41d4-a716-446655440000",
    "sampleType": "Blood",
    "collectionDate": "2024-01-15"
  }'
```

**Response**:
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "patientId": "660e8400-e29b-41d4-a716-446655440001",
  "clinicId": "550e8400-e29b-41d4-a716-446655440000",
  "sampleType": "Blood",
  "status": "PENDING",
  "collectionDate": "2024-01-15T00:00:00.000Z",
  "notes": "",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. Get information

#### Get clinic by ID
```bash
curl http://localhost:3000/api/clinics/550e8400-e29b-41d4-a716-446655440000
```

#### List all clinics
```bash
curl http://localhost:3000/api/clinics
```

#### Get patient by ID
```bash
curl http://localhost:3000/api/patients/660e8400-e29b-41d4-a716-446655440001
```

#### List patients by clinic
```bash
curl http://localhost:3000/api/patients/clinic/550e8400-e29b-41d4-a716-446655440000
```

#### Get sample by ID
```bash
curl http://localhost:3000/api/samples/770e8400-e29b-41d4-a716-446655440002
```

#### List samples by patient
```bash
curl http://localhost:3000/api/samples/patient/660e8400-e29b-41d4-a716-446655440001
```

## Run Tests

```bash
npm test
```

To run in watch mode:
```bash
npm run test:watch
```

## Folder Structure

```
clean/
├── src/
│   ├── domain/              # Business logic
│   │   ├── entities/        # Clinic, Patient, Sample
│   │   ├── valueobjects/    # Value objects
│   │   └── repositories/    # Interfaces
│   ├── application/         # Use cases
│   │   └── usecases/
│   │       ├── clinic/
│   │       ├── patient/
│   │       └── sample/
│   ├── infrastructure/      # Technical implementations
│   │   ├── repositories/    # In-memory repositories
│   │   └── container/       # Dependency injection
│   ├── presentation/        # HTTP API
│   │   ├── controllers/
│   │   └── routes/
│   ├── __tests__/          # Tests
│   └── index.ts            # Entry point
├── dist/                    # Compiled code
├── package.json
├── tsconfig.json
├── jest.config.js
├── README.md
├── ARCHITECTURE.md
├── VALUE_OBJECTS.md
└── QUICK_START.md
```

## Validations

### Clinic
- ✅ Name cannot be empty (2-100 characters)
- ✅ Address cannot be empty (5-255 characters)
- ✅ Phone must be valid (minimum 7 characters)

### Patient
- ✅ Names cannot be empty (2-50 characters)
- ✅ Email must be valid
- ✅ Phone must be valid
- ✅ Date of birth cannot be in the future
- ✅ Clinic must exist
- ✅ Patient must belong to clinic

### Sample
- ✅ Patient must exist
- ✅ Clinic must exist
- ✅ Patient must belong to clinic
- ✅ Sample type cannot be empty
- ✅ Collection date cannot be in the future

## Next Steps

1. **Add more use cases**: Update, delete, change status
2. **Integrate database**: Switch from in-memory to MongoDB/PostgreSQL
3. **Add authentication**: JWT, OAuth
4. **Add validation**: Decorators, middleware
5. **Add logging**: Winston, Pino
6. **Add documentation**: Swagger/OpenAPI
7. **Add tests**: Unit, integration, E2E

## Troubleshooting

### Error: "Cannot find module 'uuid'"
```bash
npm install uuid
npm install --save-dev @types/uuid
```

### Error: "Cannot find module 'express'"
```bash
npm install express
npm install --save-dev @types/express
```

### Port 3000 in use
Change the port in `src/index.ts`:
```typescript
const port = 3001; // Change to another port
```

### TypeScript doesn't compile
```bash
npm run build
```

If there are errors, verify that `tsconfig.json` is correctly configured.
