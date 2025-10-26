const fs = require('fs');
const path = require('path');

// Revert .background back to .Background for theme objects
const replacements = [
    // Revert theme.background → theme.Background
    [/theme\.background([^A-Za-z])/g, 'theme.Background$1'],
    [/theme\.background$/gm, 'theme.Background'],

    // Revert LightTheme.background → LightTheme.Background
    [/LightTheme\.background([^A-Za-z])/g, 'LightTheme.Background$1'],
    [/LightTheme\.background$/gm, 'LightTheme.Background'],

    // Revert DarkTheme.background → DarkTheme.Background
    [/DarkTheme\.background([^A-Za-z])/g, 'DarkTheme.Background$1'],
    [/DarkTheme\.background$/gm, 'DarkTheme.Background'],

    // Revert colors.background → colors.Background (for theme-like objects)
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
        console.error(`Error: ${filePath}: ${error.message}`);
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
