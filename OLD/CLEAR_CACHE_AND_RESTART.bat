@echo off
echo ========================================
echo Clearing ALL React Native Caches
echo ========================================

echo.
echo Step 1: Stopping Metro Bundler...
taskkill /F /IM node.exe /T 2>nul

echo.
echo Step 2: Clearing Metro cache...
rd /s /q %TEMP%\metro-* 2>nul
rd /s /q %TEMP%\react-* 2>nul
rd /s /q %TEMP%\haste-map-* 2>nul

echo.
echo Step 3: Clearing React Native cache...
rd /s /q %LOCALAPPDATA%\Temp\react-native-* 2>nul

echo.
echo Step 4: Clearing watchman cache...
watchman watch-del-all 2>nul

echo.
echo Step 5: Clearing npm cache...
npm cache clean --force

echo.
echo Step 6: Restarting Metro with clean cache...
echo.
echo Now run: npm start -- --reset-cache
echo.
echo ========================================
echo Cache cleared! Ready for fresh start.
echo ========================================
pause
