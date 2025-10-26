const fs = require('fs');
const path = require('path');

// Fix case sensitivity issues
const replacements = [
    // Breakpoints - uppercase TO lowercase
    [/breakpoints\.XS\b/g, 'breakpoints.xs'],
    [/breakpoints\.SM\b/g, 'breakpoints.sm'],
    [/breakpoints\.MD\b/g, 'breakpoints.md'],
    [/breakpoints\.LG\b/g, 'breakpoints.lg'],
    [/breakpoints\.XL\b/g, 'breakpoints.xl'],
    [/breakpoints\.XXL\b/g, 'breakpoints.xxl'],

    // Theme colors - lowercase TO uppercase (direct theme access, not theme.colors)
    [/theme\.primary\b/g, 'theme.Primary'],
    [/theme\.onPrimary\b/g, 'theme.OnPrimary'],
    [/theme\.primaryContainer\b/g, 'theme.PrimaryContainer'],
    [/theme\.onPrimaryContainer\b/g, 'theme.OnPrimaryContainer'],
    [/theme\.secondary\b/g, 'theme.Secondary'],
    [/theme\.onSecondary\b/g, 'theme.OnSecondary'],
    [/theme\.secondaryContainer\b/g, 'theme.SecondaryContainer'],
    [/theme\.onSecondaryContainer\b/g, 'theme.OnSecondaryContainer'],
    [/theme\.tertiary\b/g, 'theme.Tertiary'],
    [/theme\.onTertiary\b/g, 'theme.OnTertiary'],
    [/theme\.tertiaryContainer\b/g, 'theme.TertiaryContainer'],
    [/theme\.onTertiaryContainer\b/g, 'theme.OnTertiaryContainer'],
    [/theme\.surface\b/g, 'theme.Surface'],
    [/theme\.onSurface\b/g, 'theme.OnSurface'],
    [/theme\.surfaceVariant\b/g, 'theme.SurfaceVariant'],
    [/theme\.onSurfaceVariant\b/g, 'theme.OnSurfaceVariant'],
    [/theme\.background\b/g, 'theme.Background'],
    [/theme\.onBackground\b/g, 'theme.OnBackground'],
    [/theme\.error\b/g, 'theme.Error'],
    [/theme\.onError\b/g, 'theme.OnError'],
    [/theme\.errorContainer\b/g, 'theme.ErrorContainer'],
    [/theme\.onErrorContainer\b/g, 'theme.OnErrorContainer'],
    [/theme\.outline\b/g, 'theme.Outline'],
    [/theme\.outlineVariant\b/g, 'theme.OutlineVariant'],
    [/theme\.success\b/g, 'theme.Success'],
    [/theme\.onSuccess\b/g, 'theme.OnSuccess'],
    [/theme\.successContainer\b/g, 'theme.SuccessContainer'],
    [/theme\.onSuccessContainer\b/g, 'theme.OnSuccessContainer'],
    [/theme\.warning\b/g, 'theme.Warning'],
    [/theme\.onWarning\b/g, 'theme.OnWarning'],
    [/theme\.warningContainer\b/g, 'theme.WarningContainer'],
    [/theme\.onWarningContainer\b/g, 'theme.OnWarningContainer'],
    [/theme\.info\b/g, 'theme.Info'],
    [/theme\.onInfo\b/g, 'theme.OnInfo'],
    [/theme\.infoContainer\b/g, 'theme.InfoContainer'],
    [/theme\.onInfoContainer\b/g, 'theme.OnInfoContainer'],

    // Typography - lowercase TO uppercase (if any exist)
    [/Typography\.headingSmall\b/g, 'Typography.HeadingSmall'],
    [/Typography\.headingMedium\b/g, 'Typography.HeadingMedium'],
    [/Typography\.headingLarge\b/g, 'Typography.HeadingLarge'],
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
