#!/bin/bash
echo "🔄 Full App Rebuild - This will take a few minutes"
echo ""

echo "1️⃣ Stopping all React Native processes..."
killall node 2>/dev/null || pkill -f node 2>/dev/null || taskkill //F //IM node.exe 2>/dev/null || true

echo "2️⃣ Clearing Metro cache..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-map-* 2>/dev/null || true

echo "3️⃣ Clearing Android build cache..."
cd android
./gradlew clean 2>/dev/null || true
cd ..
rm -rf android/app/build

echo "4️⃣ Clearing watchman (if available)..."
watchman watch-del-all 2>/dev/null || true

echo ""
echo "✅ Cache cleared! Now run these commands in separate terminals:"
echo ""
echo "Terminal 1:"
echo "  npx react-native start --reset-cache"
echo ""
echo "Terminal 2 (after Metro starts):"
echo "  npx react-native run-android"
echo ""
