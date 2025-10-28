const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/screens/parent/AcademicsDetailScreen.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remove the misplaced function from inside the return object
const badCode = `    return {
      overallPercentage: Math.round(overallPercentage),
      totalSubjects: aggregatedSubjects.length,
      averageGrade: Math.round(overallPercentage),

  // Map subject full names to codes for gradebook queries
  const getSubjectCode = (subjectName: string): string => {
    const mapping: { [key: string]: string } = {
      'English': 'ENG',
      'Mathematics': 'MATH',
      'Math': 'MATH',
      'Computer Science': 'CS',
      'Physics': 'PHY',
      'Chemistry': 'CHEM',
      'Biology': 'BIO',
      'History': 'HIST',
      'Geography': 'GEO',
      'Science': 'SCI',
      'Social Studies': 'SS',
    };
    return mapping[subjectName] || subjectName.toUpperCase().slice(0, 4);
  };
      highestGrade: Math.max(...percentages),
      lowestGrade: Math.min(...percentages),
      passingSubjects,
    };
  }, [aggregatedSubjects]);`;

const goodCode = `    return {
      overallPercentage: Math.round(overallPercentage),
      totalSubjects: aggregatedSubjects.length,
      averageGrade: Math.round(overallPercentage),
      highestGrade: Math.max(...percentages),
      lowestGrade: Math.min(...percentages),
      passingSubjects,
    };
  }, [aggregatedSubjects]);

  // Map subject full names to codes for gradebook queries
  const getSubjectCode = (subjectName: string): string => {
    const mapping: { [key: string]: string } = {
      'English': 'ENG',
      'Mathematics': 'MATH',
      'Math': 'MATH',
      'Computer Science': 'CS',
      'Physics': 'PHY',
      'Chemistry': 'CHEM',
      'Biology': 'BIO',
      'History': 'HIST',
      'Geography': 'GEO',
      'Science': 'SCI',
      'Social Studies': 'SS',
    };
    return mapping[subjectName] || subjectName.toUpperCase().slice(0, 4);
  };`;

if (content.includes(badCode)) {
  content = content.replace(badCode, goodCode);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Fixed AcademicsDetailScreen.tsx - moved getSubjectCode outside return statement');
} else {
  console.log('⚠️ Pattern not found - file may have been modified');
  console.log('Current state around line 112:');
  const lines = content.split('\n');
  console.log(lines.slice(111, 139).map((line, i) => `${112 + i}: ${line}`).join('\n'));
}
