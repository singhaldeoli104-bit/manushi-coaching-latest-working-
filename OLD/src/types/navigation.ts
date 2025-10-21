/**
 * Navigation Type Definitions
 * Type-safe navigation for React Navigation 7.x
 */

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  RoleSelection: undefined;
  OnboardingStudent: undefined;
  OnboardingTeacher: undefined;
};

// Student Stack
export type StudentStackParamList = {
  StudentDashboard: undefined;
  StudentProfile: undefined;
  StudentDoubt: undefined;
  DoubtDetail: { doubtId: string };
  StudentAssignments: undefined;
  AssignmentDetail: { assignmentId: string };
  AssignmentSubmission: { assignmentId: string };
  StudentClasses: undefined;
  ClassDetail: { classId: string };
  JoinLiveClass: { classId: string; sessionId: string };
  StudentTests: undefined;
  TestDetail: { testId: string };
  TakeTest: { testId: string };
  StudentPerformance: undefined;
  StudentLeaderboard: undefined;
  StudentQA: undefined;
  QADetail: { questionId: string };
  AskQuestion: undefined;
  StudentResources: undefined;
  ResourceDetail: { resourceId: string };
  StudentAttendance: undefined;
  StudentChat: { recipientId?: string };
  StudentNotifications: undefined;
  StudentSettings: undefined;
  EditStudentProfile: undefined;
};

// Teacher Stack
export type TeacherStackParamList = {
  TeacherDashboard: undefined;
  TeacherProfile: undefined;
  TeacherClasses: undefined;
  ClassManagement: { classId: string };
  CreateClass: undefined;
  LiveClassControl: { sessionId: string };
  TeacherAssignments: undefined;
  CreateAssignment: { classId?: string };
  AssignmentGrading: { assignmentId: string };
  TeacherTests: undefined;
  CreateTest: { classId?: string };
  TestResults: { testId: string };
  TeacherAttendance: undefined;
  MarkAttendance: { classId: string; sessionId: string };
  TeacherStudents: undefined;
  StudentProgress: { studentId: string };
  TeacherResources: undefined;
  UploadResource: undefined;
  TeacherAnalytics: undefined;
  TeacherChat: { recipientId?: string };
  TeacherNotifications: undefined;
  TeacherSettings: undefined;
  EditTeacherProfile: undefined;
};

// Admin Stack
export type AdminStackParamList = {
  AdminDashboard: undefined;
  UserManagement: undefined;
  StudentManagement: undefined;
  TeacherManagement: undefined;
  ParentManagement: undefined;
  CreateUser: { role: 'student' | 'teacher' | 'parent' | 'admin' };
  EditUser: { userId: string; role: string };
  ClassManagementAdmin: undefined;
  CreateClassAdmin: undefined;
  CourseManagement: undefined;
  CreateCourse: undefined;
  PaymentManagement: undefined;
  PaymentDetail: { paymentId: string };
  SubscriptionManagement: undefined;
  AnalyticsAdmin: undefined;
  ReportsAdmin: undefined;
  ContentManagement: undefined;
  NotificationManagement: undefined;
  SendNotification: undefined;
  SettingsAdmin: undefined;
  SystemConfig: undefined;
  RolePermissions: undefined;
  AuditLogs: undefined;
  SupportTickets: undefined;
  TicketDetail: { ticketId: string };
  DatabaseManagement: undefined;
  APIConfig: undefined;
  IntegrationManagement: undefined;
  BackupRestore: undefined;
};

// Parent Stack
export type ParentStackParamList = {
  ParentDashboard: undefined;
  ParentProfile: undefined;
  ChildrenManagement: undefined;
  AddChild: undefined;
  ChildDetail: { childId: string };
  ChildProgress: { childId: string };
  ChildAttendance: { childId: string };
  ChildAssignments: { childId: string };
  ChildTests: { childId: string };
  ParentChat: { recipientId?: string };
  TeacherCommunication: { teacherId: string };
  ParentNotifications: undefined;
  PaymentHistory: undefined;
  ParentSettings: undefined;
  EditParentProfile: undefined;
  ParentReports: { childId: string };
  ParentFeedback: undefined;
};

// Bottom Tab Navigators
export type StudentTabParamList = {
  Home: undefined;
  Classes: undefined;
  Assignments: undefined;
  Performance: undefined;
  More: undefined;
};

export type TeacherTabParamList = {
  Home: undefined;
  Classes: undefined;
  Students: undefined;
  Analytics: undefined;
  More: undefined;
};

export type ParentTabParamList = {
  Home: undefined;
  Children: undefined;
  Reports: undefined;
  Messages: undefined;
  More: undefined;
};

// Root Stack (Main App Navigator)
export type RootStackParamList = {
  // Auth flow
  Auth: NavigatorScreenParams<AuthStackParamList>;

  // Main role-based flows
  StudentMain: NavigatorScreenParams<StudentTabParamList>;
  TeacherMain: NavigatorScreenParams<TeacherTabParamList>;
  AdminMain: NavigatorScreenParams<AdminStackParamList>;
  ParentMain: NavigatorScreenParams<ParentTabParamList>;

  // Common screens (accessible from any role)
  Settings: undefined;
  Profile: undefined;
  Help: undefined;
  Notifications: undefined;

  // Demo screens (development only)
  SplashScreen: undefined;
  AuthenticationDemo: undefined;
  DesignSystemDemo: undefined;
};

// Screen Props Types (for use in components)
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type StudentStackScreenProps<T extends keyof StudentStackParamList> =
  NativeStackScreenProps<StudentStackParamList, T>;

export type TeacherStackScreenProps<T extends keyof TeacherStackParamList> =
  NativeStackScreenProps<TeacherStackParamList, T>;

export type AdminStackScreenProps<T extends keyof AdminStackParamList> =
  NativeStackScreenProps<AdminStackParamList, T>;

export type ParentStackScreenProps<T extends keyof ParentStackParamList> =
  NativeStackScreenProps<ParentStackParamList, T>;

export type StudentTabScreenProps<T extends keyof StudentTabParamList> =
  BottomTabScreenProps<StudentTabParamList, T>;

export type TeacherTabScreenProps<T extends keyof TeacherTabParamList> =
  BottomTabScreenProps<TeacherTabParamList, T>;

export type ParentTabScreenProps<T extends keyof ParentTabParamList> =
  BottomTabScreenProps<ParentTabParamList, T>;

// Declare global navigation types for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
