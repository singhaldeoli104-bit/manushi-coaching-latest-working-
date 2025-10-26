const fs = require('fs');
const path = require('path');

function fixContent(content) {
    let result = content;

    // Protect theme properties first
    const protections = [
        ['theme.Success', '___THEME_SUCCESS___'],
        ['theme.Error', '___THEME_ERROR___'],
        ['theme.Warning', '___THEME_WARNING___'],
        ['theme.Info', '___THEME_INFO___'],
        ['theme.Primary', '___THEME_PRIMARY___'],
        ['theme.Secondary', '___THEME_SECONDARY___'],
        ['LightTheme.Success', '___LIGHT_SUCCESS___'],
        ['LightTheme.Error', '___LIGHT_ERROR___'],
        ['LightTheme.Warning', '___LIGHT_WARNING___'],
        ['LightTheme.Info', '___LIGHT_INFO___'],
        ['LightTheme.Primary', '___LIGHT_PRIMARY___'],
        ['LightTheme.Secondary', '___LIGHT_SECONDARY___'],
        ['DarkTheme.Success', '___DARK_SUCCESS___'],
        ['DarkTheme.Error', '___DARK_ERROR___'],
        ['DarkTheme.Warning', '___DARK_WARNING___'],
        ['DarkTheme.Info', '___DARK_INFO___'],
        ['DarkTheme.Primary', '___DARK_PRIMARY___'],
        ['DarkTheme.Secondary', '___DARK_SECONDARY___'],
    ];

    // Apply protections
    protections.forEach(([original, placeholder]) => {
        result = result.split(original).join(placeholder);
    });

    // Now fix case mismatches
    const replacements = [
        // Fix .success → .Success (on theme-like objects)
        [/\.success([^A-Za-z_])/g, '.Success$1'],
        [/\.success$/gm, '.Success'],

        // Fix .Warnings → .warnings
        [/\.Warnings([^A-Za-z_])/g, '.warnings$1'],
        [/\.Warnings$/gm, '.warnings'],

        // Fix .Primary → .primary (on non-theme objects)
        // This is tricky - only fix if not on theme/LightTheme/DarkTheme
        // We'll be conservative here

        // Fix Typography case issues
        [/Typography\.HeadingSmall/g, 'Typography.headlineSmall'],
        [/Typography\.HeadingMedium/g, 'Typography.headlineMedium'],
        [/Typography\.HeadingLarge/g, 'Typography.headlineLarge'],

        // Fix Spacing constants
        [/Spacing\.LG([^A-Za-z])/g, 'Spacing.LG$1'],
        [/Spacing\.XL([^A-Za-z])/g, 'Spacing.XL$1'],
        [/Spacing\.MD([^A-Za-z])/g, 'Spacing.MD$1'],
        [/Spacing\.SM([^A-Za-z])/g, 'Spacing.SM$1'],
        [/Spacing\.XS([^A-Za-z])/g, 'Spacing.XS$1'],
        [/Spacing\.XXL([^A-Za-z])/g, 'Spacing.XXL$1'],
    ];

    // Apply replacements
    replacements.forEach(([pattern, replacement]) => {
        result = result.replace(pattern, replacement);
    });

    // Restore protected values
    protections.forEach(([original, placeholder]) => {
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
    console.log('Fixing case mismatch errors (TS2551)...');
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
    if (fixedFiles.length > 0 && fixedFiles.length <= 30) {
        console.log('\nFixed files:');
        fixedFiles.forEach(f => console.log(`  - ${f}`));
    }
}

main();
