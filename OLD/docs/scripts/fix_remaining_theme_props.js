const fs = require('fs');
const path = require('path');

// Fix remaining theme property references
const replacements = [
    // Fix theme.border → theme.Outline
    [/theme\.border([^A-Za-z])/g, 'theme.Outline$1'],
    [/theme\.border$/gm, 'theme.Outline'],

    // Fix theme.text → theme.OnSurface
    [/theme\.text([^A-Za-z])/g, 'theme.OnSurface$1'],
    [/theme\.text$/gm, 'theme.OnSurface'],

    // Fix theme.primaryLight → theme.PrimaryContainer (or similar MD3 variant)
    [/theme\.primaryLight/g, 'theme.PrimaryContainer'],
    [/theme\.secondaryLight/g, 'theme.SecondaryContainer'],
    [/theme\.tertiaryLight/g, 'theme.TertiaryContainer'],
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
    console.log('Fixing remaining theme property references...');
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
