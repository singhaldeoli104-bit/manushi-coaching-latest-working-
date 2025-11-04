# Usage Guide - How to Use All Features ✅

**Practical guide with code examples for all features added**

Last Updated: October 22, 2025

---

## Table of Contents

1. [Safe Navigation](#1-safe-navigation)
2. [Hardware Back Button Guard](#2-hardware-back-button-guard)
3. [Navigation Analytics](#3-navigation-analytics)
4. [Deep Linking](#4-deep-linking)
5. [Navigation State Persistence](#5-navigation-state-persistence)
6. [Navigation Parameter Validation](#6-navigation-parameter-validation)
7. [Creating New Screens](#7-creating-new-screens)
8. [Applying Acceptance Checklist](#8-applying-acceptance-checklist)
9. [Best Practices](#9-best-practices)

---

## 1. Safe Navigation

### What It Does
Prevents double-tap navigation crashes with 300ms debounce.

### Import
```typescript
import { safeNavigate } from '../../utils/navigationService';
```

### Basic Usage

#### Navigate to Screen Without Params
```typescript
const handleGoToHome = () => {
  safeNavigate('NewDashboard');
};
```

#### Navigate to Screen With Params
```typescript
const handleViewChild = (childId: string) => {
  safeNavigate('ChildProgress', { childId });
};
```

#### Navigate to Nested Tab Screen
```typescript
const handleViewMessages = () => {
  navigation.navigate('Communication', {
    screen: 'MessagesList'
  });
};
```

### Advanced Usage

#### With Optional Params
```typescript
const handleMakePayment = (amount?: number, description?: string) => {
  if (amount && description) {
    safeNavigate('MakePayment', { amount, description });
  } else {
    safeNavigate('MakePayment'); // No params
  }
};
```

#### Inside Event Handlers
```typescript
<Button
  variant="primary"
  onPress={() => safeNavigate('ChildDetail', { childId: child.id })}
>
  View Details
</Button>
```

### Common Patterns

#### Navigate After Action
```typescript
const handleSaveProfile = async () => {
  await saveProfile(profileData);
  safeNavigate('NewDashboard'); // Safe even if user double-taps Save
};
```

#### Navigate from List Item
```typescript
const renderChild = ({ item }: { item: Child }) => (
  <TouchableOpacity onPress={() => safeNavigate('ChildDetail', { childId: item.id })}>
    <T>{item.full_name}</T>
  </TouchableOpacity>
);
```

### Why Use It
```typescript
// ❌ BAD - Can crash on double-tap
<Button onPress={() => navigation.navigate('ChildDetail', { childId })}>
  View
</Button>

// ✅ GOOD - Protected with debounce
<Button onPress={() => safeNavigate('ChildDetail', { childId })}>
  View
</Button>
```

---

## 2. Hardware Back Button Guard

### What It Does
Prevents accidental data loss when user presses Android back button on forms.

### Import
```typescript
import { useBlockBack } from '../../hooks/useBlockBack';
```

### Basic Usage

#### Simple Form Protection
```typescript
const EditProfileScreen = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useBlockBack(hasUnsavedChanges);

  return (
    <BaseScreen>
      <TextInput
        value={name}
        onChangeText={(text) => {
          setName(text);
          setHasUnsavedChanges(true);
        }}
      />
    </BaseScreen>
  );
};
```

#### Custom Alert Messages
```typescript
useBlockBack(
  hasUnsavedChanges,
  'You have unsaved changes in your profile. Discard them?',
  'Unsaved Profile Changes'
);
```

### Advanced Usage

#### With Options Object
```typescript
useBlockBack({
  enabled: isDirty,
  title: 'Unsaved Message',
  message: 'Your message draft will be lost. Continue?',
  onLeave: () => {
    // Optional cleanup before leaving
    console.log('User left without saving');
  },
});
```

#### Conditional Protection
```typescript
const [formState, setFormState] = useState<'clean' | 'dirty' | 'saving'>('clean');

// Only block if form is dirty (not during save)
useBlockBack(formState === 'dirty');
```

### Common Patterns

#### Payment Form Protection
```typescript
const MakePaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Block back only when amount entered but not processing
  useBlockBack(
    amount.length > 0 && !isProcessing,
    'Your payment information will be lost. Are you sure?',
    'Cancel Payment?'
  );

  return (
    <BaseScreen>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
      />
      <Button onPress={handlePayment}>Pay</Button>
    </BaseScreen>
  );
};
```

#### Multi-Step Form Protection
```typescript
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState({});

// Block back on any step except first
useBlockBack(
  currentStep > 1,
  `You're on step ${currentStep} of 3. Lose progress?`,
  'Exit Form?'
);
```

### Why Use It
Prevents frustrating scenarios:
- User fills out long form
- Accidentally hits back button
- All data lost
- User has to start over ❌

With useBlockBack:
- User fills out long form
- Accidentally hits back button
- Alert asks "Lose changes?"
- User can choose to stay ✅

---

## 3. Navigation Analytics

### What It Does
Automatically tracks screen views and user actions for analytics.

### Import
```typescript
import { trackAction, trackEvent, trackScreenView } from '../../utils/navigationAnalytics';
```

### Basic Usage

#### Track Screen View (On Mount)
```typescript
const ChildDetailScreen = ({ route }) => {
  useEffect(() => {
    trackAction('view_child_detail', 'ChildDetail', {
      childId: route.params.childId,
    });
  }, []);

  return <BaseScreen>...</BaseScreen>;
};
```

#### Track Button Press
```typescript
const handleShareProgress = async (childId: string) => {
  trackAction('share_child_progress', 'ChildDetail', { childId });

  const url = generateDeepLink('ChildProgress', { childId });
  await Share.share({ message: url });

  trackEvent('share_completed', { type: 'child_progress' });
};
```

### Advanced Usage

#### Track With Custom Properties
```typescript
const handleFilterSubjects = (filter: string) => {
  trackAction('filter_subjects', 'SubjectList', {
    filter,
    totalSubjects: subjects.length,
    timestamp: Date.now(),
  });

  setActiveFilter(filter);
};
```

#### Track Form Submission
```typescript
const handleSubmitPayment = async (amount: number) => {
  trackAction('initiate_payment', 'MakePayment', {
    amount,
    currency: 'INR',
  });

  try {
    await processPayment(amount);
    trackEvent('payment_success', { amount });
  } catch (error) {
    trackEvent('payment_failed', {
      amount,
      error: error.message,
    });
  }
};
```

### Common Patterns

#### Track Navigation + Action
```typescript
const handleViewChildDetails = (child: Child) => {
  // Track the action
  trackAction('view_child_details', 'ParentDashboard', {
    childId: child.id,
    childName: child.full_name,
  });

  // Then navigate
  safeNavigate('ChildDetail', { childId: child.id });
};
```

#### Track List Item Selection
```typescript
const renderSubject = ({ item }: { item: Subject }) => (
  <TouchableOpacity
    onPress={() => {
      trackAction('select_subject', 'SubjectList', {
        subjectId: item.id,
        subjectName: item.name,
      });
      safeNavigate('SubjectDetail', {
        studentId: route.params.studentId,
        subject: item.name,
      });
    }}
  >
    <T>{item.name}</T>
  </TouchableOpacity>
);
```

#### Track "View All" Actions
```typescript
const handleViewAllMessages = () => {
  trackAction('view_all_messages', 'ParentDashboard');
  safeNavigate('MessagesList');
};
```

### Events to Track

**Always track these:**
- Screen views (on mount)
- Navigation actions (button presses)
- Form submissions
- Share actions
- Filter/sort changes
- Critical user actions

**Never track these:**
- Personal data (names, emails, IDs should be anonymized)
- Passwords or payment details
- Private conversations

### Event Naming Convention
```typescript
// ✅ GOOD - Clear, consistent
trackAction('view_child_detail', 'ChildDetail');
trackAction('share_child_progress', 'Dashboard');
trackAction('initiate_payment', 'MakePayment');

// ❌ BAD - Inconsistent, unclear
trackAction('clickedButton', 'screen1');
trackAction('UserDidTapTheShareButtonForChild', 'Dashboard');
trackAction('payment', 'pay');
```

**Pattern:** `{verb}_{noun}` (view_child, share_progress, initiate_payment)

---

## 4. Deep Linking

### What It Does
Creates shareable URLs that open specific screens in the app.

### Import
```typescript
import { generateDeepLink } from '../../config/deepLinking';
```

### Basic Usage

#### Generate Link for Child Progress
```typescript
const childProgressUrl = generateDeepLink('ChildProgress', { childId: '123' });
// Returns: "https://app.manushicoaching.com/parent/child/123/progress"
```

#### Share Via Native Share Sheet
```typescript
const handleShareChild = async (child: Child) => {
  const url = generateDeepLink('ChildProgress', { childId: child.id });

  await Share.share({
    message: `Check out ${child.full_name}'s progress!\n\n${url}`,
    title: `${child.full_name} - Progress Report`,
  });
};
```

### Advanced Usage

#### Copy Link to Clipboard
```typescript
import Clipboard from '@react-native-clipboard/clipboard';

const handleCopyLink = (childId: string) => {
  const url = generateDeepLink('ChildProgress', { childId });
  Clipboard.setString(url);

  Alert.alert('Link Copied', 'Share this link with others!');
};
```

#### Share Multiple Options
```typescript
const handleShare = async (child: Child) => {
  const url = generateDeepLink('ChildProgress', { childId: child.id });

  Alert.alert(
    'Share Progress',
    'How would you like to share?',
    [
      {
        text: 'Copy Link',
        onPress: () => Clipboard.setString(url),
      },
      {
        text: 'Share',
        onPress: () => Share.share({ message: url }),
      },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
};
```

### Common Patterns

#### Share With Context
```typescript
const shareChildProgress = async (child: Child, context: string) => {
  const url = generateDeepLink('ChildProgress', { childId: child.id });

  const messages = {
    email: `Dear Parent,\n\nPlease review ${child.full_name}'s academic progress:\n${url}`,
    whatsapp: `📊 ${child.full_name}'s Progress Report: ${url}`,
    general: `Check out ${child.full_name}'s progress at Manushi Coaching!\n\n${url}`,
  };

  await Share.share({ message: messages[context] || messages.general });
};
```

#### Generate QR Code (Future)
```typescript
import QRCode from 'react-native-qrcode-svg';

const ProgressQRCode = ({ childId }: { childId: string }) => {
  const url = generateDeepLink('ChildProgress', { childId });

  return <QRCode value={url} size={200} />;
};
```

### Supported Deep Links

Currently configured:
- `ChildProgress`: `/parent/child/:childId/progress`

To add more, edit `src/config/deepLinking.ts`:
```typescript
export const deepLinkConfig = {
  config: {
    screens: {
      ChildProgress: 'parent/child/:childId/progress',
      SubjectDetail: 'parent/subject/:studentId/:subject',  // Add new
      PaymentHistory: 'parent/billing/history',             // Add new
    },
  },
};
```

---

## 5. Navigation State Persistence

### What It Does
Saves navigation state when app is killed, restores it on restart.

### How It Works (Automatic)
Already integrated in `App.tsx`:
```typescript
// Saves state on every navigation change
<NavigationContainer
  onStateChange={(state) => {
    saveNavigationState(state);
  }}
>

// Restores state on app start
useEffect(() => {
  const restore = async () => {
    const savedState = await restoreNavigationState();
    if (savedState) setInitialState(savedState);
    setIsReady(true);
  };
  restore();
}, []);
```

### User Experience

**Before persistence:**
1. User navigates to ChildDetail screen
2. App is killed (low memory, force quit)
3. User reopens app
4. App starts at Dashboard ❌

**With persistence:**
1. User navigates to ChildDetail screen
2. App is killed (low memory, force quit)
3. User reopens app
4. App reopens on ChildDetail screen ✅

### Customization

#### Disable for Testing
```typescript
// In App.tsx
const shouldRestore = await shouldRestoreNavigationState({
  isLoggedIn: true,
  appVersion: '1.0.0',
  // Add custom logic
  restoreEnabled: __DEV__ ? false : true,  // Disable in dev mode
});
```

#### Clear Saved State
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clear saved navigation state
await AsyncStorage.removeItem('NAVIGATION_STATE');
```

#### Customize Expiry
Edit `src/utils/navigationPersistence.ts`:
```typescript
const isStateExpired = (stateTimestamp: number) => {
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return (now - stateTimestamp) > oneWeek;  // Change to your preference
};
```

---

## 6. Navigation Parameter Validation

### What It Does
Validates navigation params with Zod before navigation to prevent runtime errors.

### Import
```typescript
import {
  safeNavigateWithValidation,
  ChildDetailParamsSchema,
  MessageDetailParamsSchema,
  // ... other schemas
} from '../../shared/validation/navigationSchemas';
```

### Basic Usage

#### Navigate With Validation
```typescript
const handleViewChild = (childId: string) => {
  const success = safeNavigateWithValidation(
    navigation,
    'ChildDetail',
    ChildDetailParamsSchema,
    { childId }
  );

  if (!success) {
    Alert.alert('Error', 'Invalid child ID');
  }
};
```

### Advanced Usage

#### Validate Deep Link Params
```typescript
const handleDeepLink = (url: string) => {
  // Extract params from URL
  const params = parseUrl(url);  // { childId: 'abc-123' }

  // Validate before navigation
  const success = safeNavigateWithValidation(
    navigation,
    'ChildProgress',
    ChildIdSchema,
    params
  );

  if (!success) {
    Alert.alert('Invalid Link', 'This link is not valid or has expired');
  }
};
```

#### Validate Optional Params
```typescript
const handleMakePayment = (amount?: number, description?: string) => {
  const success = safeNavigateWithValidation(
    navigation,
    'MakePayment',
    MakePaymentParamsSchema,
    { amount, description }  // Both optional
  );

  if (!success) {
    // Validation failed (e.g., negative amount)
    Alert.alert('Error', 'Invalid payment amount');
  }
};
```

### Common Patterns

#### Validate Form Submission
```typescript
const handleSubmitMessage = () => {
  const params = {
    recipientId: selectedTeacher.id,
    subject: messageSubject,
  };

  const success = safeNavigateWithValidation(
    navigation,
    'ComposeMessage',
    ComposeMessageParamsSchema,
    params
  );

  if (!success) {
    Alert.alert('Error', 'Please select a teacher and enter a subject');
  }
};
```

#### Validate List Item Navigation
```typescript
const renderMessage = ({ item }: { item: Message }) => (
  <TouchableOpacity
    onPress={() => {
      safeNavigateWithValidation(
        navigation,
        'MessageDetail',
        MessageDetailParamsSchema,
        { messageId: item.id }
      );
    }}
  >
    <T>{item.subject}</T>
  </TouchableOpacity>
);
```

### Available Schemas

```typescript
// Child screens
ChildDetailParamsSchema         // { childId: string (UUID) }
ChildIdSchema                   // string (UUID)

// Messages
MessageDetailParamsSchema       // { messageId: string (UUID) }
ComposeMessageParamsSchema      // { recipientId?: string, subject?: string }

// Action Items
ActionItemDetailParamsSchema    // { itemId: string (UUID) }

// Payments
MakePaymentParamsSchema         // { amount?: number (positive), description?: string }
FeeStructureParamsSchema        // { studentId?: string (UUID) }

// Academic
SubjectDetailParamsSchema       // { studentId: string (UUID), subject: string }
AssignmentsListParamsSchema     // { studentId: string (UUID) }
AssignmentDetailParamsSchema    // { assignmentId: string (UUID) }
UpcomingExamsParamsSchema       // { studentId?: string (UUID) }
AcademicReportsParamsSchema     // { studentId: string (UUID) }
StudyRecommendationsParamsSchema // { studentId: string (UUID) }

// Meetings
ScheduleMeetingParamsSchema     // { teacherId?: string (UUID) }
TeacherListParamsSchema         // { studentId?: string (UUID) }
```

### Create New Schema

Edit `src/shared/validation/navigationSchemas.ts`:
```typescript
export const MyNewScreenParamsSchema = z.object({
  requiredId: z.string().uuid('Invalid ID format'),
  optionalName: z.string().min(1, 'Name cannot be empty').optional(),
  count: z.number().int().positive().optional(),
});

export type MyNewScreenParams = z.infer<typeof MyNewScreenParamsSchema>;
```

---

## 7. Creating New Screens

### Step-by-Step Guide

#### Step 1: Create Screen File
```bash
# Location: src/screens/parent/MyNewScreen.tsx
```

#### Step 2: Use Template
```typescript
import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, T, Button, Spacer } from '../../ui';
import { trackAction } from '../../utils/navigationAnalytics';
import type { ParentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ParentStackParamList, 'MyNewScreen'>;

const MyNewScreen: React.FC<Props> = ({ route, navigation }) => {
  // Track screen view on mount
  React.useEffect(() => {
    trackAction('view_my_new_screen', 'MyNewScreen');
  }, []);

  // Get route params (if any)
  const params = route.params;

  return (
    <BaseScreen scrollable loading={false} error={null} empty={false}>
      <Col sx={{ p: 'xl' }}>
        <T variant="headline" weight="bold">My New Screen</T>
        <Spacer size="md" />
        <T variant="body" color="textSecondary">
          Screen content goes here
        </T>
        <Spacer size="md" />
        <Button variant="primary" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </Col>
    </BaseScreen>
  );
};

export default MyNewScreen;
```

#### Step 3: Add to Navigation Types
Edit `src/types/navigation.ts`:
```typescript
export type ParentStackParamList = {
  // ... existing screens
  MyNewScreen: { someId: string };  // Add your screen with params
};
```

#### Step 4: Create Validation Schema
Edit `src/shared/validation/navigationSchemas.ts`:
```typescript
export const MyNewScreenParamsSchema = z.object({
  someId: z.string().uuid('Invalid ID format'),
});
```

#### Step 5: Register in Navigator
Edit `src/navigation/ParentNavigator.tsx`:
```typescript
import MyNewScreen from '../screens/parent/MyNewScreen';

// Inside appropriate Stack.Navigator:
<Stack.Screen
  name="MyNewScreen"
  component={MyNewScreen}
  options={{ title: 'My New Screen' }}
/>
```

#### Step 6: Navigate to It
```typescript
import { safeNavigate } from '../../utils/navigationService';

const handleOpenMyScreen = (someId: string) => {
  trackAction('open_my_screen', 'CurrentScreen', { someId });
  safeNavigate('MyNewScreen', { someId });
};
```

### Real Data Integration Example

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';

const MyNewScreen: React.FC<Props> = ({ route }) => {
  const { someId } = route.params;

  // Fetch real data from Supabase
  const { data, isLoading, error } = useQuery({
    queryKey: ['myData', someId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('my_table')
        .select('*')
        .eq('id', someId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <BaseScreen
      scrollable
      loading={isLoading}
      error={error}
      empty={!data}
      emptyMessage="No data found"
    >
      {data && (
        <Col sx={{ p: 'xl' }}>
          <T variant="headline">{data.title}</T>
          <T variant="body">{data.description}</T>
        </Col>
      )}
    </BaseScreen>
  );
};
```

---

## 8. Applying Acceptance Checklist

### What It Is
Quality gate for every screen - ensures production readiness.

### How to Use

#### Step 1: Copy Template
From `ACCEPTANCE_CHECKLIST.md`, copy the template for your screen.

#### Step 2: Track Progress
Check off items as you implement them.

#### Step 3: Complete All Sections
Don't skip any section - all are important for production quality.

### Checklist Walkthrough

#### Data Layer ✅
```typescript
// ✅ No mock data - Only real Supabase queries
const { data: children } = useQuery({
  queryKey: parentQueries.children(parentId),  // ✅ Query keys factory
  queryFn: async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('parent_id', parentId);

    if (error) throw error;
    return ChildrenSchema.parse(data);  // ✅ Zod validation
  },
});

// ❌ BAD - Mock data
const children = [
  { id: '1', name: 'Test Child' }
];
```

#### UI/UX States ✅
```typescript
// ✅ BaseScreen handles all states automatically
<BaseScreen
  scrollable
  loading={isLoading}        // ✅ Loading state
  error={error}              // ✅ Error state
  empty={!children?.length}  // ✅ Empty state
  emptyMessage="No children found"
>
  {/* ✅ Success state */}
  {children?.map(child => <ChildCard key={child.id} child={child} />)}
</BaseScreen>
```

#### Accessibility ✅
```typescript
// ✅ Icon buttons have accessibilityLabel
<TouchableOpacity
  accessibilityLabel="Share child progress"
  accessibilityRole="button"
  onPress={handleShare}
>
  <Icon name="share" size={24} />
</TouchableOpacity>

// ✅ Tap targets ≥ 48dp
<Button sx={{ minHeight: 48, minWidth: 48 }}>
  Tap Me
</Button>
```

#### Performance ✅
```typescript
// ✅ FlatList optimizations
<FlatList
  data={children}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: 100,
    offset: 100 * index,
    index,
  })}
  removeClippedSubviews={true}
  renderItem={renderChild}
/>

// ✅ Memoized components
const ChildCard = React.memo(({ child }: { child: Child }) => (
  <Card>
    <T>{child.full_name}</T>
  </Card>
));

// ✅ Memoized callbacks
const handlePress = useCallback((childId: string) => {
  safeNavigate('ChildDetail', { childId });
}, []);
```

#### Analytics ✅
```typescript
// ✅ Screen view on mount
useEffect(() => {
  trackAction('view_children_list', 'ChildrenList');
}, []);

// ✅ User actions tracked
const handleViewChild = (child: Child) => {
  trackAction('view_child_detail', 'ChildrenList', {
    childId: child.id,
    // ✅ No PII - don't include child.full_name, child.email
  });
  safeNavigate('ChildDetail', { childId: child.id });
};
```

#### Navigation ✅
```typescript
// ✅ Safe navigation with debounce
const handleNavigate = () => {
  safeNavigate('ChildDetail', { childId });
};

// ✅ Param validation with Zod
const handleNavigateValidated = () => {
  safeNavigateWithValidation(
    navigation,
    'ChildDetail',
    ChildDetailParamsSchema,
    { childId }
  );
};

// ✅ Back button handling for forms
useBlockBack(hasUnsavedChanges);
```

#### Code Quality ✅
```typescript
// ✅ TypeScript - Zero errors
type Props = NativeStackScreenProps<ParentStackParamList, 'ChildrenList'>;

// ✅ BaseScreen wrapper
return <BaseScreen>...</BaseScreen>;

// ✅ UI utility library
import { Row, Col, T, Button, Spacer } from '../../ui';

// ✅ No inline styles - use sx() or theme
<Col sx={{ p: 'xl', bg: 'surface' }}>
  <T variant="headline">Title</T>
</Col>
```

### Quick Checklist Summary

Before marking screen complete, verify:
- [ ] Real Supabase data (no mock arrays)
- [ ] BaseScreen wrapper with all states
- [ ] All icon buttons have accessibilityLabel
- [ ] FlatList optimized (if list screen)
- [ ] Components memoized
- [ ] Analytics events tracked
- [ ] Safe navigation used
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0
- [ ] Tested on real device
- [ ] No console errors

---

## 9. Best Practices

### Navigation

#### Always Use Safe Navigation
```typescript
// ✅ GOOD
safeNavigate('ChildDetail', { childId });

// ❌ BAD
navigation.navigate('ChildDetail', { childId });
```

#### Track Before Navigate
```typescript
// ✅ GOOD - Track, then navigate
const handleViewChild = (childId: string) => {
  trackAction('view_child', 'Dashboard', { childId });
  safeNavigate('ChildDetail', { childId });
};

// ❌ BAD - Navigate without tracking
const handleViewChild = (childId: string) => {
  safeNavigate('ChildDetail', { childId });
};
```

#### Validate Params from External Sources
```typescript
// ✅ GOOD - Validate deep link params
const handleDeepLink = (params: unknown) => {
  safeNavigateWithValidation(
    navigation,
    'ChildDetail',
    ChildDetailParamsSchema,
    params
  );
};

// ❌ BAD - Trust external params blindly
const handleDeepLink = (params: any) => {
  navigation.navigate('ChildDetail', params);
};
```

### Data Fetching

#### Never Use Mock Data
```typescript
// ✅ GOOD - Real Supabase query
const { data: children } = useQuery({
  queryKey: parentQueries.children(parentId),
  queryFn: async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('parent_id', parentId);
    if (error) throw error;
    return data;
  },
});

// ❌ BAD - Mock data
const children = [
  { id: '1', name: 'Test Child', grade: 85 },
];
```

#### Always Use Query Keys Factory
```typescript
// ✅ GOOD - Centralized query keys
import { parentQueries } from '../../services/api/queryKeys';

const { data } = useQuery({
  queryKey: parentQueries.children(parentId),
  queryFn: fetchChildren,
});

// ❌ BAD - Inline query keys
const { data } = useQuery({
  queryKey: ['children', parentId],
  queryFn: fetchChildren,
});
```

#### Validate Data with Zod
```typescript
// ✅ GOOD - Zod validation in query
queryFn: async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*');

  if (error) throw error;
  return ChildrenArraySchema.parse(data);  // Validates shape
};

// ❌ BAD - No validation
queryFn: async () => {
  const { data } = await supabase.from('students').select('*');
  return data;  // What if structure changed?
};
```

### UI Components

#### Always Use BaseScreen
```typescript
// ✅ GOOD - BaseScreen handles states
return (
  <BaseScreen
    scrollable
    loading={isLoading}
    error={error}
    empty={!data}
  >
    <Content />
  </BaseScreen>
);

// ❌ BAD - Manual state handling
if (isLoading) return <ActivityIndicator />;
if (error) return <Text>Error</Text>;
if (!data) return <Text>No data</Text>;
return <Content />;
```

#### Use UI Utility Library
```typescript
// ✅ GOOD - UI utilities
import { Row, Col, T, Button, Spacer } from '../../ui';

<Col sx={{ p: 'xl', gap: 'md' }}>
  <T variant="headline">Title</T>
  <T variant="body">Description</T>
</Col>

// ❌ BAD - Inline styles and View/Text
<View style={{ padding: 24 }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Title</Text>
  <Text style={{ fontSize: 16 }}>Description</Text>
</View>
```

### Analytics

#### Track Key Actions Only
```typescript
// ✅ GOOD - Meaningful actions
trackAction('view_child_detail', 'Dashboard');
trackAction('share_progress', 'ChildDetail');
trackAction('initiate_payment', 'Billing');

// ❌ BAD - Too granular or meaningless
trackAction('button_pressed', 'Screen1');
trackAction('scroll', 'List');
trackAction('render', 'Component');
```

#### No PII in Analytics
```typescript
// ✅ GOOD - Anonymized IDs only
trackAction('view_child', 'Dashboard', {
  childId: 'abc-123',  // UUID is fine
});

// ❌ BAD - Contains PII
trackAction('view_child', 'Dashboard', {
  childName: 'John Doe',     // ❌ PII
  parentEmail: 'test@...',   // ❌ PII
  phoneNumber: '123-456',    // ❌ PII
});
```

### Performance

#### Memoize List Components
```typescript
// ✅ GOOD - Memoized
const ChildCard = React.memo(({ child }: { child: Child }) => (
  <Card>
    <T>{child.full_name}</T>
  </Card>
));

// ❌ BAD - Re-renders on every parent render
const ChildCard = ({ child }: { child: Child }) => (
  <Card>
    <T>{child.full_name}</T>
  </Card>
);
```

#### Optimize FlatList
```typescript
// ✅ GOOD - All optimizations
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  renderItem={renderItem}
/>

// ❌ BAD - No optimizations
<FlatList
  data={items}
  renderItem={renderItem}
/>
```

### Accessibility

#### Label Icon Buttons
```typescript
// ✅ GOOD - Accessible
<TouchableOpacity
  accessibilityLabel="Share child progress"
  accessibilityRole="button"
  onPress={handleShare}
>
  <Icon name="share" />
</TouchableOpacity>

// ❌ BAD - Not accessible
<TouchableOpacity onPress={handleShare}>
  <Icon name="share" />
</TouchableOpacity>
```

#### Minimum Tap Targets
```typescript
// ✅ GOOD - 48dp minimum
<Button sx={{ minHeight: 48, minWidth: 48 }}>
  Small Text
</Button>

// ❌ BAD - Too small
<TouchableOpacity style={{ height: 20, width: 20 }}>
  <Icon />
</TouchableOpacity>
```

---

## Quick Reference Cheat Sheet

```typescript
// 1. NAVIGATION
import { safeNavigate } from '../../utils/navigationService';
safeNavigate('ChildDetail', { childId });

// 2. BACK BUTTON GUARD
import { useBlockBack } from '../../hooks/useBlockBack';
useBlockBack(hasUnsavedChanges);

// 3. ANALYTICS
import { trackAction } from '../../utils/navigationAnalytics';
trackAction('view_screen', 'ScreenName');

// 4. DEEP LINKING
import { generateDeepLink } from '../../config/deepLinking';
const url = generateDeepLink('ChildProgress', { childId });

// 5. VALIDATION
import { safeNavigateWithValidation, ChildDetailParamsSchema } from '../../shared/validation/navigationSchemas';
safeNavigateWithValidation(navigation, 'ChildDetail', ChildDetailParamsSchema, params);

// 6. DATA FETCHING
import { useQuery } from '@tanstack/react-query';
import { parentQueries } from '../../services/api/queryKeys';
const { data, isLoading, error } = useQuery({
  queryKey: parentQueries.children(parentId),
  queryFn: fetchChildren,
});

// 7. SCREEN WRAPPER
import { BaseScreen } from '../../shared/components/BaseScreen';
<BaseScreen scrollable loading={isLoading} error={error} empty={!data}>
  <Content />
</BaseScreen>

// 8. UI COMPONENTS
import { Row, Col, T, Button, Spacer } from '../../ui';
<Col sx={{ p: 'xl', gap: 'md' }}>
  <T variant="headline">Title</T>
  <Button variant="primary" onPress={handlePress}>Action</Button>
</Col>
```

---

**Remember:** Follow the Acceptance Checklist for every screen to ensure production quality! ✅

**Next:** See `ERRORS_AND_SOLUTIONS.md` for common errors and how to fix them.
