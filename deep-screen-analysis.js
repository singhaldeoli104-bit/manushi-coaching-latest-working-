#!/usr/bin/env node

/**
 * DEEP SYSTEMATIC ANALYSIS OF ALL STUDENT SCREENS
 * Compares NEW screens with OLD screens to find missing features
 */

const fs = require('fs');
const path = require('path');

const NEW_DIR = path.join(__dirname, 'OLD', 'src', 'screens', 'student');
const OLD_DIR = path.join(__dirname, 'OLD', 'backup', 'screens', 'student');

// Mapping of NEW screens to OLD screens
const SCREEN_MAPPING = {
  'NewStudentDashboard.tsx': 'StudentDashboard.tsx',
  'NewScheduleScreen.tsx': 'ScheduleScreen.tsx',
  'NewStudyLibraryScreen.tsx': 'StudyLibraryScreen.tsx',
  'NewAIStudyScreen.tsx': 'AIStudyScreen.tsx',
  'NewAITutorChat.tsx': 'AITutorChatInterface.tsx',
  'NewClassDetailScreen.tsx': 'ClassDetailScreen.tsx',
  'NewAssignmentDetailScreen.tsx': 'AssignmentDetailScreen.tsx',
  'NewProgressDetailScreen.tsx': 'ProgressDetailScreen.tsx',
  'NewActivityDetail.tsx': 'ActivityDetailScreen.tsx',
  'NewDoubtSubmission.tsx': 'DoubtSubmissionScreen.tsx',
  'NewSimpleDoubt.tsx': 'SimpleDoubtSubmissionScreen.tsx',
  'NewLiveClassScreen.tsx': 'LiveClassParticipationScreen.tsx',
  'NewEnhancedLiveClass.tsx': 'EnhancedLiveClassParticipationScreen.tsx',
  'NewVirtualClassroom.tsx': 'VirtualClassroomInterface.tsx',
  'NewPeerLearningNetwork.tsx': 'PeerLearningNetwork.tsx',
  'NewCollaborativeAssignment.tsx': 'CollaborativeAssignmentWorkspace.tsx',
  'NewAILearningDashboard.tsx': 'StudentAILearningDashboard.tsx',
  'NewGamifiedLearningHub.tsx': 'GamifiedLearningHub.tsx',
  'NewInteractiveClassroom.tsx': 'EnhancedInteractiveClassroomScreen.tsx',
  'NewEnhancedSchedule.tsx': 'EnhancedScheduleScreen.tsx',
  'NewEnhancedAIStudy.tsx': 'EnhancedAIStudyAssistantScreen.tsx',
};

// Feature detection patterns
const FEATURES = {
  search: /search|TextInput.*search|searchQuery|onChangeText/gi,
  filter: /filter|FilterType|filterType|setFilterType/gi,
  sort: /sort|SortType|sortType|setSortType/gi,
  download: /download|Download/gi,
  bookmark: /bookmark|Bookmark|favorite|Favorite/gi,
  notes: /note|Note|addNote|saveNote/gi,
  modal: /Modal|showModal|setShowModal/gi,
  viewToggle: /grid|list|viewMode|setViewMode/gi,
  cache: /AsyncStorage|cache|Cache/gi,
  refresh: /refresh|onRefresh|refetch/gi,
  animations: /Animated|useAnimated|FadeIn|SlideIn/gi,
  icons: /Icon\s+name=|MaterialIcons|Ionicons/gi,
  stats: /stats|Statistics|rating|downloads/gi,
  tags: /tags|Tags|\.tags/gi,
};

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const analysis = {
    lines: lines.length,
    components: 0,
    states: 0,
    effects: 0,
    functions: 0,
    features: {},
  };

  // Count components
  analysis.components = (content.match(/<[A-Z][a-zA-Z]+/g) || []).length;

  // Count states
  analysis.states = (content.match(/useState/g) || []).length;

  // Count effects
  analysis.effects = (content.match(/useEffect/g) || []).length;

  // Count functions
  analysis.functions = (content.match(/const\s+\w+\s*=/g) || []).length;

  // Detect features
  Object.keys(FEATURES).forEach(feature => {
    const matches = content.match(FEATURES[feature]);
    analysis.features[feature] = matches ? matches.length : 0;
  });

  return analysis;
}

function compareScreens(newScreen, oldScreen) {
  const newPath = path.join(NEW_DIR, newScreen);
  const oldPath = path.join(OLD_DIR, oldScreen);

  if (!fs.existsSync(newPath)) {
    return { error: 'NEW screen not found' };
  }

  if (!fs.existsSync(oldPath)) {
    return { error: 'OLD screen not found' };
  }

  const newAnalysis = analyzeFile(newPath);
  const oldAnalysis = analyzeFile(oldPath);

  const missing = {};
  Object.keys(FEATURES).forEach(feature => {
    if (oldAnalysis.features[feature] > 0 && newAnalysis.features[feature] === 0) {
      missing[feature] = 'MISSING';
    } else if (oldAnalysis.features[feature] > newAnalysis.features[feature] * 2) {
      missing[feature] = 'INCOMPLETE';
    }
  });

  return {
    newScreen,
    oldScreen,
    old: oldAnalysis,
    new: newAnalysis,
    missing,
    complexity: {
      old: oldAnalysis.lines,
      new: newAnalysis.lines,
      reduction: ((1 - newAnalysis.lines / oldAnalysis.lines) * 100).toFixed(1) + '%',
    },
  };
}

console.log('═══════════════════════════════════════════════════════');
console.log('🔍 DEEP SYSTEMATIC SCREEN ANALYSIS');
console.log('═══════════════════════════════════════════════════════\n');

const results = [];

Object.keys(SCREEN_MAPPING).forEach(newScreen => {
  const oldScreen = SCREEN_MAPPING[newScreen];
  console.log(`\n📊 Analyzing: ${newScreen}`);
  console.log(`   Comparing with: ${oldScreen}`);

  const comparison = compareScreens(newScreen, oldScreen);

  if (comparison.error) {
    console.log(`   ❌ ${comparison.error}`);
    return;
  }

  results.push(comparison);

  console.log(`   OLD: ${comparison.old.lines} lines, ${comparison.old.states} states, ${comparison.old.components} components`);
  console.log(`   NEW: ${comparison.new.lines} lines, ${comparison.new.states} states, ${comparison.new.components} components`);
  console.log(`   CODE REDUCTION: ${comparison.complexity.reduction}`);

  if (Object.keys(comparison.missing).length > 0) {
    console.log(`   ⚠️  MISSING FEATURES:`);
    Object.keys(comparison.missing).forEach(feature => {
      console.log(`      - ${feature}: ${comparison.missing[feature]}`);
    });
  } else {
    console.log(`   ✅ No major features missing`);
  }
});

// Summary
console.log('\n═══════════════════════════════════════════════════════');
console.log('📈 SUMMARY');
console.log('═══════════════════════════════════════════════════════\n');

const screensWithMissing = results.filter(r => Object.keys(r.missing).length > 0);
console.log(`Screens analyzed: ${results.length}`);
console.log(`Screens with missing features: ${screensWithMissing.length}`);
console.log(`Screens complete: ${results.length - screensWithMissing.length}`);

if (screensWithMissing.length > 0) {
  console.log('\n⚠️  SCREENS NEEDING ATTENTION:\n');
  screensWithMissing.forEach(result => {
    console.log(`${result.newScreen}:`);
    console.log(`  Missing: ${Object.keys(result.missing).join(', ')}`);
    console.log(`  Code reduction: ${result.complexity.reduction}`);
    console.log('');
  });
}

// Save detailed results
fs.writeFileSync(
  path.join(__dirname, 'DEEP_SCREEN_ANALYSIS.json'),
  JSON.stringify(results, null, 2)
);

console.log('\n📄 Detailed results saved to: DEEP_SCREEN_ANALYSIS.json\n');
