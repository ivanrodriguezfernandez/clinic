# Vertical Slicing Architecture

## Overview

This project uses **Vertical Slicing** architecture, which organizes code by features/use cases rather than by technical layers. Each feature is a complete vertical slice containing all layers needed to implement that functionality.

## Structure

```
src/
├── clinic/                         # Clinic module (vertical slice)
│   ├── domain/
│   │   ├── Clinic.ts              # Entity
│   │   ├── IClinicRepository.ts    # Repository interface
│   │   └── valueobjects/          # Value objects (ClinicName, ClinicAddress, ClinicPhone)
│   ├── application/
│   │   ├── CreateClinicUseCase.ts
│   │   ├── GetClinicUseCase.ts
│   │   ├── ListClinicsUseCase.ts
│   │   ├── UpdateClinicUseCase.ts
│   │   ├── DeleteClinicUseCase.ts
│   │   ├── ActivateClinicUseCase.ts
│   │   └── DeactivateClinicUseCase.ts
│   ├── infrastructure/
│   │   ├── InMemoryClinicRepository.ts
│   │   └── Container.ts            # Module-level DI
│   ├── presentation/
│   │   ├── ClinicController.ts
│   │   └── clinicRoutes.ts
│   └── index.ts                    # Module exports
│
├── patient/                        # Patient module (vertical slice)
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   ├── presentation/
│   └── index.ts
│
├── sample/                         # Sample module (vertical slice)
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   ├── presentation/
│   └── index.ts
│
├── shared/                         # Shared utilities
│   ├── errors/                     # Custom error classes (ValidationError, NotFoundError, etc.)
│   ├── middleware/                 # Express middleware (errorHandler)
│   └── index.ts
│
├── Container.ts                    # Global dependency injection
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
Adding new features is straightforward - just create a new module folder with the same structure.

```
src/
├── clinic/
├── patient/
├── sample/
└── appointment/    # New module - same structure
    ├── domain/
    ├── application/
    ├── infrastructure/
    ├── presentation/
    └── index.ts
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

### Value Objects (`shared/`)
Reusable value objects used across modules.

```typescript
// src/shared/index.ts - Exports shared utilities
export { ValidationError } from './errors/ValidationError';
export { NotFoundError } from './errors/NotFoundError';
export { ClinicName } from '../clinic/domain/valueobjects/ClinicName';
export { PatientEmail } from '../patient/domain/valueobjects/PatientEmail';
// ... other exports
```

### Error Classes (`shared/errors/`)
Custom error classes for consistent error handling.

```typescript
// src/shared/errors/ValidationError.ts
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Global Container (`src/Container.ts`)
Dependency injection container that wires all modules.

```typescript
// src/Container.ts
import { ClinicContainer } from './clinic/infrastructure/Container';
import { PatientContainer } from './patient/infrastructure/Container';
import { SampleContainer } from './sample/infrastructure/Container';

export class Container {
  private clinicContainer: ClinicContainer;
  private patientContainer: PatientContainer;
  private sampleContainer: SampleContainer;

  constructor() {
    this.clinicContainer = new ClinicContainer();
    this.patientContainer = new PatientContainer();
    this.sampleContainer = new SampleContainer();
  }

  getClinicController() {
    return this.clinicContainer.getClinicController();
  }
  // ... other getters
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

## How This Project is Organized

This project already follows vertical slicing with modules:

1. Each module (clinic, patient, sample) is self-contained
2. Shared utilities are in `src/shared/`
3. Global container wires all modules in `src/Container.ts`
4. Tests are organized in `tests/` directory
5. Each module exports its public API via `index.ts`

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

## Example: Adding a New Module

To add an `Appointment` module:

```
src/appointment/
├── domain/
│   ├── Appointment.ts
│   ├── IAppointmentRepository.ts
│   └── valueobjects/
│       └── AppointmentTime.ts
├── application/
│   ├── CreateAppointmentUseCase.ts
│   ├── GetAppointmentUseCase.ts
│   ├── ListAppointmentsUseCase.ts
│   ├── UpdateAppointmentUseCase.ts
│   └── DeleteAppointmentUseCase.ts
├── infrastructure/
│   ├── InMemoryAppointmentRepository.ts
│   └── Container.ts
├── presentation/
│   ├── AppointmentController.ts
│   └── appointmentRoutes.ts
└── index.ts
```

Then:
1. Create `tests/usecases/appointment/` for unit tests
2. Create `tests/e2e/appointment.e2e.test.ts` for E2E tests
3. Update `src/Container.ts` to include AppointmentContainer
4. Update `src/index.ts` to register appointment routes
