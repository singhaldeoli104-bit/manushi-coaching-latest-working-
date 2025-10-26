# Navigation Quick Reference Card

**🚀 Quick copy-paste examples for common navigation patterns**

---

## Safe Navigation (Prevents Double-Tap)

```tsx
import { safeNavigate } from '@/utils/navigationService';

// Navigate to screen
safeNavigate('ChildDetail', { childId: '...' });

// Navigate without params
safeNavigate('ParentDashboard');

// Go back
import { goBack } from '@/utils/navigationService';
goBack();
```

---

## Protect Forms (Block Back Button)

```tsx
import { useBlockBack } from '@/hooks/useBlockBack';

const MyForm = () => {
  const [data, setData] = useState({});
  const isDirty = /* check if form changed */;

  useBlockBack(isDirty); // Shows default "Unsaved changes" dialog

  return <Form />;
};
```

**Custom message:**

```tsx
useBlockBack(isDirty, 'Discard payment details?', 'Unsaved Payment');
```

**Custom handler:**

```tsx
useBlockBack({
  enabled: isRecording,
  onBackPress: () => {
    stopRecording();
    return true; // Block navigation
  }
});
```

---

## Track Events

```tsx
import { trackAction, trackEvent } from '@/utils/navigationAnalytics';

// Track button click
trackAction('make_payment', 'BillingScreen', { amount: 500 });

// Track custom event
trackEvent('purchase_completed', {
  amount: 1200,
  currency: 'INR',
  plan: 'Premium'
});

// Get session summary
import { getAnalyticsSummary } from '@/utils/navigationAnalytics';
const summary = getAnalyticsSummary();
console.log(summary.sessionDuration); // seconds
```

---

## Validate Before Navigation

```tsx
import { safeNavigateWithValidation } from '@/shared/validation/navigationSchemas';
import { ChildDetailParamsSchema } from '@/shared/validation/navigationSchemas';

const handlePress = () => {
  const success = safeNavigateWithValidation(
    navigation,
    'ChildDetail',
    ChildDetailParamsSchema,
    { childId: someId }
  );

  if (!success) {
    Alert.alert('Error', 'Invalid child ID');
  }
};
```

---

## Deep Links

**Generate shareable link:**

```tsx
import { generateDeepLink } from '@/config/deepLinking';

const url = generateDeepLink('ChildProgress', { childId });
Share.share({ message: `View progress: ${url}` });
```

**Test deep link:**

```bash
# Android
adb shell am start -W -a android.intent.action.VIEW \
  -d "manushicoaching://parent/child/{UUID}/progress"

# iOS
xcrun simctl openurl booted "manushicoaching://parent/dashboard"
```

---

## Clear Navigation State (Logout)

```tsx
import { clearNavigationState } from '@/utils/navigationPersistence';

const handleLogout = async () => {
  await clearNavigationState();
  await logout();
  navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
};
```

---

## Available Validation Schemas

- `ChildDetailParamsSchema` → `{ childId: UUID }`
- `ChildProgressParamsSchema` → `{ childId: UUID }`
- `ChildAttendanceParamsSchema` → `{ childId: UUID }`
- `ChildAssignmentsParamsSchema` → `{ childId: UUID }`
- `ChildTestsParamsSchema` → `{ childId: UUID }`
- `TeacherCommunicationParamsSchema` → `{ teacherId: UUID }`
- `ParentChatParamsSchema` → `{ recipientId?: UUID }`
- `ParentReportsParamsSchema` → `{ childId: UUID }`

---

## Supported Deep Link URLs

```
manushicoaching://parent/dashboard
manushicoaching://parent/child/{childId}
manushicoaching://parent/child/{childId}/progress
manushicoaching://parent/child/{childId}/attendance
manushicoaching://parent/teacher/{teacherId}
manushicoaching://parent/chat/{recipientId}
manushicoaching://parent/payments
manushicoaching://parent/notifications

https://app.manushicoaching.com/parent/... (same as above)
```

---

## Common Patterns

### Pattern 1: List Item Navigation

```tsx
const ChildListItem = ({ child }) => (
  <TouchableOpacity
    onPress={() => safeNavigate('ChildDetail', { childId: child.id })}
  >
    <Text>{child.name}</Text>
  </TouchableOpacity>
);
```

### Pattern 2: Form with Unsaved Changes Guard

```tsx
const EditProfile = () => {
  const [data, setData] = useState(original);
  const isDirty = JSON.stringify(data) !== JSON.stringify(original);

  useBlockBack(isDirty);

  return <Form />;
};
```

### Pattern 3: Payment Flow with Analytics

```tsx
const Payment = () => {
  const [processing, setProcessing] = useState(false);

  useBlockBack(processing, 'Payment in progress...');

  const handlePay = async () => {
    setProcessing(true);
    trackAction('initiate_payment', 'PaymentScreen', { amount });

    try {
      await process();
      trackEvent('payment_success', { amount });
      safeNavigate('PaymentSuccess', { amount });
    } catch (e) {
      trackEvent('payment_failed', { error: e.message });
      Alert.alert('Error', e.message);
    } finally {
      setProcessing(false);
    }
  };

  return <PaymentForm onPay={handlePay} />;
};
```

### Pattern 4: Notification Handler

```tsx
const Notification = ({ notif }) => {
  const handlePress = () => {
    trackAction('notification_opened', 'NotificationScreen', {
      type: notif.type
    });

    const success = safeNavigateWithValidation(
      navigation,
      notif.screen,
      getSchemaForScreen(notif.screen),
      notif.data
    );

    if (!success) {
      Alert.alert('Error', 'Unable to open notification');
    }
  };

  return <Button onPress={handlePress}>Open</Button>;
};
```

---

## Debug Console Logs

```
✅ [Navigation] Navigating to: ChildDetail with params
🚫 [Navigation] Blocked rapid navigation attempt (debounced)
📊 [Analytics] Screen View: { screen: 'ChildProgress', from: 'ParentDashboard' }
💾 [NavPersist] State saved
🔗 [DeepLink] External URL: manushicoaching://...
❌ [NavValidation] Invalid params: ["childId: Invalid UUID format"]
```

---

**Need more details?** See `NAVIGATION_ENHANCEMENTS_GUIDE.md`
