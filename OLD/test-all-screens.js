/**
 * Comprehensive Screen Validation Test
 * Tests all 9 recreated teacher screens
 */

const fs = require('fs');
const path = require('path');

// Color output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  title: (msg) => console.log(`${colors.cyan}\n${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}`),
};

// Screen configurations
const SCREENS = [
  {
    name: 'NewTeacherDashboard',
    file: 'NewTeacherDashboard.tsx',
    tab: 'Home',
    critical: true,
    requiresAuth: true,
    requiresBaseScreen: true,
  },
  {
    name: 'NewAdvancedClassControlScreen',
    file: 'NewAdvancedClassControlScreen.tsx',
    tab: 'Classes',
    critical: true,
    requiresAuth: true,
    requiresBaseScreen: true,
  },
  {
    name: 'NewClassPreparationScreen',
    file: 'NewClassPreparationScreen.tsx',
    tab: 'Classes',
    critical: true,
    requiresAuth: true,
    requiresBaseScreen: true,
  },
  {
    name: 'NewAssignmentCreatorScreen',
    file: 'NewAssignmentCreatorScreen.tsx',
    tab: 'Classes',
    critical: true,
    requiresAuth: true,
    requiresBaseScreen: true,
  },
  {
    name: 'AssignmentGradingScreen',
    file: 'AssignmentGradingScreen.tsx',
    tab: 'Classes',
    critical: true,
    requiresAuth: true,
    requiresBaseScreen: false,
  },
  {
    name: 'NewStudentDetailScreen',
    file: 'NewStudentDetailScreen.tsx',
    tab: 'Students',
    critical: true,
    requiresAuth: true,
    requiresBaseScreen: true,
  },
  {
    name: 'NewAssessmentAnalyticsScreen',
    file: 'NewAssessmentAnalyticsScreen.tsx',
    tab: 'Analytics',
    critical: true,
    requiresAuth: true,
    requiresBaseScreen: true,
  },
  {
    name: 'NewAttendanceTrackingScreen',
    file: 'NewAttendanceTrackingScreen.tsx',
    tab: 'Classes',
    critical: true,
    requiresAuth: true,
    requiresBaseScreen: true,
  },
  {
    name: 'NewCommunicationHubScreen',
    file: 'NewCommunicationHubScreen.tsx',
    tab: 'Students',
    critical: true,
    requiresAuth: true,
    requiresBaseScreen: true,
  },
];

// Test results
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  details: [],
};

// Helper: Read file content
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

// Test 1: File Existence
function testFileExists(screen) {
  const filePath = path.join(__dirname, 'src', 'screens', 'teacher', screen.file);
  const exists = fs.existsSync(filePath);

  testResults.total++;
  if (exists) {
    testResults.passed++;
    return { pass: true, message: 'File exists' };
  } else {
    testResults.failed++;
    return { pass: false, message: 'File not found' };
  }
}

// Test 2: Import Statements
function testImports(screen) {
  const filePath = path.join(__dirname, 'src', 'screens', 'teacher', screen.file);
  const content = readFile(filePath);

  if (!content) {
    testResults.total++;
    testResults.failed++;
    return { pass: false, message: 'Cannot read file' };
  }

  const issues = [];

  // Check BaseScreen import
  if (screen.requiresBaseScreen) {
    if (content.includes("from '../../shared/components/BaseScreen'") ||
        content.includes('from "../../shared/components/BaseScreen"')) {
      // Correct import
    } else if (content.includes('BaseScreen')) {
      issues.push('BaseScreen import path incorrect');
    } else {
      issues.push('Missing BaseScreen import');
    }
  }

  // Check Supabase import (if used)
  if (content.includes('supabase.')) {
    if (content.includes("from '../../lib/supabase'") ||
        content.includes('from "../../lib/supabase"')) {
      // Correct
    } else if (content.includes("from '../../config/supabase'")) {
      issues.push('Supabase import uses wrong path (config vs lib)');
    }
  }

  // Check for common problematic imports
  if (content.includes("from '../../components/core/BaseScreen'")) {
    issues.push('BaseScreen imported from wrong location');
  }

  testResults.total++;
  if (issues.length === 0) {
    testResults.passed++;
    return { pass: true, message: 'All imports correct' };
  } else {
    testResults.failed++;
    return { pass: false, message: issues.join(', ') };
  }
}

// Test 3: Auth Handling
function testAuthHandling(screen) {
  const filePath = path.join(__dirname, 'src', 'screens', 'teacher', screen.file);
  const content = readFile(filePath);

  if (!content || !screen.requiresAuth) {
    testResults.total++;
    testResults.passed++;
    return { pass: true, message: 'N/A' };
  }

  const issues = [];

  // Check for auth.getUser() usage
  if (content.includes('auth.getUser()')) {
    // Check if it has fallback
    const hasUserIdOr = content.includes('user?.id ||') || content.includes('user?.id??');
    const hasConditionalId = content.includes('user ? user.id :');

    if (!hasUserIdOr && !hasConditionalId) {
      issues.push('No fallback ID for unauthenticated users');
    }

    // Check for "Not authenticated" errors
    if (content.includes('throw new Error') && content.includes('Not authenticated')) {
      issues.push('Throws error when not authenticated');
    }
  }

  testResults.total++;
  if (issues.length === 0) {
    testResults.passed++;
    return { pass: true, message: 'Auth handled properly' };
  } else {
    testResults.warnings++;
    return { pass: true, message: `Warnings: ${issues.join(', ')}`, warning: true };
  }
}

// Test 4: Component Export
function testComponentExport(screen) {
  const filePath = path.join(__dirname, 'src', 'screens', 'teacher', screen.file);
  const content = readFile(filePath);

  if (!content) {
    testResults.total++;
    testResults.failed++;
    return { pass: false, message: 'Cannot read file' };
  }

  const hasDefaultExport = content.includes('export default');
  const hasNamedExport = content.match(/export \{[^}]*\}/);

  testResults.total++;
  if (hasDefaultExport) {
    testResults.passed++;
    return { pass: true, message: 'Default export found' };
  } else {
    testResults.failed++;
    return { pass: false, message: 'No default export found' };
  }
}

// Test 5: Navigation References
function testNavigationInNavigator(screen) {
  const navigatorPath = path.join(__dirname, 'src', 'navigation', 'TeacherNavigator.tsx');
  const content = readFile(navigatorPath);

  if (!content) {
    testResults.total++;
    testResults.failed++;
    return { pass: false, message: 'Navigator not found' };
  }

  const isReferenced = content.includes(screen.name) || content.includes(screen.file.replace('.tsx', ''));

  testResults.total++;
  if (isReferenced) {
    testResults.passed++;
    return { pass: true, message: 'Referenced in navigator' };
  } else {
    testResults.warnings++;
    return { pass: true, message: 'Not found in navigator', warning: true };
  }
}

// Test 6: TypeScript Syntax
function testTypeScriptSyntax(screen) {
  const filePath = path.join(__dirname, 'src', 'screens', 'teacher', screen.file);
  const content = readFile(filePath);

  if (!content) {
    testResults.total++;
    testResults.failed++;
    return { pass: false, message: 'Cannot read file' };
  }

  const issues = [];

  // Check for common syntax issues
  if (content.includes('React.FC<') && !content.includes('import React')) {
    issues.push('Uses React.FC but missing React import');
  }

  // Check for incomplete type definitions
  const incompleteTypes = content.match(/:\s*\{\s*\}/g);
  if (incompleteTypes && incompleteTypes.length > 3) {
    issues.push('Many empty type definitions');
  }

  testResults.total++;
  if (issues.length === 0) {
    testResults.passed++;
    return { pass: true, message: 'Syntax looks good' };
  } else {
    testResults.warnings++;
    return { pass: true, message: issues.join(', '), warning: true };
  }
}

// Run all tests
function runTests() {
  log.title('TEACHER SCREENS COMPREHENSIVE VALIDATION');
  console.log(`Testing ${SCREENS.length} screens with ${6} test categories\n`);

  SCREENS.forEach((screen, index) => {
    console.log(`\n${colors.cyan}[${index + 1}/${SCREENS.length}] ${screen.name}${colors.reset}`);
    console.log(`Tab: ${screen.tab} | Critical: ${screen.critical ? 'Yes' : 'No'}`);
    console.log('-'.repeat(60));

    const screenResults = {
      screen: screen.name,
      tab: screen.tab,
      tests: [],
    };

    // Run tests
    const tests = [
      { name: 'File Exists', fn: () => testFileExists(screen) },
      { name: 'Import Statements', fn: () => testImports(screen) },
      { name: 'Auth Handling', fn: () => testAuthHandling(screen) },
      { name: 'Component Export', fn: () => testComponentExport(screen) },
      { name: 'Navigator Reference', fn: () => testNavigationInNavigator(screen) },
      { name: 'TypeScript Syntax', fn: () => testTypeScriptSyntax(screen) },
    ];

    tests.forEach(test => {
      const result = test.fn();
      screenResults.tests.push({ name: test.name, ...result });

      if (result.pass) {
        if (result.warning) {
          log.warning(`${test.name}: ${result.message}`);
        } else {
          log.success(`${test.name}: ${result.message}`);
        }
      } else {
        log.error(`${test.name}: ${result.message}`);
      }
    });

    testResults.details.push(screenResults);
  });

  // Final report
  log.title('TEST SUMMARY');
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`);
  console.log(`${colors.yellow}Warnings: ${testResults.warnings}${colors.reset}`);

  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  console.log(`\nSuccess Rate: ${successRate}%`);

  if (testResults.failed > 0) {
    log.title('FAILED TESTS');
    testResults.details.forEach(screen => {
      const failedTests = screen.tests.filter(t => !t.pass);
      if (failedTests.length > 0) {
        console.log(`\n${colors.red}${screen.screen}:${colors.reset}`);
        failedTests.forEach(test => {
          console.log(`  ❌ ${test.name}: ${test.message}`);
        });
      }
    });
  }

  if (testResults.warnings > 0) {
    log.title('WARNINGS');
    testResults.details.forEach(screen => {
      const warningTests = screen.tests.filter(t => t.warning);
      if (warningTests.length > 0) {
        console.log(`\n${colors.yellow}${screen.screen}:${colors.reset}`);
        warningTests.forEach(test => {
          console.log(`  ⚠️  ${test.name}: ${test.message}`);
        });
      }
    });
  }

  // Save report
  const reportPath = path.join(__dirname, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ timestamp: new Date().toISOString(), ...testResults }, null, 2));
  log.info(`\nDetailed report saved to: ${reportPath}`);

  return testResults.failed === 0;
}

// Run tests
const allPassed = runTests();
process.exit(allPassed ? 0 : 1);
