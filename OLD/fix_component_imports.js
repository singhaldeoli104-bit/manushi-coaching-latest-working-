const fs = require('fs');

// Fix import/export mismatches in AppNavigator
const filePath = 'src/navigation/AppNavigator.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix all the mismatched imports - these have default exports but are imported as named
const fixes = [
    // Auth screens
    ["import { ModernWelcomeScreen } from '../screens/auth/ModernWelcomeScreen'", "import ModernWelcomeScreen from '../screens/auth/ModernWelcomeScreen'"],
    ["import { UltraModernLoginScreen } from '../screens/auth/UltraModernLoginScreen'", "import UltraModernLoginScreen from '../screens/auth/UltraModernLoginScreen'"],
    ["import { RegisterScreen } from '../screens/auth/RegisterScreen'", "import RegisterScreen from '../screens/auth/RegisterScreen'"],

    // Dashboard screens
    ["import { StudentDashboard } from '../screens/dashboard/StudentDashboard'", "import StudentDashboard from '../screens/dashboard/StudentDashboard'"],
    ["import { TeacherDashboard } from '../screens/dashboard/TeacherDashboard'", "import TeacherDashboard from '../screens/dashboard/TeacherDashboard'"],
    ["import { ParentDashboard } from '../screens/dashboard/ParentDashboard'", "import ParentDashboard from '../screens/dashboard/ParentDashboard'"],
    ["import { AdminDashboard } from '../screens/dashboard/AdminDashboard'", "import AdminDashboard from '../screens/dashboard/AdminDashboard'"],

    // Student screens
    ["import { DoubtSubmissionScreen } from '../screens/student/DoubtSubmissionScreen'", "import DoubtSubmissionScreen from '../screens/student/DoubtSubmissionScreen'"],
];

fixes.forEach(([wrong, correct]) => {
    content = content.replace(wrong, correct);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed all import/export mismatches in AppNavigator.tsx');
console.log('Fixed imports:');
fixes.forEach(([wrong]) => {
    const screenName = wrong.match(/{ (\w+) }/)?.[1];
    console.log(`  - ${screenName}`);
});
