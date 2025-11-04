# Component Test Screen - Testing Instructions

## 🚀 How to Access the Test Screen

### Option 1: Navigate from Student Dashboard (Recommended)
Since the test screen is in the HomeStack, you can navigate to it programmatically:

1. **Open Student Dashboard** (main screen after login)
2. **Use React Native Dev Menu** (shake device or `adb shell input keyevent 82`)
3. **Or use ADB command to navigate directly:**
   ```bash
   # Open the test screen directly
   adb shell am start -n com.old/.MainActivity -e initialRoute ComponentTest
   ```

### Option 2: Add Temporary Navigation Button
I can add a button to the StudentDashboard that navigates to ComponentTest screen.

### Option 3: Use Deep Link
```bash
# If deep linking is configured
adb shell am start -W -a android.intent.action.VIEW -d "myapp://ComponentTest"
```

## 📋 What to Test (Systematic Checklist)

### **ATOMS (3 Components)**

#### 1. Button Component
- [ ] **Filled Buttons**: Tap Small, Medium, Large - verify ripple effect (0.12 opacity)
- [ ] **Outlined Button**: Verify 1dp border, tap to test state layer
- [ ] **Text Button**: Tap to verify no background, only text ripple
- [ ] **Tonal Button**: Verify background tint color
- [ ] **Elevated Button**: Verify shadow elevation visible
- [ ] **Disabled State**: Verify opacity 0.38, no tap response
- [ ] **Typography**: Verify labelLarge (14px) for medium/large, labelMedium (12px) for small

#### 2. Card Component
- [ ] **Elevated Card**: Verify shadow visible (elevation 1)
- [ ] **Filled Card**: Verify SurfaceVariant background color
- [ ] **Outlined Card**: Verify 1dp border visible
- [ ] **Card with Header**: Verify title uses titleMedium, subtitle uses bodyMedium
- [ ] **Corner Radius**: Verify 12dp rounded corners

#### 3. Badge Component
- [ ] **Error Badge (Small)**: Red background, verify count "5"
- [ ] **Warning Badge (Standard)**: Orange background, verify count "12"
- [ ] **Success Badge (Large)**: Green background, verify count "99"
- [ ] **Info Badge**: Blue background, verify "99+" for count 150
- [ ] **Typography**: Verify labelSmall (11px) text size

### **MOLECULES (6 Components)**

#### 4. SearchBar Component
- [ ] Type text, verify bodyLarge (16px) font
- [ ] Verify 28dp fully rounded shape
- [ ] Tap clear button (X), verify text clears
- [ ] Verify helper text shows current query
- [ ] Test focus/unfocus states

#### 5. Tabs Component
- [ ] Tap "All", "Active", "Completed" tabs
- [ ] Verify active tab has Primary color
- [ ] Verify inactive tabs have OnSurfaceVariant color
- [ ] Verify labelLarge (14px) typography
- [ ] Verify smooth transition animation

#### 6. EmptyState Component
- [ ] Verify 32dp icon size (📭 emoji)
- [ ] Verify titleMedium for "No Items Found"
- [ ] Verify bodyMedium for description text
- [ ] Verify centered alignment

#### 7. LoadingState Component
- [ ] **Spinner variant**: Verify spinner animating
- [ ] **Inline variant**: Verify horizontal layout
- [ ] Verify bodyMedium (14px) for loading text
- [ ] Verify all text uses correct typography

#### 8. Modal Component
- [ ] Tap "Open Modal" button
- [ ] Verify modal slides in with elevation 3
- [ ] Verify backdrop opacity (scrim)
- [ ] Verify 28dp corner radius
- [ ] Tap "Close" button, verify modal dismisses
- [ ] Tap outside modal, verify it closes

#### 9. BottomSheet Component
- [ ] Tap "Open Bottom Sheet" button
- [ ] Verify slide-up animation
- [ ] Verify elevation 1 shadow
- [ ] Verify titleLarge (22px) for title
- [ ] Drag down handle to close

### **NAVIGATION (3 Components)**

#### 10. StudentTopBar Component
- [ ] Verify "Component Test Lab" title uses titleLarge (22px)
- [ ] Verify 64dp height
- [ ] Tap hamburger menu (3 dots on right)
- [ ] Tap "Reset All" menu item
- [ ] Tap "About" menu item
- [ ] Verify menu uses labelLarge (14px)
- [ ] Verify state layer on menu items (0.12 opacity)

### **ORGANISMS (7 Live Class Components)**

#### 11. LiveClassControls Component
- [ ] **Mic Toggle**: Tap to toggle ON/OFF, verify icon change
- [ ] **Camera Toggle**: Tap to toggle ON/OFF, verify icon change
- [ ] **Raise Hand**: Tap to raise/lower hand, verify pulse animation when raised
- [ ] **Leave Button**: Tap to open confirmation modal
- [ ] **Recording Indicator**: Verify red blinking dot with "REC" text
- [ ] **Connection Quality**: Verify "Good" status with 2 bars
- [ ] **Platform Guard**: Verify vibration only works on Android (no iOS crash)
- [ ] **State Layers**: Verify pressed state opacity 0.88
- [ ] Verify helper text shows current states

#### 12. FilterPanel Component
- [ ] Tap "Open Filter Panel" button
- [ ] Verify slide-in from right animation
- [ ] Verify 320dp panel width
- [ ] **Status Filter (Single-select)**: Tap "Active", verify radio selection
- [ ] **Priority Filter (Multi-select)**: Tap multiple options, verify checkboxes
- [ ] Tap "Reset" button, verify all selections clear
- [ ] Tap "Apply" button, verify alert shows selected filters
- [ ] Tap X button or backdrop to close

### **MD3 FEATURES CHECKLIST**

#### Typography Verification
- [ ] Display Large: Large headings
- [ ] Headline Medium: Section titles
- [ ] Title Large: Top bar, modal titles (22px)
- [ ] Body Large: Search input (16px)
- [ ] Label Large: Buttons, menu items (14px)
- [ ] Label Small: Badges, helper text (11px)

#### State Layer Verification
- [ ] Press any button: Verify opacity 0.88 (1 - 0.12)
- [ ] Disabled button: Verify opacity 0.38
- [ ] Menu items: Verify ripple effect on tap

#### Spacing Verification (4dp Grid)
- [ ] Button padding: 16dp horizontal, 12dp vertical
- [ ] Card padding: 16dp all sides
- [ ] Section spacing: 24dp between sections
- [ ] Icon gaps: 8dp between badge icons

#### Elevation Verification
- [ ] Elevated card: Verify subtle shadow
- [ ] Modal: Verify stronger shadow (elevation 3)
- [ ] Bottom sheet: Verify light shadow (elevation 1)

#### Platform Features
- [ ] Haptic feedback: Only vibrates on Android
- [ ] No iOS crashes from Android-only APIs

## 🐛 Issues to Look For

### Critical Issues
- [ ] App crashes on any interaction
- [ ] TypeScript errors in Metro console
- [ ] Components not rendering at all
- [ ] Navigation broken (can't navigate to test screen)

### MD3 Compliance Issues
- [ ] Wrong font sizes (not matching MD3 specs)
- [ ] Wrong state layer opacities
- [ ] Spacing not on 4dp grid
- [ ] Wrong icon sizes (not 18dp/24dp/32dp/48dp)
- [ ] Elevation shadows not visible

### Visual Issues
- [ ] Text overflow or truncation
- [ ] Misaligned components
- [ ] Wrong colors used
- [ ] Animations janky or broken
- [ ] Touch targets too small (<48dp)

### Performance Issues
- [ ] Slow animations
- [ ] Laggy scrolling
- [ ] Memory warnings in logcat
- [ ] Metro bundle reload issues

## 📱 Testing Commands

```bash
# View real-time logs
adb logcat | grep -i "error\|exception\|crash"

# Check Metro bundler logs
# (Already running in your terminal)

# Reload app after code changes
adb shell input text "RR"

# Clear app data and restart
adb shell pm clear com.old && adb shell am start -n com.old/.MainActivity

# Take screenshot
adb exec-out screencap -p > component-test-screenshot.png

# Record screen video
adb shell screenrecord /sdcard/component-test.mp4
# (Stop with Ctrl+C, then pull: adb pull /sdcard/component-test.mp4)
```

## ✅ Expected Results

### All Tests Pass:
- ✅ No crashes or errors
- ✅ All 25 components render correctly
- ✅ Typography matches MD3 specs
- ✅ State layers use correct opacities
- ✅ Spacing follows 4dp grid
- ✅ Animations smooth (60fps)
- ✅ Platform guards prevent iOS crashes
- ✅ Touch targets minimum 48dp
- ✅ All interactive elements respond to touch

### Test Log Format:
```
Component: Button
Variant: Filled Small
Status: ✅ PASS
Notes: State layer opacity correct (0.88), Typography labelMedium applied

Component: LiveClassControls
Feature: Haptic Feedback
Status: ✅ PASS
Notes: Platform.OS guard working, vibration Android-only
```

## 🎯 Quick Start

**FASTEST WAY TO TEST:**

1. **App should already be running on your device**
2. **Shake device or run:** `adb shell input keyevent 82` (opens Dev Menu)
3. **In Dev Menu, reload:** Press "Reload" or type `RR` in adb:
   ```bash
   adb shell input text "RR"
   ```
4. **Navigate to test screen programmatically:**

   Since ComponentTest is in the navigation stack, you can:
   - Add a temporary button to StudentDashboard (I can do this)
   - OR use React Navigation DevTools
   - OR manually navigate via code

**Want me to add a "Component Test" button to the Student Dashboard for easy access?**
