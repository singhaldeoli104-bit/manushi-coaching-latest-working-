/**
 * EXAMPLE: How to use validation in a React Native form
 *
 * This demonstrates:
 * 1. Real-time field validation
 * 2. Submit validation
 * 3. Error display
 * 4. Form state management
 * 5. User feedback
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { T } from '../../ui';
import {
  StudentProfileFormSchema,
  validateField,
  validateForm,
  showValidationErrors,
  useFormValidation,
} from '../../utils/validationHelpers';

type Props = NativeStackScreenProps<any, 'ValidatedFormExample'>;

// ============================================================================
// METHOD 1: Manual Validation (More Control)
// ============================================================================

export function ManualValidationExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '10',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate single field (on blur or on change)
  const handleFieldValidation = (field: keyof typeof formData, value: any) => {
    const schema = StudentProfileFormSchema.shape[field];
    const error = validateField(schema, value);

    setErrors((prev) => {
      if (error) {
        return { ...prev, [field]: error };
      } else {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
    });
  };

  // Validate entire form on submit
  const handleSubmit = async () => {
    const result = validateForm(StudentProfileFormSchema, {
      ...formData,
      grade: parseInt(formData.grade, 10),
    });

    if (!result.valid) {
      setErrors(result.errors);
      showValidationErrors(result.errors);
      return;
    }

    // Valid data - proceed with submission
    const validData = result.data;
    Alert.alert('Success', `Form submitted: ${JSON.stringify(validData, null, 2)}`);

    // TODO: Send to Supabase
    // const { error } = await supabase
    //   .from('students')
    //   .insert(validData);
  };

  return (
    <BaseScreen scrollable>
      <View style={styles.container}>
        <T variant="title" weight="bold" style={styles.header}>
          Student Profile Form
        </T>
        <T variant="caption" color="muted" style={styles.subtitle}>
          Manual validation example
        </T>

        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <T variant="caption" weight="semibold" style={styles.label}>
            Full Name *
          </T>
          <TextInput
            style={[
              styles.input,
              touched.name && errors.name && styles.inputError,
            ]}
            placeholder="Enter full name"
            value={formData.name}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, name: text }));
              // Real-time validation (optional)
              if (touched.name) {
                handleFieldValidation('name', text);
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, name: true }));
              handleFieldValidation('name', formData.name);
            }}
          />
          {touched.name && errors.name && (
            <T variant="caption" color="error" style={styles.errorText}>
              {errors.name}
            </T>
          )}
        </View>

        {/* Email Field */}
        <View style={styles.fieldContainer}>
          <T variant="caption" weight="semibold" style={styles.label}>
            Email *
          </T>
          <TextInput
            style={[
              styles.input,
              touched.email && errors.email && styles.inputError,
            ]}
            placeholder="student@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, email: text }));
              if (touched.email) {
                handleFieldValidation('email', text);
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, email: true }));
              handleFieldValidation('email', formData.email);
            }}
          />
          {touched.email && errors.email && (
            <T variant="caption" color="error" style={styles.errorText}>
              {errors.email}
            </T>
          )}
        </View>

        {/* Phone Field */}
        <View style={styles.fieldContainer}>
          <T variant="caption" weight="semibold" style={styles.label}>
            Phone Number *
          </T>
          <TextInput
            style={[
              styles.input,
              touched.phone && errors.phone && styles.inputError,
            ]}
            placeholder="9876543210"
            keyboardType="phone-pad"
            maxLength={10}
            value={formData.phone}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, phone: text }));
              if (touched.phone) {
                handleFieldValidation('phone', text);
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, phone: true }));
              handleFieldValidation('phone', formData.phone);
            }}
          />
          {touched.phone && errors.phone && (
            <T variant="caption" color="error" style={styles.errorText}>
              {errors.phone}
            </T>
          )}
        </View>

        {/* Grade Field */}
        <View style={styles.fieldContainer}>
          <T variant="caption" weight="semibold" style={styles.label}>
            Grade *
          </T>
          <TextInput
            style={[
              styles.input,
              touched.grade && errors.grade && styles.inputError,
            ]}
            placeholder="10"
            keyboardType="number-pad"
            value={formData.grade}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, grade: text }));
              if (touched.grade) {
                handleFieldValidation('grade', parseInt(text, 10));
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, grade: true }));
              handleFieldValidation('grade', parseInt(formData.grade, 10));
            }}
          />
          {touched.grade && errors.grade && (
            <T variant="caption" color="error" style={styles.errorText}>
              {errors.grade}
            </T>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <T variant="body" weight="bold" style={styles.submitButtonText}>
            Submit
          </T>
        </TouchableOpacity>
      </View>
    </BaseScreen>
  );
}

// ============================================================================
// METHOD 2: Using Custom Hook (Cleaner, Less Boilerplate)
// ============================================================================

export default function HookBasedValidationExample({ navigation }: Props) {
  const form = useFormValidation(StudentProfileFormSchema, {
    name: '',
    email: '',
    phone: '',
    grade: 10,
  });

  const handleSubmit = async () => {
    if (!form.validateAll()) {
      Alert.alert(
        'Validation Error',
        'Please fix the errors before submitting'
      );
      return;
    }

    // Valid data available in form.values
    Alert.alert('Success', `Form submitted: ${JSON.stringify(form.values, null, 2)}`);

    // TODO: Send to Supabase
    // const { error } = await supabase
    //   .from('students')
    //   .insert(form.values);

    // Reset form after success
    form.reset();
  };

  return (
    <BaseScreen scrollable>
      <View style={styles.container}>
        <T variant="title" weight="bold" style={styles.header}>
          Student Profile Form
        </T>
        <T variant="caption" color="muted" style={styles.subtitle}>
          Hook-based validation example (recommended)
        </T>

        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <T variant="caption" weight="semibold" style={styles.label}>
            Full Name *
          </T>
          <TextInput
            style={[
              styles.input,
              form.touched.name && form.errors.name && styles.inputError,
            ]}
            placeholder="Enter full name"
            value={form.values.name}
            onChangeText={(text) => form.setValue('name', text)}
            onBlur={() => form.touchField('name')}
          />
          {form.touched.name && form.errors.name && (
            <T variant="caption" color="error" style={styles.errorText}>
              {form.errors.name}
            </T>
          )}
        </View>

        {/* Email Field */}
        <View style={styles.fieldContainer}>
          <T variant="caption" weight="semibold" style={styles.label}>
            Email *
          </T>
          <TextInput
            style={[
              styles.input,
              form.touched.email && form.errors.email && styles.inputError,
            ]}
            placeholder="student@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.values.email}
            onChangeText={(text) => form.setValue('email', text)}
            onBlur={() => form.touchField('email')}
          />
          {form.touched.email && form.errors.email && (
            <T variant="caption" color="error" style={styles.errorText}>
              {form.errors.email}
            </T>
          )}
        </View>

        {/* Phone Field */}
        <View style={styles.fieldContainer}>
          <T variant="caption" weight="semibold" style={styles.label}>
            Phone Number *
          </T>
          <TextInput
            style={[
              styles.input,
              form.touched.phone && form.errors.phone && styles.inputError,
            ]}
            placeholder="9876543210"
            keyboardType="phone-pad"
            maxLength={10}
            value={form.values.phone}
            onChangeText={(text) => form.setValue('phone', text)}
            onBlur={() => form.touchField('phone')}
          />
          {form.touched.phone && form.errors.phone && (
            <T variant="caption" color="error" style={styles.errorText}>
              {form.errors.phone}
            </T>
          )}
        </View>

        {/* Grade Field */}
        <View style={styles.fieldContainer}>
          <T variant="caption" weight="semibold" style={styles.label}>
            Grade *
          </T>
          <TextInput
            style={[
              styles.input,
              form.touched.grade && form.errors.grade && styles.inputError,
            ]}
            placeholder="10"
            keyboardType="number-pad"
            value={form.values.grade?.toString() || ''}
            onChangeText={(text) => form.setValue('grade', parseInt(text, 10) || 0)}
            onBlur={() => form.touchField('grade')}
          />
          {form.touched.grade && form.errors.grade && (
            <T variant="caption" color="error" style={styles.errorText}>
              {form.errors.grade}
            </T>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !form.isValid && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <T variant="body" weight="bold" style={styles.submitButtonText}>
            Submit
          </T>
        </TouchableOpacity>

        {/* Reset Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={form.reset}
          activeOpacity={0.7}
        >
          <T variant="body" color="muted">
            Reset Form
          </T>
        </TouchableOpacity>
      </View>
    </BaseScreen>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#FFF',
  },
  inputError: {
    borderColor: '#EF4444', // Red border for errors
    borderWidth: 2,
  },
  errorText: {
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFF',
  },
  resetButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
});
