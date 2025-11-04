const fs = require('fs');
const path = require('path');

// Fix LightTheme direct property references
const replacements = [
    // Fix LightTheme.border → LightTheme.Outline
    [/LightTheme\.border([^A-Za-z])/g, 'LightTheme.Outline$1'],
    [/LightTheme\.border$/gm, 'LightTheme.Outline'],

    // Fix LightTheme.text → LightTheme.OnSurface
    [/LightTheme\.text([^A-Za-z])/g, 'LightTheme.OnSurface$1'],
    [/LightTheme\.text$/gm, 'LightTheme.OnSurface'],

    // Fix DarkTheme.border → DarkTheme.Outline
    [/DarkTheme\.border([^A-Za-z])/g, 'DarkTheme.Outline$1'],
    [/DarkTheme\.border$/gm, 'DarkTheme.Outline'],

    // Fix DarkTheme.text → DarkTheme.OnSurface
    [/DarkTheme\.text([^A-Za-z])/g, 'DarkTheme.OnSurface$1'],
    [/DarkTheme\.text$/gm, 'DarkTheme.OnSurface'],

    // Fix lowercase theme property accesses
    [/LightTheme\.success([^A-Za-z])/g, 'LightTheme.Success$1'],
    [/LightTheme\.success$/gm, 'LightTheme.Success'],
    [/LightTheme\.warning([^A-Za-z])/g, 'LightTheme.Warning$1'],
    [/LightTheme\.warning$/gm, 'LightTheme.Warning'],
    [/LightTheme\.error([^A-Za-z])/g, 'LightTheme.Error$1'],
    [/LightTheme\.error$/gm, 'LightTheme.Error'],
    [/LightTheme\.info([^A-Za-z])/g, 'LightTheme.Info$1'],
    [/LightTheme\.info$/gm, 'LightTheme.Info'],

    // Same for DarkTheme
    [/DarkTheme\.success([^A-Za-z])/g, 'DarkTheme.Success$1'],
    [/DarkTheme\.success$/gm, 'DarkTheme.Success'],
    [/DarkTheme\.warning([^A-Za-z])/g, 'DarkTheme.Warning$1'],
    [/DarkTheme\.warning$/gm, 'DarkTheme.Warning'],
    [/DarkTheme\.error([^A-Za-z])/g, 'DarkTheme.Error$1'],
    [/DarkTheme\.error$/gm, 'DarkTheme.Error'],
    [/DarkTheme\.info([^A-Za-z])/g, 'DarkTheme.Info$1'],
    [/DarkTheme\.info$/gm, 'DarkTheme.Info'],
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
    console.log('Fixing LightTheme/DarkTheme property references...');
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
