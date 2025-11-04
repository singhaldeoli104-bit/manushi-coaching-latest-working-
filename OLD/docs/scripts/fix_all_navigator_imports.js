const fs = require('fs');

// Fix import/export mismatches in all navigator files
const navigatorFiles = [
    'src/navigation/AppNavigator.tsx',
    'src/navigation/ResponsiveAppNavigator.tsx',
];

// Define all the mismatched imports that need fixing
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

    // Common screens
    ["import { NotificationScreen } from '../screens/common/NotificationScreen'", "import NotificationScreen from '../screens/common/NotificationScreen'"],
    ["import { ProfileScreen } from '../screens/common/ProfileScreen'", "import ProfileScreen from '../screens/common/ProfileScreen'"],
    ["import { SettingsScreen } from '../screens/common/SettingsScreen'", "import SettingsScreen from '../screens/common/SettingsScreen'"],
];

let totalFixed = 0;

navigatorFiles.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let fileFixed = 0;

        fixes.forEach(([wrong, correct]) => {
            if (content.includes(wrong)) {
                content = content.replace(wrong, correct);
                fileFixed++;
            }
        });

        if (fileFixed > 0) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed ${fileFixed} imports in ${filePath}`);
            totalFixed += fileFixed;
        }
    } catch (error) {
        console.log(`⚠️ Could not process ${filePath}: ${error.message}`);
    }
});

console.log(`\n✅ Total: Fixed ${totalFixed} import statements across all navigator files`);
