const fs = require('fs');
const path = require('path');

// Fix human-readable size names to uppercase abbreviations
const replacements = [
    // Spacing - human readable to abbreviated
    [/Spacing\.extraSmall\b/g, 'Spacing.XS'],
    [/Spacing\.small\b/g, 'Spacing.SM'],
    [/Spacing\.medium\b/g, 'Spacing.MD'],
    [/Spacing\.large\b/g, 'Spacing.LG'],
    [/Spacing\.extraLarge\b/g, 'Spacing.XL'],
    [/Spacing\.xxLarge\b/g, 'Spacing.XXL'],
    [/Spacing\.xxxLarge\b/g, 'Spacing.XXXL'],

    // BorderRadius - human readable to abbreviated
    [/BorderRadius\.extraSmall\b/g, 'BorderRadius.XS'],
    [/BorderRadius\.small\b/g, 'BorderRadius.SM'],
    [/BorderRadius\.medium\b/g, 'BorderRadius.MD'],
    [/BorderRadius\.large\b/g, 'BorderRadius.LG'],
    [/BorderRadius\.extraLarge\b/g, 'BorderRadius.XL'],
    [/BorderRadius\.xxLarge\b/g, 'BorderRadius.XXL'],

    // IconSize - human readable to abbreviated
    [/IconSize\.extraSmall\b/g, 'IconSize.XS'],
    [/IconSize\.small\b/g, 'IconSize.SM'],
    [/IconSize\.medium\b/g, 'IconSize.MD'],
    [/IconSize\.large\b/g, 'IconSize.LG'],
    [/IconSize\.extraLarge\b/g, 'IconSize.XL'],
    [/IconSize\.xxLarge\b/g, 'IconSize.XXL'],
    [/IconSize\.xxxLarge\b/g, 'IconSize.XXXL'],

    // Typography - human readable
    [/Typography\.extraSmall\b/g, 'Typography.XS'],
    [/Typography\.small\b/g, 'Typography.SM'],
    [/Typography\.medium\b/g, 'Typography.MD'],
    [/Typography\.large\b/g, 'Typography.LG'],
    [/Typography\.extraLarge\b/g, 'Typography.XL'],
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
