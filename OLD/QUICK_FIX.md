# Quick Fix - Metro Cache Issue

The error is because Metro bundler hasn't detected the new files yet.

## Solution (Run these commands):

### **Option 1: Full Reset (Recommended)**
```bash
cd C:/PC/OLD

# Kill all Metro processes
pkill -f metro

# Clear all caches
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*

# Restart Metro with fresh cache
npx react-native start --reset-cache
```

### **Option 2: Quick Restart**
```bash
cd C:/PC/OLD

# Just stop Metro (Ctrl+C in Metro terminal)
# Then restart:
npx react-native start --reset-cache
```

### **Option 3: Windows Alternative**
If on Windows and above doesn't work:
```bash
cd C:/PC/OLD

# Delete cache folders manually
rmdir /s /q node_modules\.cache
rmdir /s /q %TEMP%\metro-*
rmdir /s /q %TEMP%\haste-map-*

# Restart Metro
npx react-native start --reset-cache
```

---

## After Restarting Metro

In a **new terminal**, rebuild the app:

```bash
cd C:/PC/OLD
npx react-native run-android
```

The app should now load successfully!

---

## Why This Happened

Metro bundler caches file locations. When we created new files in `src/features/`, Metro didn't know they existed until we:
1. Cleared the cache (`--reset-cache`)
2. Restarted the bundler

This is a common React Native issue when adding new directories or files.

---

**Expected result after fix:** App loads and shows TeacherHomeScreen!
