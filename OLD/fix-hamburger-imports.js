const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/screens/student/NewAILearningDashboard.tsx',
  'src/screens/student/NewPeerLearningNetwork.tsx',
  'src/screens/student/NewProgressDetailScreen.tsx'
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove HamburgerMenu import
  if (content.includes("import HamburgerMenu from './HamburgerMenu';")) {
    content = content.replace(/import HamburgerMenu from '\.\/HamburgerMenu';\n/g, '');
    modified = true;
    console.log(`✓ Removed HamburgerMenu import from ${file}`);
  }

  // Remove menuVisible state
  if (content.includes('const [menuVisible, setMenuVisible] = useState(false);')) {
    content = content.replace(/\s*const \[menuVisible, setMenuVisible\] = useState\(false\);/g, '');
    modified = true;
    console.log(`✓ Removed menuVisible state from ${file}`);
  }

  // Remove HamburgerMenu component usage
  const hamburgerMenuRegex = /<HamburgerMenu[\s\S]*?\/>/g;
  if (hamburgerMenuRegex.test(content)) {
    content = content.replace(hamburgerMenuRegex, '');
    modified = true;
    console.log(`✓ Removed HamburgerMenu component from ${file}`);
  }

  // Remove studentData query for HamburgerMenu
  const studentDataQueryRegex = /\/\/ Fetch student profile data for HamburgerMenu[\s\S]*?}\s*,\s*}\s*\);/;
  if (studentDataQueryRegex.test(content)) {
    content = content.replace(studentDataQueryRegex, '');
    modified = true;
    console.log(`✓ Removed studentData query from ${file}`);
  }

  // Replace hamburger button with back button
  const hamburgerButtonRegex = /onPress=\{\(\) => \{[\s\S]*?trackAction\('open_menu'[\s\S]*?setMenuVisible\(true\);[\s\S]*?\}\}/g;
  if (hamburgerButtonRegex.test(content)) {
    content = content.replace(
      hamburgerButtonRegex,
      `onPress={() => {
            trackAction('back', '${path.basename(file, '.tsx')}');
            navigation.goBack();
          }}`
    );
    content = content.replace(/<T variant="h2" style=\{styles\.(?:headerIcon|icon)\}>☰<\/T>/g, '<T variant="h2" style={styles.icon}>←</T>');
    modified = true;
    console.log(`✓ Replaced hamburger button with back button in ${file}`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${file}\n`);
  } else {
    console.log(`ℹ️  No changes needed for ${file}\n`);
  }
});

console.log('\n✅ All files processed!');
