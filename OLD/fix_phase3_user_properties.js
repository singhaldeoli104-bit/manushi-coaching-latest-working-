/**
 * Phase 3: Fix User Type and Auth Properties
 * Fixes TS2339 errors related to missing User properties (name, logout, etc.)
 *
 * Target: Add 'name' to User type, 'logout' to AuthContext
 */

const fs = require('fs');
const path = require('path');

/**
 * Update User type in database.ts to ensure 'name' property exists
 */
function fixUserType() {
  const databaseTypesPath = path.join(__dirname, 'src', 'types', 'database.ts');

  try {
    let content = fs.readFileSync(databaseTypesPath, 'utf8');

    // Find and update User interface
    const userInterfaceRegex = /export interface User \{[\s\S]*?\}/;
    const match = content.match(userInterfaceRegex);

    if (!match) {
      console.log('⚠️  User interface not found');
      return;
    }

    const currentUserInterface = match[0];

    // Check if name property already exists
    if (currentUserInterface.includes('name:')) {
      console.log('✓ User type already has name property');
      return;
    }

    // Add name property if it doesn't exist
    const updatedUserInterface = currentUserInterface.replace(
      /displayName: string \| null;/,
      'displayName: string | null;\n  name: string;'
    );

    content = content.replace(currentUserInterface, updatedUserInterface);

    fs.writeFileSync(databaseTypesPath, content, 'utf8');
    console.log('✓ Added name property to User type');

  } catch (error) {
    console.error(`✗ Error updating User type: ${error.message}`);
  }
}

/**
 * Add logout method to AuthContext
 */
function fixAuthContext() {
  const authContextPath = path.join(__dirname, 'src', 'context', 'AuthContext.tsx');

  try {
    let content = fs.readFileSync(authContextPath, 'utf8');

    // Check if logout already exists in interface
    if (content.includes('logout:')) {
      console.log('✓ AuthContext already has logout method');
      return;
    }

    // Add logout to interface
    content = content.replace(
      /signOut: \(\) => Promise<void>;/,
      'signOut: () => Promise<void>;\n  logout: () => Promise<void>;'
    );

    // Add logout to value object
    content = content.replace(
      /const value = \{[\s\S]*?signOut,/,
      match => match + '\n    logout: signOut,  // Alias for signOut'
    );

    fs.writeFileSync(authContextPath, content, 'utf8');
    console.log('✓ Added logout method to AuthContext');

  } catch (error) {
    console.error(`✗ Error updating AuthContext: ${error.message}`);
  }
}

/**
 * Add missing service methods (getStatus, analyzeUserPerformance, etc.)
 */
function addMissingServiceTypes() {
  const serviceTypesPath = path.join(__dirname, 'src', 'types', 'services.ts');

  // Create services.ts if it doesn't exist
  if (!fs.existsSync(serviceTypesPath)) {
    const serviceTypes = `/**
 * Service Type Definitions
 * Type definitions for service classes
 */

export interface AdaptiveLearningPathService {
  analyzeUserPerformance: (userId: string) => Promise<any>;
  getStatus: () => Promise<{ health: string; [key: string]: any }>;
}

export interface AdvancedAIDecisionEngine {
  getStatus: () => Promise<{ health: string; [key: string]: any }>;
}

export interface IntelligentWorkflowAutomationService {
  getStatus: () => Promise<{ health: string; [key: string]: any }>;
}

export interface ProactiveSystemOptimizerService {
  getStatus: () => Promise<{ health: string; [key: string]: any }>;
}

export interface RealTimeCollaborationService {
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler: (...args: any[]) => void) => void;
  removeAllListeners: (event?: string) => void;
}

export interface NotificationService {
  removeAllListeners: (event?: string) => void;
}

export interface VideoCallService {
  removeAllListeners: (event?: string) => void;
}
`;

    fs.writeFileSync(serviceTypesPath, serviceTypes, 'utf8');
    console.log('✓ Created services.ts with missing service types');
    return;
  }

  console.log('✓ services.ts already exists');
}

/**
 * Add missing component exports
 */
function fixComponentExports() {
  const componentsToFix = [
    {
      file: 'src/components/student/CategorySelector.tsx',
      defaultExport: 'CategorySelection',
      namedExport: 'CategorySelector'
    },
    {
      file: 'src/components/student/AutoTagger.tsx',
      needsNamedExport: true
    },
    {
      file: 'src/components/student/SimilarQuestions.tsx',
      needsNamedExport: true
    }
  ];

  componentsToFix.forEach(({ file, defaultExport, namedExport, needsNamedExport }) => {
    const filePath = path.join(__dirname, file);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      if (namedExport && defaultExport) {
        // Add named export as alias for default export
        if (!content.includes(`export { ${defaultExport} as ${namedExport} }`)) {
          content += `\nexport { ${defaultExport} as ${namedExport} };\n`;
          modified = true;
        }
      }

      if (needsNamedExport) {
        // Find the default export and add a named export
        const defaultMatch = content.match(/export default (\w+);/);
        if (defaultMatch && !content.includes(`export { ${defaultMatch[1]} }`)) {
          content = content.replace(
            defaultMatch[0],
            `export { ${defaultMatch[1]} };\n${defaultMatch[0]}`
          );
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Fixed exports in ${path.basename(file)}`);
      }

    } catch (error) {
      console.error(`✗ Error fixing exports in ${file}: ${error.message}`);
    }
  });
}

// Main execution
console.log('🔧 Phase 3: Fixing User Properties and Auth Context\n');

fixUserType();
fixAuthContext();
addMissingServiceTypes();
fixComponentExports();

console.log('\n✅ Phase 3 complete!\n');
