#!/usr/bin/env node

/**
 * Check for buttons without event handlers
 * Detects TouchableOpacity, Button, Pressable, TouchableHighlight without onPress
 */

const fs = require('fs');
const path = require('path');

const BUTTON_PATTERNS = [
  'TouchableOpacity',
  'TouchableHighlight',
  'TouchableWithoutFeedback',
  'Pressable',
  'Button',
];

const results = {
  filesChecked: 0,
  totalButtons: 0,
  buttonsWithoutHandlers: [],
  filesSummary: [],
};

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    let buttonsInFile = 0;
    let issuesInFile = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      // Check each button pattern
      for (const pattern of BUTTON_PATTERNS) {
        if (line.includes(`<${pattern}`)) {
          buttonsInFile++;
          results.totalButtons++;

          // Check if this is a self-closing tag or multi-line component
          const isSelfClosing = line.includes('/>');

          // Look ahead for onPress in next few lines (for multi-line components)
          let hasOnPress = line.includes('onPress=');

          if (!isSelfClosing && !hasOnPress) {
            // Check next 15 lines for onPress
            let foundClosing = false;
            for (let j = i + 1; j < Math.min(i + 16, lines.length); j++) {
              const nextLine = lines[j];
              if (nextLine.includes('onPress=')) {
                hasOnPress = true;
                break;
              }
              // Check if we hit the closing tag
              if (nextLine.includes(`</${pattern}>`) || nextLine.includes('/>')) {
                foundClosing = true;
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
                file: filePath,
                line: lineNum,
                type: pattern,
                code: line.trim(),
              };

              issuesInFile.push(issue);
              results.buttonsWithoutHandlers.push(issue);
            }
          }
        }
      }
    }

    results.filesSummary.push({
      file: filePath,
      buttons: buttonsInFile,
      issues: issuesInFile.length,
    });

    results.filesChecked++;

  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
  }
}

function scanDirectory(dirPath, filePattern = /\.tsx$/) {
  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath, filePattern);
      } else if (stat.isFile() && filePattern.test(item)) {
        analyzeFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dirPath}:`, error.message);
  }
}

// Main execution
const screensPath = path.join(__dirname, 'OLD', 'src', 'screens');

console.log('🔍 Scanning for buttons without handlers...\n');
console.log(`Checking directory: ${screensPath}\n`);

scanDirectory(screensPath);

// Print results
console.log('═══════════════════════════════════════════════════════');
console.log('📊 BUTTON HANDLER ANALYSIS RESULTS');
console.log('═══════════════════════════════════════════════════════\n');

console.log(`✅ Files checked: ${results.filesChecked}`);
console.log(`📍 Total buttons found: ${results.totalButtons}`);
console.log(`⚠️  Buttons without handlers: ${results.buttonsWithoutHandlers.length}\n`);

if (results.buttonsWithoutHandlers.length > 0) {
  console.log('❌ ISSUES FOUND:\n');

  // Group by file
  const issuesByFile = {};
  results.buttonsWithoutHandlers.forEach(issue => {
    const relPath = issue.file.replace(screensPath, '');
    if (!issuesByFile[relPath]) {
      issuesByFile[relPath] = [];
    }
    issuesByFile[relPath].push(issue);
  });

  Object.entries(issuesByFile).forEach(([file, issues]) => {
    console.log(`\n📄 ${file}`);
    console.log(`   ${issues.length} button(s) without handlers:`);
    issues.forEach(issue => {
      console.log(`   Line ${issue.line}: <${issue.type}> - ${issue.code.substring(0, 80)}${issue.code.length > 80 ? '...' : ''}`);
    });
  });

  console.log('\n');
} else {
  console.log('✅ No buttons without handlers found!\n');
}

// Print top files with most buttons
console.log('═══════════════════════════════════════════════════════');
console.log('📈 TOP FILES BY BUTTON COUNT');
console.log('═══════════════════════════════════════════════════════\n');

const topFiles = results.filesSummary
  .filter(f => f.buttons > 0)
  .sort((a, b) => b.buttons - a.buttons)
  .slice(0, 10);

topFiles.forEach((file, idx) => {
  const relPath = file.file.replace(screensPath, '');
  const issueMarker = file.issues > 0 ? ` ⚠️  ${file.issues} issues` : '';
  console.log(`${idx + 1}. ${relPath}: ${file.buttons} buttons${issueMarker}`);
});

console.log('\n');

// Exit code
process.exit(results.buttonsWithoutHandlers.length > 0 ? 1 : 0);
