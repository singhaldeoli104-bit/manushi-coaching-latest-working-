#!/usr/bin/env node
/**
 * Generate Teacher App Navigation Structure
 * Run: node generate-teacher-app-structure.js
 *
 * Creates:
 * - All navigation files
 * - All skeleton screen components
 * - All TypeScript types
 * - Folder structure matching UX wireframes
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'src');

// Folder structure
const FOLDERS = [
  'navigation',
  'navigation/stacks',
  'screens/home',
  'screens/classes',
  'screens/teach',
  'screens/assess',
  'screens/questions',
  'screens/library',
  'screens/comms',
  'screens/planner',
  'screens/attendance',
  'screens/reports',
  'screens/analytics',
  'screens/batches',
  'screens/tasks',
  'screens/profile',
  'components/layout',
  'components/ui',
  'components/domain',
  'state',
  'api',
  'types',
  'utils',
  'hooks',
];

// Screen definitions (name, path, title)
const SCREENS = [
  // HOME
  ['HomeDashboardScreen', 'home', 'Home Dashboard'],

  // CLASSES
  ['ClassesListScreen', 'classes', 'Classes List'],
  ['ClassOverviewScreen', 'classes', 'Class Overview'],
  ['ClassAnnouncementsScreen', 'classes', 'Class Announcements'],
  ['ClassChatScreen', 'classes', 'Class Chat'],
  ['ClassResourcesScreen', 'classes', 'Class Resources'],
  ['ClassPlannerScreen', 'classes', 'Lesson Planner'],
  ['ClassAttendanceScreen', 'classes', 'Class Attendance'],
  ['ClassReportsScreen', 'classes', 'Class Reports'],
  ['ClassAnalyticsScreen', 'classes', 'Class Analytics'],

  // TEACH
  ['SessionsManagerScreen', 'teach', 'Sessions Manager'],
  ['LiveClassScreen', 'teach', 'Live Class'],
  ['ClassSummaryScreen', 'teach', 'Class Summary'],

  // ASSESS
  ['TestsListScreen', 'assess', 'Tests List'],
  ['CreateTestScreen', 'assess', 'Create Test'],
  ['TestMonitorScreen', 'assess', 'Test Monitor'],
  ['TestAnalyticsScreen', 'assess', 'Test Analytics'],
  ['StudentTestReportScreen', 'assess', 'Student Test Report'],
  ['HomeworkBuilderScreen', 'assess', 'Homework Builder'],
  ['HomeworkSubmissionsScreen', 'assess', 'Homework Submissions'],

  // QUESTIONS
  ['QuestionBankScreen', 'questions', 'Question Bank'],
  ['QuestionBuilderScreen', 'questions', 'Question Builder'],

  // LIBRARY
  ['ResourcesLibraryScreen', 'library', 'Resources Library'],

  // COMMS
  ['AnnouncementsScreen', 'comms', 'Announcements'],
  ['ChatScreen', 'comms', 'Chat'],

  // PLANNER
  ['LessonPlannerScreen', 'planner', 'Lesson Planner'],

  // ATTENDANCE
  ['AttendanceManagerScreen', 'attendance', 'Attendance Manager'],

  // REPORTS
  ['ReportCardsScreen', 'reports', 'Report Cards'],
  ['CertificatesAwardsScreen', 'reports', 'Certificates & Awards'],

  // ANALYTICS
  ['TeacherAnalyticsScreen', 'analytics', 'Teacher Analytics'],

  // BATCHES
  ['MultiBatchOverviewScreen', 'batches', 'Multi-Batch Overview'],

  // TASKS
  ['TasksCenterScreen', 'tasks', 'Tasks Center'],

  // PROFILE
  ['TeacherProfileScreen', 'profile', 'Teacher Profile'],
  ['TeacherSettingsScreen', 'profile', 'Teacher Settings'],
];

// Create folders
function createFolders() {
  console.log('📁 Creating folder structure...\n');

  FOLDERS.forEach(folder => {
    const folderPath = path.join(BASE_DIR, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`  ✅ Created: ${folder}`);
    } else {
      console.log(`  ⏭️  Exists: ${folder}`);
    }
  });

  console.log('\n');
}

// Generate skeleton screen component
function generateScreen(screenName, folderName, title) {
  const template = `import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function ${screenName}() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>${title}</Text>
        <Text style={styles.subtitle}>Screen: ${screenName}</Text>
        <Text style={styles.status}>🚧 Under Construction</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: '#8B5CF6',
  },
});
`;

  const filePath = path.join(BASE_DIR, 'screens', folderName, `${screenName}.tsx`);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, template);
    return true;
  }
  return false;
}

// Create all screens
function createScreens() {
  console.log('📱 Creating skeleton screens...\n');

  let created = 0;
  let skipped = 0;

  SCREENS.forEach(([name, folder, title]) => {
    const wasCreated = generateScreen(name, folder, title);
    if (wasCreated) {
      console.log(`  ✅ Created: screens/${folder}/${name}.tsx`);
      created++;
    } else {
      console.log(`  ⏭️  Exists: screens/${folder}/${name}.tsx`);
      skipped++;
    }
  });

  console.log(`\n  📊 Created: ${created} | Skipped: ${skipped}\n`);
}

// Generate navigation types
function generateNavigationTypes() {
  const types = `// Auto-generated navigation types
import type {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  LiveClass: { sessionId: string };
  ClassSummary: { sessionId: string };
};

export type MainTabParamList = {
  HomeStack: undefined;
  ClassesStack: undefined;
  TeachStack: undefined;
  AssessStack: undefined;
  LibraryStack: undefined;
  MoreStack: undefined;
};

// HOME
export type HomeStackParamList = {
  HomeDashboard: undefined;
  TasksCenter: undefined;
};

// CLASSES
export type ClassesStackParamList = {
  ClassesList: undefined;
  ClassOverview: { classId: string };
  ClassAnnouncements: { classId: string };
  ClassChat: { classId: string };
  ClassResources: { classId: string };
  ClassPlanner: { classId: string };
  ClassAttendance: { classId: string };
  ClassReports: { classId: string };
  ClassAnalytics: { classId: string };
};

// TEACH
export type TeachStackParamList = {
  SessionsManager: undefined;
  LiveClassEntry: { sessionId: string };
  ClassSummaryEntry: { sessionId: string };
};

// ASSESS
export type AssessStackParamList = {
  TestsList: undefined;
  CreateTest: { classId?: string } | undefined;
  TestMonitor: { testId: string };
  TestAnalytics: { testId: string };
  StudentTestReport: { testId: string; studentId: string };
  HomeworkBuilder: { classId?: string } | undefined;
  HomeworkSubmissions: { homeworkId: string };
  QuestionBank: undefined;
  QuestionBuilder: { from?: 'test' | 'homework' } | undefined;
};

// LIBRARY
export type LibraryStackParamList = {
  ResourcesLibrary: undefined;
};

// MORE
export type MoreStackParamList = {
  Announcements: undefined;
  Chat: undefined;
  LessonPlanner: undefined;
  AttendanceManager: undefined;
  ReportCards: undefined;
  CertificatesAwards: undefined;
  TeacherAnalytics: undefined;
  MultiBatchOverview: undefined;
  TasksCenter: undefined;
  TeacherProfile: undefined;
  TeacherSettings: undefined;
};
`;

  const filePath = path.join(BASE_DIR, 'navigation', 'types.ts');
  fs.writeFileSync(filePath, types);
  console.log('📝 Created: navigation/types.ts\n');
}

// Main execution
function main() {
  console.log('\n🚀 Generating Teacher App Structure\n');
  console.log('='repeat(50));
  console.log('\n');

  createFolders();
  createScreens();
  generateNavigationTypes();

  console.log('='repeat(50));
  console.log('\n✨ Generation complete!\n');
  console.log('📁 Base directory: ' + BASE_DIR);
  console.log('📱 Total screens: ' + SCREENS.length);
  console.log('\n🎯 Next steps:');
  console.log('  1. Run: npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs');
  console.log('  2. Copy navigation files from the guide');
  console.log('  3. Start building screens one by one\n');
}

// Helper to repeat strings (for older Node versions)
if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    return new Array(count + 1).join(this);
  };
}

main();
