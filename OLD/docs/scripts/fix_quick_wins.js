const fs = require('fs');
const path = require('path');

// Quick fix for common missing properties
const replacements = [
    // Fix theme.primaryLight → theme.PrimaryContainer
    [/theme\.primaryLight/g, 'theme.PrimaryContainer'],
    [/LightTheme\.primaryLight/g, 'LightTheme.PrimaryContainer'],
    [/DarkTheme\.primaryLight/g, 'DarkTheme.PrimaryContainer'],

    // Fix theme.errorLight → theme.ErrorContainer
    [/theme\.errorLight/g, 'theme.ErrorContainer'],
    [/LightTheme\.errorLight/g, 'LightTheme.ErrorContainer'],
    [/DarkTheme\.errorLight/g, 'DarkTheme.ErrorContainer'],

    // Fix theme.successLight → theme.SuccessContainer
    [/theme\.successLight/g, 'theme.SuccessContainer'],
    [/LightTheme\.successLight/g, 'LightTheme.SuccessContainer'],

    // Fix theme.warningLight → theme.WarningContainer
    [/theme\.warningLight/g, 'theme.WarningContainer'],

    // Fix theme.infoLight → theme.InfoContainer
    [/theme\.infoLight/g, 'theme.InfoContainer'],
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
        replacements.forEach(([pattern, replacement]) => {
            content = content.replace(pattern, replacement);
        });
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

function main() {
    const files = getAllFiles('src');
    let fixedCount = 0;
    files.forEach(file => {
        if (fixFile(file)) fixedCount++;
    });
    console.log(`✅ Fixed ${fixedCount} files!`);
}

main();
