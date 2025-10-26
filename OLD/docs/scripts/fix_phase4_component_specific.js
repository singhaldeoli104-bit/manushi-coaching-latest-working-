/**
 * Phase 4: Component-Specific Fixes
 * Fixes specific issues in individual components
 *
 * Target: ImagePicker, DoubtDashboard, style objects, etc.
 */

const fs = require('fs');
const path = require('path');

const stats = {
  filesFixed: 0,
  issuesFixed: 0
};

/**
 * Fix ImagePicker component type issues
 */
function fixImagePicker() {
  const filePath = path.join(__dirname, 'src', 'components', 'media', 'ImagePicker.tsx');

  if (!fs.existsSync(filePath)) {
    console.log('⚠️  ImagePicker.tsx not found');
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix cropperStatusBarColor -> cropperStatusBarLight
    if (content.includes('cropperStatusBarColor')) {
      content = content.replace(/cropperStatusBarColor/g, 'cropperStatusBarLight');
      modified = true;
      stats.issuesFixed++;
    }

    // Fix cropRect null to undefined
    if (content.includes('cropRect: CropRect | null')) {
      content = content.replace(/cropRect: CropRect \| null/g, 'cropRect: CropRect | undefined');
      modified = true;
      stats.issuesFixed++;
    }

    // Fix duration type
    if (content.includes('duration: number | null')) {
      content = content.replace(/duration: number \| null/g, 'duration: number | undefined');
      modified = true;
      stats.issuesFixed++;
    }

    // Add openSettings method (if ImageCropPicker doesn't have it, create a fallback)
    if (content.includes('ImageCropPicker.openSettings()')) {
      content = content.replace(
        /ImageCropPicker\.openSettings\(\)/g,
        'Linking.openSettings()'
      );
      // Add Linking import if not present
      if (!content.includes("import { Linking }")) {
        content = content.replace(
          /from 'react-native';/,
          ", Linking } from 'react-native';"
        );
      }
      modified = true;
      stats.issuesFixed++;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed ImagePicker.tsx (${stats.issuesFixed} issues)`);
      stats.filesFixed++;
    }

  } catch (error) {
    console.error(`✗ Error fixing ImagePicker: ${error.message}`);
  }
}

/**
 * Fix DoubtDashboard component type issues
 */
function fixDoubtDashboard() {
  const filePath = path.join(__dirname, 'src', 'components', 'student', 'DoubtDashboard.tsx');

  if (!fs.existsSync(filePath)) {
    console.log('⚠️  DoubtDashboard.tsx not found');
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix view state type to include missing states
    const viewStateMatch = content.match(/type ViewState = ['"]form['"] \| ['"]dashboard['"] \| ['"]history['"]/);
    if (viewStateMatch) {
      content = content.replace(
        viewStateMatch[0],
        'type ViewState = "form" | "dashboard" | "history" | "ai-insights" | "collaboration"'
      );
      modified = true;
      stats.issuesFixed++;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('✓ Fixed DoubtDashboard.tsx');
      stats.filesFixed++;
    }

  } catch (error) {
    console.error(`✗ Error fixing DoubtDashboard: ${error.message}`);
  }
}

/**
 * Fix DoubtSubmissionForm imports
 */
function fixDoubtSubmissionForm() {
  const filePath = path.join(__dirname, 'src', 'components', 'student', 'DoubtSubmissionForm.tsx');

  if (!fs.existsSync(filePath)) {
    console.log('⚠️  DoubtSubmissionForm.tsx not found');
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix CategorySelector import
    if (content.includes("import { CategorySelector } from './CategorySelector'")) {
      content = content.replace(
        "import { CategorySelector } from './CategorySelector'",
        "import CategorySelection from './CategorySelector'"
      );
      // Update usage if needed
      content = content.replace(/<CategorySelector /g, '<CategorySelection ');
      modified = true;
      stats.issuesFixed++;
    }

    // Fix AutoTagger import
    if (content.includes("import { AutoTagger } from './AutoTagger'")) {
      content = content.replace(
        "import { AutoTagger } from './AutoTagger'",
        "import AutoTagger from './AutoTagger'"
      );
      modified = true;
      stats.issuesFixed++;
    }

    // Fix SimilarQuestions import
    if (content.includes("import { SimilarQuestions } from './SimilarQuestions'")) {
      content = content.replace(
        "import { SimilarQuestions } from './SimilarQuestions'",
        "import SimilarQuestions from './SimilarQuestions'"
      );
      modified = true;
      stats.issuesFixed++;
    }

    // Fix TextInput mode prop (doesn't exist in React Native TextInput)
    content = content.replace(/mode=["']outlined["']/g, '// mode="outlined" - removed (not supported)');
    if (content.includes('mode=')) {
      modified = true;
      stats.issuesFixed++;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('✓ Fixed DoubtSubmissionForm.tsx');
      stats.filesFixed++;
    }

  } catch (error) {
    console.error(`✗ Error fixing DoubtSubmissionForm: ${error.message}`);
  }
}

/**
 * Fix LivePoll comparison errors
 */
function fixLivePoll() {
  const filePath = path.join(__dirname, 'src', 'components', 'realtime', 'LivePoll.tsx');

  if (!fs.existsSync(filePath)) {
    console.log('⚠️  LivePoll.tsx not found');
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix percentage string heights
    content = content.replace(/height:\s*`\$\{.*?\}%`/g, (match) => {
      // Convert template literal percentages to proper format
      const numMatch = match.match(/\$\{(.*?)\}/);
      if (numMatch) {
        return `height: \`\${${numMatch[1]}}%\` as any`;
      }
      return match;
    });

    // Fix width percentages
    content = content.replace(/width:\s*"100%"/g, "width: '100%' as any");

    modified = true;
    stats.issuesFixed += 3;

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('✓ Fixed LivePoll.tsx');
      stats.filesFixed++;
    }

  } catch (error) {
    console.error(`✗ Error fixing LivePoll: ${error.message}`);
  }
}

/**
 * Fix PlanSelector comparison errors
 */
function fixPlanSelector() {
  const filePath = path.join(__dirname, 'src', 'components', 'payment', 'PlanSelector.tsx');

  if (!fs.existsSync(filePath)) {
    console.log('⚠️  PlanSelector.tsx not found');
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix billing period type
    const billingPeriodMatch = content.match(/type BillingPeriod = ['"]monthly['"] \| ['"]quarterly['"] \| ['"]yearly['"]/);
    if (!billingPeriodMatch && content.includes('BillingPeriod')) {
      // Add type definition
      const importEnd = content.lastIndexOf("import");
      const insertPos = content.indexOf('\n', importEnd) + 1;
      content = content.slice(0, insertPos) +
        '\ntype BillingPeriod = "monthly" | "quarterly" | "yearly";\n' +
        content.slice(insertPos);
      modified = true;
      stats.issuesFixed++;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('✓ Fixed PlanSelector.tsx');
      stats.filesFixed++;
    }

  } catch (error) {
    console.error(`✗ Error fixing PlanSelector: ${error.message}`);
  }
}

/**
 * Fix MessageBubble style issues
 */
function fixMessageBubble() {
  const filePath = path.join(__dirname, 'src', 'components', 'realtime', 'MessageBubble.tsx');

  if (!fs.existsSync(filePath)) {
    console.log('⚠️  MessageBubble.tsx not found');
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix maxWidth percentage
    content = content.replace(/maxWidth:\s*"80%"/g, "maxWidth: '80%' as any");
    modified = true;
    stats.issuesFixed++;

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('✓ Fixed MessageBubble.tsx');
      stats.filesFixed++;
    }

  } catch (error) {
    console.error(`✗ Error fixing MessageBubble: ${error.message}`);
  }
}

/**
 * Fix UserManagementScreen missing style properties
 */
function fixUserManagementScreen() {
  const filePath = path.join(__dirname, 'src', 'screens', 'admin', 'UserManagementScreen.tsx');

  if (!fs.existsSync(filePath)) {
    console.log('⚠️  UserManagementScreen.tsx not found');
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Find the styles object and add missing properties
    const stylesMatch = content.match(/const styles = StyleSheet\.create\(\{[\s\S]*?\}\);/);
    if (stylesMatch) {
      const stylesObj = stylesMatch[0];

      // Add missing emptyState styles if not present
      if (!stylesObj.includes('emptyState:')) {
        const updatedStyles = stylesObj.replace(
          /\}\);$/,
          `  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});`
        );
        content = content.replace(stylesObj, updatedStyles);
        modified = true;
        stats.issuesFixed += 3;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('✓ Fixed UserManagementScreen.tsx');
      stats.filesFixed++;
    }

  } catch (error) {
    console.error(`✗ Error fixing UserManagementScreen: ${error.message}`);
  }
}

// Main execution
console.log('🔧 Phase 4: Component-Specific Fixes\n');

fixImagePicker();
fixDoubtDashboard();
fixDoubtSubmissionForm();
fixLivePoll();
fixPlanSelector();
fixMessageBubble();
fixUserManagementScreen();

console.log('\n' + '='.repeat(60));
console.log('📊 Summary:');
console.log('='.repeat(60));
console.log(`Files fixed: ${stats.filesFixed}`);
console.log(`Issues resolved: ${stats.issuesFixed}`);
console.log('\n✅ Phase 4 complete!\n');
