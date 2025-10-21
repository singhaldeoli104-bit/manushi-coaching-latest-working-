# Fix: Metro Bundler Has Cached Old Broken Version

## The Problem:
Metro bundler has CACHED the broken version before we fixed it. Just pressing 'r' to reload won't work because it's serving cached files.

## ✅ SOLUTION - Clear Cache & Restart Fresh:

### Step 1: Stop EVERYTHING
In PowerShell, run:
```powershell
# Kill all Node processes (stops Metro)
taskkill /F /IM node.exe /T

# Wait 5 seconds
timeout /t 5
```

### Step 2: Clear Metro Cache
```powershell
cd C:\PC\old

# Delete node_modules/.cache
rm -r -fo node_modules/.cache

# Clear metro cache
npx react-native start --reset-cache
```

### Step 3: In ANOTHER PowerShell window:
```powershell
cd C:\PC\old

# Uninstall old app from device
adb uninstall com.manushicoaching

# Reinstall fresh
npm run android:dev
```

---

## OR - USE THIS SINGLE COMMAND:

### One-Step Fix (Run in PowerShell):
```powershell
cd C:\PC\old
taskkill /F /IM node.exe /T ; Start-Sleep 3 ; Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue ; Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\PC\old ; npx react-native start --reset-cache" ; Start-Sleep 10 ; adb uninstall com.manushicoaching ; npm run android:dev
```

---

## Manual Step-by-Step (If above doesn't work):

### Terminal 1:
```powershell
cd C:\PC\old
npx react-native start --reset-cache
```
Leave this running. You should see "Metro bundler ready"

### Terminal 2:
```powershell
cd C:\PC\old

# Uninstall old app
adb uninstall com.manushicoaching

# Install fresh
npm run android:dev
```

---

## Why This is Needed:

1. **Metro caches transformed JavaScript files**
2. **Even after fixing code, it serves old cached files**
3. **Pressing 'r' to reload just reloads FROM cache**
4. **We need to CLEAR cache and reinstall app completely**

---

## What Should Happen:

After following steps above:
1. Metro starts fresh with `--reset-cache`
2. App uninstalls completely
3. Fresh app installs with new code
4. App launches WITHOUT any cached code
5. **Should work now!** ✅

---

## If STILL Not Working:

The issue might not be cache. Run this to check actual runtime error:
```powershell
cd C:\PC\old\android
.\gradlew.bat installDevDebug
adb logcat -c
adb logcat | Select-String "ReactNative\|AndroidRuntime"
```

Then send me the EXACT error message you see.

---

**Status**: Cache clearing required
**Next**: Run one of the commands above
