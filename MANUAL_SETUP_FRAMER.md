# Manual Setup Guide - Teacher Dashboard in Framer

The MCP is having issues with component positioning. Here's how to set it up manually in Framer:

---

## 🎯 Quick Setup Steps

### Step 1: Open Your Framer Project
1. Open the project in Framer
2. Go to the **Desktop** canvas (you should see a blank 390×844px frame with rounded corners)

### Step 2: Add TeacherDashboard Component

1. **Find the component**:
   - Open the **Assets** panel (left sidebar)
   - Look for **"TeacherDashboard"** in Code Components section
   - OR use Insert menu → Component → TeacherDashboard

2. **Drag it onto the canvas**:
   - Drag TeacherDashboard into the **top/middle area** of the Stack frame
   - It should be 390×844px (fills the space)

3. **Set properties** (in right panel):
   - **teacherName**: "Ms. Khushi"
   - **primaryColor**: rgb(45, 91, 255) or #2D5BFF
   - **showAnalytics**: ✓ (checked)

4. **Position it**:
   - Make sure it's inside the first Frame (the one with height: 1fr)
   - It should fill the available space above the bottom nav

### Step 3: Add BottomTabNav Component

1. **Find the component**:
   - In **Assets** panel → Code Components
   - Look for **"BottomTabNav"**

2. **Drag it onto the canvas**:
   - Drag BottomTabNav into the **bottom area** of the Stack frame
   - It should be 390×72px (fixed height)

3. **Set properties** (in right panel):
   - **activeTab**: "home"
   - **backgroundColor**: rgb(255, 255, 255) or #FFFFFF
   - **activeColor**: rgb(91, 71, 251) or #5B47FB
   - **inactiveColor**: rgb(156, 163, 175) or #9CA3AF

4. **Position it**:
   - Make sure it's inside the bottom Frame (the one with height: 72px)
   - It should be fixed at the bottom

### Step 4: Adjust Layout (if needed)

1. **Select the Stack frame** (the main container)
   - In Layout panel, check:
     - Direction: **Vertical**
     - Distribution: **Start**
     - Alignment: **Center**
     - Gap: **0px**

2. **Make sure the frames are correct**:
   - **Top Frame**: Width 390px, Height **1fr** (fills space)
   - **Bottom Frame**: Width 390px, Height **72px** (fixed)

---

## 🎨 Alternative: Delete Everything and Start Fresh

If the canvas is messy, here's a clean start:

### 1. Clear the Canvas
- Select all the frames/components on the Desktop canvas
- Delete them

### 2. Create New Structure

**Create the main Stack:**
- Add a **Stack** frame
- Size: 390×844px
- Position: Absolute, top: 20px, left: 20px
- Background: rgb(249, 250, 251) or /Background/Light
- Border radius: 24px
- Layout: Stack, Vertical, Gap: 0px

**Create Top Frame (for Dashboard):**
- Add a **Frame** inside the Stack
- Width: 100%, Height: **1fr**
- Background: rgb(249, 250, 251)

**Create Bottom Frame (for Nav):**
- Add a **Frame** inside the Stack
- Width: 100%, Height: **72px**
- Background: rgb(255, 255, 255)

**Add Components:**
- Drag **TeacherDashboard** into the top frame
  - Set to fill: Width 100%, Height 100%
  - Props: teacherName="Ms. Khushi", primaryColor="#2D5BFF", showAnalytics=true

- Drag **BottomTabNav** into the bottom frame
  - Set to fill: Width 100%, Height 100%
  - Props: activeTab="home"

---

## 🔍 What You Should See

Once set up correctly, you should see:

### TeacherDashboard (Main Area):
- ✅ "Good morning, Ms. Khushi 👋" header
- ✅ Notification bell with badge (3)
- ✅ 4 cards in 2×2 grid (Next Class, Assignments, Tests, Doubts)
- ✅ 4 circular Quick Action buttons
- ✅ 2 Analytics cards with charts
- ✅ Activity Feed at bottom

### BottomTabNav (Bottom):
- ✅ 5 tabs: Home | Classes | Teach | Assess | More
- ✅ Home tab active (purple)
- ✅ Active indicator dot above Home

---

## 📱 Component Details

### Available Components in Your Project:

1. **TeacherDashboard** (Teacherdshboard.tsx)
   - Insert URL: `https://framer.com/m/Teacherdshboard-FMvg.js@BJdZk93Uex0RlJ63gzkX`
   - Size: 390×844px
   - Customizable: teacher name, colors, cards, actions

2. **BottomTabNav** (BottomTabNav.tsx)
   - Insert URL: `https://framer.com/m/BottomTabNav-j4Nm.js@uaI5LkotBQAmzx7ZRPrt`
   - Size: 100% width, 72px height
   - Customizable: active tab, colors

3. **TopBar** (TopBar.tsx) - Optional
   - Insert URL: `https://framer.com/m/TopBar-Fzd1.js@DaTnwqI5pHpFRjVFM9Mv`
   - Size: 100% width, 64px height
   - Two modes: root, child

4. **HomeScreen** (HomeScreen.tsx) - Alternative
   - Insert URL: `https://framer.com/m/HomeScreen-Jyqq.js`
   - Follows WF-HOME-01 wireframe
   - Different layout than TeacherDashboard

---

## ✅ Final Check

Preview your project and verify:
- [ ] TeacherDashboard is visible and fills the main area
- [ ] BottomTabNav is visible at the bottom
- [ ] Home tab is active (purple highlight)
- [ ] All interactive elements work (hover states, animations)
- [ ] No blank screen - everything is centered and visible

---

## 🆘 Troubleshooting

**If preview is still blank:**
1. Check if components are visible (eye icon in layers panel)
2. Check if components are inside the correct frames
3. Check if components have proper width/height set
4. Try zooming out in canvas to see if they're off-screen

**If components are off-screen:**
1. Select the component
2. In properties, check Left/Top position
3. Set Left: 0px, Top: 0px
4. OR use "Frame" layout and let the stack handle positioning

**If stack layout isn't working:**
1. Make sure parent has `layout="stack"`
2. Make sure stackDirection="vertical"
3. Make sure gap="0px"
4. Make sure children don't have absolute positioning

---

## 🎉 You're Done!

Once set up, you'll have a beautiful, fully functional Teacher Dashboard with working navigation!

Need help? Check the component properties in the right panel to customize colors, content, and behavior.
