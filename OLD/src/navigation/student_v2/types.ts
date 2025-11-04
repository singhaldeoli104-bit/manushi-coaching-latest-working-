/**
 * Student Navigation V2 - Type Definitions
 * Phase 0 Navigation Integration
 * 
 * Route types for type-safe navigation with React Navigation
 */

/**
 * Stack Navigator Routes
 * Handles all screen navigation with StudentTopBar
 */
export type StudentStackParamList = {
  // Dashboard & Home
  Dashboard: undefined;
  
  // Schedule & Classes
  Schedule: undefined;
  ClassDetail: { classId: string };
  LiveClass: { classId: string };
  
  // Assignments & Study
  AssignmentList: undefined;
  AssignmentDetail: { assignmentId: string };
  StudyMaterials: undefined;
  
  // Progress & Performance
  Progress: undefined;
  ProgressDetail: { subjectId: string };
  
  // Doubts & Help
  Doubts: undefined;
  DoubtDetail: { doubtId: string };
  AskDoubt: undefined;
  
  // Attendance
  Attendance: undefined;
  
  // Profile & Settings
  Profile: undefined;
  Settings: undefined;
  
  // Notifications
  Notifications: undefined;
};

/**
 * Bottom Tab Navigator Routes
 * Handles main app sections with StudentBottomNav
 */
export type StudentTabParamList = {
  Home: undefined;
  Schedule: undefined;
  Study: undefined;
  Progress: undefined;
  More: undefined;
};

/**
 * Drawer Navigator Routes
 * Handles side menu navigation with StudentDrawer
 */
export type StudentDrawerParamList = {
  MainTabs: undefined;
  Dashboard: undefined;
  Schedule: undefined;
  Assignments: undefined;
  Progress: undefined;
  Doubts: undefined;
  Attendance: undefined;
  Profile: undefined;
  Settings: undefined;
  Notifications: undefined;
};

/**
 * Navigation Props Helper Types
 */
export type StackScreenProps<T extends keyof StudentStackParamList> = {
  route: {
    params: StudentStackParamList[T];
  };
  navigation: any;
};

export type TabScreenProps<T extends keyof StudentTabParamList> = {
  route: {
    params: StudentTabParamList[T];
  };
  navigation: any;
};

export type DrawerScreenProps<T extends keyof StudentDrawerParamList> = {
  route: {
    params: StudentDrawerParamList[T];
  };
  navigation: any;
};
