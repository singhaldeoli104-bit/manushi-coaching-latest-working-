const fs = require('fs');
const path = require('path');

// Fix property case issues from overcorrection
const replacements = [
    // Fix .Error → .error (property access)
    [/\.Error([^A-Za-z])/g, '.error$1'],
    [/\.Error$/gm, '.error'],

    // Fix .Errors → .errors (property access)
    [/\.Errors([^A-Za-z])/g, '.errors$1'],
    [/\.Errors$/gm, '.errors'],

    // Fix .Warning → .warning (property access)
    [/\.Warning([^A-Za-z])/g, '.warning$1'],
    [/\.Warning$/gm, '.warning'],

    // Fix .Success → .success (property access)
    [/\.Success([^A-Za-z])/g, '.success$1'],
    [/\.Success$/gm, '.success'],

    // Fix .Info → .info (property access)
    [/\.Info([^A-Za-z])/g, '.info$1'],
    [/\.Info$/gm, '.info'],

    // Fix .Primary → .primary (property access on non-theme objects)
    // But be careful not to break theme.Primary
    [/status\.Primary/g, 'status.primary'],
    [/type\.Primary/g, 'type.primary'],
    [/role\.Primary/g, 'role.primary'],
    [/level\.Primary/g, 'level.primary'],

    // Fix object property names in destructuring and object literals
    [/{\s*Error:/g, '{ error:'],
    [/,\s*Error:/g, ', error:'],
    [/{\s*Errors:/g, '{ errors:'],
    [/,\s*Errors:/g, ', errors:'],
    [/{\s*Warning:/g, '{ warning:'],
    [/,\s*Warning:/g, ', warning:'],
    [/{\s*Success:/g, '{ success:'],
    [/,\s*Success:/g, ', success:'],
    [/{\s*Info:/g, '{ info:'],
    [/,\s*Info:/g, ', info:'],

    // Fix in conditionals
    [/if\s*\(\s*([a-zA-Z_]+)\.Error\s*\)/g, 'if ($1.error)'],
    [/&&\s*([a-zA-Z_]+)\.Error([^A-Za-z])/g, '&& $1.error$2'],
    [/\|\|\s*([a-zA-Z_]+)\.Error([^A-Za-z])/g, '|| $1.error$2'],

    // Fix in string literals and messages
    [/"Error":/g, '"error":'],
    [/"Errors":/g, '"errors":'],
    [/"Warning":/g, '"warning":'],
    [/"Success":/g, '"success":'],
    [/"Info":/g, '"info":'],
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
    console.log('Fixing property case issues from overcorrection...');
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
