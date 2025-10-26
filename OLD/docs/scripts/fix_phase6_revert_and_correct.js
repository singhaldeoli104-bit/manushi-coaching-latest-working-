/**
 * Phase 6: Revert Phase 1 and Apply Correct Fixes
 * Phase 1 incorrectly changed theme properties from uppercase to lowercase
 * This reverts those changes and applies correct fixes
 */

const fs = require('fs');
const path = require('path');

const stats = {
  filesProcessed: 0,
  errorsFixed: 0
};

/**
 * Revert incorrect case changes for theme objects
 * LightTheme/DarkTheme use uppercase: Primary, Secondary, etc.
 * ROLE_COLORS use lowercase: primary, secondary, etc.
 */
function revertAndFixCases(filePath, content) {
  let fixed = content;
  let count = 0;

  // Revert LightTheme/DarkTheme properties back to uppercase
  const themePropertyFixes = [
    // Only fix for LightTheme, DarkTheme, PrimaryColors, SemanticColors
    { from: /\b(LightTheme|DarkTheme|PrimaryColors|SemanticColors)\.primary\b/g, to: '$1.Primary' },
    { from: /\b(LightTheme|DarkTheme|PrimaryColors|SemanticColors)\.secondary\b/g, to: '$1.Secondary' },
    { from: /\b(LightTheme|DarkTheme|PrimaryColors|SemanticColors)\.background\b/g, to: '$1.Background' },
    { from: /\b(LightTheme|DarkTheme|PrimaryColors|SemanticColors)\.accent\b/g, to: '$1.Accent' },
    { from: /\b(LightTheme|DarkTheme|PrimaryColors|SemanticColors)\.gradient\b/g, to: '$1.Gradient' },
    { from: /\b(LightTheme|DarkTheme|PrimaryColors|SemanticColors)\.text\b/g, to: '$1.Text' },
    { from: /\b(LightTheme|DarkTheme|PrimaryColors|SemanticColors)\.border\b/g, to: '$1.Border' },
    { from: /\b(LightTheme|DarkTheme|PrimaryColors|SemanticColors)\.success\b/g, to: '$1.Success' },
    { from: /\b(LightTheme|DarkTheme|PrimaryColors|SemanticColors)\.warning\b/g, to: '$1.Warning' },
    { from: /\b(LightTheme|DarkTheme|PrimaryColors|SemanticColors)\.error\b/g, to: '$1.Error' },
    { from: /\b(LightTheme|DarkTheme|PrimaryColors|SemanticColors)\.info\b/g, to: '$1.Info' },
  ];

  themePropertyFixes.forEach(fix => {
    const matches = (fixed.match(fix.from) || []).length;
    if (matches > 0) {
      fixed = fixed.replace(fix.from, fix.to);
      count += matches;
    }
  });

  // Revert spacing properties back to uppercase
  const spacingFixes = [
    { from: /\bSpacing\.xs\b/g, to: 'Spacing.XS' },
    { from: /\bSpacing\.sm\b/g, to: 'Spacing.SM' },
    { from: /\bSpacing\.md\b/g, to: 'Spacing.MD' },
    { from: /\bSpacing\.lg\b/g, to: 'Spacing.LG' },
    { from: /\bSpacing\.xl\b/g, to: 'Spacing.XL' },
  ];

  spacingFixes.forEach(fix => {
    const matches = (fixed.match(fix.from) || []).length;
    if (matches > 0) {
      fixed = fixed.replace(fix.from, fix.to);
      count += matches;
    }
  });

  // Revert breakpoint properties back to uppercase
  const breakpointFixes = [
    { from: /\bBreakpoints\.xs\b/g, to: 'Breakpoints.XS' },
    { from: /\bBreakpoints\.sm\b/g, to: 'Breakpoints.SM' },
    { from: /\bBreakpoints\.md\b/g, to: 'Breakpoints.MD' },
    { from: /\bBreakpoints\.lg\b/g, to: 'Breakpoints.LG' },
    { from: /\bBreakpoints\.xl\b/g, to: 'Breakpoints.XL' },
  ];

  breakpointFixes.forEach(fix => {
    const matches = (fixed.match(fix.from) || []).length;
    if (matches > 0) {
      fixed = fixed.replace(fix.from, fix.to);
      count += matches;
    }
  });

  // Revert BorderRadius back to uppercase
  const borderRadiusFixes = [
    { from: /\bBorderRadius\.xs\b/g, to: 'BorderRadius.XS' },
    { from: /\bBorderRadius\.sm\b/g, to: 'BorderRadius.SM' },
    { from: /\bBorderRadius\.md\b/g, to: 'BorderRadius.MD' },
    { from: /\bBorderRadius\.lg\b/g, to: 'BorderRadius.LG' },
    { from: /\bBorderRadius\.xl\b/g, to: 'BorderRadius.XL' },
  ];

  borderRadiusFixes.forEach(fix => {
    const matches = (fixed.match(fix.from) || []).length;
    if (matches > 0) {
      fixed = fixed.replace(fix.from, fix.to);
      count += matches;
    }
  });

  return { content: fixed, count };
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    const result = revertAndFixCases(filePath, content);

    // Write back if changes were made
    if (result.content !== content) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      stats.filesProcessed++;
      stats.errorsFixed += result.count;
      console.log(`✓ Fixed ${result.count} properties in ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
  }
}

/**
 * Recursively find all TypeScript files
 */
function findTypeScriptFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!['node_modules', 'build', 'dist', '.git'].includes(file)) {
        findTypeScriptFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Main execution
console.log('🔧 Phase 6: Reverting Incorrect Fixes and Applying Correct Ones\n');
console.log('Reverting: Theme properties from lowercase back to uppercase\n');

const srcDir = path.join(__dirname, 'src');
const files = findTypeScriptFiles(srcDir);

console.log(`Processing ${files.length} TypeScript files\n`);

files.forEach(processFile);

console.log('\n' + '='.repeat(60));
console.log('📊 Fix Summary:');
console.log('='.repeat(60));
console.log(`Files processed: ${stats.filesProcessed}`);
console.log(`Properties fixed: ${stats.errorsFixed}`);

console.log('\n✅ Phase 6 complete! Run "npx tsc --noEmit" to verify.\n');
