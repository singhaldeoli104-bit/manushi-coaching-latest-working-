# 🚀 MANUSHI COACHING PLATFORM - COMPLETE LAUNCH PREPARATION GUIDE

**Document Version**: 1.0
**Last Updated**: 2025-10-15
**Project Status**: 49% Complete (Ready for Development → Production)

---

## 📑 TABLE OF CONTENTS

1. [Current Status Overview](#current-status-overview)
2. [Prerequisites & Requirements](#prerequisites--requirements)
3. [Phase 1: Backend Setup (Days 1-2)](#phase-1-backend-setup-days-1-2)
4. [Phase 2: Environment Configuration (Day 1)](#phase-2-environment-configuration-day-1)
5. [Phase 3: Database Migration (Day 1)](#phase-3-database-migration-day-1)
6. [Phase 4: Third-Party Service Integration (Days 2-3)](#phase-4-third-party-service-integration-days-2-3)
7. [Phase 5: Replace Mock Data with Real APIs (Days 3-5)](#phase-5-replace-mock-data-with-real-apis-days-3-5)
8. [Phase 6: Testing & Quality Assurance (Days 2-3)](#phase-6-testing--quality-assurance-days-2-3)
9. [Phase 7: Production Build & Deployment (Days 1-2)](#phase-7-production-build--deployment-days-1-2)
10. [Phase 8: Play Store Submission (Days 2-3)](#phase-8-play-store-submission-days-2-3)
11. [Post-Launch Monitoring](#post-launch-monitoring)
12. [Troubleshooting Guide](#troubleshooting-guide)

---

## CURRENT STATUS OVERVIEW

### ✅ What's Complete (93% UI, 33% Backend)

**Frontend (95% Complete)**:
- ✅ 50+ screens implemented across all roles
- ✅ Material Design 3 theme system
- ✅ Navigation system (AppNavigator.tsx)
- ✅ All UI components built
- ✅ Form validation (React Hook Form + Zod)
- ✅ 60 production libraries installed

**Build System (100% Complete)**:
- ✅ React Native 0.80.2 with New Architecture
- ✅ Optimized Gradle build (11-20 min builds)
- ✅ Version locking (npm-shrinkwrap.json)
- ✅ APK size optimization

### ⚠️ What's Incomplete (Critical Blockers)

**Backend Integration (33% Complete)**:
- ❌ Environment variables not configured (.env missing)
- ❌ Database migrations not applied to production
- ❌ All screens using MOCK DATA
- ❌ No real API integration
- ❌ Realtime context is stub only

**Third-Party Services (23% Complete)**:
- ❌ Stream.io not configured (live classes)
- ❌ Firebase not configured (push notifications)
- ❌ Razorpay not configured (payments)
- ❌ OpenAI not configured (AI features)
- ❌ Storage buckets not created

**Estimated Time to Launch**: 10-15 working days

---

## PREREQUISITES & REQUIREMENTS

### Required Accounts (Create These First)

1. **Supabase Account** (Database, Auth, Storage)
   - URL: https://supabase.com
   - Plan: Free tier is sufficient for beta
   - Status: ✅ Project exists: `qrwroibhzgywaiecbcoa`

2. **Stream.io Account** (Live Video Classes)
   - URL: https://getstream.io
   - Plan: $99/month for 1000 users OR Free tier (limited)
   - Status: ❌ Not created

3. **Firebase Account** (Push Notifications)
   - URL: https://console.firebase.google.com
   - Plan: Free tier (Spark plan)
   - Status: ❌ Not created

4. **Razorpay Account** (Primary Payment - India)
   - URL: https://razorpay.com
   - Plan: 2% transaction fee, no monthly fee
   - Status: ❌ Not created
   - **IMPORTANT**: Complete KYC before production

5. **OpenAI Account** (AI Features - Optional for v1.0)
   - URL: https://platform.openai.com
   - Plan: Pay-as-you-go ($0.002/1K tokens for GPT-4o)
   - Status: ❌ Not created

6. **Google Play Developer Account** (App Store)
   - URL: https://play.google.com/console
   - Cost: $25 one-time fee
   - Status: ❌ Not created

### Required Software/Tools

- ✅ Node.js 18+ (Already installed)
- ✅ Android Studio (Already installed)
- ✅ React Native CLI (Already installed)
- ✅ Git (Already installed)
- ❌ Flipper (For debugging - Optional but recommended)

### Budget Estimate

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Supabase | $0 | Free tier (500MB database, 1GB storage) |
| Stream.io | $99 | For 1000 users OR $0 (free tier with limits) |
| Firebase | $0 | Free tier (10K messages/day) |
| Razorpay | 2% per transaction | No monthly fee |
| OpenAI (Optional) | ~$20-50 | Based on usage |
| Play Store | $25 | One-time fee |
| **Total** | ~$119-169/month | + transaction fees |

---

## PHASE 1: BACKEND SETUP (Days 1-2)

### 🎯 Goal
Set up all backend services and verify they're working before integrating with the app.

---

### STEP 1.1: Supabase Database Setup (30 minutes)

#### **Action 1: Verify Supabase Project**

1. Open browser and go to https://supabase.com/dashboard
2. Login to your account
3. You should see project: `qrwroibhzgywaiecbcoa`
4. Click on the project to open it

**Verify these credentials**:
- Project URL: `https://qrwroibhzgywaiecbcoa.supabase.co`
- API URL: `https://qrwroibhzgywaiecbcoa.supabase.co/rest/v1/`

#### **Action 2: Get Supabase API Keys**

1. In Supabase dashboard, click **Settings** (left sidebar, gear icon)
2. Click **API** tab
3. You'll see two keys:
   - **anon public** key (starts with `eyJhbGci...`)
   - **service_role** key (starts with `eyJhbGci...`)

**Copy both keys** - you'll need them in Phase 2.

#### **Action 3: Verify Database Connection**

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **+ New Query**
3. Paste this test query:

```sql
SELECT version();
```

4. Click **Run** (or Ctrl+Enter)
5. You should see PostgreSQL version info

**✅ Success Criteria**: Query runs without errors

---

### STEP 1.2: Create Storage Buckets (15 minutes)

Storage buckets are needed for file uploads (profile pictures, assignments, study materials).

#### **Action 1: Create Profile Pictures Bucket**

1. In Supabase dashboard, go to **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Bucket configuration:
   - **Name**: `profiles`
   - **Public bucket**: ✅ Check this (profile pictures are public)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/*`
4. Click **Create bucket**

#### **Action 2: Create Assignments Bucket**

1. Click **Create a new bucket** again
2. Configuration:
   - **Name**: `assignments`
   - **Public bucket**: ❌ Leave unchecked (only authenticated users)
   - **File size limit**: 50 MB
   - **Allowed MIME types**: `application/pdf, image/*, application/msword`
3. Click **Create bucket**

#### **Action 3: Create Doubts Bucket**

1. Click **Create a new bucket**
2. Configuration:
   - **Name**: `doubts`
   - **Public bucket**: ❌ Leave unchecked
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `image/*`
3. Click **Create bucket**

#### **Action 4: Create Study Materials Bucket**

1. Click **Create a new bucket**
2. Configuration:
   - **Name**: `study-materials`
   - **Public bucket**: ✅ Check this (course materials are public)
   - **File size limit**: 100 MB
   - **Allowed MIME types**: `application/pdf, video/mp4, image/*`
3. Click **Create bucket**

#### **Action 5: Configure Bucket Policies**

For the **assignments** bucket (private):

1. Click on **assignments** bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Choose **Custom** policy
5. Paste this SQL:

```sql
-- Policy: Students can upload their own assignments
CREATE POLICY "Students can upload assignments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'assignments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Students can view their own assignments
CREATE POLICY "Students can view own assignments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'assignments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Teachers can view all assignments
CREATE POLICY "Teachers can view all assignments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'assignments'
  AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher'
);
```

6. Click **Save**

**✅ Success Criteria**: You see 4 buckets in Storage section

---

### STEP 1.3: Enable Realtime (5 minutes)

1. In Supabase dashboard, go to **Database** → **Replication**
2. You should see a list of tables (after migration in Phase 3)
3. Enable realtime for these tables by toggling the switch:
   - ✅ `classes` (for live class updates)
   - ✅ `doubts` (for new questions)
   - ✅ `doubt_answers` (for new answers)
   - ✅ `attendance` (for attendance marking)
   - ✅ `submissions` (for assignment submissions)

**Note**: This step can only be done AFTER database migration (Phase 3)

---

## PHASE 2: ENVIRONMENT CONFIGURATION (Day 1)

### 🎯 Goal
Create `.env` file with all API keys and configure the app to use environment variables.

---

### STEP 2.1: Create Environment File (15 minutes)

#### **Action 1: Create .env File**

1. Open terminal in project directory:
```bash
cd C:/PC/old
```

2. Create `.env` file:
```bash
# For Windows PowerShell:
New-Item -Path .env -ItemType File

# For Windows Command Prompt:
type nul > .env

# For Git Bash/Linux:
touch .env
```

3. Open `.env` file in your code editor

#### **Action 2: Add Supabase Configuration**

Copy this template and fill in your actual values:

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
SUPABASE_URL=https://qrwroibhzgywaiecbcoa.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyd3JvaWJoemd5d2FpZWNiY29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjkwNTksImV4cCI6MjA3MjAwNTA1OX0.YwFEMqbGMraRS5xeZVqEZsqeBTYNqn0AtbL1rzjvghM

# Service role key (DO NOT expose in client app - only for admin scripts)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ============================================
# STREAM.IO CONFIGURATION (Live Classes)
# ============================================
STREAM_API_KEY=your_stream_api_key_here
STREAM_API_SECRET=your_stream_api_secret_here

# ============================================
# FIREBASE CONFIGURATION (Push Notifications)
# ============================================
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_PROJECT_ID=your_firebase_project_id_here
FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
FIREBASE_APP_ID=your_app_id_here

# ============================================
# RAZORPAY CONFIGURATION (Primary Payment)
# ============================================
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# ============================================
# STRIPE CONFIGURATION (Backup Payment)
# ============================================
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# ============================================
# OPENAI CONFIGURATION (AI Features - Optional)
# ============================================
OPENAI_API_KEY=your_openai_api_key_here

# ============================================
# APP CONFIGURATION
# ============================================
APP_ENV=development
APP_VERSION=1.0.0
API_TIMEOUT=30000
MAX_FILE_SIZE=52428800
```

#### **Action 3: Secure the .env File**

1. Open `.gitignore` file in project root
2. Add this line if not already present:
```
.env
.env.*
```

3. Verify `.env` is ignored:
```bash
git status
# .env should NOT appear in the list
```

**⚠️ CRITICAL**: Never commit `.env` to Git! API keys will be exposed.

---

### STEP 2.2: Install react-native-dotenv (10 minutes)

This library allows React Native to read `.env` files.

#### **Action 1: Install Package**

```bash
cd C:/PC/old
npm install react-native-dotenv --save-dev --legacy-peer-deps
```

#### **Action 2: Configure Babel**

1. Open `babel.config.js`
2. Add `react-native-dotenv` plugin:

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    'react-native-reanimated/plugin',  // MUST be last
  ],
};
```

#### **Action 3: Create TypeScript Types**

1. Create file: `src/types/env.d.ts`
2. Add type definitions:

```typescript
declare module '@env' {
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
  export const SUPABASE_SERVICE_ROLE_KEY: string;
  export const STREAM_API_KEY: string;
  export const STREAM_API_SECRET: string;
  export const FIREBASE_API_KEY: string;
  export const FIREBASE_PROJECT_ID: string;
  export const FIREBASE_MESSAGING_SENDER_ID: string;
  export const FIREBASE_APP_ID: string;
  export const RAZORPAY_KEY_ID: string;
  export const RAZORPAY_KEY_SECRET: string;
  export const STRIPE_PUBLISHABLE_KEY: string;
  export const OPENAI_API_KEY: string;
  export const APP_ENV: string;
  export const APP_VERSION: string;
}
```

---

### STEP 2.3: Update Supabase Config to Use Environment Variables (10 minutes)

#### **Action: Modify src/lib/supabase.ts**

Replace the hardcoded values with environment variables:

```typescript
/**
 * Enhanced Supabase Configuration
 * Manushi Coaching Platform Backend Integration
 */

import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types/database';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Environment Configuration
const getSupabaseConfig = () => {
  const supabaseUrl = SUPABASE_URL;
  const supabaseAnonKey = SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration. Please check your .env file.');
  }

  return { supabaseUrl, supabaseAnonKey };
};

const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

// Enhanced Supabase client with comprehensive configuration
export const supabase: SupabaseClient<Database> = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    storageKey: 'manushi-auth-token',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'x-application-name': 'Manushi-Coaching-Platform',
    },
  },
});

// ... rest of the file remains the same
```

---

### STEP 2.4: Test Environment Configuration (5 minutes)

#### **Action 1: Restart Metro Bundler**

```bash
# Stop current Metro (Ctrl+C)
npm start -- --reset-cache
```

#### **Action 2: Rebuild App**

```bash
npm run android:clean
npm run android:dev
```

#### **Action 3: Test in App**

Add a test screen or console log to verify:

```typescript
import { SUPABASE_URL } from '@env';

console.log('✅ Environment loaded:', SUPABASE_URL);
```

**✅ Success Criteria**: Console shows Supabase URL without errors

---

## PHASE 3: DATABASE MIGRATION (Day 1)

### 🎯 Goal
Apply all database migrations to create tables, RLS policies, and sample data.

**Time Required**: 45 minutes

---

### STEP 3.1: Prepare Migration Files (5 minutes)

#### **Action: Copy Migration Files**

1. Navigate to migrations folder:
```bash
cd C:/PC/PackageCheck/supabase/migrations
```

2. You should see these files:
- ✅ `01_create_profiles.sql`
- ✅ `02_create_academic_structure.sql`
- ✅ `03_create_assignments.sql`
- ✅ `04_create_attendance.sql`
- ✅ `05_create_doubts.sql`
- ✅ `06_insert_sample_data.sql` (optional)

---

### STEP 3.2: Apply Migrations (30 minutes)

**⚠️ IMPORTANT**: Run migrations in the exact order listed!

#### **Migration 1: Create Profiles Table (5 minutes)**

1. Open Supabase dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **+ New Query**
4. Open file: `01_create_profiles.sql`
5. Copy ALL content and paste into SQL Editor
6. Click **Run** (or Ctrl+Enter)
7. Wait for: ✅ "Success. No rows returned"

**What this migration does**:
- Creates `profiles` table (extends auth.users)
- Sets up Row Level Security (RLS) policies
- Creates auto-update triggers
- Adds profile creation trigger on user signup

**Verify**:
```sql
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles';
```

Expected columns: `id`, `email`, `full_name`, `role`, `phone`, `avatar_url`, `date_of_birth`, `created_at`, `updated_at`

---

#### **Migration 2: Academic Structure (5 minutes)**

1. Click **+ New Query** (new query)
2. Open file: `02_create_academic_structure.sql`
3. Copy and paste entire content
4. Click **Run**

**What this migration does**:
- Creates `batches` table (classes/grades like "Grade 10A")
- Creates `subjects` table (Math, Physics, Chemistry, etc.)
- Creates `classes` table (live class sessions)
- Creates `class_enrollments` table (student enrollments)
- Sets up RLS policies for each table

**Verify**:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name IN ('batches', 'subjects', 'classes', 'class_enrollments');
```

Expected: 4 tables listed

---

#### **Migration 3: Assignments & Submissions (5 minutes)**

1. Click **+ New Query**
2. Open file: `03_create_assignments.sql`
3. Copy and paste
4. Click **Run**

**What this migration does**:
- Creates `assignments` table (homework, tests)
- Creates `submissions` table (student submissions)
- Sets up RLS policies (students see only their submissions)
- Adds grading system (pending, submitted, graded)

**Verify**:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name IN ('assignments', 'submissions');
```

---

#### **Migration 4: Attendance Tracking (5 minutes)**

1. Click **+ New Query**
2. Open file: `04_create_attendance.sql`
3. Copy and paste
4. Click **Run**

**What this migration does**:
- Creates `attendance` table
- Links attendance to classes and students
- Sets up RLS policies (students see own, teachers see all)

**Verify**:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'attendance';
```

---

#### **Migration 5: Doubts/Q&A System (5 minutes)**

1. Click **+ New Query**
2. Open file: `05_create_doubts.sql`
3. Copy and paste
4. Click **Run**

**What this migration does**:
- Creates `doubts` table (student questions)
- Creates `doubt_answers` table
- Sets up upvoting system
- Allows students and teachers to answer

**Verify**:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name IN ('doubts', 'doubt_answers');
```

---

#### **Migration 6: Sample Data (OPTIONAL - 5 minutes)**

⚠️ Only run this if you want test data for development.

1. Click **+ New Query**
2. Open file: `06_insert_sample_data.sql`
3. Copy and paste
4. Click **Run**

**What this inserts**:
- 6 sample subjects (Math, Physics, Chemistry, Biology, English, Computer Science)
- 5 sample batches (Grade 10A, 10B, 11A, 11B, 12A)

**Skip this for production** - you'll add real data later.

---

### STEP 3.3: Verify All Tables Created (5 minutes)

#### **Action 1: Check Tables**

Run this query in SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected tables (10 total)**:
- ✅ `attendance`
- ✅ `assignments`
- ✅ `batches`
- ✅ `class_enrollments`
- ✅ `classes`
- ✅ `doubt_answers`
- ✅ `doubts`
- ✅ `profiles`
- ✅ `subjects`
- ✅ `submissions`

#### **Action 2: Check RLS Policies**

```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

You should see multiple policies for each table (insert, select, update, delete).

#### **Action 3: Test Database Connection from App**

1. Restart Metro bundler
2. Rebuild app
3. Check console logs for connection status

**✅ Success Criteria**:
- All 10 tables exist
- No migration errors
- App connects to database successfully

---

## PHASE 4: THIRD-PARTY SERVICE INTEGRATION (Days 2-3)

### 🎯 Goal
Set up and integrate all third-party services (Stream.io, Firebase, Razorpay, OpenAI).

---

### STEP 4.1: Stream.io Setup (Live Video Classes) - 2 hours

Stream.io enables live video classes, screen sharing, and real-time chat.

#### **Part A: Create Stream.io Account (10 minutes)**

1. Go to https://getstream.io
2. Click **Start Free Trial**
3. Sign up with email
4. Verify email address
5. You'll be redirected to dashboard

#### **Part B: Create Application (5 minutes)**

1. In Stream.io dashboard, click **Create App**
2. App configuration:
   - **App Name**: "Manushi Coaching Platform"
   - **Environment**: Development (for now)
   - **Region**: Singapore (closest to India)
3. Click **Create App**

#### **Part C: Get API Credentials (5 minutes)**

1. Click on your app
2. Go to **Overview** tab
3. You'll see:
   - **API Key** (e.g., `abc123xyz`)
   - **API Secret** (e.g., `def456uvw`)
4. Copy both and add to `.env` file:

```env
STREAM_API_KEY=abc123xyz
STREAM_API_SECRET=def456uvw
```

#### **Part D: Install Stream.io SDK (Already Installed!)**

The SDK is already in `package.json`:
- ✅ `@stream-io/video-react-native-sdk@1.21.2`
- ✅ `@stream-io/react-native-webrtc@125.4.4`

#### **Part E: Initialize Stream Client (30 minutes)**

Create a new file: `src/services/video/StreamVideoService.ts`

```typescript
import { StreamVideoClient, User } from '@stream-io/video-react-native-sdk';
import { STREAM_API_KEY } from '@env';
import { supabase } from '../../lib/supabase';

class StreamVideoService {
  private client: StreamVideoClient | null = null;

  async initializeClient(userId: string, userName: string) {
    try {
      // Get token from your backend (Supabase Edge Function)
      const token = await this.generateUserToken(userId);

      const user: User = {
        id: userId,
        name: userName,
      };

      this.client = new StreamVideoClient({
        apiKey: STREAM_API_KEY,
        user,
        token,
      });

      console.log('✅ Stream.io client initialized');
      return this.client;
    } catch (error) {
      console.error('❌ Failed to initialize Stream client:', error);
      throw error;
    }
  }

  async generateUserToken(userId: string): Promise<string> {
    // TODO: Create Supabase Edge Function to generate Stream token
    // For now, use development token from Stream.io dashboard

    // TEMPORARY: Get token from Stream.io dashboard → "Chat & Messaging" → "User Tokens"
    // In production, generate this server-side for security

    throw new Error('Token generation not implemented yet. See STEP 4.1 Part F.');
  }

  async createVideoCall(callId: string, callType: 'default' | 'livestream' = 'default') {
    if (!this.client) throw new Error('Stream client not initialized');

    const call = this.client.call(callType, callId);
    await call.create();

    console.log(`✅ Video call created: ${callId}`);
    return call;
  }

  async joinVideoCall(callId: string, callType: 'default' | 'livestream' = 'default') {
    if (!this.client) throw new Error('Stream client not initialized');

    const call = this.client.call(callType, callId);
    await call.join();

    console.log(`✅ Joined video call: ${callId}`);
    return call;
  }

  async leaveCall(callId: string) {
    if (!this.client) throw new Error('Stream client not initialized');

    const call = this.client.call('default', callId);
    await call.leave();

    console.log(`✅ Left video call: ${callId}`);
  }

  disconnectClient() {
    if (this.client) {
      this.client.disconnectUser();
      this.client = null;
      console.log('✅ Stream client disconnected');
    }
  }
}

export default new StreamVideoService();
```

#### **Part F: Create Token Generation Function (Advanced - 30 minutes)**

**Option 1: Use Stream.io Dashboard Token (Development Only)**

1. Go to Stream.io dashboard
2. Navigate to **Chat & Messaging** → **User Tokens**
3. Enter a user ID (e.g., `teacher_123`)
4. Click **Generate Token**
5. Copy the token
6. Use this in `generateUserToken()` method temporarily

⚠️ **This is NOT secure for production!** Tokens should be generated server-side.

**Option 2: Create Supabase Edge Function (Production - Recommended)**

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Create Edge Function:
```bash
supabase functions new generate-stream-token
```

3. Edit `supabase/functions/generate-stream-token/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { StreamChat } from 'https://esm.sh/stream-chat@8.12.0';

const STREAM_API_KEY = Deno.env.get('STREAM_API_KEY')!;
const STREAM_API_SECRET = Deno.env.get('STREAM_API_SECRET')!;

serve(async (req) => {
  try {
    const { userId } = await req.json();

    // Generate Stream token
    const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
    const token = serverClient.createToken(userId);

    return new Response(JSON.stringify({ token }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

4. Deploy Edge Function:
```bash
supabase functions deploy generate-stream-token
```

5. Update `generateUserToken()` to call Edge Function:

```typescript
async generateUserToken(userId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('generate-stream-token', {
    body: { userId },
  });

  if (error) throw error;
  return data.token;
}
```

#### **Part G: Test Stream.io Integration (15 minutes)**

Create a test screen to verify:

```typescript
// TestStreamScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import StreamVideoService from '../services/video/StreamVideoService';

export const TestStreamScreen = () => {
  const [status, setStatus] = useState('Not initialized');

  const testConnection = async () => {
    try {
      setStatus('Initializing...');
      await StreamVideoService.initializeClient('test_user_123', 'Test User');
      setStatus('✅ Connected successfully!');
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Stream.io Status: {status}</Text>
      <Button title="Test Connection" onPress={testConnection} />
    </View>
  );
};
```

**✅ Success Criteria**: Status shows "Connected successfully!"

---

### STEP 4.2: Firebase Setup (Push Notifications) - 1.5 hours

#### **Part A: Create Firebase Project (10 minutes)**

1. Go to https://console.firebase.google.com
2. Click **Add Project**
3. Project setup:
   - **Project Name**: "Manushi Coaching Platform"
   - **Enable Google Analytics**: ✅ Yes (recommended)
   - **Analytics Account**: Default or create new
4. Click **Create Project**
5. Wait ~30 seconds for project creation

#### **Part B: Add Android App (15 minutes)**

1. In Firebase console, click **Add App** → **Android** icon
2. Register app:
   - **Android package name**: `com.manushicoaching`
   - **App nickname**: "Manushi Coaching Android"
   - **Debug signing certificate**: Leave blank for now
3. Click **Register App**
4. Download `google-services.json`
5. Move file to `android/app/` directory:

```bash
# Windows
move ~/Downloads/google-services.json C:/PC/old/android/app/

# Verify file exists:
ls android/app/google-services.json
```

#### **Part C: Configure Android Build (10 minutes)**

1. Open `android/build.gradle`
2. Add Google Services plugin (if not already present):

```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'  // Add this line
    }
}
```

3. Open `android/app/build.gradle`
4. Add at the BOTTOM of the file:

```gradle
apply plugin: 'com.google.gms.google-services'  // Add this line
```

#### **Part D: Enable Firebase Cloud Messaging (5 minutes)**

1. In Firebase console, go to **Build** → **Cloud Messaging**
2. Click **Send your first message**
3. Copy the **Sender ID** (you'll need it for `.env`)

#### **Part E: Get Firebase Configuration (10 minutes)**

1. In Firebase console, click **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click on your Android app
4. You'll see:
   - **App ID**: `1:123456:android:abc...`
   - **API Key**: `AIzaSy...`
   - **Project ID**: `manushi-coaching`
   - **Sender ID**: `123456789`

5. Add to `.env`:

```env
FIREBASE_API_KEY=AIzaSy...
FIREBASE_PROJECT_ID=manushi-coaching
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456:android:abc...
```

#### **Part F: Initialize Firebase in App (20 minutes)**

**Firebase is already installed!** (`@react-native-firebase/app`, `@react-native-firebase/messaging`)

1. Open `App.tsx`
2. Add Firebase initialization at the top:

```typescript
import messaging from '@react-native-firebase/messaging';

// Request notification permission on app start
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('✅ Notification permission granted:', authStatus);
  }
}

function App(): React.JSX.Element {
  useEffect(() => {
    requestUserPermission();
  }, []);

  // ... rest of App component
}
```

#### **Part G: Create Notification Service (30 minutes)**

Create file: `src/services/notifications/PushNotificationService.ts`

```typescript
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

class PushNotificationService {
  async initialize() {
    // Request permission
    await messaging().requestPermission();

    // Get FCM token
    const token = await messaging().getToken();
    console.log('📱 FCM Token:', token);

    // Save token to Supabase (for sending notifications)
    await this.saveFCMToken(token);

    // Listen for foreground messages
    messaging().onMessage(async (remoteMessage) => {
      console.log('📬 Foreground notification:', remoteMessage);
      await this.displayNotification(remoteMessage);
    });

    // Listen for background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('📬 Background notification:', remoteMessage);
    });

    console.log('✅ Push notifications initialized');
  }

  async saveFCMToken(token: string) {
    // TODO: Save to Supabase profiles table
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('profiles')
      .update({ fcm_token: token })
      .eq('id', user.id);
  }

  async displayNotification(remoteMessage: any) {
    // Create notification channel (Android only)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // Display notification
    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'New Notification',
      body: remoteMessage.notification?.body || '',
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  async sendNotification(userId: string, title: string, body: string) {
    // Get user's FCM token from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('fcm_token')
      .eq('id', userId)
      .single();

    if (!profile?.fcm_token) {
      console.log('❌ User has no FCM token');
      return;
    }

    // TODO: Call Firebase Cloud Functions or Edge Function to send notification
    // This requires server-side code (can't send from client for security)
  }
}

export default new PushNotificationService();
```

#### **Part H: Add FCM Token Column to Profiles Table**

Run this in Supabase SQL Editor:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fcm_token TEXT;
```

#### **Part I: Test Push Notifications (10 minutes)**

1. Rebuild app:
```bash
npm run android:clean
npm run android:dev
```

2. Open app and check console for FCM token
3. Test notification from Firebase console:
   - Go to **Cloud Messaging** → **Send your first message**
   - **Title**: "Test Notification"
   - **Body**: "This is a test"
   - **Target**: Single device
   - **FCM Token**: Paste token from console
   - Click **Send**

**✅ Success Criteria**: Notification appears on device

---

### STEP 4.3: Razorpay Setup (Primary Payment) - 1 hour

Razorpay is the primary payment gateway for India.

#### **Part A: Create Razorpay Account (15 minutes)**

1. Go to https://razorpay.com
2. Click **Sign Up** → **For Businesses**
3. Fill in:
   - **Email**: Your business email
   - **Mobile**: Your phone number
   - **Business Name**: "Manushi Coaching Platform"
4. Verify email and phone
5. Complete business details

⚠️ **KYC Required for Production**: You need to submit:
- PAN Card
- GST Certificate (if applicable)
- Business proof
- Bank account details

**For testing, you can skip KYC and use Test Mode.**

#### **Part B: Get API Keys (5 minutes)**

1. Login to Razorpay dashboard
2. Go to **Settings** → **API Keys**
3. Generate **Test Keys** first:
   - **Key ID**: `rzp_test_abc123`
   - **Key Secret**: `xyz789def456` (only shown once - save it!)

4. Add to `.env`:

```env
RAZORPAY_KEY_ID=rzp_test_abc123
RAZORPAY_KEY_SECRET=xyz789def456
```

#### **Part C: Install Razorpay SDK (Already Installed!)**

✅ `react-native-razorpay@2.3.0` is in `package.json`

#### **Part D: Create Payment Service (30 minutes)**

Create file: `src/services/payment/RazorpayService.ts`

```typescript
import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_KEY_ID } from '@env';
import { supabase } from '../../lib/supabase';

export interface PaymentOptions {
  amount: number; // in rupees (will convert to paise)
  currency?: string;
  name: string;
  description: string;
  orderId?: string;
  prefill?: {
    email: string;
    contact: string;
    name: string;
  };
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

class RazorpayService {
  /**
   * Create Razorpay order (call from server/Edge Function for security)
   */
  async createOrder(amount: number, currency: string = 'INR'): Promise<string> {
    try {
      // TODO: Create Supabase Edge Function to generate Razorpay order
      // For now, using client-side (NOT RECOMMENDED for production)

      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: amount * 100, currency }, // Convert to paise
      });

      if (error) throw error;
      return data.orderId;
    } catch (error) {
      console.error('❌ Failed to create Razorpay order:', error);
      throw error;
    }
  }

  /**
   * Open Razorpay checkout
   */
  async openCheckout(options: PaymentOptions): Promise<PaymentResult> {
    try {
      const checkoutOptions = {
        key: RAZORPAY_KEY_ID,
        amount: options.amount * 100, // Convert rupees to paise
        currency: options.currency || 'INR',
        name: options.name,
        description: options.description,
        order_id: options.orderId,
        prefill: options.prefill,
        theme: {
          color: '#6750A4', // Primary color from theme
        },
      };

      const data = await RazorpayCheckout.open(checkoutOptions);

      console.log('✅ Payment successful:', data);

      // Verify payment signature (server-side)
      await this.verifyPayment(data.razorpay_payment_id, data.razorpay_order_id, data.razorpay_signature);

      return {
        success: true,
        paymentId: data.razorpay_payment_id,
        orderId: data.razorpay_order_id,
        signature: data.razorpay_signature,
      };
    } catch (error: any) {
      console.error('❌ Payment failed:', error);

      return {
        success: false,
        error: error.description || error.message || 'Payment failed',
      };
    }
  }

  /**
   * Verify payment signature (must be done server-side)
   */
  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: { paymentId, orderId, signature },
      });

      if (error || !data.verified) {
        throw new Error('Payment verification failed');
      }

      console.log('✅ Payment verified');
      return true;
    } catch (error) {
      console.error('❌ Payment verification failed:', error);
      throw error;
    }
  }

  /**
   * Save payment details to database
   */
  async savePayment(userId: string, paymentData: any) {
    const { error } = await supabase.from('payments').insert({
      user_id: userId,
      payment_id: paymentData.paymentId,
      order_id: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      status: 'success',
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('❌ Failed to save payment:', error);
      throw error;
    }

    console.log('✅ Payment saved to database');
  }
}

export default new RazorpayService();
```

#### **Part E: Create Payments Table**

Run in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL,
  order_id TEXT,
  amount INTEGER NOT NULL, -- in paise
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own payments
CREATE POLICY "Users can view own payments"
ON payments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_payment_id ON payments(payment_id);
```

#### **Part F: Test Razorpay Integration (10 minutes)**

Update `PaymentProcessingScreen.tsx` to use real Razorpay:

```typescript
import RazorpayService from '../../services/payment/RazorpayService';

const handlePayment = async () => {
  try {
    const result = await RazorpayService.openCheckout({
      amount: 5000, // ₹5000
      name: 'Manushi Coaching',
      description: 'Class 10 Mathematics Course',
      prefill: {
        email: user.email,
        contact: user.phone,
        name: user.full_name,
      },
    });

    if (result.success) {
      Alert.alert('Success', 'Payment completed successfully!');
      await RazorpayService.savePayment(user.id, result);
    } else {
      Alert.alert('Failed', result.error || 'Payment failed');
    }
  } catch (error) {
    Alert.alert('Error', 'Something went wrong');
  }
};
```

**Test with Razorpay test cards**:
- Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits

**✅ Success Criteria**: Payment completes and appears in Razorpay dashboard

---

### STEP 4.4: OpenAI Setup (AI Features - Optional) - 30 minutes

This is optional for v1.0 but recommended for AI Study Assistant.

#### **Part A: Create OpenAI Account (5 minutes)**

1. Go to https://platform.openai.com
2. Sign up with email
3. Verify email
4. Add payment method (credit card)

#### **Part B: Get API Key (5 minutes)**

1. Go to https://platform.openai.com/api-keys
2. Click **Create new secret key**
3. Name: "Manushi Coaching Platform"
4. Copy key (starts with `sk-proj-...`)
5. Add to `.env`:

```env
OPENAI_API_KEY=sk-proj-abc123...
```

#### **Part C: Create AI Service (20 minutes)**

Create file: `src/services/ai/OpenAIService.ts`

```typescript
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@env';

class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
  }

  async generateResponse(userMessage: string, context?: string): Promise<string> {
    try {
      const systemPrompt = `You are an AI tutor for Manushi Coaching Platform, specializing in Indian high school curriculum (CBSE/ICSE).
Help students with Math, Physics, Chemistry, Biology, and other subjects.
${context ? `Context: ${context}` : ''}`;

      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini', // Cheaper and faster than GPT-4
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('❌ OpenAI API error:', error);
      throw error;
    }
  }

  async answerDoubt(doubtText: string, subject: string, grade: string): Promise<string> {
    const context = `Subject: ${subject}, Grade: ${grade}`;
    const prompt = `Student asks: "${doubtText}"\n\nProvide a detailed explanation suitable for a ${grade} student.`;

    return this.generateResponse(prompt, context);
  }

  async generateStudyPlan(subject: string, topic: string, days: number): Promise<string> {
    const prompt = `Create a ${days}-day study plan for ${subject} - ${topic} for a high school student.`;
    return this.generateResponse(prompt);
  }
}

export default new OpenAIService();
```

**✅ Success Criteria**: AI service responds to test queries

---

## PHASE 5: REPLACE MOCK DATA WITH REAL APIs (Days 3-5)

### 🎯 Goal
Replace all mock data arrays with real API calls to Supabase database.

**Estimated Time**: 3-5 days (depending on screens)

---

### STEP 5.1: Priority Order (Start Here)

Replace mock data in this order (highest priority first):

1. **Authentication** (Critical - Day 3)
2. **Student Dashboard** (High - Day 3)
3. **Teacher Dashboard** (High - Day 4)
4. **Assignments & Submissions** (High - Day 4)
5. **Live Classes** (Medium - Day 4)
6. **Parent Dashboard** (Medium - Day 5)
7. **Admin Dashboard** (Low - Day 5)

---

### STEP 5.2: Authentication Integration (2 hours)

#### **Task: Connect Login Screen to Real Auth**

**File to modify**: `src/screens/auth/UltraModernLoginScreen.tsx`

**Current code (mock)**:
```typescript
const handleLogin = async () => {
  // Mock login - just navigation
  await new Promise(resolve => setTimeout(resolve, 1000));
  onLogin(email, password, role);
};
```

**Replace with real auth**:
```typescript
import { useAuth } from '../../context/AuthContext';

const { signIn, loading } = useAuth();

const handleLogin = async () => {
  try {
    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      return;
    }

    // Get user profile to determine role
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user!.id)
      .single();

    // Navigate to role-specific dashboard
    onLogin(email, password, profile?.role || 'student');
  } catch (err) {
    setError('Login failed. Please try again.');
  }
};
```

#### **Task: Connect Sign Up Screen**

**File**: `src/screens/auth/RegisterScreen.tsx`

Replace mock sign up with:

```typescript
const { signUp } = useAuth();

const handleRegister = async () => {
  try {
    const { error } = await signUp(email, password, {
      full_name: fullName,
      role: selectedRole,
      phone: phoneNumber,
    });

    if (error) {
      setError(error.message);
      return;
    }

    Alert.alert('Success', 'Account created! Please verify your email.');
    onBackToLogin();
  } catch (err) {
    setError('Registration failed. Please try again.');
  }
};
```

**✅ Success Criteria**: Users can sign up, log in, and stay logged in after app restart

---

### STEP 5.3: Student Dashboard Integration (4 hours)

#### **File**: `src/screens/dashboard/StudentDashboard.tsx`

**Current**: Uses `mockClasses`, `mockAssignments`, `mockDoubtQuestions`

**Replace with**:

1. **Create Student Service** (`src/services/database/StudentService.ts`):

```typescript
import { supabase } from '../../lib/supabase';

class StudentService {
  async getEnrolledClasses(studentId: string) {
    const { data, error } = await supabase
      .from('class_enrollments')
      .select(`
        *,
        classes (
          id,
          title,
          description,
          scheduled_at,
          duration,
          subjects (name),
          teacher:profiles!classes_teacher_id_fkey (full_name)
        )
      `)
      .eq('student_id', studentId)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getAssignments(studentId: string) {
    // Get assignments from enrolled classes
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        *,
        classes (id, title),
        submissions (
          id,
          status,
          grade,
          submitted_at
        )
      `)
      .eq('submissions.student_id', studentId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  async getUpcomingClasses(studentId: string) {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('class_enrollments')
      .select(`
        classes (
          id,
          title,
          scheduled_at,
          duration,
          subjects (name)
        )
      `)
      .eq('student_id', studentId)
      .gte('classes.scheduled_at', now)
      .order('classes.scheduled_at', { ascending: true })
      .limit(5);

    if (error) throw error;
    return data;
  }

  async getRecentDoubts(studentId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('doubts')
      .select(`
        *,
        subjects (name),
        doubt_answers (count)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}

export default new StudentService();
```

2. **Update StudentDashboard.tsx**:

```typescript
import StudentService from '../../services/database/StudentService';
import { useQuery } from '@tanstack/react-query';

export const StudentDashboard = () => {
  const { user } = useAuth();

  // Fetch enrolled classes
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['student-classes', user?.id],
    queryFn: () => StudentService.getEnrolledClasses(user!.id),
    enabled: !!user,
  });

  // Fetch assignments
  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['student-assignments', user?.id],
    queryFn: () => StudentService.getAssignments(user!.id),
    enabled: !!user,
  });

  // Fetch upcoming classes
  const { data: upcomingClasses } = useQuery({
    queryKey: ['upcoming-classes', user?.id],
    queryFn: () => StudentService.getUpcomingClasses(user!.id),
    enabled: !!user,
  });

  // Fetch recent doubts
  const { data: doubts } = useQuery({
    queryKey: ['recent-doubts', user?.id],
    queryFn: () => StudentService.getRecentDoubts(user!.id),
    enabled: !!user,
  });

  if (classesLoading || assignmentsLoading) {
    return <LoadingScreen />;
  }

  // Render UI with real data
  return (
    <ScrollView>
      <UpcomingClassesSection classes={upcomingClasses} />
      <AssignmentsSection assignments={assignments} />
      <RecentDoubtsSection doubts={doubts} />
    </ScrollView>
  );
};
```

**✅ Success Criteria**: Student dashboard shows real data from database

---

### STEP 5.4: Teacher Dashboard Integration (4 hours)

Similar process for teacher dashboard. Create `TeacherService.ts` with methods:
- `getTeacherClasses(teacherId)`
- `getClassStudents(classId)`
- `getPendingAssignments(teacherId)`
- `getRecentSubmissions(teacherId)`

---

### STEP 5.5: Assignment Submission Integration (2 hours)

**File**: `src/screens/student/AssignmentDetailScreen.tsx`

Add submission functionality:

```typescript
const handleSubmit = async () => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        assignment_id: assignmentId,
        student_id: user.id,
        submission_text: submissionText,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    Alert.alert('Success', 'Assignment submitted successfully!');
    navigation.goBack();
  } catch (error) {
    Alert.alert('Error', 'Failed to submit assignment');
  }
};
```

---

### STEP 5.6: Complete Integration Checklist

Use this checklist to track progress:

#### **Authentication** (Day 3)
- [ ] Login with real Supabase auth
- [ ] Sign up with profile creation
- [ ] Logout functionality
- [ ] Password reset
- [ ] Session persistence

#### **Student Features** (Day 3-4)
- [ ] Dashboard with real classes
- [ ] Assignment list
- [ ] Submit assignment
- [ ] View grades
- [ ] Ask doubt question
- [ ] Join live class
- [ ] View study library

#### **Teacher Features** (Day 4)
- [ ] Dashboard with classes
- [ ] Create assignment
- [ ] Grade submissions
- [ ] Mark attendance
- [ ] View student details
- [ ] Answer doubts
- [ ] Start live class

#### **Parent Features** (Day 5)
- [ ] View children list
- [ ] Child progress reports
- [ ] Make payment
- [ ] View billing history
- [ ] Contact teacher
- [ ] View timetable

#### **Admin Features** (Day 5)
- [ ] User management (CRUD)
- [ ] View analytics
- [ ] System settings
- [ ] Content management

---

## PHASE 6: TESTING & QUALITY ASSURANCE (Days 2-3)

### 🎯 Goal
Thoroughly test all features to ensure they work correctly.

---

### STEP 6.1: Manual Testing Checklist (Day 1 - 4 hours)

#### **Authentication Testing**
- [ ] Sign up with valid email
- [ ] Sign up with existing email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Logout and verify session cleared
- [ ] Password reset email received
- [ ] Session persists after app restart

#### **Student Role Testing**
- [ ] View enrolled classes
- [ ] Join live class
- [ ] Submit assignment
- [ ] View assignment grade
- [ ] Ask doubt question
- [ ] View study materials
- [ ] Receive push notification

#### **Teacher Role Testing**
- [ ] View teaching classes
- [ ] Create new assignment
- [ ] Grade student submission
- [ ] Mark attendance
- [ ] Start live class
- [ ] Answer doubt question

#### **Parent Role Testing**
- [ ] View child list
- [ ] View child progress
- [ ] Make test payment
- [ ] Download performance report
- [ ] Contact teacher

#### **Payment Testing**
- [ ] Initiate payment
- [ ] Complete payment with test card
- [ ] Verify payment saved in database
- [ ] View payment history

---

### STEP 6.2: Automated Testing (Day 1-2 - 8 hours)

Use the **rn-qa-tester** agent to generate tests.

#### **Unit Tests for Services**

```typescript
// Example: StudentService.test.ts
describe('StudentService', () => {
  it('should fetch enrolled classes', async () => {
    const classes = await StudentService.getEnrolledClasses('test_user_id');
    expect(classes).toBeDefined();
    expect(Array.isArray(classes)).toBe(true);
  });

  it('should fetch assignments', async () => {
    const assignments = await StudentService.getAssignments('test_user_id');
    expect(assignments).toBeDefined();
  });
});
```

#### **Integration Tests for Auth**

```typescript
describe('Authentication Flow', () => {
  it('should sign up new user', async () => {
    const { error } = await authService.signUp('test@example.com', 'password123');
    expect(error).toBeNull();
  });

  it('should sign in existing user', async () => {
    const { error } = await authService.signIn('test@example.com', 'password123');
    expect(error).toBeNull();
  });
});
```

**Generate all tests using agent**:
```
"Create comprehensive tests for StudentService, TeacherService, and PaymentService"
```

---

### STEP 6.3: Performance Testing (Day 2 - 2 hours)

Use **performance-optimizer** agent.

#### **Metrics to Test**:
- App startup time (target: <3 seconds)
- Screen navigation (target: 60 FPS)
- API response time (target: <500ms)
- Memory usage (target: <200MB)
- APK size (target: <100MB)

```
"Analyze app performance and identify bottlenecks in StudentDashboard"
```

---

### STEP 6.4: Security Testing (Day 2 - 2 hours)

#### **Security Checklist**:
- [ ] API keys not exposed in code
- [ ] .env file in .gitignore
- [ ] RLS policies working (test by querying as different users)
- [ ] File upload validation (size, type)
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS prevention (sanitize user input)

#### **Test RLS Policies**:

```sql
-- Test as student (should only see own submissions)
SET LOCAL role TO authenticated;
SET LOCAL "request.jwt.claim.sub" TO 'student_user_id';

SELECT * FROM submissions; -- Should return only student's submissions

-- Test as teacher (should see all submissions for their classes)
SET LOCAL "request.jwt.claim.sub" TO 'teacher_user_id';

SELECT * FROM submissions; -- Should return submissions for teacher's classes
```

---

### STEP 6.5: Bug Tracking & Fixes (Day 3 - Full Day)

Use a spreadsheet or issue tracker to log bugs:

| Bug ID | Severity | Description | Status | Fixed By |
|--------|----------|-------------|--------|----------|
| BUG-001 | High | Login fails with special characters in password | Open | - |
| BUG-002 | Medium | Assignment submit button disabled after upload | Fixed | Dev A |
| BUG-003 | Low | Profile picture not loading on slow network | Open | - |

**Priority**: Fix all High/Critical bugs before launch.

---

## PHASE 7: PRODUCTION BUILD & DEPLOYMENT (Days 1-2)

### 🎯 Goal
Create release-ready APK/AAB for Play Store submission.

---

### STEP 7.1: Update App Version (10 minutes)

#### **Update android/app/build.gradle**:

```gradle
android {
    defaultConfig {
        applicationId "com.manushicoaching"
        versionCode 1  // Increment for each release
        versionName "1.0.0"  // User-facing version
    }
}
```

#### **Update package.json**:

```json
{
  "version": "1.0.0"
}
```

---

### STEP 7.2: Configure Release Signing (30 minutes)

#### **Action 1: Generate Keystore**

```bash
cd android/app

# Generate release keystore
keytool -genkeypair -v -storetype PKCS12 -keystore manushi-release.keystore -alias manushi -keyalg RSA -keysize 2048 -validity 10000

# Enter details when prompted:
# Password: <strong_password>
# First and Last Name: Manushi Coaching Platform
# Organizational Unit: Development
# Organization: Manushi Coaching
# City: Bangalore
# State: Karnataka
# Country Code: IN
```

**Save password securely!** You'll need it for every release.

#### **Action 2: Configure Gradle**

Create `android/gradle.properties` (if not exists) and add:

```properties
MANUSHI_RELEASE_STORE_FILE=manushi-release.keystore
MANUSHI_RELEASE_KEY_ALIAS=manushi
MANUSHI_RELEASE_STORE_PASSWORD=<your_password>
MANUSHI_RELEASE_KEY_PASSWORD=<your_password>
```

**⚠️ IMPORTANT**: Add `gradle.properties` to `.gitignore`!

#### **Action 3: Update android/app/build.gradle**:

```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('MANUSHI_RELEASE_STORE_FILE')) {
                storeFile file(MANUSHI_RELEASE_STORE_FILE)
                storePassword MANUSHI_RELEASE_STORE_PASSWORD
                keyAlias MANUSHI_RELEASE_KEY_ALIAS
                keyPassword MANUSHI_RELEASE_KEY_PASSWORD
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true  // Enable ProGuard
            shrinkResources true  // Remove unused resources
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

### STEP 7.3: Build Release APK (20 minutes)

```bash
cd android

# Clean previous builds
./gradlew clean

# Build release APK
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

**Expected size**: 50-80 MB (down from 250MB dev build)

---

### STEP 7.4: Build Release AAB for Play Store (20 minutes)

Android App Bundle (.aab) is required for Play Store.

```bash
cd android

# Build AAB
./gradlew bundleRelease

# AAB location:
# android/app/build/outputs/bundle/release/app-release.aab
```

---

### STEP 7.5: Test Release Build (30 minutes)

#### **Install APK on Device**:

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

#### **Test Thoroughly**:
- [ ] App launches without crashes
- [ ] Login works
- [ ] All features functional
- [ ] No debug logs in LogCat
- [ ] Performance is smooth (60 FPS)
- [ ] App icon is correct
- [ ] Splash screen displays

---

## PHASE 8: PLAY STORE SUBMISSION (Days 2-3)

### 🎯 Goal
Submit app to Google Play Store for review.

---

### STEP 8.1: Create Play Console Account (20 minutes)

1. Go to https://play.google.com/console
2. Sign in with Google account
3. Pay $25 one-time registration fee
4. Complete developer profile:
   - Developer name: "Manushi Coaching"
   - Email address
   - Phone number
   - Website (optional)

---

### STEP 8.2: Create App Listing (1 hour)

#### **Action 1: Create New App**

1. Click **Create app**
2. Fill in:
   - **App name**: "Manushi Coaching Platform"
   - **Default language**: English (India)
   - **App or game**: App
   - **Free or paid**: Free
3. Accept declarations and click **Create app**

#### **Action 2: App Details**

**Short description** (80 chars):
```
Complete coaching solution for students, teachers, and parents
```

**Full description** (4000 chars):
```
Manushi Coaching Platform is a comprehensive educational app designed for Indian students, teachers, and parents.

FEATURES:

For Students:
• Attend live classes with video streaming
• Submit assignments and get instant feedback
• Ask doubts and get answers from teachers
• Track your academic progress
• Access study materials anytime

For Teachers:
• Conduct live classes with screen sharing
• Create and grade assignments
• Mark attendance digitally
• Manage classes and students
• Communicate with parents

For Parents:
• Monitor child's academic progress
• View attendance and grades
• Make fee payments securely
• Communicate with teachers
• Download performance reports

TECHNOLOGY:
• HD video streaming for live classes
• Secure payment integration with Razorpay
• Real-time notifications
• Offline access to study materials
• AI-powered study assistant (coming soon)

SUBJECTS COVERED:
Mathematics, Physics, Chemistry, Biology, English, Computer Science, and more.

BOARDS SUPPORTED:
CBSE, ICSE, State Boards

Perfect for coaching institutes, tuition centers, and online education providers.
```

---

### STEP 8.3: Graphics Assets (2 hours)

You need to create these graphics (use Figma/Canva):

#### **App Icon** (Required)
- Size: 512x512 pixels
- Format: PNG (32-bit)
- No alpha/transparency
- High-quality, recognizable design

#### **Feature Graphic** (Required)
- Size: 1024x500 pixels
- Format: PNG/JPEG
- Showcases main feature

#### **Screenshots** (Minimum 2, Maximum 8)
- Size: 1080x1920 pixels (portrait) OR 1920x1080 (landscape)
- Format: PNG/JPEG
- Show key features:
  1. Login/Dashboard
  2. Live class screen
  3. Assignment submission
  4. Progress tracking
  5. Payment screen

**Tools to Create**:
- Use Android emulator with screenshot tool
- Use Figma with device frames
- Hire designer on Fiverr ($20-50)

---

### STEP 8.4: Content Rating (20 minutes)

1. Go to **Content rating** section
2. Start questionnaire
3. Answer questions about your app content:
   - Educational content: Yes
   - User-generated content: Yes (doubts, assignments)
   - Social features: No
   - Violence: No
   - Alcohol/drugs: No
4. Get rating (usually: Everyone/Everyone 10+)

---

### STEP 8.5: App Content (30 minutes)

#### **Privacy Policy** (Required)

Create a privacy policy at https://app-privacy-policy-generator.firebaseapp.com/

Upload to your website or use Google Sites for free hosting.

**Privacy policy URL**: `https://yourwebsite.com/privacy-policy`

#### **Data Safety**

Declare what data you collect:
- [ ] Location data (if tracking student location)
- [ ] Personal information (name, email, phone)
- [ ] Financial information (payment details)
- [ ] Photos and videos (profile pictures)
- [ ] Files and docs (assignments)

**Data usage**:
- App functionality
- Analytics
- Communication

**Data sharing**:
- [ ] No data shared with third parties OR
- [ ] Data shared with: Razorpay (payments), Firebase (analytics)

---

### STEP 8.6: Upload AAB (10 minutes)

1. Go to **Release** → **Production**
2. Click **Create new release**
3. Upload `app-release.aab`
4. Release name: "1.0.0"
5. Release notes:
```
Initial release of Manushi Coaching Platform

Features:
• Live video classes
• Assignment submission and grading
• Doubt Q&A system
• Attendance tracking
• Secure payment integration
• Progress reports for parents
```

---

### STEP 8.7: Set Pricing & Distribution (10 minutes)

1. **Pricing**: Free
2. **Countries**: Select:
   - India (primary)
   - United States
   - United Kingdom
   - (Add more if needed)
3. **Content rating**: Apply rating from Step 8.4
4. **Target audience**: Ages 13+

---

### STEP 8.8: Submit for Review (5 minutes)

1. Review all sections (must show green checkmarks)
2. Click **Submit for review**
3. Expected review time: 1-7 days

**After approval**: App goes live on Play Store!

---

## POST-LAUNCH MONITORING

### Week 1: Critical Monitoring

#### **Daily Checks**:
- [ ] Monitor crash reports in Play Console
- [ ] Check Firebase Crashlytics
- [ ] Review user reviews (respond within 24 hours)
- [ ] Monitor API usage in Supabase dashboard
- [ ] Check payment success rate in Razorpay

#### **Metrics to Track**:
- Active users (DAU/MAU)
- Crash-free rate (target: >99%)
- Average session length
- Retention rate (Day 1, Day 7, Day 30)
- Payment conversion rate
- Live class attendance rate

---

### Week 2-4: Optimization

#### **User Feedback Analysis**:
- Read all reviews
- Identify common issues
- Prioritize bug fixes

#### **Performance Optimization**:
- Monitor API response times
- Optimize slow queries
- Reduce APK size if needed

#### **Feature Requests**:
- Track most requested features
- Plan v1.1 release

---

## TROUBLESHOOTING GUIDE

### Common Issues & Solutions

#### **Issue: Supabase Connection Failed**

**Symptoms**: "Network request failed" errors

**Solutions**:
1. Check internet connection
2. Verify `.env` file has correct `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. Check Supabase dashboard status (https://status.supabase.com)
4. Verify RLS policies not blocking access:
```sql
-- Disable RLS temporarily for testing
ALTER TABLE <table_name> DISABLE ROW LEVEL SECURITY;
```

---

#### **Issue: Stream.io Video Not Starting**

**Symptoms**: Black screen or "Unable to join call" error

**Solutions**:
1. Verify `STREAM_API_KEY` in `.env`
2. Check user token is valid (not expired)
3. Ensure camera/microphone permissions granted
4. Check Stream.io dashboard for error logs
5. Test with Stream.io example app first

---

#### **Issue: Firebase Notifications Not Received**

**Symptoms**: No push notifications

**Solutions**:
1. Check `google-services.json` is in `android/app/`
2. Verify FCM token is saved in database
3. Test notification from Firebase console
4. Check app has notification permission
5. Verify APNs certificate (iOS) or FCM settings (Android)

---

#### **Issue: Razorpay Checkout Not Opening**

**Symptoms**: "Razorpay not initialized" error

**Solutions**:
1. Verify `RAZORPAY_KEY_ID` in `.env`
2. Check Razorpay account is activated
3. Use test keys for development
4. Complete KYC for production keys
5. Check LogCat for Razorpay SDK errors

---

#### **Issue: Build Fails with "Duplicate class" Error**

**Symptoms**: Gradle build fails

**Solutions**:
1. Clean build:
```bash
cd android && ./gradlew clean && cd ..
```
2. Delete `.gradle` cache:
```bash
rm -rf android/.gradle
```
3. Check `packagingOptions` in `android/app/build.gradle`
4. Update duplicate library versions

---

#### **Issue: App Crashes on Startup**

**Symptoms**: App opens then immediately closes

**Solutions**:
1. Check LogCat for crash logs:
```bash
adb logcat | grep -i "error\|exception"
```
2. Verify all native modules linked correctly
3. Check `.env` file exists and readable
4. Disable Hermes temporarily (test)
5. Rebuild app:
```bash
npm run android:clean
npm run android:dev
```

---

## APPENDIX: USEFUL COMMANDS

### Development Commands

```bash
# Start Metro bundler
npm start

# Start with cache reset
npm start -- --reset-cache

# Build and install (development)
npm run android:dev

# Build release APK
cd android && ./gradlew assembleRelease

# Build release AAB
cd android && ./gradlew bundleRelease

# Clean build cache
npm run android:clean

# Check APK size
du -sh android/app/build/outputs/apk/release/app-release.apk

# View device logs
adb logcat

# Clear app data
adb shell pm clear com.manushicoaching
```

---

### Supabase Commands

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref qrwroibhzgywaiecbcoa

# Create Edge Function
supabase functions new function-name

# Deploy Edge Function
supabase functions deploy function-name

# View logs
supabase functions logs function-name

# Generate TypeScript types from database
supabase gen types typescript --project-id qrwroibhzgywaiecbcoa > src/types/database.ts
```

---

## CONCLUSION

**Estimated Total Time to Launch**: 10-15 working days

**Critical Path**:
1. Set up backend (Days 1-2)
2. Replace mock data (Days 3-5)
3. Testing & QA (Days 6-8)
4. Build & submit (Days 9-10)

**Minimum Viable Launch** (7 days):
- Skip OpenAI (add in v1.1)
- Skip automated tests (manual testing only)
- Launch with basic features
- Add advanced features post-launch

**Next Steps**:
1. Create `.env` file (30 minutes)
2. Apply database migrations (1 hour)
3. Test Supabase connection (15 minutes)
4. Start replacing mock data (ongoing)

**Questions? Issues?**
- Supabase: https://supabase.com/docs
- Stream.io: https://getstream.io/video/docs/react-native/
- Razorpay: https://razorpay.com/docs/

---

**Good luck with the launch! 🚀**
