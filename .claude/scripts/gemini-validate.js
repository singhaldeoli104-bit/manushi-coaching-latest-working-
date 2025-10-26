#!/usr/bin/env node

/**
 * Gemini API Validator
 * Calls Gemini 2.5 Pro API for code validation
 */

const fs = require('fs');
const path = require('path');

// Read API key from .env.local
function getApiKey() {
  const envPath = path.join(__dirname, '../../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env.local not found');
    console.error('Please create .env.local with GEMINI_API_KEY');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY=(.+)/);

  if (!match) {
    console.error('❌ Error: GEMINI_API_KEY not found in .env.local');
    process.exit(1);
  }

  return match[1].trim();
}

// Main validation function
async function validateCode(codeContent, context, focus = 'all') {
  const apiKey = getApiKey();
  // Using gemini-2.0-flash-exp (latest available model as of Jan 2025)
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  const prompt = `You are a code review expert analyzing React Native TypeScript code.

${context}

**Validation Focus:** ${focus}

**Code to Analyze:**
\`\`\`typescript
${codeContent}
\`\`\`

Please provide a comprehensive analysis covering:

1. **CRITICAL ISSUES** (🔴)
   - Security vulnerabilities
   - Memory leaks
   - Data integrity issues
   - Breaking bugs

2. **PERFORMANCE ISSUES** (🟡)
   - Missing memoization
   - Unnecessary re-renders
   - Expensive operations
   - List optimization opportunities

3. **CODE QUALITY ISSUES** (🟢)
   - TypeScript type safety
   - Error handling gaps
   - Accessibility issues
   - Best practices violations

4. **STRENGTHS** (✅)
   - What's done well
   - Good patterns used
   - Proper implementations

For each issue, provide:
- Exact location (line number if visible)
- Code snippet showing the problem
- Why it's an issue
- How to fix it (with code example)
- Severity level

Format your response in clear markdown with headers and code blocks.`;

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.2,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ]
  };

  console.error('🤖 Calling Gemini 2.5 Pro API...');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ API Error:', error);
      process.exit(1);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('❌ Unexpected API response format');
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }

    const analysis = data.candidates[0].content.parts[0].text;
    console.log('\n' + analysis);

    return {
      success: true,
      analysis,
      model: 'gemini-2.0-flash-exp',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error calling Gemini API:', error.message);
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node gemini-validate.js <file-path> [focus]');
    console.log('');
    console.log('Arguments:');
    console.log('  file-path  Path to the file to validate');
    console.log('  focus      Optional: security | performance | accessibility | all (default: all)');
    console.log('');
    console.log('Example:');
    console.log('  node gemini-validate.js ../OLD/src/screens/parent/NewParentDashboard.tsx security');
    process.exit(0);
  }

  const filePath = args[0];
  const focus = args[1] || 'all';

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const codeContent = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  const lines = codeContent.split('\n').length;

  const context = `
**Project Context:**
- Framework: React Native with TypeScript
- State Management: TanStack Query (React Query)
- Database: Supabase with Row Level Security
- Navigation: React Navigation (Native Stack)
- UI Components: Custom library with Material Design 3

**Critical Constraints:**
- NO package modifications allowed (no npm install)
- NO mock data allowed (must use real Supabase queries)
- MUST use BaseScreen wrapper for all screens
- MUST track analytics events
- MUST use safe navigation patterns
- MUST use nullish coalescing (??) for numeric values

**File Information:**
- Name: ${fileName}
- Lines: ${lines}
- Type: React Native Screen Component
`;

  validateCode(codeContent, context, focus)
    .then(() => {
      console.error('\n✅ Validation complete!');
    })
    .catch(error => {
      console.error('❌ Validation failed:', error.message);
      process.exit(1);
    });
}

module.exports = { validateCode };
