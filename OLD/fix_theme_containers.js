const fs = require('fs');
const path = require('path');

// Fix theme container properties to PascalCase
const replacements = [
    // Fix theme properties to PascalCase
    [/theme\.background([^A-Za-z])/g, 'theme.Background$1'],
    [/theme\.background$/gm, 'theme.Background'],
    [/theme\.errorContainer([^A-Za-z])/g, 'theme.ErrorContainer$1'],
    [/theme\.errorContainer$/gm, 'theme.ErrorContainer'],
    [/theme\.infoContainer([^A-Za-z])/g, 'theme.InfoContainer$1'],
    [/theme\.infoContainer$/gm, 'theme.InfoContainer'],
    [/theme\.warningContainer([^A-Za-z])/g, 'theme.WarningContainer$1'],
    [/theme\.warningContainer$/gm, 'theme.WarningContainer'],
    [/theme\.successContainer([^A-Za-z])/g, 'theme.SuccessContainer$1'],
    [/theme\.successContainer$/gm, 'theme.SuccessContainer'],

    // LightTheme
    [/LightTheme\.background([^A-Za-z])/g, 'LightTheme.Background$1'],
    [/LightTheme\.background$/gm, 'LightTheme.Background'],
    [/LightTheme\.errorContainer([^A-Za-z])/g, 'LightTheme.ErrorContainer$1'],
    [/LightTheme\.errorContainer$/gm, 'LightTheme.ErrorContainer'],
    [/LightTheme\.infoContainer([^A-Za-z])/g, 'LightTheme.InfoContainer$1'],
    [/LightTheme\.infoContainer$/gm, 'LightTheme.InfoContainer'],

    // DarkTheme
    [/DarkTheme\.background([^A-Za-z])/g, 'DarkTheme.Background$1'],
    [/DarkTheme\.background$/gm, 'DarkTheme.Background'],
    [/DarkTheme\.errorContainer([^A-Za-z])/g, 'DarkTheme.ErrorContainer$1'],
    [/DarkTheme\.errorContainer$/gm, 'DarkTheme.ErrorContainer'],
    [/DarkTheme\.infoContainer([^A-Za-z])/g, 'DarkTheme.InfoContainer$1'],
    [/DarkTheme\.infoContainer$/gm, 'DarkTheme.InfoContainer'],

    // colors object (when accessing theme colors)
    [/colors\.background([^A-Za-z])/g, 'colors.Background$1'],
    [/colors\.background$/gm, 'colors.Background'],
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
