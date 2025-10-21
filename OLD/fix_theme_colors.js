const fs = require('fs');
const path = require('path');

// Mapping of old theme.colors patterns to new theme patterns
const replacements = [
    [/theme\.colors\.onSurfaceVariant/g, 'theme.OnSurfaceVariant'],
    [/theme\.colors\.textSecondary/g, 'theme.OnSurfaceVariant'],
    [/theme\.colors\.text/g, 'theme.OnSurface'],
    [/theme\.colors\.primary/g, 'theme.Primary'],
    [/theme\.colors\.onSurface/g, 'theme.OnSurface'],
    [/theme\.colors\.surface/g, 'theme.Surface'],
    [/theme\.colors\.onPrimary/g, 'theme.OnPrimary'],
    [/theme\.colors\.outline/g, 'theme.Outline'],
    [/theme\.colors\.border/g, 'theme.Outline'],
    [/theme\.colors\.onBackground/g, 'theme.OnBackground'],
    [/theme\.colors\.surfaceVariant/g, 'theme.SurfaceVariant'],
    [/theme\.colors\.background/g, 'theme.Background'],
    [/theme\.colors\.onPrimaryContainer/g, 'theme.OnPrimaryContainer'],
    [/theme\.colors\.primaryContainer/g, 'theme.PrimaryContainer'],
    [/theme\.colors\.error/g, 'theme.Error'],
    [/theme\.colors\.onErrorContainer/g, 'theme.OnErrorContainer'],
    [/theme\.colors\.errorContainer/g, 'theme.ErrorContainer'],
    [/theme\.colors\.onSecondaryContainer/g, 'theme.OnSecondaryContainer'],
    [/theme\.colors\.secondaryContainer/g, 'theme.SecondaryContainer'],
    [/theme\.colors\.onError/g, 'theme.OnError'],
    [/theme\.colors\.outlineVariant/g, 'theme.OutlineVariant'],
    [/theme\.colors\.onTertiaryContainer/g, 'theme.OnTertiaryContainer'],
    [/theme\.colors\.success/g, 'theme.Success'],
    [/theme\.colors\.secondary/g, 'theme.Secondary'],
    [/theme\.colors\.tertiary/g, 'theme.Tertiary'],
    [/theme\.colors\.tertiaryContainer/g, 'theme.TertiaryContainer'],
    [/theme\.colors\.onSecondary/g, 'theme.OnSecondary'],
    [/theme\.colors\.warning/g, 'theme.Warning'],
    [/theme\.colors\.onTertiary/g, 'theme.OnTertiary'],
    [/theme\.colors\.disabled/g, 'theme.OnSurface'],
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
                console.log(`Fixed ${fixedCount}/${files.length} files...`);
            }
        }
    });

    console.log(`\n✅ Complete! Fixed ${fixedCount} files out of ${files.length} total files.`);
}

main();
