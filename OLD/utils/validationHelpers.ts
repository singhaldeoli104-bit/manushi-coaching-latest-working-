import { z } from 'zod';
import { Alert } from 'react-native';

// ============================================================================
// COMMON VALIDATION SCHEMAS (Reusable across app)
// ============================================================================

export const CommonSchemas = {
  // Email validation
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  // Phone validation (Indian format)
  phoneIndian: z.string()
    .regex(/^[6-9]\d{9}$/, 'Invalid phone number (must be 10 digits starting with 6-9)'),

  // Name validation
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  // Password validation
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  // UUID validation
  uuid: z.string().uuid('Invalid ID format'),

  // Grade validation
  grade: z.number()
    .int('Grade must be a whole number')
    .min(1, 'Grade must be between 1 and 12')
    .max(12, 'Grade must be between 1 and 12'),

  // Age validation
  age: z.number()
    .int('Age must be a whole number')
    .min(5, 'Age must be at least 5')
    .max(25, 'Age must be under 25'),

  // Date validation (YYYY-MM-DD format)
  dateString: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const d = new Date(date);
      return !isNaN(d.getTime()) && d < new Date('2100-01-01');
    }, 'Invalid date'),

  // URL validation
  url: z.string().url('Invalid URL'),

  // Non-empty string
  nonEmptyString: z.string()
    .min(1, 'This field is required')
    .trim(),

  // Positive number
  positiveNumber: z.number()
    .positive('Must be a positive number'),

  // Amount (money - supports decimals)
  amount: z.number()
    .positive('Amount must be positive')
    .refine((val) => {
      const decimal = val.toString().split('.')[1];
      return !decimal || decimal.length <= 2;
    }, 'Amount can have at most 2 decimal places'),
};

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

/**
 * Validate a single field and return error message if invalid
 */
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: any
): string | null {
  try {
    schema.parse(value);
    return null; // Valid
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return 'Validation error';
  }
}

/**
 * Validate an entire form object
 * Returns { valid: true } or { valid: false, errors: {...} }
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: any
): { valid: true; data: T } | { valid: false; errors: Record<string, string> } {
  try {
    const validated = schema.parse(data);
    return { valid: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { valid: false, errors };
    }
    return { valid: false, errors: { _form: 'Validation error' } };
  }
}

/**
 * Show validation errors as Alert
 */
export function showValidationErrors(errors: Record<string, string>): void {
  const errorMessages = Object.entries(errors)
    .map(([field, message]) => `• ${message}`)
    .join('\n');

  Alert.alert('Validation Error', errorMessages);
}

/**
 * Safe parse - returns null if invalid, or parsed data if valid
 */
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: any
): T | null {
  try {
    return schema.parse(data);
  } catch {
    return null;
  }
}

// ============================================================================
// EXAMPLE FORM SCHEMAS
// ============================================================================

// Student profile form
export const StudentProfileFormSchema = z.object({
  name: CommonSchemas.name,
  email: CommonSchemas.email,
  phone: CommonSchemas.phoneIndian,
  grade: CommonSchemas.grade,
  dateOfBirth: CommonSchemas.dateString.optional(),
});

export type StudentProfileForm = z.infer<typeof StudentProfileFormSchema>;

// Login form
export const LoginFormSchema = z.object({
  email: CommonSchemas.email,
  password: z.string().min(1, 'Password is required'),
});

export type LoginForm = z.infer<typeof LoginFormSchema>;

// Payment form
export const PaymentFormSchema = z.object({
  amount: CommonSchemas.amount,
  paymentMethod: z.enum(['card', 'upi', 'netbanking']),
  // Conditional fields based on payment method
  cardNumber: z.string().optional(),
  upiId: z.string().optional(),
}).refine(
  (data) => {
    if (data.paymentMethod === 'card') {
      return !!data.cardNumber && /^\d{16}$/.test(data.cardNumber);
    }
    if (data.paymentMethod === 'upi') {
      return !!data.upiId && /^[\w.-]+@[\w.-]+$/.test(data.upiId);
    }
    return true;
  },
  {
    message: 'Invalid payment details',
    path: ['paymentMethod'],
  }
);

export type PaymentForm = z.infer<typeof PaymentFormSchema>;

// Note creation form
export const NoteFormSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title is too long'),
  content: z.string()
    .min(10, 'Note content must be at least 10 characters')
    .max(5000, 'Note is too long'),
  subjectId: CommonSchemas.uuid.optional(),
  tags: z.array(z.string()).optional(),
});

export type NoteForm = z.infer<typeof NoteFormSchema>;

// ============================================================================
// USAGE HOOK FOR FORMS
// ============================================================================

/**
 * Example custom hook for form validation
 * Usage:
 *
 * const form = useFormValidation(StudentProfileFormSchema, {
 *   name: '',
 *   email: '',
 *   phone: '',
 *   grade: 10,
 * });
 *
 * <TextInput
 *   value={form.values.name}
 *   onChangeText={(text) => form.setValue('name', text)}
 *   onBlur={() => form.touchField('name')}
 * />
 * {form.touched.name && form.errors.name && (
 *   <T color="error">{form.errors.name}</T>
 * )}
 */
export function useFormValidation<T>(
  schema: z.ZodSchema<T>,
  initialValues: any
) {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const setValue = (field: string, value: any) => {
    setValues((prev: any) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const touchField = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate field on blur
    validateSingleField(field);
  };

  const validateSingleField = (field: string) => {
    try {
      const fieldSchema = (schema as any).shape[field];
      if (fieldSchema) {
        fieldSchema.parse(values[field]);
        // Clear error
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.errors[0].message,
        }));
      }
    }
  };

  const validateAll = (): boolean => {
    const result = validateForm(schema, values);
    if (result.valid) {
      setErrors({});
      return true;
    } else {
      setErrors(result.errors);
      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(result.errors).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      return false;
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    setValue,
    touchField,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}

// Note: Import React at top if using the hook
import React from 'react';
