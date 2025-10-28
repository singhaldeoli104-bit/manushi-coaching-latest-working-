const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/screens/parent/SubjectDetailScreen.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Finalizing upgrades...\n');

// 1. Add safeNavigate import
console.log('1️⃣  Adding safe navigation import...');
content = content.replace(
  /import { trackScreenView, trackAction } from '\.\.\/\.\.\/utils\/navigationAnalytics';/g,
  `import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';`
);

// 2. Remove old subject code-to-name mapping (we now use full names directly)
console.log('2️⃣  Removing outdated subject code mapping...');
const oldMapping = `                <T variant="title" weight="bold" style={{ marginTop: Spacing.xs }}>
                  {subject === 'MATH' ? 'Mathematics' :
                   subject === 'PHYS' ? 'Physics' :
                   subject === 'CHEM' ? 'Chemistry' :
                   subject === 'BIO' ? 'Biology' :
                   subject === 'ENG' ? 'English' :
                   subject === 'CS' ? 'Computer Science' :
                   subject}
                </T>`;

const newMapping = `                <T variant="title" weight="bold" style={{ marginTop: Spacing.xs }}>
                  {getFullSubjectName(subject)}
                </T>`;

content = content.replace(oldMapping, newMapping);

// 3. Fix LineChart import issue - remove it since we're not using external charts
console.log('3️⃣  Removing unused chart library imports...');
content = content.replace(
  /import { LineChart } from 'react-native-chart-kit';\n/g,
  ''
);

fs.writeFileSync(filePath, content, 'utf8');

console.log('\n✅ All upgrades finalized!');
console.log('   - Added safeNavigate import');
console.log('   - Removed outdated subject mapping');
console.log('   - Cleaned up unused imports');
