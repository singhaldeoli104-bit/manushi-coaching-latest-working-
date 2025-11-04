# Errors and Solutions Guide ✅

**Common errors, what they mean, and how to fix them**

Last Updated: October 22, 2025

---

## Table of Contents

1. [Navigation Errors](#1-navigation-errors)
2. [TypeScript Errors](#2-typescript-errors)
3. [Validation Errors](#3-validation-errors)
4. [Deep Linking Errors](#4-deep-linking-errors)
5. [Data Fetching Errors](#5-data-fetching-errors)
6. [Performance Issues](#6-performance-issues)
7. [Build/Compilation Errors](#7-buildcompilation-errors)
8. [Runtime Errors](#8-runtime-errors)
9. [Common Mistakes](#9-common-mistakes)

---

## 1. Navigation Errors

### Error 1.1: Screen Not Found Warning

**Error Message:**
```
Warning: The action 'NAVIGATE' with payload {"name":"ChildDetail","params":{"childId":"123"}}
was not handled by any navigator.

Do you have a screen named 'ChildDetail'?
```

**What It Means:**
You're trying to navigate to a screen that doesn't exist or isn't registered in the navigator.

**Common Causes:**
1. Screen file exists but not registered in ParentNavigator.tsx
2. Typo in screen name
3. Screen is in wrong navigator (e.g., trying to navigate to admin screen from parent navigator)

**Solution:**

**Step 1:** Check if screen is registered in ParentNavigator.tsx
```typescript
// ❌ PROBLEM - Screen not registered
// ParentNavigator.tsx has no ChildDetail screen

// ✅ SOLUTION - Register the screen
import ChildDetailScreen from '../screens/parent/ChildDetailScreen';

// Inside appropriate Stack.Navigator:
<Stack.Screen
  name="ChildDetail"
  component={ChildDetailScreen}
  options={{ title: 'Child Details' }}
/>
```

**Step 2:** Check navigation types match
```typescript
// ❌ PROBLEM - Type says 'ChildDetails' but registering 'ChildDetail'
export type ParentStackParamList = {
  ChildDetails: { childId: string };  // Typo: ChildDetails
};

// ✅ SOLUTION - Match exactly
export type ParentStackParamList = {
  ChildDetail: { childId: string };  // Matches screen name
};
```

**Step 3:** Use safe navigation (prevents crashes)
```typescript
// ✅ TEMPORARY WORKAROUND - Until screen is registered
const handleViewChild = (childId: string) => {
  // Navigate to existing screen instead
  navigation.navigate('Children', {
    screen: 'ChildProgress',
    params: { childId }
  });
};
```

---

### Error 1.2: Navigation Rapid Fire (Double-Tap)

**Error Message:**
```
Warning: Multiple calls to navigate to screen 'ChildDetail' detected
```

**What It Means:**
User double-tapped a button, causing multiple navigation attempts.

**Common Causes:**
1. Using `navigation.navigate()` directly
2. No debouncing on button presses
3. Async operations causing delayed navigation

**Solution:**

```typescript
// ❌ PROBLEM - No debounce protection
<Button onPress={() => navigation.navigate('ChildDetail', { childId })}>
  View Details
</Button>

// ✅ SOLUTION 1 - Use safeNavigate (300ms debounce)
import { safeNavigate } from '../../utils/navigationService';

<Button onPress={() => safeNavigate('ChildDetail', { childId })}>
  View Details
</Button>

// ✅ SOLUTION 2 - Disable button during navigation
const [isNavigating, setIsNavigating] = useState(false);

<Button
  disabled={isNavigating}
  onPress={() => {
    setIsNavigating(true);
    navigation.navigate('ChildDetail', { childId });
  }}
>
  View Details
</Button>
```

---

### Error 1.3: Nested Navigation Params Lost

**Error Message:**
```
TypeError: Cannot read property 'childId' of undefined
```

**What It Means:**
Params weren't passed correctly through nested navigators.

**Common Causes:**
1. Navigating to tab screen without passing params correctly
2. Params not defined in parent navigator

**Solution:**

```typescript
// ❌ PROBLEM - Params lost in nested navigation
navigation.navigate('Children', { childId: '123' });

// ✅ SOLUTION - Pass params to nested screen
navigation.navigate('Children', {
  screen: 'ChildProgress',
  params: { childId: '123' }
});
```

---

### Error 1.4: Back Button Not Blocked

**Issue:**
User presses Android back button on form, loses all unsaved data.

**What It Means:**
No back button guard implemented for form screens.

**Solution:**

```typescript
// ❌ PROBLEM - No back button guard
const EditProfileScreen = () => {
  const [name, setName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <BaseScreen>
      <TextInput value={name} onChangeText={setName} />
      <Button onPress={handleSave}>Save</Button>
    </BaseScreen>
  );
};

// ✅ SOLUTION - Add useBlockBack
import { useBlockBack } from '../../hooks/useBlockBack';

const EditProfileScreen = () => {
  const [name, setName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Block back button when there are unsaved changes
  useBlockBack(hasChanges, 'You have unsaved changes. Discard?');

  return (
    <BaseScreen>
      <TextInput
        value={name}
        onChangeText={(text) => {
          setName(text);
          setHasChanges(true);
        }}
      />
      <Button onPress={handleSave}>Save</Button>
    </BaseScreen>
  );
};
```

---

## 2. TypeScript Errors

### Error 2.1: Navigation Params Type Mismatch

**Error Message:**
```
Argument of type '{ childId: string }' is not assignable to parameter of type 'undefined'.
```

**What It Means:**
Screen expects params but type definition says it takes `undefined`.

**Solution:**

```typescript
// ❌ PROBLEM - Type says no params but code passes params
export type ParentStackParamList = {
  ChildDetail: undefined;  // Says no params
};

safeNavigate('ChildDetail', { childId: '123' });  // Error!

// ✅ SOLUTION - Define params in type
export type ParentStackParamList = {
  ChildDetail: { childId: string };  // Now accepts params
};

safeNavigate('ChildDetail', { childId: '123' });  // ✅ Works!
```

---

### Error 2.2: Optional Params Not Marked

**Error Message:**
```
Argument of type '[]' is not assignable to parameter of type
'[screen: "MakePayment", params: { amount: number }]'.
```

**What It Means:**
Screen has required params but you want to navigate without params.

**Solution:**

```typescript
// ❌ PROBLEM - Amount is required
export type ParentStackParamList = {
  MakePayment: { amount: number; description: string };  // Both required
};

safeNavigate('MakePayment');  // Error - missing params!

// ✅ SOLUTION - Mark params as optional
export type ParentStackParamList = {
  MakePayment: { amount?: number; description?: string };  // Both optional
};

safeNavigate('MakePayment');  // ✅ Works!
safeNavigate('MakePayment', { amount: 100 });  // ✅ Also works!
```

---

### Error 2.3: Wrong Screen Name Type

**Error Message:**
```
Argument of type '"ChildDetails"' is not assignable to parameter of type
'"ChildDetail" | "NewDashboard" | ...'.
```

**What It Means:**
Screen name has a typo or doesn't exist in type definition.

**Solution:**

```typescript
// ❌ PROBLEM - Typo in screen name
safeNavigate('ChildDetails', { childId });  // ChildDetails (plural)

// ✅ SOLUTION - Use exact name from type definition
safeNavigate('ChildDetail', { childId });  // ChildDetail (singular)
```

**Pro Tip:** Use TypeScript autocomplete - type `safeNavigate('` and press Ctrl+Space to see all valid screen names.

---

### Error 2.4: Component Props Missing Types

**Error Message:**
```
Parameter 'props' implicitly has an 'any' type.
```

**What It Means:**
Screen component props aren't typed.

**Solution:**

```typescript
// ❌ PROBLEM - No types
const ChildDetailScreen = (props) => {  // 'props' is 'any'
  const { childId } = props.route.params;
  return <BaseScreen>...</BaseScreen>;
};

// ✅ SOLUTION - Add proper types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ParentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ParentStackParamList, 'ChildDetail'>;

const ChildDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { childId } = route.params;  // ✅ Fully typed!
  return <BaseScreen>...</BaseScreen>;
};
```

---

## 3. Validation Errors

### Error 3.1: Invalid UUID Format

**Error Message:**
```
[Navigation] Validation failed for ChildDetail:
- childId: Invalid ID format
```

**What It Means:**
Param value doesn't match Zod schema (expected UUID, got something else).

**Common Causes:**
1. Passing plain string instead of UUID
2. Passing number instead of string
3. Corrupted/truncated UUID from deep link

**Solution:**

```typescript
// ❌ PROBLEM - Not a valid UUID
const childId = '123';  // Just a number string
safeNavigateWithValidation(
  navigation,
  'ChildDetail',
  ChildDetailParamsSchema,  // Expects UUID
  { childId }
);
// Returns false, logs error

// ✅ SOLUTION 1 - Use actual UUID from database
const childId = '550e8400-e29b-41d4-a716-446655440000';  // Valid UUID
safeNavigateWithValidation(
  navigation,
  'ChildDetail',
  ChildDetailParamsSchema,
  { childId }
);
// ✅ Works!

// ✅ SOLUTION 2 - Handle validation failure gracefully
const success = safeNavigateWithValidation(
  navigation,
  'ChildDetail',
  ChildDetailParamsSchema,
  { childId: maybeInvalidId }
);

if (!success) {
  Alert.alert('Error', 'Invalid child ID. Please try again.');
}
```

---

### Error 3.2: Required Field Missing

**Error Message:**
```
[Navigation] Validation failed for SubjectDetail:
- subject: Required
```

**What It Means:**
Required param wasn't provided.

**Solution:**

```typescript
// ❌ PROBLEM - Missing required param
safeNavigateWithValidation(
  navigation,
  'SubjectDetail',
  SubjectDetailParamsSchema,
  { studentId: '123' }  // Missing 'subject'
);

// ✅ SOLUTION - Provide all required params
safeNavigateWithValidation(
  navigation,
  'SubjectDetail',
  SubjectDetailParamsSchema,
  {
    studentId: '550e8400-e29b-41d4-a716-446655440000',
    subject: 'Mathematics',  // ✅ Now provided
  }
);
```

---

### Error 3.3: Number Validation Failed

**Error Message:**
```
[Navigation] Validation failed for MakePayment:
- amount: Amount must be positive
```

**What It Means:**
Number param doesn't meet constraints (e.g., negative number when positive required).

**Solution:**

```typescript
// ❌ PROBLEM - Negative or zero amount
safeNavigateWithValidation(
  navigation,
  'MakePayment',
  MakePaymentParamsSchema,
  { amount: -100 }  // Negative!
);

// ✅ SOLUTION - Validate before navigation
const handleMakePayment = (amount: number) => {
  if (amount <= 0) {
    Alert.alert('Error', 'Please enter a valid payment amount');
    return;
  }

  safeNavigateWithValidation(
    navigation,
    'MakePayment',
    MakePaymentParamsSchema,
    { amount }
  );
};
```

---

## 4. Deep Linking Errors

### Error 4.1: Deep Link Not Opening App

**Issue:**
Clicking deep link URL doesn't open the app.

**Common Causes:**
1. URL scheme not registered in app config
2. Wrong domain in deep link config
3. App not installed

**Solution:**

**Step 1:** Check AndroidManifest.xml (Android)
```xml
<!-- ✅ REQUIRED - URL scheme config -->
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="manushicoaching" />
  <data android:host="app.manushicoaching.com" android:scheme="https" />
</intent-filter>
```

**Step 2:** Check Info.plist (iOS)
```xml
<!-- ✅ REQUIRED - URL scheme config -->
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>manushicoaching</string>
    </array>
  </dict>
</array>
```

**Step 3:** Verify deep link config matches
```typescript
// src/config/deepLinking.ts
export const deepLinkConfig = {
  prefixes: [
    'manushicoaching://',  // Must match scheme in manifest
    'https://app.manushicoaching.com',  // Must match domain in manifest
  ],
  // ...
};
```

---

### Error 4.2: Deep Link Opens App But Wrong Screen

**Issue:**
Deep link opens app but doesn't navigate to correct screen.

**Common Causes:**
1. URL path doesn't match config
2. Params not extracted correctly
3. Screen not registered

**Solution:**

```typescript
// ❌ PROBLEM - Path doesn't match
// URL: https://app.manushicoaching.com/child/123/details
// Config expects: /parent/child/:childId/progress

// ✅ SOLUTION - Match URL to config
export const deepLinkConfig = {
  config: {
    screens: {
      ChildProgress: {
        path: 'parent/child/:childId/progress',  // Must match URL structure
        parse: {
          childId: (childId: string) => {
            // Validate and return
            return validateDeepLinkParams(ChildIdSchema, childId) || undefined;
          },
        },
      },
    },
  },
};

// Generate link that matches config
const url = generateDeepLink('ChildProgress', { childId: '123' });
// Returns: "https://app.manushicoaching.com/parent/child/123/progress"
// ✅ Matches config path exactly!
```

---

### Error 4.3: Deep Link Params Invalid

**Issue:**
Deep link opens app but crashes or shows error.

**Common Causes:**
1. Corrupted UUID in URL
2. Required params missing from URL
3. No validation before navigation

**Solution:**

```typescript
// ❌ PROBLEM - No validation
export const deepLinkConfig = {
  config: {
    screens: {
      ChildProgress: {
        path: 'parent/child/:childId/progress',
        // No parse/validation - passes bad params directly!
      },
    },
  },
};

// ✅ SOLUTION - Add validation
export const deepLinkConfig = {
  config: {
    screens: {
      ChildProgress: {
        path: 'parent/child/:childId/progress',
        parse: {
          childId: (childId: string) => {
            // Validate before passing to screen
            const validated = validateDeepLinkParams(ChildIdSchema, childId);
            if (!validated) {
              console.error('❌ Invalid childId in deep link:', childId);
              return undefined;  // Screen will show error state
            }
            return validated;
          },
        },
      },
    },
  },
};
```

---

## 5. Data Fetching Errors

### Error 5.1: Query Key Not Reactive

**Issue:**
Data doesn't refetch when params change.

**Common Causes:**
1. Query key doesn't include reactive dependencies
2. Using static query key with dynamic data

**Solution:**

```typescript
// ❌ PROBLEM - Query key doesn't include childId
const { data } = useQuery({
  queryKey: ['child'],  // Static - doesn't change when childId changes!
  queryFn: () => fetchChild(childId),
});

// ✅ SOLUTION - Include dependencies in query key
const { data } = useQuery({
  queryKey: ['child', childId],  // Reactive - refetches when childId changes!
  queryFn: () => fetchChild(childId),
});

// ✅ EVEN BETTER - Use query keys factory
import { parentQueries } from '../../services/api/queryKeys';

const { data } = useQuery({
  queryKey: parentQueries.childDetail(childId),  // Centralized + reactive
  queryFn: () => fetchChild(childId),
});
```

---

### Error 5.2: Supabase RLS Error

**Error Message:**
```
Error: new row violates row-level security policy for table "students"
```

**What It Means:**
Row-Level Security (RLS) policy prevents the operation.

**Common Causes:**
1. User doesn't have permission to access data
2. RLS policy misconfigured
3. Wrong user ID in query

**Solution:**

**Step 1:** Check if RLS is the issue
```typescript
// Test query with service role (bypasses RLS)
const { data, error } = await supabase
  .from('students')
  .select('*')
  .eq('id', childId);

// If this works, it's an RLS issue
```

**Step 2:** Fix RLS policy in Supabase dashboard
```sql
-- ❌ PROBLEM - Too restrictive
CREATE POLICY "Users can view own children"
ON students FOR SELECT
USING (false);  -- Blocks everything!

-- ✅ SOLUTION - Allow parents to view their children
CREATE POLICY "Parents can view own children"
ON students FOR SELECT
USING (
  parent_id = auth.uid()  -- Match authenticated parent
);
```

**Step 3:** Ensure correct user ID in query
```typescript
// ❌ PROBLEM - Using wrong ID
const parentId = '123';  // Hardcoded ID
const { data } = await supabase
  .from('students')
  .select('*')
  .eq('parent_id', parentId);  // Won't match RLS policy!

// ✅ SOLUTION - Use authenticated user ID
import { useAuth } from '../../hooks/useAuth';

const { user } = useAuth();
const { data } = await supabase
  .from('students')
  .select('*')
  .eq('parent_id', user.id);  // ✅ Matches RLS policy!
```

---

### Error 5.3: Mock Data in Production

**Issue:**
Real data not showing, mock data displays instead.

**What It Means:**
Code using hardcoded mock arrays instead of Supabase queries.

**Solution:**

```typescript
// ❌ PROBLEM - Mock data (forbidden!)
const children = [
  { id: '1', name: 'Test Child', grade: 85 },
  { id: '2', name: 'Another Child', grade: 92 },
];

return (
  <FlatList
    data={children}
    renderItem={renderChild}
  />
);

// ✅ SOLUTION - Real Supabase data
import { useQuery } from '@tanstack/react-query';
import { parentQueries } from '../../services/api/queryKeys';

const { data: children, isLoading, error } = useQuery({
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

return (
  <BaseScreen loading={isLoading} error={error} empty={!children?.length}>
    <FlatList
      data={children}
      renderItem={renderChild}
    />
  </BaseScreen>
);
```

---

### Error 5.4: Zod Validation Failed

**Error Message:**
```
ZodError: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "number",
    "path": ["student_id"]
  }
]
```

**What It Means:**
Data from Supabase doesn't match Zod schema.

**Common Causes:**
1. Database schema changed but Zod schema didn't
2. Wrong field types in Zod schema
3. Missing fields in Supabase query

**Solution:**

```typescript
// ❌ PROBLEM - Schema doesn't match database
const ChildSchema = z.object({
  id: z.string().uuid(),
  student_id: z.string(),  // Database has number, schema expects string!
  full_name: z.string(),
});

// ✅ SOLUTION - Match database types exactly
const ChildSchema = z.object({
  id: z.string().uuid(),
  student_id: z.number(),  // ✅ Matches database
  full_name: z.string(),
});

// ✅ OR - Transform database type to desired type
const ChildSchema = z.object({
  id: z.string().uuid(),
  student_id: z.number().transform(String),  // Convert number → string
  full_name: z.string(),
});
```

---

## 6. Performance Issues

### Issue 6.1: Screen Renders Slowly

**Symptoms:**
- Long delay before screen appears
- Janky scrolling
- UI freezes

**Common Causes:**
1. Heavy computation in render
2. Large list without optimization
3. Too many re-renders

**Solution:**

**Fix 1: Memoize Heavy Computations**
```typescript
// ❌ PROBLEM - Runs on every render
const ChildDetailScreen = ({ route }) => {
  const { childId } = route.params;
  const { data: child } = useQuery(/* ... */);

  // ❌ Runs expensive calculation on EVERY render!
  const overallGrade = calculateComplexGrade(child?.subjects);

  return <T>Grade: {overallGrade}</T>;
};

// ✅ SOLUTION - Memoize computation
const ChildDetailScreen = ({ route }) => {
  const { childId } = route.params;
  const { data: child } = useQuery(/* ... */);

  // ✅ Only recalculates when child.subjects changes
  const overallGrade = useMemo(() => {
    return calculateComplexGrade(child?.subjects);
  }, [child?.subjects]);

  return <T>Grade: {overallGrade}</T>;
};
```

**Fix 2: Optimize FlatList**
```typescript
// ❌ PROBLEM - No optimizations
<FlatList
  data={largeArray}
  renderItem={({ item }) => <ChildCard child={item} />}
/>

// ✅ SOLUTION - All optimizations
const ITEM_HEIGHT = 100;

<FlatList
  data={largeArray}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  renderItem={({ item }) => <ChildCard child={item} />}
/>
```

**Fix 3: Memoize Components**
```typescript
// ❌ PROBLEM - Re-renders on every parent render
const ChildCard = ({ child }: { child: Child }) => (
  <Card>
    <T>{child.full_name}</T>
  </Card>
);

// ✅ SOLUTION - Only re-renders when child changes
const ChildCard = React.memo(({ child }: { child: Child }) => (
  <Card>
    <T>{child.full_name}</T>
  </Card>
));
```

---

### Issue 6.2: Tab Switch Slow

**Symptoms:**
- Delay when switching tabs
- Memory usage high
- App crashes on low-memory devices

**Solution:**

```typescript
// ❌ PROBLEM - All tabs loaded at once
<Tab.Navigator>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Children" component={ChildrenScreen} />
  <Tab.Screen name="Communication" component={CommunicationScreen} />
  <Tab.Screen name="Billing" component={BillingScreen} />
</Tab.Navigator>

// ✅ SOLUTION - Optimize tab loading
<Tab.Navigator
  screenOptions={{
    lazy: true,                    // Load tabs only when accessed
    detachInactiveScreens: true,   // Unmount inactive tabs (40-60% memory savings)
    freezeOnBlur: true,            // Stop re-renders when tab not visible
  }}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Children" component={ChildrenScreen} />
  <Tab.Screen name="Communication" component={CommunicationScreen} />
  <Tab.Screen name="Billing" component={BillingScreen} />
</Tab.Navigator>
```

---

## 7. Build/Compilation Errors

### Error 7.1: TypeScript Compilation Errors

**Error Message:**
```
error TS2322: Type '{ childId: string; }' is not assignable to type 'undefined'.
```

**Solution:**
See [Error 2.1: Navigation Params Type Mismatch](#error-21-navigation-params-type-mismatch) above.

---

### Error 7.2: Metro Bundler Can't Resolve Module

**Error Message:**
```
Error: Unable to resolve module `../../utils/navigationService` from
`src/screens/parent/NewParentDashboard.tsx`
```

**Common Causes:**
1. File doesn't exist at that path
2. Typo in import path
3. Metro cache issue

**Solution:**

**Step 1:** Check file exists
```bash
ls src/utils/navigationService.ts
# If not found, file doesn't exist or path is wrong
```

**Step 2:** Fix import path
```typescript
// ❌ PROBLEM - Wrong path
import { safeNavigate } from '../../utils/navigationService';
// But file is at: src/services/navigationService.ts

// ✅ SOLUTION - Correct path
import { safeNavigate } from '../../services/navigationService';
```

**Step 3:** Clear Metro cache
```bash
# Clear cache and restart
npx react-native start --reset-cache
```

---

### Error 7.3: Duplicate Module Name

**Error Message:**
```
Error: jest-haste-map: Haste module naming collision: Duplicate module name: ChildDetailScreen
```

**Common Causes:**
1. Two files with same name in different folders
2. File exists in both src/ and backup/

**Solution:**

```bash
# ❌ PROBLEM - Duplicate files
src/screens/parent/ChildDetailScreen.tsx
backup/screens/parent/ChildDetailScreen.tsx

# ✅ SOLUTION - Exclude backup from Metro
# Edit metro.config.js
module.exports = {
  resolver: {
    blacklistRE: /backup\/.*/,  // Ignore backup folder
  },
};
```

---

## 8. Runtime Errors

### Error 8.1: Cannot Read Property of Undefined

**Error Message:**
```
TypeError: Cannot read property 'childId' of undefined
```

**Common Causes:**
1. Accessing route.params when they don't exist
2. Data not loaded yet
3. Optional param not provided

**Solution:**

```typescript
// ❌ PROBLEM - Assumes params always exist
const ChildDetailScreen = ({ route }) => {
  const { childId } = route.params;  // Crashes if params is undefined!
  return <T>{childId}</T>;
};

// ✅ SOLUTION 1 - Optional chaining
const ChildDetailScreen = ({ route }) => {
  const childId = route.params?.childId;

  if (!childId) {
    return <EmptyState message="Child ID is required" />;
  }

  return <T>{childId}</T>;
};

// ✅ SOLUTION 2 - Default values
const ChildDetailScreen = ({ route }) => {
  const { childId = '' } = route.params || {};

  if (!childId) {
    return <EmptyState message="Child ID is required" />;
  }

  return <T>{childId}</T>;
};
```

---

### Error 8.2: Hooks Called Conditionally

**Error Message:**
```
Error: Rendered fewer hooks than expected. This may be caused by an accidental early return statement.
```

**Common Causes:**
1. Calling hooks inside if/else
2. Early return before hooks
3. Hooks inside loops

**Solution:**

```typescript
// ❌ PROBLEM - Hook called conditionally
const ChildDetailScreen = ({ route }) => {
  if (!route.params?.childId) {
    return <EmptyState />;  // Early return!
  }

  const { data } = useQuery(/* ... */);  // ❌ Hook after conditional return!
};

// ✅ SOLUTION - Call hooks unconditionally
const ChildDetailScreen = ({ route }) => {
  const childId = route.params?.childId;

  // ✅ Hook always called
  const { data } = useQuery({
    queryKey: ['child', childId],
    queryFn: () => fetchChild(childId),
    enabled: !!childId,  // Only run query if childId exists
  });

  if (!childId) {
    return <EmptyState message="Child ID is required" />;
  }

  return <T>{data?.full_name}</T>;
};
```

---

### Error 8.3: State Update on Unmounted Component

**Error Message:**
```
Warning: Can't perform a React state update on an unmounted component.
```

**Common Causes:**
1. Async operation completes after component unmounts
2. Subscription not cleaned up
3. Timer not cleared

**Solution:**

```typescript
// ❌ PROBLEM - setState after unmount
const MyScreen = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);  // ❌ What if component unmounts before this?
  }, []);

  return <T>{data}</T>;
};

// ✅ SOLUTION 1 - Cleanup flag
const MyScreen = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchData().then((result) => {
      if (isMounted) {  // ✅ Only update if still mounted
        setData(result);
      }
    });

    return () => {
      isMounted = false;  // Cleanup
    };
  }, []);

  return <T>{data}</T>;
};

// ✅ SOLUTION 2 - Use React Query (handles this automatically)
const MyScreen = () => {
  const { data } = useQuery({
    queryKey: ['myData'],
    queryFn: fetchData,
  });

  return <T>{data}</T>;
};
```

---

## 9. Common Mistakes

### Mistake 9.1: Not Using BaseScreen

**Problem:**
Manually implementing loading/error/empty states for every screen.

**Solution:**

```typescript
// ❌ BAD - Manual state handling (100+ lines)
const ChildrenListScreen = () => {
  const { data, isLoading, error } = useQuery(/* ... */);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading children...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error.message}</Text>
        <Button title="Retry" onPress={refetch} />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No children found</Text>
        <Button title="Add Child" onPress={() => {}} />
      </View>
    );
  }

  return <FlatList data={data} renderItem={renderChild} />;
};

// ✅ GOOD - BaseScreen handles everything (10 lines)
const ChildrenListScreen = () => {
  const { data, isLoading, error } = useQuery(/* ... */);

  return (
    <BaseScreen
      scrollable
      loading={isLoading}
      error={error}
      empty={!data?.length}
      emptyMessage="No children found"
    >
      <FlatList data={data} renderItem={renderChild} />
    </BaseScreen>
  );
};
```

---

### Mistake 9.2: Inline Styles Instead of sx()

**Problem:**
Code is messy, inconsistent, hard to maintain.

**Solution:**

```typescript
// ❌ BAD - Inline styles
<View style={{ padding: 24, backgroundColor: '#FFFFFF', borderRadius: 8 }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000000' }}>
    Title
  </Text>
  <Text style={{ fontSize: 16, color: '#666666', marginTop: 8 }}>
    Description
  </Text>
</View>

// ✅ GOOD - sx() with theme tokens
import { Col, T, Spacer } from '../../ui';

<Col sx={{ p: 'xl', bg: 'surface', borderRadius: 'md' }}>
  <T variant="headline" weight="bold">Title</T>
  <Spacer size="sm" />
  <T variant="body" color="textSecondary">Description</T>
</Col>
```

---

### Mistake 9.3: Not Tracking Analytics

**Problem:**
No visibility into user behavior, can't improve UX.

**Solution:**

```typescript
// ❌ BAD - No analytics
const handleViewChild = (childId: string) => {
  navigation.navigate('ChildDetail', { childId });
};

// ✅ GOOD - Track before navigate
import { trackAction } from '../../utils/navigationAnalytics';

const handleViewChild = (childId: string) => {
  trackAction('view_child_detail', 'ChildrenList', { childId });
  safeNavigate('ChildDetail', { childId });
};
```

---

### Mistake 9.4: Not Validating Navigation Params

**Problem:**
App crashes when params are invalid (from deep links, etc.).

**Solution:**

```typescript
// ❌ BAD - No validation
const handleDeepLink = (params: any) => {
  navigation.navigate('ChildDetail', params);  // What if params.childId is invalid?
};

// ✅ GOOD - Validate before navigate
import { safeNavigateWithValidation, ChildDetailParamsSchema } from '../../shared/validation/navigationSchemas';

const handleDeepLink = (params: unknown) => {
  const success = safeNavigateWithValidation(
    navigation,
    'ChildDetail',
    ChildDetailParamsSchema,
    params
  );

  if (!success) {
    Alert.alert('Invalid Link', 'This link is not valid or has expired.');
  }
};
```

---

### Mistake 9.5: Not Memoizing List Components

**Problem:**
List scrolling is janky, app feels slow.

**Solution:**

```typescript
// ❌ BAD - Component re-renders unnecessarily
const ChildCard = ({ child }: { child: Child }) => (
  <Card>
    <T>{child.full_name}</T>
  </Card>
);

<FlatList
  data={children}
  renderItem={({ item }) => <ChildCard child={item} />}
/>

// ✅ GOOD - Memoized component
const ChildCard = React.memo(({ child }: { child: Child }) => (
  <Card>
    <T>{child.full_name}</T>
  </Card>
));

<FlatList
  data={children}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ChildCard child={item} />}
/>
```

---

## Troubleshooting Checklist

When something goes wrong, check these in order:

### 1. TypeScript Errors? ✅
- [ ] Run `npx tsc --noEmit` to see all errors
- [ ] Fix type mismatches in navigation params
- [ ] Ensure all components have proper types

### 2. Navigation Not Working? ✅
- [ ] Screen registered in ParentNavigator.tsx?
- [ ] Screen name matches type definition exactly?
- [ ] Using safeNavigate() instead of navigation.navigate()?
- [ ] Params match schema?

### 3. Data Not Loading? ✅
- [ ] Query key includes all dependencies?
- [ ] Supabase RLS policy allows access?
- [ ] Using real data (not mock arrays)?
- [ ] Zod schema matches database?

### 4. Performance Issues? ✅
- [ ] FlatList optimized (keyExtractor, getItemLayout, removeClippedSubviews)?
- [ ] Components memoized with React.memo?
- [ ] Heavy computations memoized with useMemo?
- [ ] Callbacks memoized with useCallback?

### 5. Build Failing? ✅
- [ ] Metro cache cleared? (`npx react-native start --reset-cache`)
- [ ] No duplicate files in src/ and backup/?
- [ ] All imports have correct paths?
- [ ] TypeScript compiles without errors?

---

## Quick Reference: Error → Solution

| Error | Quick Fix |
|-------|-----------|
| Screen not found | Register in ParentNavigator.tsx |
| Type mismatch | Update ParentStackParamList |
| Double navigation | Use safeNavigate() |
| Params lost | Pass through nested navigation correctly |
| Invalid UUID | Validate with safeNavigateWithValidation() |
| RLS error | Fix Supabase policy or use correct user ID |
| Mock data | Replace with useQuery + Supabase |
| Slow scrolling | Optimize FlatList + memoize components |
| State update on unmount | Use cleanup in useEffect or React Query |
| Module not found | Check import path + clear Metro cache |

---

**Remember:** Follow the Acceptance Checklist to prevent most errors before they happen! ✅

**See also:**
- `FEATURES_ADDED.md` - What features are available
- `USAGE_GUIDE.md` - How to use features correctly
- `ACCEPTANCE_CHECKLIST.md` - Quality gate for each screen

## Error 8.X: Badge Component TypeError - Cannot Read Property bg

**Error Message:**
```
TypeError: Cannot read property 'bg' of undefined
This error is located at:
    at Badge (...)
```

**What It Means:**
Badge component is being used incorrectly - either with children instead of label prop, or with an invalid variant.

**Common Causes:**
1. Using children syntax: `<Badge>text</Badge>` instead of label prop
2. Using invalid variant: `variant="primary"` (only default/success/warning/error/info are valid)
3. Passing number to label without converting to string

**Solution:**

```typescript
// ❌ WRONG - Using children
<Badge variant="success">
  {child.status}
</Badge>

// ✅ CORRECT - Use label prop
<Badge variant="success" label={child.status} />

// ❌ WRONG - Invalid variant "primary"
<Badge variant="primary">New</Badge>

// ✅ CORRECT - Use "info" instead of "primary"
<Badge variant="info" label="New" />

// ❌ WRONG - Number without converting to string
<Badge variant="error">{count}</Badge>

// ✅ CORRECT - Convert to string
<Badge variant="error" label={String(count)} />
```

**Valid Badge Variants:**
- `default` - Neutral (gray)
- `success` - Green (completed, active)
- `warning` - Orange (pending, caution)
- `error` - Red (failed, overdue)
- `info` - Blue (new, information)

**Reference:** See BADGE_ERROR_FIXED_REFERENCE.md for complete guide

---

