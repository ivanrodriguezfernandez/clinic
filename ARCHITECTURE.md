# Clean Architecture - Detailed Guide

## Design Principles

This API follows the **Clean Architecture** principles by Robert C. Martin, with emphasis on:

1. **Framework Independence**: Business logic doesn't depend on Express, databases, etc.
2. **Testability**: Each layer can be tested independently
3. **Maintainability**: Changes in one layer don't affect other layers
4. **Scalability**: Easy to add new features

## Architecture Layers

### 1. Domain Layer

**Location**: `src/{module}/domain/` (e.g., `src/clinic/domain/`, `src/patient/domain/`)

The innermost and most important layer. Contains pure business logic.

#### Entities

Entities are objects that represent business concepts. They are **rich in logic** and not simple data containers.

**Characteristics**:
- Encapsulation: Private properties, public methods
- Validations: Validate their own state
- Business methods: Implement domain rules
- `toPrimitives()` method: Converts entity to a plain object

**Example - Clinic**:
```typescript
class Clinic {
  private id: string;
  private name: ClinicName;
  private isActive: boolean;

  // Validations in constructor
  constructor(name: ClinicName, address: ClinicAddress, phone: ClinicPhone) {
    this.id = uuidv4();
    this.name = name;
    // ...
  }

  // Business methods
  activate(): void {
    if (this.isActive) {
      throw new Error('Clinic is already active');
    }
    this.isActive = true;
  }
}
```

#### Value Objects

Value Objects represent domain values with built-in validation and business logic.

**Characteristics**:
- Immutable: Cannot be changed after creation
- No identity: Equality based on value, not identity
- Validation in constructor: Ensures valid state
- Encapsulates logic: Domain rules are encapsulated

**Example - ClinicName**:
```typescript
import { ValidationError } from '../../../shared';

export class ClinicName {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Clinic name cannot be empty');
    }
    if (value.trim().length < 2) {
      throw new ValidationError('Clinic name must be at least 2 characters long');
    }
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }
}
```

#### Repository Interfaces

Define **contracts** for persistence without specifying how they're implemented.

```typescript
export interface IClinicRepository {
  save(clinic: Clinic): Promise<void>;
  findById(id: string): Promise<Clinic | null>;
  findAll(): Promise<Clinic[]>;
  update(clinic: Clinic): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### 2. Application Layer

**Location**: `src/{module}/application/` (e.g., `src/clinic/application/`)

Orchestrates business logic. Contains **use cases**.

#### Use Cases

Each use case represents a user action. Implements application logic:
- Validates that entities exist
- Orchestrates operations between multiple entities
- Transforms data between layers

**Structure**:
```typescript
export interface CreateClinicRequest {
  name: string;
  address: string;
  phone: string;
}

export interface CreateClinicResponse {
  id: string;
  name: string;
  // ...
}

export class CreateClinicUseCase {
  constructor(private clinicRepository: IClinicRepository) {}

  async execute(request: CreateClinicRequest): Promise<CreateClinicResponse> {
    // 1. Create entity (domain validations)
    const clinicName = new ClinicName(request.name);
    const clinic = new Clinic(clinicName, ...);
    
    // 2. Persist
    await this.clinicRepository.save(clinic);
    
    // 3. Return DTO
    return {
      id: clinic.getId(),
      name: clinic.getName().getValue(),
      // ...
    };
  }
}
```

**Advantages**:
- Each use case is independent
- Easy to test
- Reusable from different interfaces (HTTP, CLI, etc.)

### 3. Infrastructure Layer

**Location**: `src/{module}/infrastructure/` (e.g., `src/clinic/infrastructure/`)

Technical implementations of domain interfaces.

#### Repository Implementations

Implement domain interfaces. In this project, we use in-memory repositories.

```typescript
export class InMemoryClinicRepository implements IClinicRepository {
  private clinics: Map<string, Clinic> = new Map();

  async save(clinic: Clinic): Promise<void> {
    this.clinics.set(clinic.getId(), clinic);
  }

  async findById(id: string): Promise<Clinic | null> {
    return this.clinics.get(id) || null;
  }
  // ...
}
```

**Note**: Easy to switch to MongoDB, PostgreSQL, etc. without affecting domain or application.

#### Container (Dependency Injection)

Centralizes instance creation and their dependencies.

```typescript
export class Container {
  private clinicRepository: InMemoryClinicRepository;

  constructor() {
    this.clinicRepository = new InMemoryClinicRepository();
  }

  getCreateClinicUseCase(): CreateClinicUseCase {
    return new CreateClinicUseCase(this.clinicRepository);
  }
}
```

**Advantages**:
- Single place to change implementations
- Facilitates testing (inject mocks)
- Avoids coupling

### 4. Presentation Layer

**Location**: `src/{module}/presentation/` (e.g., `src/clinic/presentation/`)

HTTP interface with Express.

#### Controllers

Handle HTTP requests and delegate to use cases.

```typescript
export class ClinicController {
  constructor(private createClinicUseCase: CreateClinicUseCase) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, address, phone } = req.body;
      
      // Validate input
      if (!name || !address || !phone) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      
      // Execute use case
      const response = await this.createClinicUseCase.execute({
        name,
        address,
        phone,
      });
      
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

**Responsibilities**:
- Parse HTTP input
- Validate format
- Call use case
- Format HTTP response

#### Routes

Define endpoints.

```typescript
export function createClinicRoutes(clinicController: ClinicController): Router {
  const router = Router();
  
  router.post('/', (req, res) => clinicController.create(req, res));
  router.get('/:id', (req, res) => clinicController.getById(req, res));
  
  return router;
}
```

## Request Flow

```
HTTP Request
    ↓
Router → Controller
    ↓
UseCase (Application Layer)
    ↓
Entity (Domain Layer)
    ↓
Value Objects (Domain Layer)
    ↓
Repository Interface (Domain Layer)
    ↓
Repository Implementation (Infrastructure Layer)
    ↓
In-Memory Storage
    ↓
Response DTO
    ↓
HTTP Response
```

## Complete Example: Create a Clinic

### 1. HTTP Request
```bash
POST /api/clinics
{
  "name": "Central Clinic",
  "address": "Main Street 123",
  "phone": "+34 912345678"
}
```

### 2. Router
Receives the request and passes it to the controller.

### 3. Controller
```typescript
async create(req: Request, res: Response): Promise<void> {
  const { name, address, phone } = req.body;
  const response = await this.createClinicUseCase.execute({
    name,
    address,
    phone,
  });
  res.status(201).json(response);
}
```

### 4. UseCase
```typescript
async execute(request: CreateClinicRequest): Promise<CreateClinicResponse> {
  // Create Value Objects (automatic validation)
  const clinicName = new ClinicName(request.name);
  const clinicAddress = new ClinicAddress(request.address);
  const clinicPhone = new ClinicPhone(request.phone);
  
  // Create entity
  const clinic = new Clinic(clinicName, clinicAddress, clinicPhone);
  
  // Persist
  await this.clinicRepository.save(clinic);
  
  // Return DTO
  return { id: clinic.getId(), ... };
}
```

### 5. Entity
```typescript
constructor(name: ClinicName, address: ClinicAddress, phone: ClinicPhone) {
  this.id = uuidv4();
  this.name = name;
  this.address = address;
  this.phone = phone;
  // ...
}
```

### 6. Repository
```typescript
async save(clinic: Clinic): Promise<void> {
  this.clinics.set(clinic.getId(), clinic);
}
```

### 7. HTTP Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Central Clinic",
  "address": "Main Street 123",
  "phone": "+34 912345678",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## Architecture Advantages

### 1. Testability
```typescript
// Test UseCase without Express
const mockRepository = new MockClinicRepository();
const useCase = new CreateClinicUseCase(mockRepository);
const response = await useCase.execute({...});
expect(response.id).toBeDefined();
```

### 2. Change Implementations
```typescript
// Switch from in-memory to MongoDB
// Only change in Container
const clinicRepository = new MongoClinicRepository();
// Rest of code doesn't change
```

### 3. Reuse Logic
```typescript
// Same UseCase can be used from:
// - HTTP API
// - CLI
// - Events
// - Scheduled tasks
```

### 4. Independent Domain
```typescript
// Business logic is in Clinic
// Doesn't depend on Express, databases, etc.
// Can be used in any context
```

## How to Add a New Feature

### 1. Define the Entity (Domain)
```typescript
// src/domain/entities/NewEntity.ts
export class NewEntity {
  // Business logic
}
```

### 2. Define the Repository (Domain)
```typescript
// src/domain/repositories/INewEntityRepository.ts
export interface INewEntityRepository {
  save(entity: NewEntity): Promise<void>;
  // ...
}
```

### 3. Implement the Repository (Infrastructure)
```typescript
// src/infrastructure/repositories/InMemoryNewEntityRepository.ts
export class InMemoryNewEntityRepository implements INewEntityRepository {
  // Implementation
}
```

### 4. Create the UseCase (Application)
```typescript
// src/application/usecases/newentity/CreateNewEntityUseCase.ts
export class CreateNewEntityUseCase {
  // Application logic
}
```

### 5. Create the Controller (Presentation)
```typescript
// src/presentation/controllers/NewEntityController.ts
export class NewEntityController {
  // HTTP handling
}
```

### 6. Create the Routes (Presentation)
```typescript
// src/presentation/routes/newentityRoutes.ts
export function createNewEntityRoutes(controller: NewEntityController): Router {
  // Routes
}
```

### 7. Register in Container (Infrastructure)
```typescript
// src/infrastructure/container/Container.ts
getCreateNewEntityUseCase(): CreateNewEntityUseCase {
  return new CreateNewEntityUseCase(this.newEntityRepository);
}
```

### 8. Add Routes to Server (Presentation)
```typescript
// src/index.ts
app.use('/api/newentities', createNewEntityRoutes(container.getNewEntityController()));
```

## Conclusion

This architecture provides a solid, maintainable, and scalable foundation for Node.js applications. Clear separation of concerns makes code easier to understand, test, and modify.
