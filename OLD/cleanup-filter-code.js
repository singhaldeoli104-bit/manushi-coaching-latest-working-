const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/screens/parent/SubjectDetailScreen.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove examTypeFilter state
content = content.replace(
  /  const \[examTypeFilter, setExamTypeFilter\] = useState<ExamType>\('all'\);\n/g,
  ''
);

// 2. Replace filteredGrades with grades directly
content = content.replace(
  /  const filteredGrades = useMemo\(\(\) => \{\n    if \(examTypeFilter === 'all'\) return grades;\n    return grades\.filter\(g => g\.exam_type === examTypeFilter\);\n  \}, \[grades, examTypeFilter\]\);\n\n  const sortedGrades = useMemo\(\(\) => \{\n    const sorted = \[\.\.\.filteredGrades\];/g,
  `  const sortedGrades = useMemo(() => {
    const sorted = [...grades];`
);

// Update the dependency array
content = content.replace(
  /  \}, \[filteredGrades, sortBy\]\);/g,
  '  }, [grades, sortBy]);'
);

// 3. Remove handleFilterChange function
content = content.replace(
  /  const handleFilterChange = \(type: ExamType\) => \{\n    trackAction\('filter_exams', 'SubjectDetail', \{ type \}\);\n    setExamTypeFilter\(type\);\n  \};\n\n/g,
  ''
);

// 4. Simplify empty state message
content = content.replace(
  /No \{examTypeFilter === 'all' \? '' : examTypeFilter \+ ' '\}assessments found/g,
  'No assessments found'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Cleaned up all filter-related code:');
console.log('   - Removed examTypeFilter state');
console.log('   - Removed filteredGrades (now using grades directly)');
console.log('   - Removed handleFilterChange function');
console.log('   - Updated empty state message');
