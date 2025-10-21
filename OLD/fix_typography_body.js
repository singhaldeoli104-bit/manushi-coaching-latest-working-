const fs = require('fs');
const path = require('path');

// Fix Typography.body references to Typography.bodyMedium
const replacements = [
    // Fix Typography.body (without following alphanumeric - to avoid bodyMedium, bodyLarge, bodySmall)
    [/Typography\.body([^A-Za-z])/g, 'Typography.bodyMedium$1'],
    [/typography\.body([^A-Za-z])/g, 'typography.bodyMedium$1'],

    // Also fix if it's at end of line
    [/Typography\.body$/gm, 'Typography.bodyMedium'],
    [/typography\.body$/gm, 'typography.bodyMedium'],
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
    console.log('Fixing Typography.body references...');
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
