#!/usr/bin/env node

/**
 * Check NEW Student Screens ONLY for button handlers
 * Focuses on the 21 "New" screens and 6 recently created screens
 */

const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'OLD', 'src', 'screens', 'student');

// List of NEW student screens to check
const NEW_STUDENT_SCREENS = [
  // 21 "New" Premium Minimal Design Screens
  'NewStudentDashboard.tsx',
  'NewScheduleScreen.tsx',
  'NewClassDetailScreen.tsx',
  'NewAssignmentDetailScreen.tsx',
  'NewProgressDetailScreen.tsx',
  'NewStudyLibraryScreen.tsx',
  'NewAIStudyScreen.tsx',
  'NewSimpleDoubt.tsx',
  'NewAITutorChat.tsx',
  'NewDoubtSubmission.tsx',
  'NewActivityDetail.tsx',
  'NewAILearningDashboard.tsx',
  'NewCollaborativeAssignment.tsx',
  'NewPeerLearningNetwork.tsx',
  'NewVirtualClassroom.tsx',
  'NewLiveClassScreen.tsx',
  'NewEnhancedSchedule.tsx',
  'NewEnhancedLiveClass.tsx',
  'NewEnhancedAIStudy.tsx',
  'NewGamifiedLearningHub.tsx',
  'NewInteractiveClassroom.tsx',

  // 6 Recently Created Screens
  'AIPracticeProblems.tsx',
  'AIStudySummaries.tsx',
  'PeerDetail.tsx',
  'Whiteboard.tsx',
  'ClassChat.tsx',
  'ClassNotes.tsx',
];

const BUTTON_PATTERNS = [
  'TouchableOpacity',
  'TouchableHighlight',
  'TouchableWithoutFeedback',
  'Pressable',
  'Button',
];

const results = {
  screensChecked: 0,
  totalButtons: 0,
  buttonsWithoutHandlers: [],
  cleanScreens: [],
  issueScreens: [],
};

function analyzeFile(fileName) {
  const filePath = path.join(basePath, fileName);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fileName}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let buttonsInFile = 0;
  let issuesInFile = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    for (const pattern of BUTTON_PATTERNS) {
      if (line.includes(`<${pattern}`)) {
        buttonsInFile++;
        results.totalButtons++;

        // Check if this is a self-closing tag or multi-line component
        const isSelfClosing = line.includes('/>');
        let hasOnPress = line.includes('onPress=');

        if (!isSelfClosing && !hasOnPress) {
          // Check next 15 lines for onPress
          for (let j = i + 1; j < Math.min(i + 16, lines.length); j++) {
            const nextLine = lines[j];
            if (nextLine.includes('onPress=')) {
              hasOnPress = true;
              break;
            }
            // Check if we hit the closing tag
            if (nextLine.includes(`</${pattern}>`) || nextLine.includes('/>')) {
              break;
            }
          }
        }

        // Report if no onPress found
        if (!hasOnPress) {
          // Exception: disabled buttons don't need handlers
          const isDisabled = line.includes('disabled={true}') || line.includes('disabled=');

          if (!isDisabled) {
            const issue = {
              file: fileName,
              line: lineNum,
              type: pattern,
              code: line.trim().substring(0, 100),
            };

            issuesInFile.push(issue);
            results.buttonsWithoutHandlers.push(issue);
          }
        }
      }
    }
  }

  results.screensChecked++;

  if (issuesInFile.length === 0) {
    results.cleanScreens.push({
      file: fileName,
      buttons: buttonsInFile,
    });
    console.log(`✅ ${fileName}: ${buttonsInFile} buttons, all have handlers`);
  } else {
    results.issueScreens.push({
      file: fileName,
      buttons: buttonsInFile,
      issues: issuesInFile.length,
    });
    console.log(`❌ ${fileName}: ${buttonsInFile} buttons, ${issuesInFile.length} without handlers`);
  }
}

// Main execution
console.log('═══════════════════════════════════════════════════════');
console.log('🔍 NEW STUDENT SCREENS - BUTTON HANDLER CHECK');
console.log('═══════════════════════════════════════════════════════\n');

console.log(`Checking ${NEW_STUDENT_SCREENS.length} NEW student screens...\n`);

NEW_STUDENT_SCREENS.forEach(screen => {
  analyzeFile(screen);
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('📊 RESULTS SUMMARY');
console.log('═══════════════════════════════════════════════════════\n');

console.log(`✅ Screens checked: ${results.screensChecked}/${NEW_STUDENT_SCREENS.length}`);
console.log(`📍 Total buttons found: ${results.totalButtons}`);
console.log(`⚠️  Buttons without handlers: ${results.buttonsWithoutHandlers.length}`);
console.log(`✅ Clean screens: ${results.cleanScreens.length}`);
console.log(`❌ Screens with issues: ${results.issueScreens.length}\n`);

if (results.buttonsWithoutHandlers.length === 0) {
  console.log('🎉 PERFECT! All NEW student screens have proper button handlers!\n');
} else {
  console.log('⚠️  ISSUES FOUND:\n');

  results.issueScreens.forEach(screen => {
    console.log(`\n📄 ${screen.file} - ${screen.issues} issue(s)`);
    const issues = results.buttonsWithoutHandlers.filter(i => i.file === screen.file);
    issues.forEach(issue => {
      console.log(`   Line ${issue.line}: <${issue.type}> - ${issue.code}${issue.code.length >= 100 ? '...' : ''}`);
    });
  });
  console.log('\n');
}

// Percentage calculation
const percentage = results.totalButtons > 0
  ? ((results.totalButtons - results.buttonsWithoutHandlers.length) / results.totalButtons * 100).toFixed(1)
  : 100;

console.log('═══════════════════════════════════════════════════════');
console.log(`📈 BUTTON HANDLER COVERAGE: ${percentage}%`);
console.log('═══════════════════════════════════════════════════════\n');

if (results.cleanScreens.length > 0) {
  console.log('✅ CLEAN SCREENS (Top 10):');
  results.cleanScreens.slice(0, 10).forEach((screen, idx) => {
    console.log(`${idx + 1}. ${screen.file}: ${screen.buttons} buttons`);
  });
  if (results.cleanScreens.length > 10) {
    console.log(`... and ${results.cleanScreens.length - 10} more clean screens`);
  }
  console.log('');
}

// Save detailed results
const outputPath = path.join(__dirname, 'NEW_STUDENT_BUTTONS_REPORT.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`📄 Detailed results saved to: NEW_STUDENT_BUTTONS_REPORT.json\n`);

// Exit code
process.exit(results.buttonsWithoutHandlers.length > 0 ? 1 : 0);
