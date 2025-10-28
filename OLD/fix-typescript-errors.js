const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/screens/parent/SubjectDetailScreen.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Fixing TypeScript errors...\n');

// 1. Remove unused screenWidth
console.log('1️⃣  Removing unused screenWidth...');
content = content.replace(/const screenWidth = Dimensions\.get\('window'\)\.width;\n\n/g, '');
content = content.replace(/import { Dimensions } from 'react-native';\n/g, '');

// 2. Fix unused 'g' parameter in trend calculation
console.log('2️⃣  Fixing unused parameter in trend...');
content = content.replace(
  /const recentGrades = sortedGrades\.slice\(0, 6\)\.reverse\(\); \/\/ Last 6 assessments\n    const chartData = \{\n      labels: recentGrades\.map\(\(g, i\) => `#\$\{i \+ 1\}`\),/g,
  `const recentGrades = sortedGrades.slice(0, 6).reverse(); // Last 6 assessments
    const chartData = {
      labels: recentGrades.map((_g, i) => \`#\${i + 1}\`),`
);

// 3. Move trend calculation AFTER sortedGrades to fix declaration order
console.log('3️⃣  Moving trend calculation after sortedGrades declaration...');

// Find and extract the trend calculation
const trendCalc = content.match(/  \/\/ Calculate performance trend[\s\S]*?\}, \[grades, sortedGrades\]\);/);
if (trendCalc) {
  // Remove it from its current location
  content = content.replace(trendCalc[0] + '\n\n', '');

  // Add it after sortedGrades
  content = content.replace(
    /(  const sortedGrades = useMemo[\s\S]*?\}, \[grades, sortBy\]\);)/,
    `$1

${trendCalc[0]}`
  );
}

// 4. Fix progress null checks with optional chaining
console.log('4️⃣  Adding null safety for progress...');
content = content.replace(/progress\.attendance_percentage/g, 'progress?.attendance_percentage');
content = content.replace(/progress\.completed_assignments/g, 'progress?.completed_assignments');
content = content.replace(/progress\.total_assignments/g, 'progress?.total_assignments');

fs.writeFileSync(filePath, content, 'utf8');

console.log('\n✅ TypeScript errors fixed!');
console.log('   - Removed unused screenWidth');
console.log('   - Fixed unused parameter _g');
console.log('   - Moved trend calculation after sortedGrades');
console.log('   - Added null safety for progress');
