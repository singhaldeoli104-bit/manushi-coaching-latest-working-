/**
 * Phase 2: Add Missing Type Definitions
 * Fixes TS2304 (Cannot find name) errors by adding missing type definitions
 *
 * Target: DocumentPickerResponse, MessageStatus, BorderRadius, etc.
 */

const fs = require('fs');
const path = require('path');

// Types to add
const typeDefinitions = {
  'DocumentPickerResponse': `
// Document Picker Types
export interface DocumentPickerResponse {
  uri: string;
  type: string;
  name: string;
  size: number;
}
`,

  'MessageStatus': `
// Message Status Enum
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';
`,

  'BorderRadius': `
// Border Radius Constants
export const BorderRadius = {
  none: 0,
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  full: 9999,
} as const;

export type BorderRadiusKey = keyof typeof BorderRadius;
`,

  'SelectedImage': `
// Image Picker Types
export interface SelectedImage {
  uri: string;
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  cropRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
`,
};

// Add missing types to database.ts
function addMissingTypes() {
  const databaseTypesPath = path.join(__dirname, 'src', 'types', 'database.ts');

  try {
    let content = fs.readFileSync(databaseTypesPath, 'utf8');

    // Check which types are missing
    const missingTypes = [];

    Object.keys(typeDefinitions).forEach(typeName => {
      if (!content.includes(typeName)) {
        missingTypes.push(typeName);
      }
    });

    if (missingTypes.length === 0) {
      console.log('✓ All types already defined');
      return;
    }

    // Add missing types at the end of the file
    let additions = '\n// Auto-generated missing types\n';
    missingTypes.forEach(typeName => {
      additions += typeDefinitions[typeName];
    });

    content += additions;

    fs.writeFileSync(databaseTypesPath, content, 'utf8');

    console.log(`✓ Added ${missingTypes.length} missing type definitions:`);
    missingTypes.forEach(type => console.log(`  - ${type}`));

  } catch (error) {
    console.error(`✗ Error updating database.ts: ${error.message}`);
  }
}

// Fix imports for components that need these types
function fixImports() {
  const filesToFix = [
    'src/components/student/MediaUploader.tsx',
    'src/components/student/SimpleMediaUploader.tsx',
    'src/components/teacher/ChatWindow.tsx',
  ];

  filesToFix.forEach(relPath => {
    const filePath = path.join(__dirname, relPath);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${relPath}`);
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // Check if we need to add imports
      if (content.includes('DocumentPickerResponse') && !content.includes("import.*DocumentPickerResponse")) {
        // Add import at the top
        const importLine = "import type { DocumentPickerResponse } from '../../types/database';\n";
        const firstImportMatch = content.match(/^import .+;/m);
        if (firstImportMatch) {
          content = content.replace(firstImportMatch[0], firstImportMatch[0] + '\n' + importLine);
          modified = true;
        }
      }

      if (content.includes('MessageStatus') && !content.includes("import.*MessageStatus")) {
        const importLine = "import type { MessageStatus } from '../../types/database';\n";
        const firstImportMatch = content.match(/^import .+;/m);
        if (firstImportMatch) {
          content = content.replace(firstImportMatch[0], firstImportMatch[0] + '\n' + importLine);
          modified = true;
        }
      }

      if (content.includes('BorderRadius') && !content.includes("import.*BorderRadius")) {
        const importLine = "import { BorderRadius } from '../../types/database';\n";
        const firstImportMatch = content.match(/^import .+;/m);
        if (firstImportMatch) {
          content = content.replace(firstImportMatch[0], firstImportMatch[0] + '\n' + importLine);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Fixed imports in ${path.basename(filePath)}`);
      }

    } catch (error) {
      console.error(`✗ Error fixing imports in ${relPath}: ${error.message}`);
    }
  });
}

// Main execution
console.log('🔧 Phase 2: Adding Missing Type Definitions\n');

addMissingTypes();
fixImports();

console.log('\n✅ Phase 2 complete!\n');
