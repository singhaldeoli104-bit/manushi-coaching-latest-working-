const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/screens/parent/SubjectDetailScreen.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remove the Filter by Exam Type section, keep only Sort controls
const oldSection = `        {/* Section 3: Filter and Sort Controls */}
        {grades.length > 0 && (
          <>
            <T variant="body" weight="semiBold">Filter by Exam Type</T>
            <Row style={{ flexWrap: 'wrap', gap: Spacing.xs }}>
              {(['all', 'quiz', 'test', 'midterm', 'final', 'assignment'] as ExamType[]).map(type => (
                <Button
                  key={type}
                  variant={examTypeFilter === type ? 'primary' : 'outline'}
                  onPress={() => handleFilterChange(type)}
                  style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </Row>

            <Row style={{ gap: Spacing.xs }}>
              <T variant="body" weight="semiBold">Sort by:</T>
              <Button
                variant={sortBy === 'date' ? 'primary' : 'outline'}
                onPress={() => handleSortChange('date')}
                style={{ flex: 1 }}
              >
                Date
              </Button>
              <Button
                variant={sortBy === 'score' ? 'primary' : 'outline'}
                onPress={() => handleSortChange('score')}
                style={{ flex: 1 }}
              >
                Score
              </Button>
            </Row>
          </>
        )}`;

const newSection = `        {/* Section 3: Sort Controls */}
        {grades.length > 0 && (
          <Row style={{ gap: Spacing.xs }}>
            <T variant="body" weight="semiBold">Sort by:</T>
            <Button
              variant={sortBy === 'date' ? 'primary' : 'outline'}
              onPress={() => handleSortChange('date')}
              style={{ flex: 1 }}
            >
              Date
            </Button>
            <Button
              variant={sortBy === 'score' ? 'primary' : 'outline'}
              onPress={() => handleSortChange('score')}
              style={{ flex: 1 }}
            >
              Score
            </Button>
          </Row>
        )}`;

if (content.includes(oldSection)) {
  content = content.replace(oldSection, newSection);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Removed "Filter by Exam Type" section');
  console.log('   Kept "Sort by" controls');
} else {
  console.log('⚠️ Pattern not found - searching for alternative pattern...');

  // Try to find just the filter section
  const lines = content.split('\n');
  const filterLineIndex = lines.findIndex(line => line.includes('Filter by Exam Type'));
  if (filterLineIndex !== -1) {
    console.log(`   Found "Filter by Exam Type" at line ${filterLineIndex + 1}`);
  } else {
    console.log('   "Filter by Exam Type" text not found in file');
  }
}
