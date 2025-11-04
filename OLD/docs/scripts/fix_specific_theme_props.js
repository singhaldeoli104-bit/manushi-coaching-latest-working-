const fs = require('fs');
const path = require('path');

// Fix very specific theme property issues found in errors
const replacements = [
    // Fix theme.colors.accent → theme.Primary
    [/theme\.colors\.accent/g, 'theme.Primary'],

    // Fix theme.colors.divider → theme.OutlineVariant
    [/theme\.colors\.divider/g, 'theme.OutlineVariant'],

    // Fix standalone .colors references (when theme is already removed)
    // This is for cases where it's just accessing colors.something in a style object
    // Be careful to only match when it looks like it's a nested property access
    [/,\s*{\s*backgroundColor:\s*theme\.colors\./g, ', { backgroundColor: theme.'],
    [/,\s*{\s*color:\s*theme\.colors\./g, ', { color: theme.'],
    [/,\s*{\s*borderColor:\s*theme\.colors\./g, ', { borderColor: theme.'],

    // Fix individual remaining theme.border and theme.text
    // Be very specific to avoid false positives
    [/(\W)theme\.border(\W)/g, '$1theme.Outline$2'],
    [/(\W)theme\.text(\W)/g, '$1theme.OnSurface$2'],

    // Fix in style objects
    [/borderColor:\s*theme\.border\b/g, 'borderColor: theme.Outline'],
    [/color:\s*theme\.text\b/g, 'color: theme.OnSurface'],
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
    console.log('Fixing specific theme property issues...');
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
    if (fixedFiles.length > 0) {
        console.log('\nFixed files:');
        fixedFiles.forEach(f => console.log(`  - ${f}`));
    }
}

main();
