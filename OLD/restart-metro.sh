#!/bin/bash
# Quick script to restart Metro with cache clearing

echo "🛑 Stopping Metro bundler..."
pkill -f metro
pkill -f "react-native start"

echo "🧹 Clearing Metro cache..."
rm -rf node_modules/.cache
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true

echo "✨ Starting Metro with fresh cache..."
npx react-native start --reset-cache
