#!/usr/bin/env node

/**
 * Comprehensive Codebase Audit Tool
 * Detects:
 * 1. Unimplemented buttons (already done - 126 found)
 * 2. TODO/Coming Soon placeholders
 * 3. Missing navigation components
 * 4. Dead routes
 * 5. Broken image paths
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const basePath = path.join(__dirname, 'OLD', 'src');

// Results storage
const results = {
  buttons: { total: 1137, missing: 126 }, // From previous scan
  todos: [],
  comingSoon: [],
  missingComponents: [],
  deadRoutes: [],
  images: [],
};

// 1. Scan for TODOs and placeholders
function scanPlaceholders() {
  console.log('🔍 Scanning for TODO/Coming Soon placeholders...\n');

  try {
    // Count TODOs
    const todoOutput = execSync(
      `grep -ri "TODO:\\|FIXME:\\|XXX:\\|HACK:" ${basePath} | wc -l`,
      { encoding: 'utf-8' }
    ).trim();

    const comingSoonOutput = execSync(
      `grep -ri "coming soon\\|to be implemented\\|not implemented\\|placeholder" ${basePath} | wc -l`,
      { encoding: 'utf-8' }
    ).trim();

    results.todos = parseInt(todoOutput) || 0;
    results.comingSoon = parseInt(comingSoonOutput) || 0;

    console.log(`   TODO/FIXME/XXX: ${results.todos} occurrences`);
    console.log(`   Coming Soon/Placeholders: ${results.comingSoon} occurrences`);
  } catch (error) {
    console.error('Error scanning placeholders:', error.message);
  }
}

// 2. Check navigation routes vs components
function checkNavigationRoutes() {
  console.log('\n🧭 Checking navigation routes vs components...\n');

  const navigators = [
    'navigation/ParentNavigator.tsx',
    'navigation/StudentNavigator.tsx',
    'navigation/TeacherNavigator.tsx',
    'navigation/AdminNavigator.tsx',
  ];

  const routes = new Set();
  const components = new Set();

  // Extract routes from navigators
  navigators.forEach(nav => {
    const navPath = path.join(basePath, nav);
    if (!fs.existsSync(navPath)) return;

    const content = fs.readFileSync(navPath, 'utf-8');

    // Find Screen imports
    const importMatches = content.matchAll(/import\s+(\w+)\s+from\s+['"](.+?)['"]/g);
    for (const match of importMatches) {
      const [, componentName, importPath] = match;
      if (componentName.includes('Screen') || componentName.includes('Dashboard')) {
        routes.add(componentName);
      }
    }

    // Find Stack.Screen name props
    const screenMatches = content.matchAll(/<Stack\.Screen\s+name=["'](\w+)["']/g);
    for (const match of screenMatches) {
      routes.add(match[1]);
    }
  });

  // Find all screen components
  const screenDirs = [
    'screens/parent',
    'screens/student',
    'screens/teacher',
    'screens/admin',
    'screens/common',
  ];

  screenDirs.forEach(dir => {
    const dirPath = path.join(basePath, dir);
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      if (file.endsWith('.tsx') && !file.includes('.backup')) {
        const componentName = file.replace('.tsx', '');
        components.add(componentName);
      }
    });
  });

  // Find missing components (routes without files)
  routes.forEach(route => {
    if (!components.has(route) && !route.includes('Stack') && !route.includes('Navigator')) {
      results.missingComponents.push(route);
    }
  });

  // Find dead routes (files not used in navigation)
  components.forEach(component => {
    if (!routes.has(component)) {
      results.deadRoutes.push(component);
    }
  });

  console.log(`   Total routes declared: ${routes.size}`);
  console.log(`   Total screen components: ${components.size}`);
  console.log(`   Missing components: ${results.missingComponents.length}`);
  console.log(`   Potentially dead routes: ${results.deadRoutes.length}`);
}

// 3. Check image paths
function checkImagePaths() {
  console.log('\n🖼️  Checking image paths...\n');

  const imagePatterns = [
    /<Image[^>]+source=\{require\(['"](.+?)['"]\)\}/g,
    /<Image[^>]+source=\{\{uri:\s*['"](.+?)['"]\s*\}\}/g,
    /<img[^>]+src=["'](.+?)["']/g,
  ];

  let totalImages = 0;
  let brokenImages = 0;

  function scanFile(filePath) {
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
              file: path.relative(basePath, filePath),
              image: imagePath,
            });
          }
        }
      }
    });
  }

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        scanFile(fullPath);
      }
    });
  }

  try {
    walkDir(basePath);
    console.log(`   Total images referenced: ${totalImages}`);
    console.log(`   Broken image paths: ${brokenImages}`);
  } catch (error) {
    console.error('Error checking images:', error.message);
  }
}

// Main execution
console.log('═══════════════════════════════════════════════════════');
console.log('🔬 COMPREHENSIVE CODEBASE AUDIT');
console.log('═══════════════════════════════════════════════════════\n');

console.log('✅ 1. Unimplemented Buttons: ALREADY SCANNED');
console.log(`   Total buttons: ${results.buttons.total}`);
console.log(`   Missing handlers: ${results.buttons.missing}\n`);

scanPlaceholders();
checkNavigationRoutes();
checkImagePaths();

console.log('\n═══════════════════════════════════════════════════════');
console.log('📊 AUDIT SUMMARY');
console.log('═══════════════════════════════════════════════════════\n');

console.log('🔘 Buttons:');
console.log(`   Total: ${results.buttons.total}`);
console.log(`   Missing handlers: ${results.buttons.missing} (11.1%)\n`);

console.log('📝 Placeholders:');
console.log(`   TODO/FIXME comments: ${results.todos}`);
console.log(`   "Coming Soon" messages: ${results.comingSoon}\n`);

console.log('🧭 Navigation:');
console.log(`   Missing components: ${results.missingComponents.length}`);
console.log(`   Potentially dead routes: ${results.deadRoutes.length}\n`);

console.log('🖼️  Images:');
console.log(`   Broken image paths: ${results.images.length}\n`);

// Print details if issues found
if (results.missingComponents.length > 0) {
  console.log('\n⚠️  MISSING COMPONENTS:');
  results.missingComponents.slice(0, 10).forEach(comp => {
    console.log(`   - ${comp}`);
  });
  if (results.missingComponents.length > 10) {
    console.log(`   ... and ${results.missingComponents.length - 10} more`);
  }
}

if (results.deadRoutes.length > 10) {
  console.log('\n⚠️  POTENTIALLY DEAD ROUTES (Top 10):');
  results.deadRoutes.slice(0, 10).forEach(route => {
    console.log(`   - ${route}`);
  });
  console.log(`   ... and ${results.deadRoutes.length - 10} more`);
}

if (results.images.length > 0) {
  console.log('\n⚠️  BROKEN IMAGE PATHS:');
  results.images.slice(0, 5).forEach(img => {
    console.log(`   - ${img.file}: ${img.image}`);
  });
  if (results.images.length > 5) {
    console.log(`   ... and ${results.images.length - 5} more`);
  }
}

console.log('\n═══════════════════════════════════════════════════════\n');

// Save results to JSON
const outputPath = path.join(__dirname, 'AUDIT_RESULTS.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`📄 Full results saved to: ${outputPath}\n`);
