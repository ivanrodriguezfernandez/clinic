# Value Objects

## What are Value Objects?

Value Objects are objects that represent domain values. Unlike Entities, Value Objects:

- **Have no identity**: Two Value Objects are equal if their values are equal
- **Are immutable**: Once created, they don't change
- **Encapsulate validation logic**: Validation happens in the constructor
- **Avoid Primitive Obsession**: Replace primitive types (strings, numbers) with meaningful objects

## Value Objects in the API

### Clinic

#### ClinicName
```typescript
new ClinicName("Central Clinic")
// Validations:
// - Cannot be empty
// - Minimum 2 characters
// - Maximum 100 characters
```

#### ClinicAddress
```typescript
new ClinicAddress("Main Street 123")
// Validations:
// - Cannot be empty
// - Minimum 5 characters
// - Maximum 255 characters
```

#### ClinicPhone
```typescript
new ClinicPhone("+34 912345678")
// Validations:
// - Valid format (minimum 7 characters with digits, spaces, hyphens, etc.)
```

### Patient

#### PatientFirstName
```typescript
new PatientFirstName("John")
// Validations:
// - Cannot be empty
// - Minimum 2 characters
// - Maximum 50 characters
```

#### PatientLastName
```typescript
new PatientLastName("Smith")
// Validations:
// - Cannot be empty
// - Minimum 2 characters
// - Maximum 50 characters
```

#### PatientEmail
```typescript
new PatientEmail("john@example.com")
// Validations:
// - Valid email format
// - Normalized to lowercase
```

#### PatientPhone
```typescript
new PatientPhone("+34 987654321")
// Validations:
// - Valid format (minimum 7 characters with digits, spaces, hyphens, etc.)
```

#### PatientDateOfBirth
```typescript
new PatientDateOfBirth(new Date("1990-01-15"))
// Validations:
// - Cannot be in the future
// Methods:
// - getValue(): Date
// - getAge(): number (calculates age automatically)
```

## Value Objects Advantages

### 1. Centralized Validation
```typescript
// ❌ Without Value Objects
const clinic = new Clinic("", "address", "phone"); // Error in constructor

// ✅ With Value Objects
const name = new ClinicName(""); // Immediate error when creating Value Object
```

### 2. Type Safety
```typescript
// ❌ Without Value Objects
function updateClinicName(clinic: Clinic, name: string) {
  clinic.changeName(name); // Is it a valid name?
}

// ✅ With Value Objects
function updateClinicName(clinic: Clinic, name: ClinicName) {
  clinic.changeName(name); // Guaranteed to be valid
}
```

### 3. Encapsulated Business Logic
```typescript
// ✅ With Value Objects
const age = patient.getAge(); // Calculation logic is in PatientDateOfBirth
```

### 4. Semantic Comparison
```typescript
// ✅ With Value Objects
const email1 = new PatientEmail("john@example.com");
const email2 = new PatientEmail("john@example.com");
email1.equals(email2); // true (value-based comparison)
```

## How to Use Value Objects

### In Entities

```typescript
export class Clinic {
  private name: ClinicName;
  private address: ClinicAddress;
  private phone: ClinicPhone;

  constructor(
    name: ClinicName,
    address: ClinicAddress,
    phone: ClinicPhone
  ) {
    this.name = name;
    this.address = address;
    this.phone = phone;
  }

  getName(): ClinicName {
    return this.name;
  }

  changeName(newName: ClinicName): void {
    this.name = newName;
  }
}
```

### In Use Cases

```typescript
export class CreateClinicUseCase {
  async execute(request: CreateClinicRequest): Promise<CreateClinicResponse> {
    // Create Value Objects (automatic validation)
    const clinicName = new ClinicName(request.name);
    const clinicAddress = new ClinicAddress(request.address);
    const clinicPhone = new ClinicPhone(request.phone);

    // Create entity with Value Objects
    const clinic = new Clinic(clinicName, clinicAddress, clinicPhone);
    
    // Persist
    await this.clinicRepository.save(clinic);

    // Return primitives in response
    return {
      id: clinic.getId(),
      name: clinic.getName().getValue(),
      address: clinic.getAddress().getValue(),
      phone: clinic.getPhone().getValue(),
      // ...
    };
  }
}
```

## Folder Structure

```
src/domain/valueobjects/
├── ClinicName.ts
├── ClinicAddress.ts
├── ClinicPhone.ts
├── PatientFirstName.ts
├── PatientLastName.ts
├── PatientEmail.ts
├── PatientPhone.ts
└── PatientDateOfBirth.ts
```

## Future Value Objects

You can create more Value Objects for:

- **Sample**: `SampleType`, `SampleStatus`
- **Identifiers**: `ClinicId`, `PatientId`, `SampleId`
- **Money**: `Price`, `Currency`
- **Measurements**: `Temperature`, `Weight`, `Height`
- **Ranges**: `DateRange`, `TimeRange`

## Example: Create a New Value Object

```typescript
// src/domain/valueobjects/SampleType.ts
export class SampleType {
  private readonly value: string;
  private static readonly VALID_TYPES = ['Blood', 'Urine', 'Saliva', 'Stool'];

  constructor(value: string) {
    if (!SampleType.VALID_TYPES.includes(value)) {
      throw new Error(`Invalid sample type. Must be one of: ${SampleType.VALID_TYPES.join(', ')}`);
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: SampleType): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static getValidTypes(): string[] {
    return [...SampleType.VALID_TYPES];
  }
}
```

## Conclusion

Value Objects are a powerful tool for:

- ✅ Avoiding Primitive Obsession
- ✅ Centralizing validations
- ✅ Improving type safety
- ✅ Making code more expressive
- ✅ Facilitating testing
- ✅ Implementing business logic clearly
