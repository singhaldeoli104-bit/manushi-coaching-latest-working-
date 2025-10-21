const fs = require('fs');
const path = require('path');

// Fix useTheme imports from react-native-paper to local context
const replacements = [
    // Replace the import
    [/import\s*{\s*useTheme\s*}\s*from\s*['"]react-native-paper['"]/g,
     "import { useTheme } from '../../context/ThemeContext'"],

    // Also handle variations with other imports
    [/import\s*{\s*([^}]*),\s*useTheme\s*}\s*from\s*['"]react-native-paper['"]/g,
     "import { $1 } from 'react-native-paper';\nimport { useTheme } from '../../context/ThemeContext'"],

    [/import\s*{\s*useTheme\s*,\s*([^}]*)\s*}\s*from\s*['"]react-native-paper['"]/g,
     "import { $1 } from 'react-native-paper';\nimport { useTheme } from '../../context/ThemeContext'"],
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
    console.log('Fixing useTheme imports...');
    const files = getAllFiles('src');

    console.log(`Found ${files.length} TypeScript files to check...`);

    let fixedCount = 0;
    const fixedFiles = [];

    files.forEach((file, index) => {
        if (fixFile(file)) {
            fixedCount++;
            fixedFiles.push(file);
            console.log(`Fixed: ${file}`);
        }
    });

    console.log(`\n✅ Complete! Fixed ${fixedCount} files out of ${files.length} total files.`);
}

main();
