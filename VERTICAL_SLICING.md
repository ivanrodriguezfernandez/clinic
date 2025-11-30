# Vertical Slicing Architecture

## Overview

This project uses **Vertical Slicing** architecture, which organizes code by features/use cases rather than by technical layers. Each feature is a complete vertical slice containing all layers needed to implement that functionality.

## Structure

```
src/
├── shared/                          # Shared across all features
│   ├── domain/
│   │   ├── valueobjects/           # Shared value objects
│   │   └── errors/                 # Domain errors
│   ├── infrastructure/
│   │   ├── container/              # Dependency injection
│   │   └── repositories/           # In-memory repositories
│   └── presentation/
│       └── middleware/             # Shared middleware
│
├── features/                        # Vertical slices by feature
│   ├── clinic/                     # Clinic feature
│   │   ├── domain/
│   │   │   ├── Clinic.ts           # Entity
│   │   │   └── ClinicRepository.ts # Repository interface
│   │   ├── application/
│   │   │   ├── CreateClinicUseCase.ts
│   │   │   ├── GetClinicUseCase.ts
│   │   │   ├── ListClinicsUseCase.ts
│   │   │   ├── UpdateClinicUseCase.ts
│   │   │   ├── DeleteClinicUseCase.ts
│   │   │   ├── ActivateClinicUseCase.ts
│   │   │   └── DeactivateClinicUseCase.ts
│   │   ├── infrastructure/
│   │   │   └── InMemoryClinicRepository.ts
│   │   ├── presentation/
│   │   │   ├── ClinicController.ts
│   │   │   └── clinicRoutes.ts
│   │   ├── __tests__/
│   │   │   ├── usecases/           # Unit tests
│   │   │   └── e2e/                # E2E tests
│   │   └── index.ts                # Feature exports
│   │
│   ├── patient/                    # Patient feature
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   ├── presentation/
│   │   ├── __tests__/
│   │   └── index.ts
│   │
│   └── sample/                     # Sample feature
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       ├── presentation/
│       ├── __tests__/
│       └── index.ts
│
└── index.ts                        # Application entry point
```

## Benefits

### 1. **Feature Independence**
Each feature is self-contained and can be developed, tested, and deployed independently.

```typescript
// clinic/index.ts - Feature exports
export { Clinic } from './domain/Clinic';
export { ClinicRepository } from './domain/ClinicRepository';
export { CreateClinicUseCase } from './application/CreateClinicUseCase';
// ... other exports
```

### 2. **Clear Boundaries**
Each feature has clear responsibilities and dependencies are explicit.

```typescript
// clinic/application/CreateClinicUseCase.ts
import { ClinicRepository } from '../domain/ClinicRepository';
import { Clinic } from '../domain/Clinic';
import { ClinicName } from '../../shared/domain/valueobjects/ClinicName';
```

### 3. **Easy to Scale**
Adding new features is straightforward - just create a new feature folder with the same structure.

```
src/features/
├── clinic/
├── patient/
├── sample/
└── appointment/    # New feature - same structure
    ├── domain/
    ├── application/
    ├── infrastructure/
    ├── presentation/
    └── __tests__/
```

### 4. **Improved Testability**
Tests are co-located with features, making it easier to maintain and understand test coverage.

```
clinic/
├── __tests__/
│   ├── usecases/
│   │   ├── CreateClinicUseCase.test.ts
│   │   ├── GetClinicUseCase.test.ts
│   │   └── ...
│   └── e2e/
│       └── clinic.e2e.test.ts
```

### 5. **Reduced Cognitive Load**
Developers work within a feature folder, reducing the need to navigate across multiple directories.

## Feature Structure Details

### Domain Layer (`domain/`)
Contains business logic and entities specific to the feature.

```typescript
// clinic/domain/Clinic.ts
export class Clinic {
  private id: string;
  private name: ClinicName;
  private address: ClinicAddress;
  private phone: ClinicPhone;
  private isActive: boolean;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(...) { }
  
  // Business methods
  activate(): void { }
  deactivate(): void { }
  changeName(name: ClinicName): void { }
}
```

### Application Layer (`application/`)
Contains use cases that orchestrate domain logic.

```typescript
// clinic/application/CreateClinicUseCase.ts
export class CreateClinicUseCase {
  constructor(private clinicRepository: ClinicRepository) {}

  async execute(input: CreateClinicInput): Promise<CreateClinicOutput> {
    const clinic = new Clinic(
      ClinicName.create(input.name),
      ClinicAddress.create(input.address),
      ClinicPhone.create(input.phone)
    );

    await this.clinicRepository.save(clinic);
    return clinic.toPrimitives();
  }
}
```

### Infrastructure Layer (`infrastructure/`)
Contains implementation details like repositories.

```typescript
// clinic/infrastructure/InMemoryClinicRepository.ts
export class InMemoryClinicRepository implements ClinicRepository {
  private clinics: Map<string, Clinic> = new Map();

  async save(clinic: Clinic): Promise<void> {
    this.clinics.set(clinic.getId(), clinic);
  }

  async findById(id: string): Promise<Clinic | null> {
    return this.clinics.get(id) || null;
  }
}
```

### Presentation Layer (`presentation/`)
Contains HTTP controllers and routes.

```typescript
// clinic/presentation/ClinicController.ts
export class ClinicController {
  constructor(
    private createClinicUseCase: CreateClinicUseCase,
    private getClinicUseCase: GetClinicUseCase,
    // ... other use cases
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.createClinicUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

### Tests (`__tests__/`)
Tests are organized by type and co-located with the feature.

```typescript
// clinic/__tests__/usecases/CreateClinicUseCase.test.ts
describe('CreateClinicUseCase', () => {
  // Unit tests
});

// clinic/__tests__/e2e/clinic.e2e.test.ts
describe('Clinic E2E Tests', () => {
  // E2E tests
});
```

## Shared Code

### Value Objects (`shared/domain/valueobjects/`)
Reusable value objects used across features.

```typescript
// shared/domain/valueobjects/ClinicName.ts
export class ClinicName {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): ClinicName {
    if (!value || value.trim().length < 3) {
      throw new Error('Clinic name must be at least 3 characters');
    }
    return new ClinicName(value.trim());
  }

  getValue(): string {
    return this.value;
  }
}
```

### Repositories (`shared/infrastructure/repositories/`)
In-memory repository implementations.

```typescript
// shared/infrastructure/repositories/InMemoryClinicRepository.ts
export class InMemoryClinicRepository implements ClinicRepository {
  private clinics: Map<string, Clinic> = new Map();
  // Implementation
}
```

### Container (`shared/infrastructure/container/`)
Dependency injection container.

```typescript
// shared/infrastructure/container/Container.ts
export class Container {
  private clinicRepository: ClinicRepository;
  private patientRepository: PatientRepository;
  // ... other repositories

  constructor() {
    this.clinicRepository = new InMemoryClinicRepository();
    this.patientRepository = new InMemoryPatientRepository();
  }

  getCreateClinicUseCase(): CreateClinicUseCase {
    return new CreateClinicUseCase(this.clinicRepository);
  }
  // ... other use case getters
}
```

## Feature Index

Each feature exports its public API through an `index.ts` file:

```typescript
// clinic/index.ts
export { Clinic } from './domain/Clinic';
export { ClinicRepository } from './domain/ClinicRepository';
export { CreateClinicUseCase } from './application/CreateClinicUseCase';
export { GetClinicUseCase } from './application/GetClinicUseCase';
export { ListClinicsUseCase } from './application/ListClinicsUseCase';
export { UpdateClinicUseCase } from './application/UpdateClinicUseCase';
export { DeleteClinicUseCase } from './application/DeleteClinicUseCase';
export { ActivateClinicUseCase } from './application/ActivateClinicUseCase';
export { DeactivateClinicUseCase } from './application/DeactivateClinicUseCase';
export { ClinicController } from './presentation/ClinicController';
```

## Migration Path

If migrating from layered architecture:

1. Create `src/features/` directory
2. Create subdirectories for each feature (clinic, patient, sample)
3. Move domain entities to `features/{feature}/domain/`
4. Move use cases to `features/{feature}/application/`
5. Move repositories to `features/{feature}/infrastructure/`
6. Move controllers/routes to `features/{feature}/presentation/`
7. Move tests to `features/{feature}/__tests__/`
8. Create `shared/` for cross-cutting concerns
9. Update imports and exports
10. Update Container to use new structure

## Advantages Over Layered Architecture

| Aspect | Layered | Vertical Slicing |
|--------|--------|------------------|
| **Feature Independence** | Low - changes span multiple folders | High - all code in one folder |
| **Scalability** | Harder - many files per layer | Easier - clear feature boundaries |
| **Team Collaboration** | Conflicts - multiple teams edit same files | Better - teams work on separate features |
| **Onboarding** | Harder - need to understand all layers | Easier - understand one feature at a time |
| **Testing** | Scattered - tests far from code | Co-located - tests with feature |
| **Refactoring** | Risky - changes affect multiple layers | Safer - changes isolated to feature |

## Best Practices

1. **Keep features independent** - Minimize cross-feature dependencies
2. **Use interfaces** - Define contracts between layers
3. **Centralize shared code** - Put reusable code in `shared/`
4. **Co-locate tests** - Keep tests with features
5. **Clear exports** - Use `index.ts` for feature API
6. **Document dependencies** - Make cross-feature deps explicit
7. **One responsibility** - Each use case does one thing
8. **Immutable value objects** - Prevent accidental mutations

## Example: Adding a New Feature

To add an `Appointment` feature:

```
src/features/appointment/
├── domain/
│   ├── Appointment.ts
│   └── AppointmentRepository.ts
├── application/
│   ├── CreateAppointmentUseCase.ts
│   ├── GetAppointmentUseCase.ts
│   ├── ListAppointmentsUseCase.ts
│   ├── UpdateAppointmentUseCase.ts
│   └── DeleteAppointmentUseCase.ts
├── infrastructure/
│   └── InMemoryAppointmentRepository.ts
├── presentation/
│   ├── AppointmentController.ts
│   └── appointmentRoutes.ts
├── __tests__/
│   ├── usecases/
│   │   ├── CreateAppointmentUseCase.test.ts
│   │   └── ...
│   └── e2e/
│       └── appointment.e2e.test.ts
└── index.ts
```

Then register in Container and add routes to main app.
