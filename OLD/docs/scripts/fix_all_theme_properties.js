const fs = require('fs');
const path = require('path');

// Comprehensive theme property case fixes - catch ALL variants
const replacements = [
    // All possible theme property patterns (both theme.property and destructured)
    // Direct theme access
    [/\.primary([^A-Z])/g, '.Primary$1'],
    [/\.onPrimary([^A-Z])/g, '.OnPrimary$1'],
    [/\.primaryContainer([^A-Z])/g, '.PrimaryContainer$1'],
    [/\.onPrimaryContainer([^A-Z])/g, '.OnPrimaryContainer$1'],

    [/\.secondary([^A-Z])/g, '.Secondary$1'],
    [/\.onSecondary([^A-Z])/g, '.OnSecondary$1'],
    [/\.secondaryContainer([^A-Z])/g, '.SecondaryContainer$1'],
    [/\.onSecondaryContainer([^A-Z])/g, '.OnSecondaryContainer$1'],

    [/\.tertiary([^A-Z])/g, '.Tertiary$1'],
    [/\.onTertiary([^A-Z])/g, '.OnTertiary$1'],
    [/\.tertiaryContainer([^A-Z])/g, '.TertiaryContainer$1'],
    [/\.onTertiaryContainer([^A-Z])/g, '.OnTertiaryContainer$1'],

    [/\.surface([^A-Z])/g, '.Surface$1'],
    [/\.onSurface([^A-Z])/g, '.OnSurface$1'],
    [/\.surfaceVariant([^A-Z])/g, '.SurfaceVariant$1'],
    [/\.onSurfaceVariant([^A-Z])/g, '.OnSurfaceVariant$1'],

    [/\.background([^A-Z])/g, '.Background$1'],
    [/\.onBackground([^A-Z])/g, '.OnBackground$1'],

    [/\.error([^A-Z])/g, '.Error$1'],
    [/\.onError([^A-Z])/g, '.OnError$1'],
    [/\.errorContainer([^A-Z])/g, '.ErrorContainer$1'],
    [/\.onErrorContainer([^A-Z])/g, '.OnErrorContainer$1'],

    [/\.success([^A-Z])/g, '.Success$1'],
    [/\.onSuccess([^A-Z])/g, '.OnSuccess$1'],
    [/\.successContainer([^A-Z])/g, '.SuccessContainer$1'],
    [/\.onSuccessContainer([^A-Z])/g, '.OnSuccessContainer$1'],

    [/\.warning([^A-Z])/g, '.Warning$1'],
    [/\.onWarning([^A-Z])/g, '.OnWarning$1'],
    [/\.warningContainer([^A-Z])/g, '.WarningContainer$1'],
    [/\.onWarningContainer([^A-Z])/g, '.OnWarningContainer$1'],

    [/\.info([^A-Z])/g, '.Info$1'],
    [/\.onInfo([^A-Z])/g, '.OnInfo$1'],
    [/\.infoContainer([^A-Z])/g, '.InfoContainer$1'],
    [/\.onInfoContainer([^A-Z])/g, '.OnInfoContainer$1'],

    [/\.outline([^A-Z])/g, '.Outline$1'],
    [/\.outlineVariant([^A-Z])/g, '.OutlineVariant$1'],

    // Typography fixes - lowercase to PascalCase
    [/Typography\.headingSmall/g, 'Typography.HeadingSmall'],
    [/Typography\.headingMedium/g, 'Typography.HeadingMedium'],
    [/Typography\.headingLarge/g, 'Typography.HeadingLarge'],
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
    console.log('Finding all TypeScript files...');
    const files = getAllFiles('src');

    console.log(`Found ${files.length} TypeScript files to check...`);

    let fixedCount = 0;

    files.forEach((file, index) => {
        if (fixFile(file)) {
            fixedCount++;
            if (fixedCount % 10 === 0) {
                console.log(`Fixed ${fixedCount} files...`);
            }
        }
    });

    console.log(`\n✅ Complete! Fixed ${fixedCount} files out of ${files.length} total files.`);
}

main();
