const fs = require('fs');
const path = require('path');

// Fix components that have BOTH "export const Component" and "export default Component"
// This was caused by TS-Expert agent adding export const when it shouldn't have

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else if (fullPath.endsWith('.tsx')) {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

let fixedCount = 0;
const files = getAllFiles('src/components');

files.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // Check if file has both export patterns
        const hasExportConst = /export const \w+:\s*React\.FC/.test(content);
        const hasExportDefault = /export default/.test(content);

        if (hasExportConst && hasExportDefault) {
            // Remove "export" from "export const ComponentName: React.FC"
            // Making it just "const ComponentName: React.FC"
            content = content.replace(/export const (\w+):\s*React\.FC/g, 'const $1: React.FC');

            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                fixedCount++;
                console.log(`✅ Fixed: ${filePath}`);
            }
        }
    } catch (error) {
        // Skip
    }
});

console.log(`\n✅ Total: Fixed double exports in ${fixedCount} components`);
