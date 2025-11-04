const fs = require('fs');
const path = require('path');

// Find all TypeScript files
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

// Components that have DEFAULT exports but are imported as NAMED
const componentFixes = [
    // Core components
    'CoachingTextField',
    'CoachingButton',
    'CoachingProgressBar',
    'DashboardCard',
    'StatusBadge',
    'ErrorBoundary',

    // Media components (also have named exports, but default is primary)
    'FilePreview',
    'FileUploader',
    'ImagePicker',
    'MediaGallery',
    'UploadProgress',
    'VideoPlayer',

    // Student components
    'DoubtDashboard',
    'DoubtPreview',
    'DoubtSubmissionForm',
    'AIDoubtResolver',
    'CodeEditor',
    'DrawingCanvas',
    'CategorySelector',

    // Realtime components
    'ChatWindow',
    'LiveClassIndicator',
    'LivePoll',
    'MessageBubble',
    'NotificationBanner',
    'PresenceIndicator',
    'TypingIndicator',

    // Other components
    'SmartParentInsights',
    'PlanSelector',
    'IntelligentAnalyticsDashboard',
];

let totalFixed = 0;
let filesModified = 0;

const files = getAllFiles('src');

files.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        let fileChanged = false;

        componentFixes.forEach(componentName => {
            // Fix pattern: import { Component } from '...'
            const wrongPattern = new RegExp(`import\\s*{\\s*${componentName}\\s*}\\s*from\\s*['"]([^'"]+)['"]`, 'g');

            if (wrongPattern.test(content)) {
                content = content.replace(wrongPattern, `import ${componentName} from '$1'`);
                fileChanged = true;
                totalFixed++;
            }
        });

        if (fileChanged) {
            fs.writeFileSync(filePath, content, 'utf8');
            filesModified++;
        }
    } catch (error) {
        // Skip files that can't be read
    }
});

console.log(`✅ Fixed ${totalFixed} import statements in ${filesModified} files`);
console.log(`\nComponents fixed: ${componentFixes.length}`);
