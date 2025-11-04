# LiveClassScreen.tsx – Analysis & Feature Inventory

**File:** `OLD/src/screens/teacher/LiveClassScreen.tsx`  
**Lines:** 1,713  
**Component:** `LiveClassScreen` (exported named functional component)  
**Last Reviewed:** 2025-10-26  
**Purpose:** Teacher-facing control room for live classes (start/end class, manage participants, screen share, recording, polls/quizzes, chat, spotlight, whiteboard).

---

## 1. File Metadata
- **Imports:** 30+ component dependencies from `../../components/teacher/*`, MD3 components (`Appbar`, `Portal`, `Snackbar`, `ActivityIndicator`), theming constants (`LightTheme`, `Typography`, `Spacing`, `BorderRadius`), custom buttons/cards.
- **Export:** `export const LiveClassScreen: React.FC<LiveClassScreenProps>`
- **Props:** `{ classId: string; teacherName: string; onNavigate: (screen: string) => void; }`
- **Internal interfaces:** `ClassDetails`, `QuickAction`.
- **No BaseScreen wrapper**, uses `SafeAreaView` + manual loading overlays.

## 2. State & Side Effects
| Category | Hook | Notes |
|---|---|---|
| Loading/notifications | `isLoading`, `snackbarVisible`, `snackbarMessage` | uses manual `setTimeout` for fake loading |
| Class metadata | `classDetails`, `currentTime` | seed data hard-coded (“Advanced Mathematics”, 24 students) |
| Participation | `participants`, `selectedTab`, `showPrivateMessaging`, `spotlightSettings` | participants initialized with mocked list when class goes live |
| AV controls | `isScreenSharing`, `isRecording`, `isMuted`, `isVideoEnabled`, `isScreenViewerVisible`, `isScreenViewerFullscreen` | stored in local state |
| Recording | `recordingStatus`, `recordingDuration`, `recordingStartTime`, `recordingFileSize` | timers simulated; no persistence |
| Polls/quizzes | `showPollCreator`, `showQuizCreator`, `activePolls`, `activeQuizzes`, `pollIdCounter`, `quizIdCounter` | local arrays; not persisted |
| Timers/effects | Interval updating `currentTime` every second; `useEffect` to add hardware back handler; multiple `setTimeout` calls simulate network |

### Observations / Issues
- Extensive use of **mock data** (participants, class details, polls). Violates project constraint (no mock data).
- **No Supabase integration** for sessions, participants, chat, or analytics.
- Uses `Alert.alert` success messages instead of Snackbar/analytics for start/end class.
- `BackHandler` is wired manually with a callback prop `onNavigate`, not the project’s navigation stack.
- No React Query usage; state resets on remount.

## 3. UI Structure
Top-level render:
1. `SafeAreaView` container with `StatusBar`.
2. `Portal` hosting `Snackbar`.
3. App bar (`renderAppBar`):
   - Title “Live Class Control Center”
   - Subtitle showing `classDetails.subject`, grade, teacher name.
   - Status pill (preparing/live/ended), clock, professor initials.
4. `ScrollView` containing:
   - `renderClassInfo()` – quick stats card (students, start time, attendance widget).
   - `renderMainControls()` – Start/End class button or completion message.
   - `renderTabNavigation()` – horizontal tab strip (info, participants, attendance, chat, spotlight, whiteboard, screen share, controls, recording, polls).
   - `renderTabContent()` – per-tab panels:
     - **Info (Quick Actions):** grid of `DashboardCard` quick actions (share resources, launch breakout, etc.) fed by `quickActions` array.
     - **Participants:** `ParticipantList` with hand-raise summary, `PrivateMessaging` modal toggle.
     - **Attendance:** `AttendanceWidget` inside card, summary stats, manual mark buttons.
     - **Chat:** `ChatWindow`, `PrivateMessaging`, toggles for open chat.
     - **Spotlight:** `ParticipantSpotlightManager` + `SpotlightControls`.
     - **Whiteboard:** `WhiteboardManager` with controls and status.
     - **Screen Share:** `ScreenShareControls` + `SharedScreenViewer` (with fullscreen toggle).
     - **Controls:** `LiveClassControls` for mute/unmute, breakout, raise hand resets, etc.
     - **Recording:** `RecordingControls`, `RecordingStatus`, timer display, simulated file size.
     - **Polls:** `LivePollCreator`, `QuickQuizCreator`, `PollResults`, `QuizResults`, `PollManager`.

### Conditional Layouts
- Many sections gated by `classDetails.status === 'live'`.
- Attendance card hidden until class live.
- Chat, spotlight, whiteboard, screen share, controls, recording, polls tabs only render when `status === 'live'`.
- Post-class message for `status === 'ended'`.

## 4. Interaction & Business Logic
- **Start class:** `handleStartClass` prompts confirmation, transitions `status` to `live`, sets `startTime`, displays success `Alert`.
- **End class:** `handleEndClass` confirmation; updates `status` to `ended`, then alerts and calls `onNavigate('back')`.
- **Spotlight controls:** `handleSpotlightSettingsChange`, `handleSpotlightAction`.
- **Screen share:** `handleScreenShareToggle`, `handleScreenViewerToggle`, `handleScreenViewerFullscreenToggle`.
- **Recording:** `handleRecordingToggle`, `handleRecordingPause`, `handleRecordingStop`, `updateRecordingDuration`; uses `setInterval` to increment duration while recording.
- **Polls/quizzes:** creation handlers convert `PollQuestion[]`/`QuizQuestion[]` to active objects stored locally; `PollManager` updates and finalizes results; `handlePollClose`, `handleQuizClose`.
- **Quick actions:** static array with `onPress` linking to various handler functions (some missing, e.g., breakouts).
- **Attendance:** `handleAttendanceMark` toggles `isPresent`; uses `showSnackbar`.
- **Chat:** toggles for private messaging, uses `ChatWindow` callbacks (`handleSendMessage`, `handleBulkMessage`).
- **Back handling:** `BackHandler.addEventListener` intercepts hardware back button to prevent leaving active live class.

## 5. External Dependencies & Missing Integrations
- **Components invoked but not analyzed here:** Many teacher components (ParticipantList, ChatWindow, etc.) expect props shaped around the mock state objects.
- **No analytics tracking** (`trackScreenView`, `trackAction`) anywhere in file.
- **No safe navigation:** uses `onNavigate` prop rather than `safeNavigate`.
- **No hooks for Supabase/auth:** should pull user/class data via `supabase`, `useQuery`, etc.
- **No BaseScreen:** violates mandatory pattern.
- **No theming via `useTheme`:** uses static `LightTheme` constants.
- **No accessibility labels**: Buttons rely on text only; tab icons use unlabelled emoji glyphs.

## 6. Issues & Risks
- ✔️ **Critical:** Mock data for class details, participants, polls, chat (violates “no mock data” rule).
- ✔️ **Critical:** Missing Supabase queries/mutations for class sessions, attendance, polls, chat.
- ✔️ **Critical:** No BaseScreen wrapper; manual loading/error management.
- ✔️ **Critical:** No analytics tracking.
- ✔️ **Critical:** Navigation integration relies on callback rather than safe navigation (`TeacherNavigator` expects screen component, not manual `onNavigate`).
- ⚠️ **High:** All quick-action handlers operate on local state only; nothing persists or fetches.
- ⚠️ **High:** Poll/quiz states not persisted; IDs resets local.
- ⚠️ **High:** Recording logic purely simulated; no actual file handling.
- ⚠️ **Medium:** `BackHandler` might conflict with navigation stack.
- ⚠️ **Medium:** Timer interval and multiple `setTimeout` calls risk memory leaks (no cleanup for recording interval).
- ⚠️ **Medium:** Hard-coded teacher name from props; no fallback from auth.
- ⚠️ **Medium:** Layout uses `ScrollView` with many nested components—performance risk on low devices.
- ⚠️ **Low:** Unicode glyph icons may not render consistently; lacks fallback tokens.

## 7. Recreation Checklist (Key Requirements)
1. Wrap screen in `BaseScreen` with `loading`, `error`, `empty`, and `onRetry`.
2. Replace `LiveClassScreenProps` with typed navigation props (`TeacherStackParamList` entry, e.g., `{ classId, sessionId }`).
3. Implement Supabase queries:
   - Fetch class/session metadata (teacher, schedule, status).
   - Subscribe to participant presence (maybe `live_class_participants` table).
   - Fetch/chat messages, polls, quizzes, whiteboard states from database.
4. Create React Query mutations:
   - Start/end class session (insert/update `live_class_sessions`).
   - Toggle attendance/presence.
   - Manage screen sharing and recording states.
   - Create polls/quizzes and capture responses.
5. Add analytics logging for screen view and every major action.
6. Replace direct `Alert` usage with snackbar + analytics + safe nav.
7. Use `useTheme` + MD3 tokens instead of static LightTheme references.
8. Refine tab navigation to accessible buttons (aria labels, vector icons).
9. Ensure supporting components accept data from queries (update their types if necessary).
10. Add Supabase real-time listeners for session events (presence, polls, chat).
11. Provide tests/docs and ensure acceptance checklist compliance.

## 8. Suggested Data Schema (Initial Draft)
- `live_class_sessions` (id, class_id, teacher_id, scheduled_start, actual_start, actual_end, status, recording_url, recording_duration, created_at, updated_at)
- `live_class_participants` (id, session_id, student_id, join_time, leave_time, audio_enabled, video_enabled, hand_raised, last_ping_at)
- `live_class_chat_messages` (id, session_id, sender_id, message, message_type, is_private, recipient_id, created_at)
- `live_class_polls` / `live_class_poll_options` / `live_class_poll_responses`
- `live_class_quizzes` / `live_class_quiz_questions` / `live_class_quiz_responses`
- `live_class_whiteboards` (session_id, content, last_updated_by, last_updated_at)
- Indices & RLS policies required for teacher access; migrations to be created.

## 9. Dependencies for Recreation
- `BaseScreen`, `trackScreenView`, `trackAction`, `safeNavigate`.
- `@tanstack/react-query` hooks (query + mutation).
- Supabase client (`supabase` from `../../lib/supabase`), plus new migrations.
- Potential new hooks to encapsulate real-time updates (e.g., `useSupabaseChannel`).
- Reuse existing teacher components but ensure they consume fetched data.

## 10. Next Steps
1. Design migrations for live class tables & policies (if not already in Supabase).
2. Update navigation types & `TeacherNavigator` to point to a new production-ready screen (e.g., `NewLiveClassScreen.tsx`).
3. Implement new screen following BaseScreen pattern, real data flows, analytics, safe navigation.
4. Retrofit existing teacher sub-components if they require data shape adjustments.
5. Add automated UI coverage (Appium) for start/end class, poll creation, recording toggles.

---

**Analysis prepared by:** Codex Assistant (2025-10-26)  
**Use this with Screen Recreator workflow before implementing the new Live Class experience.**

