# 🔄 Force Full Rebuild - Fix Old Dashboard Issue

You're seeing the old dashboard because the app hasn't fully rebuilt with the new navigation.

---

## 🚀 **Complete Rebuild Steps (Do This)**

### **Step 1: Stop Everything**
```bash
# Stop Metro bundler (Ctrl+C in Metro terminal)
# Stop any running emulators/devices
```

### **Step 2: Clear ALL Caches**
```bash
cd C:/PC/OLD

# Clear Metro cache
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*

# Clear Android build cache
cd android
./gradlew clean
cd ..
rm -rf android/app/build

# Clear watchman (if you have it)
watchman watch-del-all
```

### **Step 3: Start Fresh Metro**
```bash
cd C:/PC/OLD
npx react-native start --reset-cache
```

### **Step 4: Rebuild App (in NEW terminal)**
```bash
cd C:/PC/OLD

# Uninstall old app from device first
adb uninstall com.old

# Then install fresh
npx react-native run-android
```

---

## 🎯 **Quick Windows Commands**

If on Windows, use these instead:

```powershell
cd C:\PC\OLD

# Clear caches
rmdir /s /q node_modules\.cache
rmdir /s /q android\app\build

# Clean Android
cd android
gradlew clean
cd ..

# Uninstall old app
adb uninstall com.old

# Start Metro in one terminal
npx react-native start --reset-cache

# Build in another terminal
npx react-native run-android
```

---

## ✅ **Verification Steps**

After rebuild, the **NEW TeacherHomeScreen** should show:

### **What you SHOULD see:**
```
┌─────────────────────────────────────────────┐
│ [<] Teacher Home        [🔔] [👤]           │
│     Welcome, {Name}                         │
│     [All classes ▼]                         │
└─────────────────────────────────────────────┘

Then 6 cards below:
1. Urgent Summary (light blue background)
2. Quick Actions (4 buttons)
3. Today's Classes
4. Attendance
5. Messages
6. Tasks
```

### **What you should NOT see:**
- Old multi-tab dashboard (dashboard/attendance/communication tabs)
- "Phase 29-32" or "Phase 85-88" text
- Old "NewTeacherDashboard" interface

---

## 🔍 **How to Confirm It's the NEW Screen**

Look for these indicators:

1. ✅ **App Bar says "Teacher Home"** (not "Teacher Dashboard")
2. ✅ **Class switcher chip** at top right `[All classes ▼]`
3. ✅ **6 separate cards** (not tabbed interface)
4. ✅ **Material Design 3 colors** (blue badges, clean cards)
5. ✅ **No phase comments** in any visible text

---

## 🆘 **Still Seeing Old Dashboard?**

### Check 1: Verify Import
```bash
cd C:/PC/OLD
grep -n "TeacherHomeScreen" src/navigation/TeacherNavigator.tsx
```

Should show:
```
14:import TeacherHomeScreen from '../screens/teacher/TeacherHomeScreen';
52:        name="TeacherHome"
53:        component={TeacherHomeScreen}
```

### Check 2: Verify File Exists
```bash
ls -la src/screens/teacher/TeacherHomeScreen.tsx
```

Should show the file exists.

### Check 3: Check Metro Logs
In Metro terminal, look for:
```
Loading TeacherHomeScreen
```

If you see `Loading NewTeacherDashboard` instead, the navigation didn't update.

### Check 4: Nuclear Option - Complete Reinstall
```bash
cd C:/PC/OLD

# Stop everything
adb shell am force-stop com.old

# Uninstall completely
adb uninstall com.old

# Clear ALL caches
rm -rf node_modules/.cache
rm -rf android/app/build
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*

# Restart Metro
npx react-native start --reset-cache

# Full rebuild (in new terminal)
npx react-native run-android
```

---

## 📱 **After Rebuild Checklist**

- [ ] Metro bundler shows: "Loading TeacherHomeScreen"
- [ ] App opens to Home tab
- [ ] Header says "Teacher Home" (not "Teacher Dashboard")
- [ ] See class switcher chip `[All classes ▼]`
- [ ] See 6 cards (not tabbed interface)
- [ ] No "Phase X" text visible

---

## 🎉 **Expected Result**

After complete rebuild, you'll see the **beautiful new Material Design 3 home screen** with:
- Clean app bar with class context switcher
- Urgent summary card (light blue)
- Quick action buttons
- Today's schedule
- Attendance status
- Recent messages
- Pending tasks

No more old dashboard! 🚀

---

**TIP:** If you're in a hurry, the absolute fastest way:
```bash
# One terminal:
cd C:/PC/OLD && rm -rf node_modules/.cache && npx react-native start --reset-cache

# Another terminal:
adb uninstall com.old && npx react-native run-android
```

This should work 99% of the time!
