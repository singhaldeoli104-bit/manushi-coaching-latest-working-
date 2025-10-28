const fs = require('fs');
const path = require('path');

const mainFile = path.join(__dirname, 'src/screens/parent/SubjectDetailScreen.tsx');
const newSectionsFile = path.join(__dirname, 'add-new-sections.tsx');

let content = fs.readFileSync(mainFile, 'utf8');
const newSections = fs.readFileSync(newSectionsFile, 'utf8');

console.log('📝 Inserting new UI sections...\n');

// Find the insertion point - right after Performance Summary card closes, before Sort Controls
const insertionMarker = `        </Card>

        {/* Section 3: Sort Controls */}`;

if (content.includes(insertionMarker)) {
  content = content.replace(
    insertionMarker,
    `        </Card>

${newSections}

        {/* Section 3: Sort Controls */}`
  );

  fs.writeFileSync(mainFile, content, 'utf8');
  console.log('✅ New sections inserted successfully!');
  console.log('   - Performance Trend & Attendance');
  console.log('   - Recent Activity Timeline (Last 3 Assessments)');
  console.log('   - Quick Actions (Upcoming Exams, Share Report)');
} else {
  console.log('⚠️  Insertion marker not found');
  console.log('   Searching for alternative location...');

  // Try to find the Sort Controls section
  if (content.includes('{/* Section 3: Sort Controls */}')) {
    console.log('   Found Sort Controls section');
  }
}
