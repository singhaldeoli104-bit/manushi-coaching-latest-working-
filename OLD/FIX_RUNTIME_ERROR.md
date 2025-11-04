# Fix "Runtime Not Ready" Error

**Error**: `TypeError: Cannot read property 'titleLarge' of undefined`
**Cause**: Metro bundler cache is stale, app hasn't fully rebuilt

---

## 🔧 Complete Fix (Windows)

Run these commands **in order**:

### Step 1: Stop Everything
```bash
# Stop Metro (Ctrl+C in Metro terminal)
# Stop app on device
adb shell am force-stop com.old
```

### Step 2: Clear ALL Caches
```bash
cd C:/PC/OLD

# Clear Metro cache
rmdir /s /q node_modules\.cache
del /s /q %TEMP%\metro-*
del /s /q %TEMP%\haste-map-*

# Clear Android build cache
cd android
gradlew clean
cd ..
rmdir /s /q android\app\build
```

### Step 3: Uninstall Old App
```bash
adb uninstall com.old
```

### Step 4: Start Fresh Metro (Terminal 1)
```bash
cd C:/PC/OLD
npx react-native start --reset-cache
```

### Step 5: Build Fresh (Terminal 2 - wait for Metro to fully start)
```bash
cd C:/PC/OLD
npx react-native run-android
```

---

## 🐧 Alternative: Linux/Mac Commands

```bash
cd /c/PC/OLD

# Clear caches
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*
rm -rf android/app/build

# Clean Android
cd android && ./gradlew clean && cd ..

# Uninstall
adb uninstall com.old

# Terminal 1: Start Metro
npx react-native start --reset-cache

# Terminal 2: Build app
npx react-native run-android
```

---

## ✅ Expected Result

After the rebuild, the app should load successfully and show:
- **TeacherHomeScreen** with real data
- Welcome, Rajesh Sharma
- 3 classes in Today's Schedule
- Attendance, Messages, and Tasks cards with data
- NO "runtime not ready" errors

---

## 🆘 If Still Failing

1. Check Metro bundler logs for "Loading..." messages
2. Check logcat for any remaining errors:
   ```bash
   adb logcat | grep -i "reactnative\|error"
   ```
3. Verify typography file exists:
   ```bash
   ls -la src/theme/typography.ts
   ```

---

**This should completely resolve the runtime error!**
