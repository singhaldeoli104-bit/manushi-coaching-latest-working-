const fs = require('fs');
const path = require('path');

// Fix overcorrections from previous script
const replacements = [
    // Console methods should be lowercase
    [/console\.Error/g, 'console.error'],
    [/console\.Info/g, 'console.info'],
    [/console\.Warning/g, 'console.warn'],
    [/console\.Success/g, 'console.log'],

    // Common enum/status values that should be lowercase
    [/FileUploadStatus\.Error/g, 'FileUploadStatus.error'],
    [/FileUploadStatus\.Success/g, 'FileUploadStatus.success'],
    [/FileUploadStatus\.Warning/g, 'FileUploadStatus.warning'],
    [/FileUploadStatus\.Info/g, 'FileUploadStatus.info'],

    [/status\.Error/g, 'status.error'],
    [/status\.Success/g, 'status.success'],
    [/status\.Warning/g, 'status.warning'],
    [/status\.Info/g, 'status.info'],

    [/type\.Error/g, 'type.error'],
    [/type\.Success/g, 'type.success'],
    [/type\.Warning/g, 'type.warning'],
    [/type\.Info/g, 'type.info'],

    [/severity\.Error/g, 'severity.error'],
    [/severity\.Success/g, 'severity.success'],
    [/severity\.Warning/g, 'severity.warning'],
    [/severity\.Info/g, 'severity.info'],

    [/level\.Error/g, 'level.error'],
    [/level\.Success/g, 'level.success'],
    [/level\.Warning/g, 'level.warning'],
    [/level\.Info/g, 'level.info'],

    // Notification types
    [/NotificationType\.Error/g, 'NotificationType.error'],
    [/NotificationType\.Success/g, 'NotificationType.success'],
    [/NotificationType\.Warning/g, 'NotificationType.warning'],
    [/NotificationType\.Info/g, 'NotificationType.info'],

    // Alert types
    [/AlertType\.Error/g, 'AlertType.error'],
    [/AlertType\.Success/g, 'AlertType.success'],
    [/AlertType\.Warning/g, 'AlertType.warning'],
    [/AlertType\.Info/g, 'AlertType.info'],

    // Message types
    [/MessageType\.Error/g, 'MessageType.error'],
    [/MessageType\.Success/g, 'MessageType.success'],
    [/MessageType\.Warning/g, 'MessageType.warning'],
    [/MessageType\.Info/g, 'MessageType.info'],

    // Variants
    [/'Error'/g, "'error'"],
    [/'Success'/g, "'success'"],
    [/'Warning'/g, "'warning'"],
    [/'Info'/g, "'info'"],
    [/"Error"/g, '"error"'],
    [/"Success"/g, '"success"'],
    [/"Warning"/g, '"warning"'],
    [/"Info"/g, '"info"'],
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
    console.log('Fixing overcorrections...');
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
