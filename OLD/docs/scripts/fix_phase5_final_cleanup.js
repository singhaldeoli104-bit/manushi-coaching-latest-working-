/**
 * Phase 5: Final Cleanup
 * Fix any remaining syntax errors from previous fixes
 */

const fs = require('fs');
const path = require('path');

// Fix ImagePicker import statement
function fixImagePickerImport() {
  const filePath = path.join(__dirname, 'src', 'components', 'media', 'ImagePicker.tsx');

  if (!fs.existsSync(filePath)) {
    console.log('⚠️  ImagePicker.tsx not found');
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix the malformed import statement
    content = content.replace(
      /\} , Linking \} from 'react-native';/,
      "  Linking,\n} from 'react-native';"
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✓ Fixed ImagePicker import statement');

  } catch (error) {
    console.error(`✗ Error fixing ImagePicker: ${error.message}`);
  }
}

// Main execution
console.log('🔧 Phase 5: Final Cleanup\n');

fixImagePickerImport();

console.log('\n✅ Phase 5 complete!\n');
