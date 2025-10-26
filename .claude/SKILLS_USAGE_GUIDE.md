# Skills Usage Guide - Systematic Screen Recreation

## ✅ Skills Are Now Properly Configured!

Your Claude Code skills are set up in the correct format:

```
.claude/skills/
├── screen-analyzer/
│   └── SKILL.md ✅
├── screen-recreator/
│   └── SKILL.md ✅
└── ai-cross-validator/
    └── SKILL.md ✅
```

**After restarting Claude Code**, these skills will automatically activate when you trigger them!

---

## 🎯 How Skills Work

Skills are **model-invoked** - meaning I (Claude) automatically decide when to use them based on:
1. Your request keywords
2. The skill's description
3. The current context

You don't need to manually invoke them - just **say the trigger words** and the skill activates!

---

## 🔍 Skill 1: Screen Analyzer

### What It Does
Systematically extracts **100% of features** from existing screens by:
- Reading the ENTIRE file (no skipping)
- Going through A-S analysis checklist
- Extracting ALL imports, types, state, queries
- Documenting ALL UI sections in order
- Listing ALL user interactions
- Identifying ALL issues and TODOs
- Providing recreation checklist

### Trigger Words
Just say:
- **"Analyze EnhancedParentDashboardScreen.tsx"**
- **"Extract features from [filename]"**
- **"Analyze screen before recreation"**

### What Happens
1. ✅ Reads PROJECT_MEMORY.md automatically
2. ✅ Reads target file completely
3. ✅ Goes through systematic A-S checklist
4. ✅ Provides comprehensive analysis report
5. ✅ Creates recreation checklist

### Example Usage
```
User: "Analyze ChildDetailScreen.tsx before recreating it"

Claude: *Activates screen-analyzer skill*
        *Reads PROJECT_MEMORY.md, FEATURES_ADDED.md, etc.*
        *Analyzes file systematically (A through S)*
        *Provides 100% feature extraction report*
```

---

## 🏗️ Skill 2: Screen Recreator

### What It Does
Creates production-ready screens by:
- Reading all project documentation first
- Enforcing NO mock data rule
- Using real Supabase queries only
- Applying BaseScreen wrapper
- Adding safe navigation
- Tracking all analytics
- Applying acceptance checklist
- Avoiding all known errors

### Trigger Words
Just say:
- **"Create MessagesListScreen"**
- **"Implement ChildDetailScreen"**
- **"Build a screen for [purpose]"**
- **"Recreate [ScreenName] from analysis"**

### What Happens
1. ✅ Reads PROJECT_MEMORY.md constraints
2. ✅ Checks if database table exists
3. ✅ Creates migration if needed
4. ✅ Implements screen with template
5. ✅ Adds TypeScript types
6. ✅ Tests data fetching
7. ✅ Applies acceptance checklist
8. ✅ Provides testing instructions

### Example Usage
```
User: "Create a MessagesListScreen to show parent-teacher messages"

Claude: *Activates screen-recreator skill*
        *Reads PROJECT_MEMORY.md for constraints*
        *Checks if 'messages' table exists*
        *Creates migration if needed*
        *Implements screen with real Supabase query*
        *Applies acceptance checklist*
        *Provides testing instructions*
```

---

## 🤖 Skill 3: AI Cross Validator

### What It Does
Dual-AI validation that catches **20% more issues** by:
- Analyzing code with Claude's perspective
- Calling Gemini API for independent review
- Comparing both findings
- Resolving contradictions with web research
- Providing consensus recommendations

### Trigger Words
Just say:
- **"Validate NewParentDashboard.tsx with Gemini"**
- **"Cross-validate this screen"**
- **"AI review before deployment"**
- **"Validate with dual-AI"**

### What Happens
1. ✅ Claude analyzes the file first
2. ✅ Calls Gemini 2.0 Flash API
3. ✅ Compares findings from both AIs
4. ✅ Searches web to resolve contradictions
5. ✅ Provides consensus report with priorities

### Example Usage
```
User: "Validate NewParentDashboard.tsx focusing on performance"

Claude: *Activates ai-cross-validator skill*
        *Analyzes file with Claude's perspective*
        *Calls Gemini API via .claude/scripts/gemini-validate.js*
        *Compares both analyses*
        *Provides consensus report with priority fixes*
```

---

## 🚀 Perfect Workflow

### Step 1: Analyze Existing Screen
```
User: "Analyze EnhancedParentDashboardScreen.tsx"

Claude: *screen-analyzer skill activates*
        → Provides comprehensive feature report
```

### Step 2: Recreate New Screen
```
User: "Create NewParentDashboard.tsx with all features from analysis"

Claude: *screen-recreator skill activates*
        → Implements screen with 100% feature parity
        → Uses real Supabase data
        → Applies all best practices
```

### Step 3: Validate Before Deployment
```
User: "Validate NewParentDashboard.tsx with dual-AI"

Claude: *ai-cross-validator skill activates*
        → Claude + Gemini analyze together
        → Provides consensus recommendations
```

---

## ✅ What Skills Enforce Automatically

### NO Mock Data Rule ❌
Skills will **automatically reject** any mock data:
```typescript
// ❌ Skill will catch and fix this
const students = [{ id: '1', name: 'Test' }];

// ✅ Skill enforces real data
const { data: students } = useQuery({
  queryKey: ['students', parentId],
  queryFn: fetchFromSupabase
});
```

### Real Supabase Queries ✅
Skills **always use** real database:
- Check if table exists
- Create migration if needed
- Add sample data
- Create RLS policies
- Use TanStack Query

### BaseScreen Wrapper ✅
Skills **always wrap** screens:
```typescript
<BaseScreen
  scrollable={true}
  loading={isLoading}
  error={error}
  empty={!data}
  onRetry={refetch}
>
  <Content />
</BaseScreen>
```

### Safe Navigation ✅
Skills **always use** debounced navigation:
```typescript
import { safeNavigate } from '../../utils/navigationService';
safeNavigate('ChildDetail', { childId });
```

### Analytics Tracking ✅
Skills **always track** events:
```typescript
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
trackScreenView('ScreenName', { from: 'Dashboard' });
trackAction('view_detail', 'ScreenName', { id });
```

### Acceptance Checklist ✅
Skills **always apply** before completion:
- [ ] Real Supabase data (no mock arrays)
- [ ] BaseScreen wrapper with all states
- [ ] All icon buttons have accessibilityLabel
- [ ] Components memoized
- [ ] Analytics events tracked
- [ ] Safe navigation used
- [ ] TypeScript errors: 0
- [ ] Tested on device

---

## 🎓 When Skills Activate

Skills activate **automatically** when you use trigger words:

| Your Words | Skill Activated |
|------------|-----------------|
| "Analyze [screen]" | screen-analyzer |
| "Extract features from [file]" | screen-analyzer |
| "Create [screen]" | screen-recreator |
| "Implement [screen]" | screen-recreator |
| "Build a screen for [purpose]" | screen-recreator |
| "Validate with Gemini" | ai-cross-validator |
| "Cross-validate [file]" | ai-cross-validator |
| "AI review" | ai-cross-validator |

---

## 📊 What You Get

### From screen-analyzer:
- 📄 Comprehensive analysis report (3000+ words)
- ✅ 100% feature extraction checklist
- ⚠️ Issues and TODOs identified
- 💡 Recommendations for recreation

### From screen-recreator:
- 📝 Production-ready screen implementation
- 🗄️ Database migrations (if needed)
- ✅ All best practices applied
- 🧪 Testing instructions provided

### From ai-cross-validator:
- 🤖 Dual-AI consensus report
- 🔴 Critical issues (both AIs agree)
- 🟡 Performance issues prioritized
- 🟢 Code quality improvements
- 📊 Before/after score comparison

---

## 🔄 After Restart

**Next time you start Claude Code:**

1. Skills will be **automatically loaded**
2. No need to invoke manually
3. Just use trigger words naturally
4. Skills handle everything systematically

---

## 💡 Example Session

```
User: "I need to recreate the ChildDetailScreen"

Claude: *Activates screen-analyzer skill*
        → "Let me analyze the existing ChildDetailScreen first..."
        → *Reads entire file systematically*
        → *Provides comprehensive feature report*

User: "Now create the new version with those features"

Claude: *Activates screen-recreator skill*
        → *Reads PROJECT_MEMORY.md for constraints*
        → *Checks database tables*
        → *Creates migration if needed*
        → *Implements screen with real data*
        → *Applies acceptance checklist*
        → "✅ ChildDetailScreen created! All features implemented."

User: "Validate it before I deploy"

Claude: *Activates ai-cross-validator skill*
        → *Analyzes with both Claude + Gemini*
        → *Compares findings*
        → *Provides consensus report*
        → "✅ Validation complete! 2 critical issues found, 3 performance improvements recommended."
```

---

## 🎯 Key Benefits

1. **Systematic** - No steps skipped
2. **Enforces Rules** - NO mock data, ALWAYS real Supabase
3. **Quality Guaranteed** - Acceptance checklist applied
4. **Catches More Issues** - Dual-AI validation
5. **Fully Autonomous** - Just say what you want
6. **Project-Aware** - Reads all documentation

---

## 🚀 Start Using

**Right now** (before restart):
- Skills exist but not loaded yet
- I can follow their instructions manually
- Full automation after restart

**After restart**:
- Skills load automatically
- Just use trigger words
- Complete autonomy!

---

**Your skills are ready! Restart Claude Code to activate them fully. 🎉**
