# Parent Dashboard Project - Root Directory

## 📁 Project Structure

```
C:\PC\
├── CLAUDE.md                    # ⭐ Project instructions (read by Claude Code)
├── package.json                 # Dependencies (locked - no modifications)
├── package-lock.json            # Dependency lock file
├── tsconfig.json                # TypeScript configuration
├── jest.config.js               # Jest test configuration
│
├── OLD/                         # 🚀 Main working directory
│   ├── src/                     # Source code
│   │   ├── screens/parent/      # Parent screens (26 new + 9 old)
│   │   ├── navigation/          # Navigation setup
│   │   ├── services/api/        # API services
│   │   ├── utils/               # Utilities
│   │   └── types/               # TypeScript types
│   │
│   ├── backup/                  # Complete backup (136 files)
│   │
│   ├── Essential Documentation: # 📚 Read these
│   │   ├── README.md                              # Documentation index
│   │   ├── PROJECT_MEMORY.md                      # Start here every session
│   │   ├── SESSION_ERRORS_AND_FIXES.md           # Today's errors & solutions
│   │   ├── PARENT_DASHBOARD_RECREATION_PLAN.md   # Implementation roadmap
│   │   ├── USAGE_GUIDE.md                        # How-to guide
│   │   ├── FEATURES_ADDED.md                     # Feature inventory
│   │   ├── ACCEPTANCE_CHECKLIST.md               # Quality checklist
│   │   └── GRADUAL_REPLACEMENT_CONFIRMED.md      # Strategy
│   │
│   └── docs/                    # Archived documentation (70 files)
│
└── docs/                        # Root level archived files
    ├── archived/                # Archived MD files (33 files)
    └── sql/                     # SQL migration files (3 files)
```

---

## ⭐ Quick Start

### For Development Work:
```bash
cd C:\PC\OLD\
# All work happens in OLD/ directory
```

### For Documentation:
```bash
# Read essential docs in OLD/
1. PROJECT_MEMORY.md           # Critical context
2. SESSION_ERRORS_AND_FIXES.md # Known errors & fixes
3. USAGE_GUIDE.md              # How to implement
```

### For Configuration:
```bash
# Essential config files (in PC/ root)
- CLAUDE.md         # Claude Code instructions
- package.json      # Dependencies (locked)
- tsconfig.json     # TypeScript config
- jest.config.js    # Test config
```

---

## 🚫 Critical Rules

### NO Package Modifications
```bash
# ❌ NEVER run these commands:
npm install <package>
npm update
npm uninstall
yarn add

# ✅ Working directory: C:\PC\OLD\
# ✅ Use existing packages only
```

### File Organization
- **Keep clean:** Essential files only in root
- **Archive:** Historical docs in docs/archived/
- **Work:** All code work in OLD/ directory
- **Read:** Essential docs in OLD/ root

---

## 📊 Current Status

### Completed ✅
- Phase 1: Overview Tab
- Phase 2: ChildrenListScreen & ChildDetailScreen
- Navigation fixes (6 errors resolved)
- Documentation organization

### In Progress ⏳
- Phase 3: Academic screens

### Next Steps 📋
1. Create student_grades table in Supabase
2. Complete SubjectDetailScreen
3. Implement remaining Phase 3 screens

---

## 📂 File Organization Details

### Essential Config Files (PC/ root):
```
CLAUDE.md           - Claude Code project instructions
package.json        - Dependencies (locked)
package-lock.json   - Dependency lock
tsconfig.json       - TypeScript configuration
jest.config.js      - Test configuration
```

### Working Directory (OLD/):
```
src/                - All source code
backup/             - Complete backup (136 files)
README.md           - Documentation index
PROJECT_MEMORY.md   - Critical context
SESSION_ERRORS_AND_FIXES.md - Error reference
[5 more essential docs]
docs/               - Archived documentation (70 files)
```

### Archived Files (docs/):
```
archived/           - 33 archived MD files
sql/                - 3 SQL migration files
```

---

## 🔗 Important Links

### Documentation
- **Essential Docs:** `C:\PC\OLD\` (8 files)
- **Archived Docs:** `C:\PC\OLD\docs\` (70 files)
- **Root Archived:** `C:\PC\docs\archived\` (33 files)

### Source Code
- **Screens:** `C:\PC\OLD\src\screens\parent\`
- **Navigation:** `C:\PC\OLD\src\navigation\`
- **Services:** `C:\PC\OLD\src\services\api\`

### Database
- **SQL Files:** `C:\PC\docs\sql\`
- **Migrations:** Available for reference

---

## 📖 Documentation Index

### Must Read (in OLD/):
1. **PROJECT_MEMORY.md** - Start here every session
2. **SESSION_ERRORS_AND_FIXES.md** - Avoid known errors
3. **README.md** - Documentation guide

### Implementation Guides (in OLD/):
4. **PARENT_DASHBOARD_RECREATION_PLAN.md** - Roadmap
5. **USAGE_GUIDE.md** - Code examples
6. **ACCEPTANCE_CHECKLIST.md** - Quality gate

### Reference (in OLD/):
7. **FEATURES_ADDED.md** - Feature inventory
8. **GRADUAL_REPLACEMENT_CONFIRMED.md** - Strategy

---

## 🎯 Daily Workflow

1. **Start Session:**
   ```bash
   cd C:\PC\OLD\
   # Read PROJECT_MEMORY.md
   ```

2. **Implement:**
   ```bash
   # Follow USAGE_GUIDE.md patterns
   # Check SESSION_ERRORS_AND_FIXES.md
   ```

3. **Complete:**
   ```bash
   # Apply ACCEPTANCE_CHECKLIST.md
   # Test thoroughly
   ```

---

**Remember:** All active work happens in `C:\PC\OLD\` directory! 🚀
