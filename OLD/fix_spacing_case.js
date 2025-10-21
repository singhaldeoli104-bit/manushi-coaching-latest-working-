const fs = require('fs');
const path = require('path');

// Spacing property case fixes
const replacements = [
    // Spacing sizes
    [/spacing\.xs\b/g, 'spacing.XS'],
    [/spacing\.sm\b/g, 'spacing.SM'],
    [/spacing\.md\b/g, 'spacing.MD'],
    [/spacing\.lg\b/g, 'spacing.LG'],
    [/spacing\.xl\b/g, 'spacing.XL'],
    [/spacing\.xxl\b/g, 'spacing.XXL'],
    [/spacing\.xxxl\b/g, 'spacing.XXXL'],
    [/spacing\.full\b/g, 'spacing.FULL'],

    // Borderradius
    [/borderRadius\.xs\b/g, 'borderRadius.XS'],
    [/borderRadius\.sm\b/g, 'borderRadius.SM'],
    [/borderRadius\.md\b/g, 'borderRadius.MD'],
    [/borderRadius\.lg\b/g, 'borderRadius.LG'],
    [/borderRadius\.xl\b/g, 'borderRadius.XL'],
    [/borderRadius\.xxl\b/g, 'borderRadius.XXL'],
    [/borderRadius\.full\b/g, 'borderRadius.FULL'],

    // IconSize
    [/iconSize\.xs\b/g, 'iconSize.XS'],
    [/iconSize\.sm\b/g, 'iconSize.SM'],
    [/iconSize\.md\b/g, 'iconSize.MD'],
    [/iconSize\.lg\b/g, 'iconSize.LG'],
    [/iconSize\.xl\b/g, 'iconSize.XL'],
    [/iconSize\.xxl\b/g, 'iconSize.XXL'],
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
