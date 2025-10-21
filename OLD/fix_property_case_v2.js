const fs = require('fs');
const path = require('path');

// Fix property case issues but preserve theme.Error, theme.Warning, etc.
function fixContent(content) {
    let result = content;

    // First, protect theme properties by temporarily replacing them
    const themeProtections = [
        ['theme.Error', '___THEME_ERROR___'],
        ['theme.Warning', '___THEME_WARNING___'],
        ['theme.Success', '___THEME_SUCCESS___'],
        ['theme.Info', '___THEME_INFO___'],
        ['theme.Errors', '___THEME_ERRORS___'],
    ];

    // Apply protections
    themeProtections.forEach(([original, placeholder]) => {
        result = result.split(original).join(placeholder);
    });

    // Now fix property access patterns
    const replacements = [
        // Fix .Error → .error (property access on non-theme objects)
        [/\.Error([^A-Za-z_])/g, '.error$1'],
        [/\.Error$/gm, '.error'],

        // Fix .Errors → .errors (property access)
        [/\.Errors([^A-Za-z_])/g, '.errors$1'],
        [/\.Errors$/gm, '.errors'],

        // Fix .Warning → .warning (property access)
        [/\.Warning([^A-Za-z_])/g, '.warning$1'],
        [/\.Warning$/gm, '.warning'],

        // Fix .Warnings → .warnings (property access)
        [/\.Warnings([^A-Za-z_])/g, '.warnings$1'],
        [/\.Warnings$/gm, '.warnings'],

        // Fix .Success → .success (property access)
        [/\.Success([^A-Za-z_])/g, '.success$1'],
        [/\.Success$/gm, '.success'],

        // Fix .Info → .info (property access)
        [/\.Info([^A-Za-z_])/g, '.info$1'],
        [/\.Info$/gm, '.info'],

        // Fix object property names in destructuring
        [/{\s*Error:/g, '{ error:'],
        [/,\s*Error:/g, ', error:'],
        [/{\s*Errors:/g, '{ errors:'],
        [/,\s*Errors:/g, ', errors:'],
        [/{\s*Warning:/g, '{ warning:'],
        [/,\s*Warning:/g, ', warning:'],
        [/{\s*Warnings:/g, '{ warnings:'],
        [/,\s*Warnings:/g, ', warnings:'],
        [/{\s*Success:/g, '{ success:'],
        [/,\s*Success:/g, ', success:'],
        [/{\s*Info:/g, '{ info:'],
        [/,\s*Info:/g, ', info:'],

        // Fix in string literals (JSON keys)
        [/"Error":/g, '"error":'],
        [/"Errors":/g, '"errors":'],
        [/"Warning":/g, '"warning":'],
        [/"Warnings":/g, '"warnings":'],
        [/"Success":/g, '"success":'],
        [/"Info":/g, '"info":'],
    ];

    // Apply replacements
    replacements.forEach(([pattern, replacement]) => {
        result = result.replace(pattern, replacement);
    });

    // Restore theme properties
    themeProtections.forEach(([original, placeholder]) => {
        result = result.split(placeholder).join(original);
    });

    return result;
}

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
        const originalContent = fs.readFileSync(filePath, 'utf8');
        const newContent = fixContent(originalContent);

        // Only write if changes were made
        if (newContent !== originalContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}: ${error.message}`);
        return false;
    }
}

function main() {
    console.log('Fixing property case issues (v2 - preserving theme properties)...');
    const files = getAllFiles('src');

    console.log(`Found ${files.length} TypeScript files to check...`);

    let fixedCount = 0;
    const fixedFiles = [];

    files.forEach((file, index) => {
        if (fixFile(file)) {
            fixedCount++;
            fixedFiles.push(file);
            if (fixedCount % 10 === 0) {
                console.log(`Fixed ${fixedCount} files...`);
            }
        }
    });

    console.log(`\n✅ Complete! Fixed ${fixedCount} files out of ${files.length} total files.`);
    if (fixedFiles.length > 0 && fixedFiles.length <= 20) {
        console.log('\nFixed files:');
        fixedFiles.forEach(f => console.log(`  - ${f}`));
    }
}

main();
