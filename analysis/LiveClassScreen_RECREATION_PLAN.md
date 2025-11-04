# LiveClassScreen Recreation Plan (Production-Ready Version)

**Goal:** Replace `OLD/src/screens/teacher/LiveClassScreen.tsx` with a modern `NewLiveClassScreen.tsx` that complies with project standards (BaseScreen, Supabase data, analytics, safe navigation, no mock data).

---

## 1. Navigation & Typing
- Add `LiveClass` (or `TeacherLiveClass`) route to `TeacherStackParamList` with params `{ classId: string; sessionId?: string }`.
- Update `TeacherNavigator` to import `NewLiveClassScreen` and pass navigation props rather than callback handlers.
- Ensure `TeacherDashboard` and any other entry points use `safeNavigate` with validated params.

## 2. Supabase Data Model
Create new tables (SQL migrations via `supabase_migrations`):
1. **live_class_sessions**
   ```sql
   id uuid primary key default uuid_generate_v4();
   class_id uuid references classes(id);
   teacher_id uuid references teachers(id);
   scheduled_start timestamptz;
   actual_start timestamptz;
   actual_end timestamptz;
   status text check (status in ('scheduled','live','paused','ended','cancelled'));
   recording_url text;
   recording_duration_seconds integer;
   notes text;
   created_at timestamptz default now();
   updated_at timestamptz default now();
   ```
2. **live_class_participants**
   ```sql
   id uuid primary key default uuid_generate_v4();
   session_id uuid references live_class_sessions(id) on delete cascade;
   student_id uuid references students(id);
   join_time timestamptz;
  leave_time timestamptz;
   audio_enabled boolean default false;
   video_enabled boolean default false;
   hand_raised boolean default false;
   last_seen_at timestamptz;
   ```
3. **live_class_attendance**
   ```sql
   id uuid primary key default uuid_generate_v4();
   session_id uuid references live_class_sessions(id) on delete cascade;
   student_id uuid references students(id);
   status text check (status in ('present','absent','late','excused'));
   marked_by uuid references teachers(id);
   marked_at timestamptz default now();
   notes text;
   ```
4. **live_class_chat_messages**
   ```sql
   id uuid primary key default uuid_generate_v4();
   session_id uuid references live_class_sessions(id) on delete cascade;
   sender_id uuid references profiles(id);
   message text;
   message_type text default 'text';
   is_private boolean default false;
   recipient_id uuid references profiles(id);
   created_at timestamptz default now();
   ```
5. **live_class_polls / live_class_poll_options / live_class_poll_responses**
6. **live_class_quizzes / live_class_quiz_questions / live_class_quiz_responses**
7. **live_class_whiteboards** (optional, JSON content + versioning)

**Policies:** add RLS to allow:
- Teachers: full access to sessions they own.
- Students: read-only access to sessions they attend (for future student app).
- Service role bypass for automation.

## 3. React Query Data Flows
| Query | Key | Description |
|---|---|---|
| Session metadata | `['liveSession', sessionId]` | fetch `live_class_sessions` joined with classes, teacher, schedule. |
| Participant roster | `['liveSessionParticipants', sessionId]` | fetch participant list + attendance summary. |
| Attendance summary | `['liveAttendance', sessionId]` | aggregated counts for BaseScreen empty state. |
| Chat messages | `['liveChat', sessionId]` | initial load + subscribe to real-time updates. |
| Polls & quizzes | `['livePolls', sessionId]`, `['liveQuizzes', sessionId]` | open polls/quizzes with responses. |
| Whiteboard state | `['liveWhiteboard', sessionId]` | JSON blob + last updated metadata. |

Use `supabase.channel()` for:
- Participant presence updates.
- Chat message inserts.
- Poll/quiz creation/responses.
- Recording status events.

## 4. Mutations
- `startClass(sessionId)` → set `status='live'`, `actual_start=now()` (or create new session if none).
- `endClass(sessionId)` → set `status='ended'`, `actual_end=now()`, finalize recordings.
- `updateParticipantStatus` → toggles audio/video/hand raise.
- `markAttendance` → upsert into `live_class_attendance`.
- `sendChatMessage` → insert row; handle private flag.
- `createPoll` / `closePoll` / `submitPollResponse`.
- `createQuiz` / `submitQuizResponse`.
- `toggleRecording` / `updateRecordingProgress`.
- `toggleScreenShare` (persist to session or ephemeral state table).

All mutations must use `useMutation` with optimistic UI + `invalidateQueries`.

## 5. Component Layout Plan
### Top-Level
```tsx
const NewLiveClassScreen: React.FC<Props> = ({ route, navigation }) => {
  const { classId, sessionId } = route.params;
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { data: session, isLoading, error, refetch } = useLiveSessionQuery(sessionId, classId);

  return (
    <BaseScreen
      scrollable
      loading={isLoading}
      error={error ? 'Unable to load live class.' : null}
      empty={!isLoading && !session}
      emptyTitle="No live session"
      emptyBody="This class is not live yet."
      onRetry={refetch}
    >
      {/* App bar, status chips, actions, tab navigation */}
    </BaseScreen>
  );
};
```

### Tabs / Sections
1. **Overview tab** – class metadata, elapsed time, session status, quick actions.
2. **Participants** – `ParticipantList` bound to query data; actions trigger mutations.
3. **Attendance** – `AttendanceWidget` with real data (counts computed server-side or in hook).
4. **Chat** – `ChatWindow` integrated with Supabase channel.
5. **Spotlight** – persisted spotlight config (store in session record JSON).
6. **Whiteboard** – integrate with whiteboard table or temporary store until backend ready.
7. **Screen Share** – show presenter info, `ScreenShareControls` toggles send mutation events.
8. **Controls** – quick toggles for mic/video, breakout, record.
9. **Recording** – status indicator bound to session fields (`recording_status`, `recording_duration`).
10. **Polls/Quizzes** – use new Poll/Quiz tables; `LivePollCreator` + results components consume data.

### Hooks/Utilities to Build
- `useLiveSession(sessionId, classId)`
- `useLiveParticipants(sessionId)`
- `useSupabaseChannel(channelName, handlers)`
- `useRecordingTimer(recordingStatus, recordingStartTime)`

## 6. Analytics & UX
- `useEffect` on mount: `trackScreenView('LiveClass', { classId, sessionId })`.
- Wrap every major action with `trackAction` (start/end, mute all, launch poll, send message).
- Replace `Alert.alert` success states with Snackbar (already available) + analytics.
- Add `accessibilityLabel` to tab buttons; swap emoji icons for `MaterialIcons`.
- Use theme colors via `useTheme()` rather than `LightTheme`.

## 7. Acceptance Checklist Mapping
- ✅ No mock data → all data retrieved from Supabase.
- ✅ BaseScreen wrapper → part of layout.
- ✅ Safe navigation → use `safeNavigate(navigation, 'TeacherDashboard')` etc.
- ✅ Analytics events → instrument actions.
- ✅ Error handling → BaseScreen + Snackbar + mutation `onError`.
- ✅ Performance → `FlatList` for participants/chat; avoid re-renders with `useMemo`.
- ✅ Accessibility → aria labels, focusable controls, dynamic font sizing support.

## 8. Migration / Setup Tasks
1. Draft SQL migrations for new tables & policies (place under `supabase_migrations`).
2. Update Supabase CLI config if necessary and document run command.
3. Seed sample data (optional) for development once tables exist.

## 9. Testing Strategy
- **Unit:** Hooks (e.g., `useLiveSession`) with Mock Supabase client.
- **Integration:** Jest tests ensuring major components render given mocked query results.
- **E2E:** Extend Appium script to launch Live Class, toggle start/end, create poll, verify UI updates.
- **Manual:** Follow checklists from `TEACHER_DASHBOARD_TEST_CHECKLIST.md` + new Live Class scenarios.

## 10. Implementation Order
1. Create migrations & update Supabase data layer.
2. Implement hooks (queries/mutations + channel subscription).
3. Build `NewLiveClassScreen` using BaseScreen + new hooks.
4. Update navigator & remove old mock-based screen (optionally archive as `.legacy`).
5. QA (manual + automated) and document in `TEACHER_SCREENS_RECREATION_COMPLETE.md`.

---

**Prepared by:** Codex Assistant – 2025-10-26  
Use alongside the analysis report before executing the Screen Recreator workflow.

