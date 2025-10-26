const fs = require('fs');
const path = require('path');

// Fix remaining theme property issues
const replacements = [
    // Remove .colors from theme (still exists in some places)
    [/theme\.colors\.primary/g, 'theme.Primary'],
    [/theme\.colors\.onPrimary/g, 'theme.OnPrimary'],
    [/theme\.colors\.surface/g, 'theme.Surface'],
    [/theme\.colors\.onSurface/g, 'theme.OnSurface'],
    [/theme\.colors\.background/g, 'theme.Background'],
    [/theme\.colors\.error/g, 'theme.Error'],
    [/theme\.colors\.success/g, 'theme.Success'],
    [/theme\.colors\.warning/g, 'theme.Warning'],
    [/theme\.colors\.info/g, 'theme.Info'],
    [/theme\.colors\.outline/g, 'theme.Outline'],

    // Fix theme.border → theme.Outline
    [/theme\.border([^A-Z])/g, 'theme.Outline$1'],
    [/theme\.border$/gm, 'theme.Outline'],

    // Fix theme.text → theme.OnSurface
    [/theme\.text([^A-Z])/g, 'theme.OnSurface$1'],
    [/theme\.text$/gm, 'theme.OnSurface'],

    // Fix theme.textSecondary → theme.OnSurfaceVariant
    [/theme\.textSecondary/g, 'theme.OnSurfaceVariant'],

    // For style objects that might have just color: theme.colors.something
    [/colors\.primary/g, 'Primary'],
    [/colors\.surface/g, 'Surface'],
    [/colors\.onSurface/g, 'OnSurface'],
    [/colors\.error/g, 'Error'],
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
    console.log('Fixing remaining theme property issues...');
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
