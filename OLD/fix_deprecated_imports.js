const fs = require('fs');
const path = require('path');

// Fix deprecated React Native imports
const replacements = [
    // AsyncStorage - deprecated in React Native, use @react-native-async-storage/async-storage
    [/import\s+{\s*AsyncStorage\s*}\s+from\s+['"]react-native['"]/g,
     "import AsyncStorage from '@react-native-async-storage/async-storage'"],

    // Gesture handlers - moved to react-native-gesture-handler
    [/import\s+{\s*([^}]*PanGestureHandler[^}]*)\s*}\s+from\s+['"]react-native['"]/g,
     "import { $1 } from 'react-native-gesture-handler'"],

    [/import\s+{\s*([^}]*PinchGestureHandler[^}]*)\s*}\s+from\s+['"]react-native['"]/g,
     "import { $1 } from 'react-native-gesture-handler'"],

    [/import\s+{\s*([^}]*State[^}]*)\s*}\s+from\s+['"]react-native['"]/g,
     "import { $1 } from 'react-native-gesture-handler'"],
];

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

function fixFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // Apply all replacements
        replacements.forEach(([pattern, replacement]) => {
            content = content.replace(pattern, replacement);
        });

        // Only write if changes were made
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}: ${error.message}`);
        return false;
    }
}

function main() {
    console.log('Fixing deprecated React Native imports...');
    const files = getAllFiles('src');

    console.log(`Found ${files.length} TypeScript files to check...`);

    let fixedCount = 0;

    files.forEach((file, index) => {
        if (fixFile(file)) {
            fixedCount++;
            console.log(`Fixed: ${file}`);
        }
    });

    console.log(`\n✅ Complete! Fixed ${fixedCount} files out of ${files.length} total files.`);
}

main();
