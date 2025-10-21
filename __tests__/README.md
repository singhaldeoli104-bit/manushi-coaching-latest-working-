# Testing Documentation - Phase 8

This directory contains all tests for the Manushi Coaching Platform backend.

## 📁 Directory Structure

```
__tests__/
├── setup/               # Test configuration and setup
│   └── jest.setup.ts   # Global test setup
├── utils/              # Test utilities and helpers
│   └── testHelpers.ts  # Common test functions
├── unit/               # Unit tests (60% of test suite)
│   ├── database/       # Database function tests
│   ├── services/       # Service layer tests
│   └── cache/          # Cache service tests
├── integration/        # Integration tests (30% of test suite)
│   ├── rls/           # Row Level Security tests
│   └── flows/         # End-to-end flow tests
├── performance/        # Performance tests (5% of test suite)
│   ├── queries/       # Query performance benchmarks
│   └── load/          # Load testing scripts
├── security/          # Security tests (5% of test suite)
│   ├── injection/     # SQL injection tests
│   └── authorization/ # Authorization tests
└── e2e/              # End-to-end tests (optional)
```

## 🚀 Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suites
```bash
npm run test:unit          # Run unit tests only
npm run test:integration   # Run integration tests only
npm run test:performance   # Run performance tests only
npm run test:security      # Run security tests only
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### CI/CD Pipeline
```bash
npm run test:ci
```

## 🎯 Coverage Goals

| Component | Target Coverage |
|-----------|----------------|
| Database Functions | 90% |
| Service Layer | 80% |
| API Endpoints | 75% |
| UI Components | 70% |
| Utilities | 80% |

## 📝 Writing Tests

### Unit Test Example

```typescript
import { calculateStudentGPA } from '@/services/student/studentProgressService';

describe('calculateStudentGPA', () => {
  it('should calculate GPA correctly', async () => {
    const gpa = await calculateStudentGPA('student-id');
    expect(gpa).toBeGreaterThanOrEqual(0);
    expect(gpa).toBeLessThanOrEqual(10);
  });
});
```

### Integration Test Example

```typescript
import { createTestSupabaseClient, generateTestStudent } from '../utils/testHelpers';

describe('Student Enrollment Flow', () => {
  let supabase: SupabaseClient;

  beforeAll(() => {
    supabase = createTestSupabaseClient();
  });

  it('should complete student enrollment', async () => {
    const studentData = generateTestStudent();

    const { data, error } = await supabase
      .from('students')
      .insert(studentData)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.student_id).toBe(studentData.student_id);
  });
});
```

## 🔧 Test Utilities

### Available Helpers

- `createTestSupabaseClient()` - Create test Supabase client
- `createAuthenticatedClient(userId)` - Create authenticated client
- `generateTestStudent()` - Generate test student data
- `generateTestTeacher()` - Generate test teacher data
- `generateTestParent()` - Generate test parent data
- `TestDataCleanup` - Clean up test data after tests
- `measureExecutionTime(fn)` - Measure function execution time
- `assertExecutionTime(fn, maxDuration)` - Assert performance threshold

### Custom Matchers

- `.toBeValidUUID()` - Check if string is valid UUID
- `.toBeISO8601()` - Check if string is ISO 8601 date

## 🔐 Environment Setup

Before running tests, create `.env.test`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-test-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-test-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-test-service-key

TEST_ADMIN_ID=uuid-of-test-admin
TEST_TEACHER_ID=uuid-of-test-teacher
TEST_PARENT_ID=uuid-of-test-parent
TEST_STUDENT_ID=uuid-of-test-student
```

## 📊 Test Execution Plan

### Day 1-2: Unit Tests
- Database function tests
- Service layer tests
- Cache service tests
- Target: 60%+ coverage

### Day 3-4: Integration Tests
- RLS policy tests
- End-to-end flow tests
- Real-time subscription tests
- Target: 80%+ critical path coverage

### Day 5: Performance Tests
- Query performance benchmarks
- Load testing (100-1000 concurrent users)
- Stress testing
- Target: All queries < 2s

### Day 6: Security Tests
- SQL injection prevention
- Authorization bypass prevention
- Data exposure prevention
- Target: 0 vulnerabilities

### Day 7: UAT & Reporting
- User acceptance testing
- Bug fixing
- Final report generation

## 🐛 Debugging Tests

### Enable Verbose Logging
```bash
jest --verbose
```

### Run Specific Test File
```bash
jest path/to/test.test.ts
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

## 📚 Best Practices

1. **Test Isolation** - Each test should be independent
2. **Clean Up** - Always clean up test data in `afterEach`
3. **Descriptive Names** - Use clear test names describing what is tested
4. **AAA Pattern** - Arrange, Act, Assert
5. **Mock External Services** - Mock API calls, file system operations
6. **Performance Assertions** - Include performance checks in critical paths
7. **Security Testing** - Always test authorization and input validation

## 🔗 Related Documentation

- [Phase 8 Testing Plan](../PHASE_8_TESTING_QA_PLAN.md)
- [Backend TODO List](../BACKEND_TODO_LIST.md)
- [Jest Documentation](https://jestjs.io/)
- [Supabase Testing](https://supabase.com/docs/guides/testing)
