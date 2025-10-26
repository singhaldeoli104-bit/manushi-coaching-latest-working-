const fs = require('fs');
const path = require('path');

// Map old typography names to Material Design 3 names
const replacements = [
    // Old Material-UI/MD2 typography → MD3 typography
    [/Typography\.caption\b/g, 'Typography.bodySmall'],
    [/typography\.caption\b/g, 'typography.bodySmall'],

    [/Typography\.h1\b/g, 'Typography.displayLarge'],
    [/typography\.h1\b/g, 'typography.displayLarge'],

    [/Typography\.h2\b/g, 'Typography.displayMedium'],
    [/typography\.h2\b/g, 'typography.displayMedium'],

    [/Typography\.h3\b/g, 'Typography.headlineLarge'],
    [/typography\.h3\b/g, 'typography.headlineLarge'],

    [/Typography\.h4\b/g, 'Typography.headlineMedium'],
    [/typography\.h4\b/g, 'typography.headlineMedium'],

    [/Typography\.h5\b/g, 'Typography.headlineSmall'],
    [/typography\.h5\b/g, 'typography.headlineSmall'],

    [/Typography\.h6\b/g, 'Typography.titleLarge'],
    [/typography\.h6\b/g, 'typography.titleLarge'],

    [/Typography\.body1\b/g, 'Typography.bodyLarge'],
    [/typography\.body1\b/g, 'typography.bodyLarge'],

    [/Typography\.body2\b/g, 'Typography.bodyMedium'],
    [/typography\.body2\b/g, 'typography.bodyMedium'],

    [/Typography\.subtitle1\b/g, 'Typography.titleMedium'],
    [/typography\.subtitle1\b/g, 'typography.titleMedium'],

    [/Typography\.subtitle2\b/g, 'Typography.titleSmall'],
    [/typography\.subtitle2\b/g, 'typography.titleSmall'],

    [/Typography\.button\b/g, 'Typography.labelLarge'],
    [/typography\.button\b/g, 'typography.labelLarge'],

    [/Typography\.overline\b/g, 'Typography.labelSmall'],
    [/typography\.overline\b/g, 'typography.labelSmall'],

    // Add missing size - XXS doesn't exist, use XS
    [/Spacing\.XXS\b/g, 'Spacing.XS'],
    [/spacing\.XXS\b/g, 'spacing.XS'],
    [/IconSize\.XXS\b/g, 'IconSize.XS'],
    [/iconSize\.XXS\b/g, 'iconSize.XS'],
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
    console.log('Fixing Material Design 3 typography mappings...');
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
