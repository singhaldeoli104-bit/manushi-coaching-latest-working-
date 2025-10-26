const fs = require('fs');
const path = require('path');

// Fix theme.error → theme.Error, theme.warning → theme.Warning, etc.
const replacements = [
    // Fix theme property accesses to use PascalCase
    [/theme\.error([^A-Za-z])/g, 'theme.Error$1'],
    [/theme\.error$/gm, 'theme.Error'],

    [/theme\.warning([^A-Za-z])/g, 'theme.Warning$1'],
    [/theme\.warning$/gm, 'theme.Warning'],

    [/theme\.warnings([^A-Za-z])/g, 'theme.Warnings$1'],
    [/theme\.warnings$/gm, 'theme.Warnings'],

    [/theme\.success([^A-Za-z])/g, 'theme.Success$1'],
    [/theme\.success$/gm, 'theme.Success'],

    [/theme\.info([^A-Za-z])/g, 'theme.Info$1'],
    [/theme\.info$/gm, 'theme.Info'],
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
    console.log('Fixing theme property case issues...');
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
