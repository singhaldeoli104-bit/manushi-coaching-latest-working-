/**
 * Student Context - Global State Management for Student Data
 *
 * Provides centralized access to student profile and authentication state
 * across the entire student section of the app.
 *
 * Features:
 * - Student profile data (name, email, avatar, class, etc.)
 * - Authentication integration (student_id)
 * - Supabase real-time query
 * - Loading and error states
 * - TypeScript type safety
 *
 * Usage:
 * // Wrap your app with the provider
 * <StudentProvider>
 *   <StudentScreens />
 * </StudentProvider>
 *
 * // Access student data in any component
 * const { student, loading, error, refetch } = useStudent();
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

// Student Profile Interface
export interface StudentProfile {
  /** Unique student ID */
  id: string;

  /** Student's full name */
  name: string;

  /** Student's email */
  email: string;

  /** Student's avatar URL */
  avatar?: string;

  /** Student's phone number */
  phone?: string;

  /** Student's class/grade */
  class?: string;

  /** Student's section */
  section?: string;

  /** Student's roll number */
  rollNumber?: string;

  /** Student's date of birth */
  dateOfBirth?: string;

  /** Student's address */
  address?: string;

  /** Parent/Guardian contact */
  guardianPhone?: string;

  /** Account creation date */
  createdAt: string;

  /** Last profile update date */
  updatedAt: string;
}

// Student Context State
interface StudentContextState {
  /** Current student profile data */
  student: StudentProfile | null;

  /** Loading state */
  loading: boolean;

  /** Error state */
  error: Error | null;

  /** Refetch student data */
  refetch: () => void;
}

// Create Context
const StudentContext = createContext<StudentContextState | undefined>(undefined);

// Student Provider Props
interface StudentProviderProps {
  children: ReactNode;
}

/**
 * Student Context Provider
 *
 * Fetches and provides student profile data to all child components
 */
export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
  // Get authenticated user
  const { user } = useAuth();
  const studentId = user?.id;

  // Fetch student profile from Supabase
  const {
    data: student,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<StudentProfile | null, Error>({
    queryKey: ['student', studentId],
    queryFn: async () => {
      if (!studentId) {
        return null;
      }

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as StudentProfile;
    },
    enabled: !!studentId, // Only run query if studentId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  const value: StudentContextState = {
    student: student || null,
    loading,
    error: error as Error | null,
    refetch,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

/**
 * Hook to access Student Context
 *
 * @returns Student context state with profile data, loading, error states
 * @throws Error if used outside StudentProvider
 *
 * @example
 * const { student, loading, error, refetch } = useStudent();
 *
 * if (loading) return <LoadingState />;
 * if (error) return <ErrorState error={error} />;
 * if (!student) return <EmptyState />;
 *
 * return <Text>Hello, {student.name}!</Text>;
 */
export const useStudent = (): StudentContextState => {
  const context = useContext(StudentContext);

  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }

  return context;
};

export default StudentContext;
