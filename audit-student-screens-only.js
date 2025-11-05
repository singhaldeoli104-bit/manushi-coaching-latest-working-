#!/usr/bin/env node

/**
 * STUDENT SCREENS ONLY AUDIT
 * Focus exclusively on student-related files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STUDENT_SCREENS_DIR = path.join(__dirname, 'OLD', 'src', 'screens', 'student');
const STUDENT_NAVIGATOR = path.join(__dirname, 'OLD', 'src', 'navigation', 'StudentNavigator.tsx');

console.log('═══════════════════════════════════════════════════════');
console.log('🎓 STUDENT SCREENS ONLY - COMPREHENSIVE AUDIT');
console.log('═══════════════════════════════════════════════════════\n');

const results = {
  buttons: { total: 0, missing: 0, issues: [] },
  todos: [],
  comingSoon: [],
  navigation: { declared: [], existing: [], missing: [], dead: [] },
  images: [],
};

// ============================================================================
// 1. CHECK BUTTONS IN STUDENT SCREENS
// ============================================================================

console.log('🔘 1. CHECKING BUTTONS IN STUDENT SCREENS...\n');

const BUTTON_PATTERNS = [
  'TouchableOpacity',
  'TouchableHighlight',
  'TouchableWithoutFeedback',
  'Pressable',
  'Button',
];

function checkButtonsInFile(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let fileButtons = 0;
  let fileMissing = 0;
  const issues = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const pattern of BUTTON_PATTERNS) {
      if (line.includes(`<${pattern}`)) {
        fileButtons++;

        // Check if this line or next 15 lines have onPress/onClick
        let hasHandler = false;

        // Check current line
        if (line.includes('onPress=') || line.includes('onClick=') || line.includes('disabled={true}') || line.includes('disabled')) {
          hasHandler = true;
        }

        // Check next 15 lines for multi-line components
        if (!hasHandler) {
          for (let j = 1; j <= 15 && (i + j) < lines.length; j++) {
            const nextLine = lines[i + j];
            if (nextLine.includes('onPress=') || nextLine.includes('onClick=')) {
              hasHandler = true;
              break;
            }
            // Stop if we hit a closing tag
            if (nextLine.includes(`</${pattern}>`)) {
              break;
            }
          }
        }

        if (!hasHandler) {
          fileMissing++;
          issues.push({
            file: fileName,
            line: i + 1,
            pattern: pattern,
            context: line.trim().substring(0, 80),
          });
        }
      }
    }
  }

  return { fileButtons, fileMissing, issues };
}

// Scan all student screen files
const studentFiles = fs.readdirSync(STUDENT_SCREENS_DIR)
  .filter(f => f.endsWith('.tsx') && !f.includes('.backup'));

studentFiles.forEach(file => {
  const filePath = path.join(STUDENT_SCREENS_DIR, file);
  const { fileButtons, fileMissing, issues } = checkButtonsInFile(filePath, file);

  results.buttons.total += fileButtons;
  results.buttons.missing += fileMissing;
  results.buttons.issues.push(...issues);
});

console.log(`   ✅ Files checked: ${studentFiles.length}`);
console.log(`   📍 Total buttons: ${results.buttons.total}`);
console.log(`   ⚠️  Missing handlers: ${results.buttons.missing}`);

if (results.buttons.missing > 0) {
  console.log(`\n   ❌ ISSUES FOUND:\n`);

  // Group by file
  const byFile = {};
  results.buttons.issues.forEach(issue => {
    if (!byFile[issue.file]) byFile[issue.file] = [];
    byFile[issue.file].push(issue);
  });

  Object.keys(byFile).forEach(file => {
    console.log(`   📄 ${file} (${byFile[file].length} issue${byFile[file].length > 1 ? 's' : ''})`);
    byFile[file].forEach(issue => {
      console.log(`      Line ${issue.line}: <${issue.pattern}> - ${issue.context}`);
    });
    console.log('');
  });
} else {
  console.log(`   ✅ PERFECT! All buttons have handlers!\n`);
}

// ============================================================================
// 2. CHECK TODO/COMING SOON IN STUDENT SCREENS
// ============================================================================

console.log('\n📝 2. CHECKING TODO/COMING SOON IN STUDENT SCREENS...\n');

const todoPatterns = ['TODO:', 'FIXME:', 'XXX:', 'HACK:'];
const comingSoonPatterns = ['coming soon', 'Coming Soon', 'to be implemented', 'not implemented', 'will be available', 'placeholder'];

studentFiles.forEach(file => {
  const filePath = path.join(STUDENT_SCREENS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Check TODOs
    todoPatterns.forEach(pattern => {
      if (line.includes(pattern)) {
        results.todos.push({
          file: file,
          line: idx + 1,
          content: line.trim(),
        });
      }
    });

    // Check Coming Soon
    comingSoonPatterns.forEach(pattern => {
      if (line.toLowerCase().includes(pattern.toLowerCase())) {
        results.comingSoon.push({
          file: file,
          line: idx + 1,
          content: line.trim(),
        });
      }
    });
  });
});

console.log(`   TODO/FIXME comments: ${results.todos.length}`);
console.log(`   "Coming Soon" messages: ${results.comingSoon.length}`);

if (results.todos.length > 0) {
  console.log('\n   📋 TODO COMMENTS:\n');
  results.todos.forEach(todo => {
    console.log(`      ${todo.file}:${todo.line}`);
    console.log(`      ${todo.content.substring(0, 100)}`);
    console.log('');
  });
}

if (results.comingSoon.length > 0) {
  console.log('\n   🚧 COMING SOON MESSAGES:\n');
  results.comingSoon.forEach(msg => {
    console.log(`      ${msg.file}:${msg.line}`);
    console.log(`      ${msg.content.substring(0, 100)}`);
    console.log('');
  });
}

// ============================================================================
// 3. CHECK NAVIGATION ROUTES VS COMPONENTS
// ============================================================================

console.log('\n🧭 3. CHECKING STUDENT NAVIGATION ROUTES...\n');

if (fs.existsSync(STUDENT_NAVIGATOR)) {
  const navContent = fs.readFileSync(STUDENT_NAVIGATOR, 'utf-8');

  // Extract imported screen names
  const importMatches = navContent.matchAll(/import\s+(\w+)\s+from\s+['"](.+?student\/(\w+))['"]/g);
  for (const match of importMatches) {
    const screenName = match[1];
    results.navigation.declared.push(screenName);
  }

  // Extract registered routes
  const routeMatches = navContent.matchAll(/<Stack\.Screen\s+name=["'](\w+)["']\s+component=\{(\w+)\}/g);
  for (const match of routeMatches) {
    const routeName = match[1];
    const componentName = match[2];
    if (!results.navigation.declared.includes(componentName)) {
      results.navigation.declared.push(componentName);
    }
  }

  // Get existing screen files
  results.navigation.existing = studentFiles.map(f => f.replace('.tsx', ''));

  // Find missing components (declared but no file)
  results.navigation.missing = results.navigation.declared.filter(
    name => !results.navigation.existing.includes(name)
  );

  // Find dead routes (file exists but not declared)
  results.navigation.dead = results.navigation.existing.filter(
    name => !results.navigation.declared.includes(name)
  );

  console.log(`   Routes declared in navigator: ${results.navigation.declared.length}`);
  console.log(`   Screen files that exist: ${results.navigation.existing.length}`);
  console.log(`   Missing components: ${results.navigation.missing.length}`);
  console.log(`   Dead routes (not in navigator): ${results.navigation.dead.length}`);

  if (results.navigation.missing.length > 0) {
    console.log('\n   ⚠️  MISSING COMPONENTS (declared but no file):\n');
    results.navigation.missing.forEach(name => {
      console.log(`      - ${name}.tsx`);
    });
  }

  if (results.navigation.dead.length > 0) {
    console.log('\n   ⚠️  DEAD ROUTES (file exists but not in navigator):\n');
    results.navigation.dead.forEach(name => {
      console.log(`      - ${name}.tsx`);
    });
  }
} else {
  console.log('   ❌ StudentNavigator.tsx not found!');
}

// ============================================================================
// 4. CHECK IMAGE PATHS IN STUDENT SCREENS
// ============================================================================

console.log('\n🖼️  4. CHECKING IMAGE PATHS IN STUDENT SCREENS...\n');

const imagePatterns = [
  /<Image[^>]+source=\{require\(['"](.+?)['"]\)\}/g,
  /<Image[^>]+source=\{\{uri:\s*['"](.+?)['"]\s*\}\}/g,
];

let totalImages = 0;
let brokenImages = 0;

studentFiles.forEach(file => {
  const filePath = path.join(STUDENT_SCREENS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  imagePatterns.forEach(pattern => {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      totalImages++;
      const imagePath = match[1];

      // Check if it's a local require (not URI)
      if (!imagePath.startsWith('http') && !imagePath.startsWith('data:')) {
        const resolvedPath = path.resolve(path.dirname(filePath), imagePath);
        if (!fs.existsSync(resolvedPath)) {
          brokenImages++;
          results.images.push({
            file: file,
            path: imagePath,
          });
        }
      }
    }
  });
});

console.log(`   Total images referenced: ${totalImages}`);
console.log(`   Broken image paths: ${brokenImages}`);

if (brokenImages > 0) {
  console.log('\n   ❌ BROKEN IMAGE PATHS:\n');
  results.images.forEach(img => {
    console.log(`      ${img.file}: ${img.path}`);
  });
} else {
  console.log('   ✅ All image paths are valid!');
}

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n═══════════════════════════════════════════════════════');
console.log('📊 STUDENT SCREENS AUDIT SUMMARY');
console.log('═══════════════════════════════════════════════════════\n');

console.log('🔘 Buttons:');
console.log(`   Total: ${results.buttons.total}`);
console.log(`   Missing handlers: ${results.buttons.missing} (${((results.buttons.missing / results.buttons.total) * 100).toFixed(1)}%)`);
console.log(`   Coverage: ${(((results.buttons.total - results.buttons.missing) / results.buttons.total) * 100).toFixed(1)}%`);

console.log('\n📝 Placeholders:');
console.log(`   TODO comments: ${results.todos.length}`);
console.log(`   "Coming Soon" messages: ${results.comingSoon.length}`);

console.log('\n🧭 Navigation:');
console.log(`   Routes declared: ${results.navigation.declared.length}`);
console.log(`   Files existing: ${results.navigation.existing.length}`);
console.log(`   Missing components: ${results.navigation.missing.length}`);
console.log(`   Dead routes: ${results.navigation.dead.length}`);

console.log('\n🖼️  Images:');
console.log(`   Total referenced: ${totalImages}`);
console.log(`   Broken paths: ${brokenImages}`);

// Calculate grade
let score = 100;
const buttonCoverage = ((results.buttons.total - results.buttons.missing) / results.buttons.total) * 100;
if (buttonCoverage < 100) score -= (100 - buttonCoverage) * 0.3;
if (results.todos.length > 5) score -= 5;
if (results.comingSoon.length > 3) score -= 10;
if (results.navigation.missing.length > 0) score -= results.navigation.missing.length * 2;
if (brokenImages > 0) score -= brokenImages * 5;

console.log(`\n🎯 OVERALL GRADE: ${score.toFixed(0)}/100`);

if (score >= 95) console.log('   ✅ EXCELLENT - Production ready!');
else if (score >= 85) console.log('   🟢 GOOD - Minor fixes needed');
else if (score >= 70) console.log('   🟡 ACCEPTABLE - Some work required');
else console.log('   🔴 NEEDS WORK - Significant issues found');

console.log('\n═══════════════════════════════════════════════════════\n');

// Save results
const outputPath = path.join(__dirname, 'STUDENT_SCREENS_AUDIT_RESULTS.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`📄 Full results saved to: ${outputPath}\n`);
