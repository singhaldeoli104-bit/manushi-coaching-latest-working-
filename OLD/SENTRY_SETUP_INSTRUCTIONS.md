# Sentry Setup Instructions - Sprint 0

## ⚠️ Important Note

**Our project has a constraint: NO PACKAGE MODIFICATIONS without approval.**

However, Sentry is critical for Sprint 0 (Security & Observability) and production monitoring. You'll need to install it.

---

## Step 1: Install Sentry SDK

```bash
cd C:/PC/OLD
npm install @sentry/react-native
```

---

## Step 2: Run Sentry Wizard

The wizard will automatically configure your project:

```bash
npx @sentry/wizard -i reactNative -p android,ios
```

**What the wizard does:**
- Creates Sentry configuration files
- Adds build scripts
- Configures source maps for error tracking
- Sets up iOS and Android integrations

---

## Step 3: Get Your Sentry DSN

1. Go to https://sentry.io
2. Create a new project (or use existing)
3. Copy your DSN (looks like: `https://xxx@xxx.ingest.sentry.io/xxx`)

---

## Step 4: Add DSN to Environment

Create or update `.env` file:

```bash
# Add to C:/PC/OLD/.env
SENTRY_DSN=your-dsn-here
NODE_ENV=development
```

**For production:**
```bash
SENTRY_DSN=your-production-dsn
NODE_ENV=production
```

---

## Step 5: Initialize Sentry in App.tsx

**Update** `src/App.tsx`:

```typescript
import { initSentry } from './config/sentry';

// Initialize Sentry BEFORE anything else
initSentry();

function App() {
  // ... rest of your app
}
```

---

## Step 6: Test Sentry Integration

**Add a test button to trigger an error:**

```typescript
import { captureException, generateCorrelationId, setCorrelationId } from './config/sentry';

function TestSentryButton() {
  const handleTest = () => {
    const correlationId = generateCorrelationId();
    setCorrelationId(correlationId);

    try {
      throw new Error('Test error from Sprint 0');
    } catch (error) {
      captureException(error, {
        testData: 'This is a test',
        userId: 'test-user',
      });
    }
  };

  return (
    <Button onPress={handleTest} title="Test Sentry" />
  );
}
```

**Expected Result:**
- Error appears in Sentry dashboard
- Tagged with correlation ID
- Includes test context data

---

## Step 7: Integrate with useSecureRPC

**Update** `src/hooks/useSecureRPC.ts`:

Add at the top:
```typescript
import { setCorrelationId, clearCorrelationId, captureException } from '../config/sentry';
```

Update `executeSecureRPC`:
```typescript
async function executeSecureRPC(request: SecureWriteRequest): Promise<SecureWriteResponse> {
  // Generate correlation ID
  const correlationId = generateCorrelationId();
  setCorrelationId(correlationId);

  try {
    const { data, error } = await supabase.functions.invoke(/*...*/);

    if (error) {
      captureException(new Error(error.message), {
        action: request.action,
        targetId: request.targetId,
        correlationId,
      });
      throw error;
    }

    return data;
  } finally {
    clearCorrelationId();
  }
}
```

---

## Step 8: Verify Setup

### Test Checklist:
- [ ] Sentry SDK installed
- [ ] Wizard run successfully
- [ ] DSN added to .env
- [ ] initSentry() called in App.tsx
- [ ] Test error captured in dashboard
- [ ] Correlation ID visible in Sentry
- [ ] User context set on login
- [ ] Breadcrumbs showing navigation

### View in Sentry:
1. Go to your Sentry project
2. Click "Issues"
3. You should see your test error
4. Click on it to see:
   - Correlation ID tag
   - User context
   - Breadcrumbs
   - Stack trace

---

## Step 9: Production Configuration

**Environment-specific settings:**

```typescript
// src/config/sentry.ts (already configured)
const SENTRY_CONFIG = {
  tracesSampleRate: __DEV__ ? 0.1 : 1.0,  // 10% dev, 100% prod
  debug: __DEV__,                          // Only in dev
};
```

**Release tracking:**

```bash
# During build, set release version
export SENTRY_RELEASE="coaching-admin@1.0.0"
npx react-native run-android --variant=release
```

---

## Common Issues & Solutions

### Issue 1: "Sentry is not defined"
**Solution:** Import sentry config in App.tsx before anything else

### Issue 2: "DSN not configured"
**Solution:** Check .env file exists and has correct DSN

### Issue 3: "Errors not showing in dashboard"
**Solution:**
- Check DSN is correct
- Verify network connectivity
- Check Sentry project is active

### Issue 4: "Source maps not working"
**Solution:**
- Run wizard again
- Check build scripts added correctly
- Upload source maps manually if needed

---

## Integration Points

### 1. Secure RPC (useSecureRPC.ts)
- Automatically sets correlation ID
- Captures RPC errors
- Tags with action/targetId

### 2. Navigation (navigationService.ts)
- Track screen views
- Add navigation breadcrumbs

### 3. Auth (AuthContext.tsx)
- Set user context on login
- Clear user context on logout

### 4. API Calls (everywhere)
- Track API performance
- Capture API errors
- Monitor response times

---

## Sprint 0 Sign-off Requirement

**Sentry must be:**
- ✅ Installed and configured
- ✅ Capturing errors with correlation IDs
- ✅ Tracking user context
- ✅ Monitoring performance
- ✅ Verified in production-like environment

---

## After Setup

Update Sprint 0 tracking:
- Mark "Integrate Sentry" as ✅ Complete
- Test correlation ID tracking
- Verify error capture
- Move to Performance Budgets

---

**Questions?** Check Sentry docs: https://docs.sentry.io/platforms/react-native/

**Ready to proceed?** Run the commands above and test!
