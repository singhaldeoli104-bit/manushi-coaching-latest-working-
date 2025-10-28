const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/screens/parent/AcademicsDetailScreen.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remove the getSubjectCode conversion
content = content.replace(
  /subject: getSubjectCode\(subject\.subject\),/g,
  'subject: subject.subject,  // Pass full name - gradebook.subject_code stores full names'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed: Now passing full subject names directly (no conversion)');
console.log('   Reason: gradebook.subject_code column contains full names like "English", not codes like "ENG"');
