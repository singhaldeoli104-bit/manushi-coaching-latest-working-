const fs = require('fs');
const path = require('path');

// Spacing property case fixes - with capital variable names
const replacements = [
    // Spacing sizes (capital S)
    [/Spacing\.xs\b/g, 'Spacing.XS'],
    [/Spacing\.sm\b/g, 'Spacing.SM'],
    [/Spacing\.md\b/g, 'Spacing.MD'],
    [/Spacing\.lg\b/g, 'Spacing.LG'],
    [/Spacing\.xl\b/g, 'Spacing.XL'],
    [/Spacing\.xxl\b/g, 'Spacing.XXL'],
    [/Spacing\.xxxl\b/g, 'Spacing.XXXL'],

    // BorderRadius (capital B and R)
    [/BorderRadius\.xs\b/g, 'BorderRadius.XS'],
    [/BorderRadius\.sm\b/g, 'BorderRadius.SM'],
    [/BorderRadius\.md\b/g, 'BorderRadius.MD'],
    [/BorderRadius\.lg\b/g, 'BorderRadius.LG'],
    [/BorderRadius\.xl\b/g, 'BorderRadius.XL'],
    [/BorderRadius\.xxl\b/g, 'BorderRadius.XXL'],
    [/BorderRadius\.full\b/g, 'BorderRadius.FULL'],

    // IconSize (capital I and S)
    [/IconSize\.xs\b/g, 'IconSize.XS'],
    [/IconSize\.sm\b/g, 'IconSize.SM'],
    [/IconSize\.md\b/g, 'IconSize.MD'],
    [/IconSize\.lg\b/g, 'IconSize.LG'],
    [/IconSize\.xl\b/g, 'IconSize.XL'],
    [/IconSize\.xxl\b/g, 'IconSize.XXL'],
    [/IconSize\.xxxl\b/g, 'IconSize.XXXL'],

    // Typography (capital T)
    [/Typography\.xs\b/g, 'Typography.XS'],
    [/Typography\.sm\b/g, 'Typography.SM'],
    [/Typography\.md\b/g, 'Typography.MD'],
    [/Typography\.lg\b/g, 'Typography.LG'],
    [/Typography\.xl\b/g, 'Typography.XL'],
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
