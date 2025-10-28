const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/screens/parent/SubjectDetailScreen.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🚀 Starting SubjectDetailScreen comprehensive upgrades...\n');

// 1. Fix documentation comment
console.log('1️⃣  Fixing documentation...');
content = content.replace(
  / \* - Filter by exam type\n/g,
  ''
);

// 2. Add LineChart import
console.log('2️⃣  Adding LineChart import...');
content = content.replace(
  /import { ProgressBar } from 'react-native-paper';/g,
  `import { ProgressBar } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Share } from 'react-native';`
);

// 3. Add screenWidth constant
content = content.replace(
  /const SubjectDetailScreen: React\.FC<Props> = \({ route }\) => {/g,
  `const screenWidth = Dimensions.get('window').width;

const SubjectDetailScreen: React.FC<Props> = ({ route }) => {`
);

// 4. Add helper function for full subject names
const getFullSubjectName = `
  // Get full subject name (since we now use full names, just return as-is)
  const getFullSubjectName = (subjectCode: string): string => {
    return subjectCode; // Already full name like "English", "Mathematics"
  };
`;

content = content.replace(
  /  const toggleSection = /g,
  `${getFullSubjectName}
  const toggleSection = `
);

// 5. Add trend calculation
const trendCalculation = `
  // Calculate performance trend
  const performanceTrend = useMemo(() => {
    if (grades.length < 2) return null;

    const recentGrades = sortedGrades.slice(0, 6).reverse(); // Last 6 assessments
    const chartData = {
      labels: recentGrades.map((g, i) => \`#\${i + 1}\`),
      datasets: [{
        data: recentGrades.map(g => g.percentage || 0),
        color: (opacity = 1) => \`rgba(66, 133, 244, \${opacity})\`,
        strokeWidth: 2
      }]
    };

    // Calculate trend direction
    const firstHalf = recentGrades.slice(0, Math.floor(recentGrades.length / 2));
    const secondHalf = recentGrades.slice(Math.floor(recentGrades.length / 2));
    const firstAvg = firstHalf.reduce((sum, g) => sum + (g.percentage || 0), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, g) => sum + (g.percentage || 0), 0) / secondHalf.length;

    const trendDirection = secondAvg > firstAvg + 5 ? 'improving' :
                          secondAvg < firstAvg - 5 ? 'declining' : 'stable';

    return { chartData, trendDirection };
  }, [grades, sortedGrades]);
`;

content = content.replace(
  /  const sortedGrades = useMemo/g,
  `${trendCalculation}

  const sortedGrades = useMemo`
);

// 6. Add share functionality
const shareFunction = `
  const handleShareReport = async () => {
    try {
      const report = \`📊 Academic Report - \${getFullSubjectName(subject)}

Overall Grade: \${gradeLetter} (\${(overallAverage ?? 0).toFixed(1)}%)
Total Assessments: \${stats.totalAssessments}
Average Score: \${(stats.average ?? 0).toFixed(1)}%
Highest: \${stats.highest ? (stats.highest.percentage ?? 0).toFixed(0) : '-'}%
Lowest: \${stats.lowest ? (stats.lowest.percentage ?? 0).toFixed(0) : '-'}%

Recent Assessments:
\${sortedGrades.slice(0, 5).map(g =>
  \`• \${g.exam_name}: \${g.obtained_marks}/\${g.max_marks} (\${(g.percentage || 0).toFixed(1)}%)\`
).join('\\n')}

Generated from Manushi Coaching App\`;

      await Share.share({
        message: report,
        title: \`Academic Report - \${getFullSubjectName(subject)}\`,
      });
      trackAction('share_report', 'SubjectDetail', { subject });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
`;

content = content.replace(
  /  const handleSortChange = /g,
  `${shareFunction}

  const handleSortChange = `
);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Phase 1 complete: Basic fixes and utilities added');
console.log('   - Fixed documentation');
console.log('   - Added imports (LineChart, Share)');
console.log('   - Added trend calculation');
console.log('   - Added share functionality\n');
