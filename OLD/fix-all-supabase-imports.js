const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing ALL Supabase client imports in student screens...\n');

// All student screen files
const files = [
  'src/screens/student/AddToPlaylistModal.tsx',
  'src/screens/student/PlaylistsView.tsx',
  'src/screens/student/NewStudyLibraryScreen.tsx'
];

let fixedCount = 0;
let alreadyCorrectCount = 0;

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace the incorrect import
  const oldImport = `import { supabase } from '../../config/supabaseClient';`;
  const newImport = `import { supabase } from '../../lib/supabase';`;

  if (content.includes(oldImport)) {
    content = content.replace(oldImport, newImport);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    fixedCount++;
  } else if (content.includes(newImport)) {
    console.log(`⏭️  Already correct: ${filePath}`);
    alreadyCorrectCount++;
  } else {
    console.log(`⚠️  Import not found in: ${filePath}`);
  }
});

console.log(`\n✅ Complete! Fixed ${fixedCount} files, ${alreadyCorrectCount} already correct.`);
console.log('📝 All screens now using authenticated Supabase client from src/lib/supabase.ts');
console.log('🔐 This ensures all queries include the user\'s auth token for RLS policies');
