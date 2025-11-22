const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Supabase client imports...\n');

// Files that need fixing
const files = [
  'src/screens/student/AddToPlaylistModal.tsx',
  'src/screens/student/PlaylistsView.tsx'
];

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
  } else if (content.includes(newImport)) {
    console.log(`⏭️  Already correct: ${filePath}`);
  } else {
    console.log(`⚠️  Import not found in: ${filePath}`);
  }
});

console.log('\n✅ All imports fixed!');
console.log('📝 Now using authenticated Supabase client from src/lib/supabase.ts');
