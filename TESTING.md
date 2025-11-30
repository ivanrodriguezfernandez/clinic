# Testing Guide

## Overview

The project includes comprehensive tests:
- **Unit Tests**: Test individual use cases in isolation
- **Integration Tests**: Test interactions between use cases
- **E2E Tests**: Test the complete API via HTTP requests

## Test Structure

```
tests/
├── usecases/          # Unit tests
│   ├── clinic/
│   ├── patient/
│   └── sample/
└── e2e/               # E2E tests
    ├── clinic.e2e.test.ts
    ├── patient.e2e.test.ts
    └── sample.e2e.test.ts
```

## Running Tests

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm test -- --coverage     # With coverage
```

## Test Coverage

- **Unit Tests**: All use cases with valid and invalid inputs
- **Integration Tests**: Complete workflows across modules
- **E2E Tests**: All HTTP endpoints with error handling

## Adding New Tests

Create a new test file: `tests/usecases/{module}/{UseCase}.test.ts`

```typescript
import { Container } from '../../src/Container';
import { MyUseCase } from '../../src/clinic/application/MyUseCase';

describe('MyUseCase', () => {
  let useCase: MyUseCase;

  beforeEach(() => {
    const container = new Container();
    useCase = container.getMyUseCase();
  });

  test('should do something', async () => {
    const result = await useCase.execute({...});
    expect(result).toBeDefined();
  });
});
```
