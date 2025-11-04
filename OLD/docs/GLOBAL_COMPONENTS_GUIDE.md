# Global Components Guide - Top App Bar, Notifications, Settings 📱

**Created:** October 22, 2025
**Status:** ✅ READY TO INTEGRATE

---

## 📋 What Was Created

### **1. TopAppBar Component** ✅
**File:** `src/components/navigation/TopAppBar.tsx`

Material Design 3 top app bar with:
- 64dp height (MD3 spec)
- Logo/Back button on left
- Title in center
- Notifications icon (with badge count)
- Settings icon
- Profile avatar on right

**Features:**
- Notification badge shows unread count
- All touch targets ≥ 48dp
- Proper MD3 elevation
- Customizable actions

---

### **2. Notifications List Screen** ✅
**File:** `src/screens/common/NotificationsListScreen.tsx`

Full notifications screen with:
- All notifications list
- Unread count badge
- Color-coded by type (academic/financial/communication)
- "Mark all as read" action
- Click to view notification details

---

### **3. Settings Screen** ✅
**File:** `src/screens/common/SettingsScreen.tsx`

Complete settings screen with:
- **Account:** Profile, Change Password, Language
- **Notifications:** Push notifications, Email alerts toggles
- **Appearance:** Dark mode toggle
- **About:** Help, Privacy Policy, Terms, App Version
- Logout button

---

## 🎯 Current Status

### **What We Have Now:**
✅ **Bottom Tab Navigation** (Home, Children, Messages, Billing)
✅ **NewParentDashboard** with MD3 UI
✅ **TopAppBar** component created
✅ **Notifications screen** created
✅ **Settings screen** created

### **What's NOT Integrated Yet:**
❌ TopAppBar not added to navigation
❌ Notifications screen not registered in navigator
❌ Settings screen not registered in navigator
❌ Profile screen not created

---

## 🚀 How to Integrate

### **Step 1: Add TopAppBar to HomeStack**

Edit `src/navigation/ParentNavigator.tsx`:

```typescript
import { TopAppBar } from '../components/navigation/TopAppBar';

function HomeStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        // REPLACE the default header with custom TopAppBar
        header: (props) => (
          <TopAppBar
            title={props.options.title || props.route.name}
            notificationCount={5} // TODO: Get from useParentDashboard
            onNotificationPress={() => props.navigation.navigate('NotificationsList')}
            onSettingsPress={() => props.navigation.navigate('Settings')}
            onProfilePress={() => props.navigation.navigate('Profile')}
            profileInitials="JD" // TODO: Get from user context
          />
        ),
      }}
    >
      <Stack.Screen
        name="NewDashboard"
        options={{ title: 'Dashboard' }}
      >
        {(props) => (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <NewParentDashboard {...props} />
          </ErrorBoundary>
        )}
      </Stack.Screen>

      {/* ... other screens ... */}
    </Stack.Navigator>
  );
}
```

---

### **Step 2: Register New Screens**

Add to `src/navigation/ParentNavigator.tsx`:

```typescript
// Import at top
import NotificationsListScreen from '../screens/common/NotificationsListScreen';
import SettingsScreen from '../screens/common/SettingsScreen';

// Add to HomeStack screens
<Stack.Screen
  name="NotificationsList"
  options={{ title: 'Notifications' }}
>
  {(props) => (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <NotificationsListScreen {...props} />
    </ErrorBoundary>
  )}
</Stack.Screen>

<Stack.Screen
  name="Settings"
  options={{ title: 'Settings' }}
>
  {(props) => (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <SettingsScreen {...props} />
    </ErrorBoundary>
  )}
</Stack.Screen>
```

---

### **Step 3: Add Types to Navigation**

Edit `src/types/navigation.ts`:

```typescript
export type ParentStackParamList = {
  // ... existing screens ...

  // NEW: Global screens
  NotificationsList: undefined;
  Settings: undefined;
  Profile: undefined; // TODO: Create this screen
};
```

---

### **Step 4: Connect Real Data**

Update TopAppBar to use real notification count:

```typescript
// In HomeStack
function HomeStack() {
  const { user } = useAuth();
  const { notifications } = useParentDashboard(user?.id);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => (
          <TopAppBar
            title={props.options.title || props.route.name}
            notificationCount={unreadCount} // ✅ Real data!
            onNotificationPress={() => props.navigation.navigate('NotificationsList')}
            onSettingsPress={() => props.navigation.navigate('Settings')}
            onProfilePress={() => props.navigation.navigate('Profile')}
            profileInitials={user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
          />
        ),
      }}
    >
      {/* screens */}
    </Stack.Navigator>
  );
}
```

---

## 📊 Component Usage Examples

### **TopAppBar - Basic Usage**

```typescript
<TopAppBar
  title="Dashboard"
  notificationCount={5}
  onNotificationPress={() => navigation.navigate('NotificationsList')}
  onSettingsPress={() => navigation.navigate('Settings')}
  onProfilePress={() => navigation.navigate('Profile')}
/>
```

### **TopAppBar - With Back Button**

```typescript
<TopAppBar
  title="Child Details"
  showBack={true}
  onBackPress={() => navigation.goBack()}
  notificationCount={5}
  onSettingsPress={() => navigation.navigate('Settings')}
/>
```

### **TopAppBar - Custom Actions**

```typescript
<TopAppBar
  title="Messages"
  rightActions={
    <>
      <IconButton icon="filter" onPress={() => {}} />
      <IconButton icon="search" onPress={() => {}} />
    </>
  }
/>
```

---

## 🎨 MD3 Compliance

All components follow Material Design 3 specifications:

### **TopAppBar:**
- ✅ 64dp height (MD3 SmallTopAppBar)
- ✅ Primary color background
- ✅ White text (onPrimary)
- ✅ Elevation 1 (resting state)
- ✅ All touch targets ≥ 48dp

### **Notifications Screen:**
- ✅ Color-coded notification types
- ✅ Unread indicators (left border + badge)
- ✅ Card-based layout (12dp radius)
- ✅ Proper spacing (16dp padding)

### **Settings Screen:**
- ✅ Sectioned layout (Account, Notifications, Appearance, About)
- ✅ ListItem components (64dp height)
- ✅ Switch toggles for preferences
- ✅ Proper elevation and shadows

---

## 🔄 Data Flow

### **Notifications:**
```
useParentDashboard hook
    ↓
returns { notifications: [...] }
    ↓
Filter unread: notifications.filter(n => !n.read_at)
    ↓
Pass count to TopAppBar
    ↓
User taps → Navigate to NotificationsList
    ↓
Show all notifications with "Mark as Read" actions
```

### **Settings:**
```
User taps settings icon
    ↓
Navigate to SettingsScreen
    ↓
Toggle switches update local state
    ↓
TODO: Persist to AsyncStorage or Supabase
```

---

## ✅ TODO - Next Steps

### **High Priority:**
- [ ] Create Profile screen (`src/screens/common/ProfileScreen.tsx`)
- [ ] Integrate TopAppBar into navigation
- [ ] Register NotificationsList and Settings screens
- [ ] Connect real notification data from useParentDashboard
- [ ] Implement "Mark as Read" mutation for notifications

### **Medium Priority:**
- [ ] Implement Settings persistence (AsyncStorage)
- [ ] Add dark mode theme switching
- [ ] Create Help & Support screen
- [ ] Add Privacy Policy screen
- [ ] Implement logout functionality

### **Low Priority:**
- [ ] Add drawer navigation (optional)
- [ ] Add search functionality to notifications
- [ ] Add filter by type (academic/financial/communication)
- [ ] Add notification sound settings
- [ ] Add biometric authentication toggle

---

## 📁 File Structure

```
src/
├── components/
│   └── navigation/
│       └── TopAppBar.tsx         ✅ Created
│
├── screens/
│   ├── common/
│   │   ├── NotificationsListScreen.tsx  ✅ Created
│   │   ├── SettingsScreen.tsx          ✅ Created
│   │   └── ProfileScreen.tsx           ❌ TODO
│   │
│   └── parent/
│       └── NewParentDashboard.tsx      ✅ Already enhanced
│
├── navigation/
│   └── ParentNavigator.tsx       ⏳ Needs update
│
└── types/
    └── navigation.ts             ⏳ Needs update
```

---

## 🧪 Testing Checklist

### **TopAppBar:**
- [ ] Appears on all screens
- [ ] Notification badge shows correct count
- [ ] Tapping notifications icon opens NotificationsList
- [ ] Tapping settings icon opens Settings
- [ ] Tapping profile avatar opens Profile
- [ ] Back button works on detail screens
- [ ] Title updates correctly per screen

### **Notifications:**
- [ ] All notifications load from Supabase
- [ ] Unread notifications show badge and left border
- [ ] Unread count is accurate
- [ ] Tapping notification opens relevant screen
- [ ] "Mark all as read" works
- [ ] Empty state shows when no notifications

### **Settings:**
- [ ] All toggles work
- [ ] Settings persist after app restart
- [ ] Dark mode toggle changes theme
- [ ] Navigation to sub-screens works
- [ ] Logout button triggers logout flow
- [ ] App version shows correctly

---

## 🎯 Expected Result

After integration, users will have:

1. **Persistent Top Bar** on all screens with:
   - App logo
   - Screen title
   - Notification icon with badge
   - Settings icon
   - Profile avatar

2. **Complete Notifications System**:
   - Badge on bell icon
   - Full notifications list screen
   - Mark as read functionality
   - Navigation to relevant screens

3. **Full Settings Screen**:
   - Account management
   - Notification preferences
   - Appearance settings
   - About/Help sections
   - Logout option

---

**Status:** ✅ Components created, ready for integration
**Next:** Integrate into ParentNavigator.tsx

**Documentation complete! 📱**
