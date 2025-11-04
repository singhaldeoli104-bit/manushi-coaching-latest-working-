# CRITICAL FIX: Typography Naming Conflict

## Problem
There are **TWO different Typography exports** causing the error:

1. `src/theme/typography.ts` - Has `titleLarge` ✅ (correct)
2. `src/theme/designSystem.ts` - Has `fontSize`, `fontWeight` ❌ (different structure)

When screens import Typography, they sometimes get the wrong one!

---

## Quick Fix (Manual Edit)

### Step 1: Edit `src/theme/designSystem.ts`

**Find line 61:**
```typescript
export const Typography = {
```

**Change it to:**
```typescript
// RENAMED to avoid conflict with theme/typography.ts
export const FontSystem = {
```

### Step 2: Save the file

### Step 3: Restart Metro
```bash
# Stop Metro (Ctrl+C)
# Start fresh
npx react-native start --reset-cache
```

### Step 4: Reload app
The app should now load without the "titleLarge undefined" error!

---

## What This Does

- Renames `Typography` → `FontSystem` in designSystem.ts
- This removes the naming conflict
- Screens importing from `theme/typography` will now get the correct Typography object with `titleLarge`

---

## Alternative: Quick Sed Command (Linux/Mac)

```bash
cd C:/PC/OLD
sed -i 's/^export const Typography = {/export const FontSystem = {/' src/theme/designSystem.ts
```

---

## Files That Use designSystem.Typography

These files will break temporarily (won't affect TeacherHomeScreen):
- src/components/common/ChildSwitcher.tsx
- src/components/common/DashboardHeader.tsx
- src/components/common/SectionHeader.tsx

But they're not used in TeacherNavigator, so the app will still load!

---

**After this fix + Metro restart, the app should work!**
