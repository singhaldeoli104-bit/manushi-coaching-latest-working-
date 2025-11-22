# HOME Screen Implementation - Teacher App

## ✅ Completed

### 1. **BottomTabNav Component** - IMPROVED ✨
**File in Framer**: `BottomTabNav.tsx` (componentId: pYTJRli)
**Insert URL**: `https://framer.com/m/BottomTabNav-j4Nm.js@uaI5LkotBQAmzx7ZRPrt`

**Improvements Made**:
- ✅ Better icon design (cleaner, more modern)
- ✅ Active indicator dot at top of active tab
- ✅ Smooth animations (y-axis lift on active tab)
- ✅ Border-top separator
- ✅ Filled icons when active, outlined when inactive
- ✅ Better color scheme (Primary: #5B47FB)

**5 Tabs**:
1. Home 📚
2. Classes 📋
3. Teach 🖥️
4. Assess ✅
5. More ⋯

---

### 2. **TopBar Component** - COMPLETED ✨
**File in Framer**: `TopBar.tsx` (componentId: VmkJq_N)
**Insert URL**: `https://framer.com/m/TopBar-Fzd1.js@DaTnwqI5pHpFRjVFM9Mv`

**Features**:
- Two modes: **Root** (hamburger + title + subtitle + profile) and **Child** (back arrow + title + overflow)
- Already integrated into HOME tab
- Smooth hover/tap animations

---

### 3. **HomeScreen Component** - CREATED ✨
**File**: `C:\PC\HomeScreen.tsx` (saved locally, ready to upload)

**Follows WF-HOME-01 Wireframe Exactly**:

#### Section 1: Welcome Strip
- "Good morning, Ms. Khushi 👋"
- "You have 8 things to do today"

#### Section 2: Today's Snapshot (2×2 Grid)
- **Upcoming classes**: 3 📚
- **To review**: 14 📝
- **Live tests**: 1 ⏱️
- **Unread chats**: 5 💬

Each pill has:
- Icon + number + label
- Hover effect (border color changes)
- Tap animation

#### Section 3: Today's Tasks Strip
- White card with "Today's tasks" header
- "View all →" link
- Task chips:
  - "Review Class 10A homework (14)"
  - "Create test for JEE batch"

#### Section 4: Upcoming Classes
- Section header: "Upcoming classes"
- 3 class cards with:
  - Time (10:00 AM)
  - Subject (Physics)
  - Class name (Class 11A)
  - **"Start" button** (if class can start now)
- Hover effect (purple border)

#### Section 5: Pending Review
- Section header: "Pending review"
- Review cards with:
  - Type badge (Homework/Test) in orange
  - Title
  - Class name + submission count
  - Arrow icon →
- Hover effect (orange border)

#### Section 6: Communication
- Section header: "Communication"
- 3 tiles in 2-column grid:
  - **Announcements** 📢 (2)
  - **Class chat** 💬 (5)
  - **Student doubts** ❓ (3)
- Notification badges on tiles
- Hover animation (scale + purple border)

---

## 🎨 Design System Used

### Colors
- **Primary**: #5B47FB (Purple)
- **Warning**: #F59E0B (Orange)
- **Success**: #10B981 (Green)
- **Error**: #EF4444 (Red)
- **Background**: #F9FAFB (Light Gray)
- **Card**: #FFFFFF (White)
- **Text Primary**: #111827 (Dark Gray)
- **Text Secondary**: #6B7280 (Medium Gray)
- **Border**: #E5E7EB (Light Gray)

### Typography
- **Heading**: 24px, 700 weight
- **Subheading**: 16px, 600 weight
- **Body**: 14px, 500 weight
- **Caption**: 12-13px, 400 weight
- **Pill values**: 24px, 700 weight

### Spacing
- **Section margins**: 20px
- **Card padding**: 16px
- **Grid gaps**: 12px
- **Border radius**: 12px (cards), 8px (buttons)

### Animations (Framer Motion)
- **Initial**: opacity 0, y offset
- **Animate**: opacity 1, y 0
- **Stagger delays**: 0.1s, 0.2s, 0.3s...
- **Hover**: scale 1.02, border color change
- **Tap**: scale 0.98

---

## 📋 Next Steps - TO DO

### Step 1: Reconnect to Framer MCP
The MCP connection was lost during development. You need to:
1. Open your Framer project
2. Press **Cmd+K** (or Ctrl+K on Windows)
3. Search for "MCP"
4. Open the **MCP plugin**
5. Make sure you're logged in with the same Google account

### Step 2: Upload HomeScreen Component
Once MCP is reconnected, I'll:
1. Create `HomeScreen.tsx` as a code file in Framer
2. Get the insert URL
3. Add it to the HOME tab canvas

### Step 3: Replace Current Dashboard
In the HOME tab (nodeId: TbvNnX8NE):
1. Remove the old TeacherDashboard component
2. Add the new HomeScreen component
3. Position it in the ScrollArea

### Step 4: Add BottomTabNav
Replace the placeholder bottom nav with the actual BottomTabNav component:
- Use insert URL: `https://framer.com/m/BottomTabNav-j4Nm.js@uaI5LkotBQAmzx7ZRPrt`
- Set `activeTab="home"`
- Height: 72px

### Step 5: Create and Add FAB
Create a simple FAB component (Floating Action Button):
- Purple circle with "+" icon
- Size: 56×56px
- Position: Absolute, bottom-right (16px from bottom, 16px from right)
- Shadow: 0 4px 12px rgba(0,0,0,0.15)
- Opens "Quick Actions" bottom sheet on tap

### Step 6: Configure Canvas for Preview
To show only the HOME screen:
1. Hide the other 4 tab screens (Classes, Teach, Assess, More)
2. Or move them off-canvas
3. Focus on HOME tab for UX validation

---

## 🎯 UX Validation Checklist

Compare the Framer preview against WF-HOME-01:

- [ ] Welcome strip shows greeting + task count
- [ ] 2×2 snapshot pills with correct icons and colors
- [ ] Today's tasks strip with "View all" link
- [ ] Upcoming classes cards with time, subject, class name
- [ ] "Start" button visible on first class only
- [ ] Pending review cards with type badges
- [ ] Communication tiles in 2-column grid
- [ ] Notification badges on comm tiles
- [ ] All hover states working
- [ ] All tap animations smooth
- [ ] Colors match design system
- [ ] Typography consistent
- [ ] Spacing matches wireframe
- [ ] FAB visible bottom-right
- [ ] Bottom nav active on "Home" tab
- [ ] Top bar shows hamburger + "Home" + profile

---

## 📄 Files Created

1. **C:\PC\HomeScreen.tsx** - Ready to upload to Framer
2. **Framer: TopBar.tsx** - Already in Framer (componentId: VmkJq_N)
3. **Framer: BottomTabNav.tsx** - Already in Framer (componentId: pYTJRli)

---

## 🚀 Once Connected

Just let me know when Framer MCP is reconnected, and I'll:
1. Upload the HomeScreen component
2. Integrate it into the canvas
3. Add the BottomTabNav
4. Create and add the FAB
5. Set up the preview to show only HOME screen

Then you can validate the UX in real-time! 🎉
