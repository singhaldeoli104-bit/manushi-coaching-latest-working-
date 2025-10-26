const fs = require('fs');
const path = require('path');

function fixImports(content) {
    let result = content;

    // Fix AsyncStorage import
    result = result.replace(
        /import\s*{\s*([^}]*,\s*)?AsyncStorage(\s*,[^}]*)?\s*}\s*from\s*['"]react-native['"]/g,
        (match, before, after) => {
            // Build the new import for react-native without AsyncStorage
            let reactNativeImports = [];
            if (before) {
                reactNativeImports.push(before.replace(/,\s*$/, ''));
            }
            if (after) {
                reactNativeImports.push(after.replace(/^\s*,\s*/, ''));
            }

            let newImports = [];
            if (reactNativeImports.length > 0 && reactNativeImports.join('').trim()) {
                newImports.push(`import { ${reactNativeImports.join('')} } from 'react-native'`);
            }
            newImports.push(`import AsyncStorage from '@react-native-async-storage/async-storage'`);

            return newImports.join(';\n');
        }
    );

    // Fix imports from react-native-gesture-handler that should be from react-native
    const rnComponents = [
        'View', 'Text', 'StyleSheet', 'Dimensions', 'Alert', 'ActivityIndicator',
        'SafeAreaView', 'StatusBar', 'BackHandler', 'Platform', 'AppState', 'AppStateStatus',
        'ScrollView', 'FlatList', 'SectionList', 'TouchableOpacity', 'Pressable',
        'Image', 'TextInput', 'Modal', 'KeyboardAvoidingView'
    ];

    // Check if file imports from gesture-handler
    const gestureHandlerImportRegex = /import\s*{([^}]+)}\s*from\s*['"]react-native-gesture-handler['"]/g;
    const matches = [...content.matchAll(gestureHandlerImportRegex)];

    if (matches.length > 0) {
        matches.forEach(match => {
            const importedItems = match[1].split(',').map(item => item.trim());
            const gestureHandlerItems = [];
            const reactNativeItems = [];

            importedItems.forEach(item => {
                if (rnComponents.includes(item)) {
                    reactNativeItems.push(item);
                } else {
                    gestureHandlerItems.push(item);
                }
            });

            let replacement = '';
            if (gestureHandlerItems.length > 0) {
                replacement += `import { ${gestureHandlerItems.join(', ')} } from 'react-native-gesture-handler'`;
            }
            if (reactNativeItems.length > 0) {
                if (replacement) replacement += ';\n';
                replacement += `import { ${reactNativeItems.join(', ')} } from 'react-native'`;
            }

            result = result.replace(match[0], replacement);
        });
    }

    return result;
}

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
        const originalContent = fs.readFileSync(filePath, 'utf8');
        const newContent = fixImports(originalContent);

        // Only write if changes were made
        if (newContent !== originalContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}: ${error.message}`);
        return false;
    }
}

function main() {
    console.log('Fixing import errors...');
    const files = getAllFiles('src');

    console.log(`Found ${files.length} TypeScript files to check...`);

    let fixedCount = 0;
    const fixedFiles = [];

    files.forEach((file, index) => {
        if (fixFile(file)) {
            fixedCount++;
            fixedFiles.push(file);
            console.log(`Fixed: ${file}`);
        }
    });

    console.log(`\n✅ Complete! Fixed ${fixedCount} files out of ${files.length} total files.`);
}

main();
