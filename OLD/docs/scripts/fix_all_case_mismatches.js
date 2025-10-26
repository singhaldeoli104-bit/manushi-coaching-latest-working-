const fs = require('fs');
const path = require('path');

function fixContent(content) {
    let result = content;

    // Fix all case mismatches in one pass
    const replacements = [
        // Style object properties - PascalCase → camelCase
        [/\.ErrorContainer([^A-Za-z])/g, '.errorContainer$1'],
        [/\.ErrorContainer$/gm, '.errorContainer'],
        [/\.InfoContainer([^A-Za-z])/g, '.infoContainer$1'],
        [/\.InfoContainer$/gm, '.infoContainer'],
        [/\.Background([^A-Za-z])/g, '.background$1'],
        [/\.Background$/gm, '.background'],

        // Breakpoints - uppercase → lowercase
        [/breakpoints\.LG([^A-Za-z])/g, 'breakpoints.lg$1'],
        [/breakpoints\.LG$/gm, 'breakpoints.lg'],
        [/breakpoints\.XL([^A-Za-z])/g, 'breakpoints.xl$1'],
        [/breakpoints\.XL$/gm, 'breakpoints.xl'],
        [/breakpoints\.XXL([^A-Za-z])/g, 'breakpoints.xxl$1'],
        [/breakpoints\.XXL$/gm, 'breakpoints.xxl'],
        [/breakpoints\.MD([^A-Za-z])/g, 'breakpoints.md$1'],
        [/breakpoints\.MD$/gm, 'breakpoints.md'],
        [/breakpoints\.SM([^A-Za-z])/g, 'breakpoints.sm$1'],
        [/breakpoints\.SM$/gm, 'breakpoints.sm'],

        // Status/variant colors - PascalCase → camelCase (on semantic color objects)
        [/semanticColors\.Success([^A-Za-z])/g, 'semanticColors.success$1'],
        [/semanticColors\.Success$/gm, 'semanticColors.success'],
        [/semanticColors\.Error([^A-Za-z])/g, 'semanticColors.error$1'],
        [/semanticColors\.Error$/gm, 'semanticColors.error'],
        [/semanticColors\.Warning([^A-Za-z])/g, 'semanticColors.warning$1'],
        [/semanticColors\.Warning$/gm, 'semanticColors.warning'],
        [/semanticColors\.Info([^A-Za-z])/g, 'semanticColors.info$1'],
        [/semanticColors\.Info$/gm, 'semanticColors.info'],

        // API response - PascalCase → camelCase
        [/response\.Success([^A-Za-z])/g, 'response.success$1'],
        [/response\.Success$/gm, 'response.success'],

        // Navigation colors - PascalCase → camelCase
        [/navColors\.Primary([^A-Za-z])/g, 'navColors.primary$1'],
        [/navColors\.Primary$/gm, 'navColors.primary'],
        [/navColors\.Secondary([^A-Za-z])/g, 'navColors.secondary$1'],
        [/navColors\.Secondary$/gm, 'navColors.secondary'],

        // Variant enums - lowercase → PascalCase
        [/ButtonVariant\.warning([^A-Za-z])/g, 'ButtonVariant.Warning$1'],
        [/ButtonVariant\.warning$/gm, 'ButtonVariant.Warning'],
        [/ButtonVariant\.error([^A-Za-z])/g, 'ButtonVariant.Error$1'],
        [/ButtonVariant\.error$/gm, 'ButtonVariant.Error'],
        [/ButtonVariant\.info([^A-Za-z])/g, 'ButtonVariant.Info$1'],
        [/ButtonVariant\.info$/gm, 'ButtonVariant.Info'],
        [/BadgeVariant\.warning([^A-Za-z])/g, 'BadgeVariant.Warning$1'],
        [/BadgeVariant\.warning$/gm, 'BadgeVariant.Warning'],
        [/BadgeVariant\.error([^A-Za-z])/g, 'BadgeVariant.Error$1'],
        [/BadgeVariant\.error$/gm, 'BadgeVariant.Error'],
        [/BadgeVariant\.info([^A-Za-z])/g, 'BadgeVariant.Info$1'],
        [/BadgeVariant\.info$/gm, 'BadgeVariant.Info'],
    ];

    // Apply all replacements
    replacements.forEach(([pattern, replacement]) => {
        result = result.replace(pattern, replacement);
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
    console.log('Fixing ALL case mismatch errors aggressively...');
    const files = getAllFiles('src');

    console.log(`Found ${files.length} TypeScript files...`);

    let fixedCount = 0;
    files.forEach(file => {
        if (fixFile(file)) fixedCount++;
    });

    console.log(`✅ Fixed ${fixedCount} files!`);
}

main();
