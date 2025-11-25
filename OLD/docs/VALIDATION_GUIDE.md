# 📋 Validation Guide for React Native Mobile Apps

Complete guide for implementing validation in your React Native + TypeScript app.

---

## 🎯 Types of Validation

### 1. Form Input Validation (User Input)
**Purpose:** Validate data entered by users in forms
**When:** Registration, profile editing, payment forms, note creation
**Tools:** Zod schemas, custom validation functions

### 2. Navigation Parameter Validation
**Purpose:** Ensure valid data passed between screens
**When:** Screen navigation with params, deep linking
**Tools:** Zod schemas in `navigationSchemas.ts`

### 3. API/Supabase Data Validation
**Purpose:** Validate data received from backend
**When:** After fetching from Supabase, external APIs
**Tools:** Zod schemas, type guards

### 4. Business Logic Validation
**Purpose:** Enforce business rules
**When:** Payment processing, enrollment logic, scheduling
**Tools:** Custom validation functions

---

## ⚡ Quick Start

### Step 1: Import validation helpers
```typescript
import {
  CommonSchemas,
  validateField,
  validateForm,
  useFormValidation,
} from '../utils/validationHelpers';
```

### Step 2: Define your schema
```typescript
import { z } from 'zod';

const MyFormSchema = z.object({
  name: CommonSchemas.name,
  email: CommonSchemas.email,
  phone: CommonSchemas.phoneIndian,
});
```

### Step 3: Use in component (Method 1: Hook)
```typescript
const form = useFormValidation(MyFormSchema, {
  name: '',
  email: '',
  phone: '',
});

<TextInput
  value={form.values.name}
  onChangeText={(text) => form.setValue('name', text)}
  onBlur={() => form.touchField('name')}
/>
{form.touched.name && form.errors.name && (
  <T color="error">{form.errors.name}</T>
)}
```

### Step 4: Submit
```typescript
const handleSubmit = () => {
  if (!form.validateAll()) {
    Alert.alert('Please fix errors');
    return;
  }
  // Valid data in form.values
  submitToSupabase(form.values);
};
```

---

## 📚 Common Schemas Reference

```typescript
// Email
CommonSchemas.email
// Error: "Invalid email address"

// Phone (Indian - 10 digits starting with 6-9)
CommonSchemas.phoneIndian
// Error: "Invalid phone number (must be 10 digits starting with 6-9)"

// Name (2-50 chars, letters only)
CommonSchemas.name
// Error: "Name must be at least 2 characters"

// Password (8+ chars, uppercase, lowercase, number)
CommonSchemas.password
// Error: "Password must contain at least one uppercase letter"

// UUID
CommonSchemas.uuid
// Error: "Invalid ID format"

// Grade (1-12)
CommonSchemas.grade
// Error: "Grade must be between 1 and 12"

// Age (5-25)
CommonSchemas.age
// Error: "Age must be at least 5"

// Date (YYYY-MM-DD)
CommonSchemas.dateString
// Error: "Date must be in YYYY-MM-DD format"

// Amount (money, max 2 decimals)
CommonSchemas.amount
// Error: "Amount can have at most 2 decimal places"

// Non-empty string
CommonSchemas.nonEmptyString
// Error: "This field is required"
```

---

## 🛠️ Helper Functions

### validateField
```typescript
const error = validateField(CommonSchemas.email, 'test@example.com');
// Returns: null (valid) or error message string
```

### validateForm
```typescript
const result = validateForm(MySchema, formData);
if (result.valid) {
  // result.data has validated, typed data
} else {
  // result.errors has field-level errors
}
```

### useFormValidation (Hook)
```typescript
const form = useFormValidation(schema, initialValues);

// API:
form.values        // Current form values
form.errors        // Current errors object
form.touched       // Which fields user has touched
form.setValue      // Update a field value
form.touchField    // Mark field as touched
form.validateAll   // Validate entire form
form.reset         // Reset to initial state
form.isValid       // Boolean - is form valid?
```

---

## 🎨 UI Patterns

### 1. Inline Errors (Recommended for Mobile)
```typescript
<TextInput
  style={[
    styles.input,
    form.touched.email && form.errors.email && styles.inputError
  ]}
  value={form.values.email}
  onChangeText={(text) => form.setValue('email', text)}
  onBlur={() => form.touchField('email')}
/>
{form.touched.email && form.errors.email && (
  <T variant="caption" color="error">
    {form.errors.email}
  </T>
)}
```

### 2. Alert Dialog (Critical Errors)
```typescript
if (!form.validateAll()) {
  Alert.alert('Validation Error', 'Please fix the errors before submitting');
  return;
}
```

### 3. Disabled Submit Button
```typescript
<TouchableOpacity
  style={[
    styles.submitButton,
    !form.isValid && styles.submitButtonDisabled
  ]}
  disabled={!form.isValid}
  onPress={handleSubmit}
>
  <T>Submit</T>
</TouchableOpacity>
```

---

## 🔥 Best Practices

### ✅ DO

1. **Validate on blur** (when user leaves field)
```typescript
onBlur={() => form.touchField('email')}
```

2. **Show errors only after field is touched**
```typescript
{form.touched.email && form.errors.email && ...}
```

3. **Clear errors when user starts typing**
```typescript
// useFormValidation does this automatically
```

4. **Validate entire form before submit**
```typescript
if (!form.validateAll()) return;
```

5. **Validate data from Supabase**
```typescript
const validated = MySchema.parse(supabaseData);
```

6. **Use TypeScript types from schemas**
```typescript
type MyForm = z.infer<typeof MyFormSchema>;
```

### ❌ DON'T

1. **Don't validate on every keystroke** (bad UX)
```typescript
// ❌ BAD
onChangeText={(text) => {
  form.setValue('email', text);
  form.touchField('email'); // Shows error while typing
}}

// ✅ GOOD
onChangeText={(text) => form.setValue('email', text)}
onBlur={() => form.touchField('email')} // Shows error after leaving field
```

2. **Don't trust client-side validation alone**
```typescript
// ✅ Validate on client (good UX)
// ✅ Also validate on server/Supabase (security)
```

3. **Don't show all errors at once**
```typescript
// ❌ BAD - overwhelming
Alert.alert('Errors', Object.values(errors).join('\n'));

// ✅ GOOD - show inline per field
```

4. **Don't skip validation on data from Supabase**
```typescript
// ❌ BAD - trust backend data
const data = await supabase.from('students').select();
return data; // Might have unexpected shape

// ✅ GOOD - validate backend data
const data = await supabase.from('students').select();
return StudentsSchema.parse(data);
```

---

## 🔄 Validation Timing

### Real-Time (On Change)
**When to use:** Only for simple validations like "required" or character limits
**UX:** Can be annoying if too aggressive

```typescript
onChangeText={(text) => {
  form.setValue('name', text);
  if (text.length > 50) {
    // Show error immediately if too long
  }
}}
```

### On Blur (Recommended)
**When to use:** Most validations (email, phone, etc.)
**UX:** Best balance - validates after user finishes typing

```typescript
onBlur={() => form.touchField('email')}
```

### On Submit
**When to use:** Always validate entire form before submitting
**UX:** Final safety check

```typescript
const handleSubmit = () => {
  if (!form.validateAll()) {
    Alert.alert('Please fix errors');
    return;
  }
  // Proceed
};
```

---

## 📖 Full Examples

See complete working examples in:
- `screens/examples/ValidatedFormExample.tsx` - Two methods demonstrated
- `utils/validationHelpers.ts` - All helper functions and schemas

---

## 🚀 Custom Validation Schemas

### Basic Schema
```typescript
const MySchema = z.object({
  name: z.string().min(2, 'Too short'),
  age: z.number().min(18, 'Must be 18+'),
});
```

### Optional Fields
```typescript
const MySchema = z.object({
  name: z.string(),
  middleName: z.string().optional(), // Can be undefined
  nickname: z.string().nullable(),   // Can be null
});
```

### Conditional Validation
```typescript
const PaymentSchema = z.discriminatedUnion('paymentMethod', [
  z.object({
    paymentMethod: z.literal('card'),
    cardNumber: z.string().length(16),
  }),
  z.object({
    paymentMethod: z.literal('upi'),
    upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/),
  }),
]);
```

### Custom Refinement
```typescript
const PasswordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
```

### Array Validation
```typescript
const TagsSchema = z.object({
  tags: z.array(z.string())
    .min(1, 'At least one tag required')
    .max(5, 'Maximum 5 tags allowed'),
});
```

---

## 🐛 Common Validation Errors

### "Expected string, received number"
```typescript
// ❌ Problem
const age = "25"; // String from TextInput
schema.parse({ age }); // Expects number

// ✅ Solution
const age = parseInt(ageInput, 10);
schema.parse({ age });
```

### "Invalid UUID"
```typescript
// ❌ Problem
safeNavigate('ChildDetail', { childId: '123' }); // Not a UUID

// ✅ Solution
// Ensure IDs from Supabase are proper UUIDs
// Or use z.string() instead of z.string().uuid()
```

### "Field is required but empty"
```typescript
// ❌ Problem
const name = "   "; // Spaces only
schema.parse({ name });

// ✅ Solution
const name = nameInput.trim();
schema.parse({ name });
```

---

## 📝 Checklist for Every Form

- [ ] Define Zod schema with clear error messages
- [ ] Use `useFormValidation` hook for state management
- [ ] Show errors only for touched fields
- [ ] Validate on blur (not on every keystroke)
- [ ] Validate entire form before submit
- [ ] Show inline errors below each field
- [ ] Visual feedback (red border on error)
- [ ] Disable submit button if form invalid
- [ ] Clear error when user starts correcting
- [ ] Test with invalid data
- [ ] Test with edge cases (empty, very long, special chars)

---

**Remember:** Client-side validation is for **UX**, server-side validation is for **security**. Always validate on both!
