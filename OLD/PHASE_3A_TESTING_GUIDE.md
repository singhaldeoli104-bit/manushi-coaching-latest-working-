# Phase 3A: M3 Expressive Testing Guide

**Date:** 2025-11-01
**Purpose:** Device testing guide for all Phase 3A M3 Expressive components
**Required:** Android device connected via ADB

---

## Quick Start

### Step 1: Build and Install

```bash
# Navigate to project directory
cd C:/PC/OLD

# Build and install on Android device
npx react-native run-android
```

### Step 2: Launch M3E Test Screen

The app is configured to launch directly into the M3 Expressive Test Screen:
- `SHOW_M3E_TEST_DIRECTLY = true` in `App.tsx:36`
- Purple status bar indicates M3E test mode
- Scroll through all 6 test sections

---

## Testing Checklist

### Section 1: Button Animations + Haptics ✅

**What to Test:**
- [ ] **Press and hold** each button variant
- [ ] Feel **subtle scale down** to 98% (quick compression)
- [ ] Release and feel **bouncy spring back** to 100%
- [ ] Feel **haptic vibration** on release (selection pattern)
- [ ] Verify all 7 button states work:
  - Filled Large
  - Tonal Medium
  - Outlined Small
  - Text Button
  - Elevated
  - Loading (no interaction)
  - Disabled (no interaction)

**Expected Behavior:**
- Quick scale down on press (friction: 5, tension: 300)
- Slow, bouncy scale up on release (friction: 3, tension: 40)
- Single short vibration on release (10ms pulse)
- Animations run at 60fps (smooth, no jank)

**Pass Criteria:**
- ✅ All buttons respond with smooth animations
- ✅ Haptic feedback felt on press (not in simulator)
- ✅ Loading button shows spinner, disabled button doesn't respond
- ✅ No visual glitches or stuttering

---

### Section 2: IconButton Variants ✅

**What to Test:**
- [ ] Tap **all icon button sizes** (small, medium, large)
- [ ] Feel **lighter haptic** (impact_light vs selection)
- [ ] Verify **4 variants** render correctly:
  - Filled (primary background)
  - Filled Tonal (secondary container)
  - Outlined (border only)
  - Standard (transparent)
- [ ] Verify **loading state** (shows spinner)
- [ ] Verify **disabled state** (no interaction)

**Expected Behavior:**
- More pronounced scale (95% vs 98% for buttons)
- Lighter haptic feedback (5ms pulse vs 10ms)
- Smooth spring animation
- Circular shape maintained

**Pass Criteria:**
- ✅ All variants visually distinct
- ✅ Haptic feels lighter than regular buttons
- ✅ Animations smooth and responsive
- ✅ Loading and disabled states work

---

### Section 3: LoadingIndicator Variants ✅

**What to Test:**
- [ ] **Circular** - Standard spinning circle
- [ ] **Pulse** - Pulsing circle (scale 1.0 → 1.3, opacity 1.0 → 0.3)
- [ ] **Dots** - Three dots bouncing (staggered 150ms delay)
- [ ] **Linear Progress** - Horizontal bar at 60%
- [ ] **Linear Indeterminate** - Sliding animation left to right

**Expected Behavior:**
- All animations loop smoothly
- Pulse: 800ms cycle (800ms grow, 800ms shrink)
- Dots: 400ms up, 400ms down per dot
- Linear: Smooth slide animation

**Pass Criteria:**
- ✅ All 5 loading states animate correctly
- ✅ No stuttering or frame drops
- ✅ Linear progress shows 60% filled
- ✅ Indeterminate animation loops continuously

---

### Section 4: Skeleton Loaders ✅

**What to Test:**
- [ ] Tap "Hide/Show Skeletons" toggle button
- [ ] Verify **shimmer animation** (sweeps left to right)
- [ ] Test **basic shapes**:
  - Circle (48x48)
  - Rounded rectangle (100x48)
  - Text line (50% width)
- [ ] Test **pre-built layouts**:
  - SkeletonAvatar (64px circle)
  - SkeletonText (2 lines at 80%, 60%)
  - SkeletonCard (150px rounded)
  - SkeletonListItem (avatar + 2 text lines)
  - SkeletonPost (full card with header, image, text)

**Expected Behavior:**
- Shimmer opacity pulses from 0.3 → 0.6 → 0.3
- Animation duration: 1200ms default
- All shapes have proper border radius
- Background: SurfaceVariant color

**Pass Criteria:**
- ✅ Shimmer animation visible and smooth
- ✅ Toggle button hides/shows skeletons
- ✅ All shapes render with correct dimensions
- ✅ Pre-built layouts match descriptions

---

### Section 5: Shimmer Effects ✅

**What to Test:**
- [ ] Tap "Hide/Show Shimmer" toggle button
- [ ] Verify **ShimmerPlaceholder** (standalone 120px box)
- [ ] Verify **ShimmerList** (3 items with shimmer)
- [ ] Verify **Shimmer as Overlay** (shows content with shimmer on top)

**Expected Behavior:**
- Shimmer sweeps horizontally across container
- Translation: -100% to 200% (1200ms default)
- Gradient effect with opacity layers
- Overlay mode doesn't hide content

**Pass Criteria:**
- ✅ Shimmer animation sweeps smoothly
- ✅ Toggle button controls visibility
- ✅ Overlay mode shows content below shimmer
- ✅ ShimmerList shows multiple placeholders

---

### Section 6: Haptic Feedback Patterns ✅

**What to Test:**
- [ ] Tap each of the **7 haptic pattern buttons**:
  - **Selection** - 10ms single pulse
  - **Success** - 10ms, 50ms pause, 10ms (double pulse)
  - **Warning** - 10ms, 50ms, 10ms, 50ms, 10ms (triple pulse)
  - **Error** - 50ms, 30ms, 50ms (two longer pulses)
  - **Impact Light** - 5ms single pulse
  - **Impact Medium** - 15ms single pulse
  - **Impact Heavy** - 30ms single pulse

**Expected Behavior:**
- Each pattern has distinct vibration rhythm
- Success: Two quick taps
- Warning: Three quick taps
- Error: Two longer taps with pause
- Impact: Single tap (varying intensity)

**Pass Criteria:**
- ✅ All 7 patterns produce distinct vibrations
- ✅ Selection, success, warning, error clearly different
- ✅ Impact light/medium/heavy have varying durations
- ✅ No crashes or errors on haptic calls

**⚠️ Note:** Haptic feedback only works on real devices, **not simulators**

---

## Performance Testing

### FPS Monitoring (Android)

```bash
# Enable FPS monitor in Metro
# Press 'D' for dev menu → Toggle Performance Monitor

# Or use ADB
adb shell dumpsys gfxinfo com.old | grep "Total frames rendered"
```

**Target:** 60fps for all animations

**Expected FPS:**
- Button animations: 60fps
- Loading indicators: 60fps
- Skeleton shimmer: 60fps
- Shimmer effects: 60fps

### Memory Baseline

```bash
# Check memory usage
adb shell dumpsys meminfo com.old | grep "TOTAL:"
```

**Expected:** No significant memory increase from Phase 3A components

---

## Troubleshooting

### Issue: No haptic feedback felt

**Cause:** Running on simulator or vibration disabled
**Fix:**
1. Test on real Android device (not emulator)
2. Check device vibration settings (not muted)
3. Verify Vibration permission in AndroidManifest.xml

### Issue: Animations stuttering/laggy

**Cause:** JS thread overloaded or slow device
**Fix:**
1. Close other apps running in background
2. Enable Performance Monitor in dev menu
3. Check for JS errors in Metro console
4. Verify `useNativeDriver: true` is set (already done)

### Issue: Shimmer not visible

**Cause:** Shimmer color too similar to background
**Fix:**
1. Toggle "Hide/Show Shimmer" to restart animation
2. Check LightTheme.SurfaceVariant color contrast
3. Verify animation is running (not paused)

### Issue: TypeScript errors on build

**Cause:** New imports not recognized
**Fix:**
```bash
# Clear Metro cache
cd C:/PC/OLD
npx react-native start --reset-cache

# Clean and rebuild
cd android && ./gradlew clean
cd .. && npx react-native run-android
```

---

## Test Results Template

```markdown
## Phase 3A Test Results

**Date:** [DATE]
**Device:** [DEVICE MODEL]
**Android Version:** [VERSION]
**Tester:** [NAME]

### Section 1: Buttons ✅/❌
- [ ] Animations smooth
- [ ] Haptic feedback working
- [ ] All 7 states render correctly
- **Notes:**

### Section 2: IconButtons ✅/❌
- [ ] All variants render
- [ ] Lighter haptic felt
- [ ] Animations smooth
- **Notes:**

### Section 3: LoadingIndicators ✅/❌
- [ ] All 5 variants work
- [ ] Animations loop smoothly
- [ ] No stuttering
- **Notes:**

### Section 4: Skeleton Loaders ✅/❌
- [ ] Shimmer animation visible
- [ ] All shapes render
- [ ] Pre-built layouts work
- **Notes:**

### Section 5: Shimmer Effects ✅/❌
- [ ] Shimmer sweeps smoothly
- [ ] Overlay mode works
- [ ] Toggle controls visibility
- **Notes:**

### Section 6: Haptic Patterns ✅/❌
- [ ] All 7 patterns distinct
- [ ] Success/warning/error different
- [ ] Impact light/medium/heavy vary
- **Notes:**

### Performance ✅/❌
- **FPS:** [VALUE]fps (target: 60fps)
- **Memory:** [VALUE]MB
- **Jank:** [PERCENTAGE]%
- **Notes:**

### Overall Status: ✅ PASS / ❌ FAIL
**Summary:**

**Issues Found:**
1.
2.
3.

**Recommendations:**
1.
2.
3.
```

---

## Success Criteria

**Phase 3A passes device testing if:**

1. ✅ All button animations run smoothly at 60fps
2. ✅ Haptic feedback works on all interactions
3. ✅ All 4 loading indicator variants animate correctly
4. ✅ Skeleton loaders show shimmer animation
5. ✅ Shimmer effects sweep smoothly across containers
6. ✅ All 7 haptic patterns produce distinct vibrations
7. ✅ No crashes, errors, or visual glitches
8. ✅ Performance stays above 50fps (60fps ideal)
9. ✅ Memory usage remains stable (no leaks)
10. ✅ All toggles and interactions work as expected

---

## Next Steps After Testing

**If all tests pass:**
- Document results in test results template
- Take screenshots of each section
- Record video of animations (optional)
- Update PHASE_3A_M3E_COMPLETION.md with test results
- Proceed to Phase 3B (new components) or Phase 2 obligations (iOS/Perf)

**If issues found:**
- Document all issues in test results template
- Create GitHub issues for each bug
- Fix critical issues before proceeding
- Re-test after fixes

---

**Ready to test!** 🚀

Build the app with: `npx react-native run-android`

**Signed Off By:** Claude Code
**Date:** 2025-11-01
**Document ID:** PHASE_3A_TESTING_GUIDE
