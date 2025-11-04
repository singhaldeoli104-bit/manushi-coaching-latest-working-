# Student Manual Test Cases

_Preconditions:_ Launch the Manushi Coaching app, authenticate with a valid **student** account, and ensure the device has stable connectivity for any mocked async wait states. All navigation paths reference the default `StudentNavigator` structure (bottom tabs: Home, Classes, Study, Progress, Connect).

## StudentDashboard (`src/screens/student/StudentDashboard.tsx`)
**Navigation:** Login -> Student role landing -> `Home` tab (default) -> `StudentDashboard`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-DASH-001 | Hero metrics render correctly | 1. Observe hero section on load.<br>2. Compare XP, streak, and completion % with mock data from `StudentDashboard` file.<br>3. Rotate device to confirm responsive layout (if supported). | Hero cards show seeded values; layout stays intact on orientation change. |  |  |  |
| STU-DASH-002 | Quick actions trigger navigation stubs | 1. Tap `Join Live Class`, `Submit Doubt`, and `AI Assistant` quick action cards.<br>2. Dismiss resulting alerts or follow navigation prompts back. | Each action fires matching alert/handler without errors; navigation returns to dashboard if routed away. |  |  |  |
| STU-DASH-003 | Upcoming assignments interactions | 1. Scroll to assignments list.<br>2. Tap `Mark Complete` on an assignment.<br>3. Tap `View Details` to navigate to assignment detail screen and return. | Success alert shown on completion; navigation to assignment detail occurs and back navigation returns to dashboard state. |  |  |  |
| STU-DASH-004 | Activity feed integrity | 1. Scroll to Recent Activity.<br>2. Verify timestamps and icons per seed data.<br>3. Tap an item to ensure handler fires (usually alert/log). | Feed displays all events with correct metadata; tapping does not crash and triggers placeholder handler. |  |  |  |
| STU-DASH-005 | Notification center overlay | 1. Tap bell/notifications icon.<br>2. Validate grouped notifications rendered by `NotificationRenderer`.<br>3. Mark one notification read and close overlay via back button hardware. | Overlay appears with grouped sections; marking read updates badge count; hardware back dismisses overlay due to custom handler. |  |  |  |
| STU-DASH-006 | Manual refresh & caching | 1. Pull down to refresh.<br>2. Observe spinner and confirm dashboard data re-fetch message/snackbar.<br>3. Kill app, relaunch offline (disable network) to confirm cached data loads. | Refresh control shows, snackbar indicates result; offline launch uses cached AsyncStorage snapshot without crash. |  |  |  |
| STU-DASH-007 | Smart recommendations deep link | 1. In Smart Recommendations lens tap a high-priority card (e.g., `Catch up on Physics`).<br>2. Verify navigation to target route (AI dashboard/class detail).<br>3. Return via back navigation. | Navigation pushes correct screen; returning pops back to dashboard maintaining scroll position. |  |  |  |

## StudentAILearningDashboard (`src/screens/student/StudentAILearningDashboard.tsx`)
**Navigation:** `Home` tab -> from StudentDashboard tap `AI Learning Dashboard` quick action / menu -> `StudentAILearningDashboard`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-AILD-001 | Overview tab cards | 1. Confirm Overview tab active by default.<br>2. Inspect learning momentum, AI coach tip, and KPIs.<br>3. Validate text matches seed data arrays. | Cards render without missing fields; values align with configured mock data. |  |  |  |
| STU-AILD-002 | Tab navigation works | 1. Switch to `Learning Paths`, `Predictions`, and `Insights` tabs sequentially.<br>2. Observe content swapping and active indicator behavior.<br>3. Return to Overview. | Tab indicator updates; each tab renders relevant list/cards; no console errors. |  |  |  |
| STU-AILD-003 | CTA triggers maintained | 1. On each tab tap the primary CTA (e.g., `Start Plan`, `View Prediction`).<br>2. Capture any alerts/modals.<br>3. Close and ensure tab state persists. | Each CTA fires expected placeholder handler; no navigation dead ends; returning preserves selected tab. |  |  |  |
| STU-AILD-004 | Refresh/Sync operation | 1. Use any available refresh button (e.g., sync icon).<br>2. Wait for simulated delay if present.<br>3. Re-check data integrity post-refresh. | Loading indicator (if provided) completes; data remains consistent without duplication. |  |  |  |
| STU-AILD-005 | Predictive accuracy messaging | 1. Open Predictions tab.<br>2. Inspect accuracy %, confidence tags, and risk levels.<br>3. Tap `Explain Prediction` (if present). | Accuracy badges colour-coded by threshold; explanation modal/alert provides textual reasoning. |  |  |  |
| STU-AILD-006 | Cross-screen recommendations | 1. From Insights tab select `Review Study Plan` suggestion.<br>2. Ensure navigation pushes Enhanced AI Study or relevant module.<br>3. Confirm breadcrumb/back behaviour. | Suggestion opens correct feature; back navigation returns to Insights tab preserving scroll. |  |  |  |

## DoubtSubmissionScreen (`src/screens/student/DoubtSubmissionScreen.tsx`)
**Navigation:** `Home` tab -> StudentDashboard quick action `Submit Doubt` -> `DoubtSubmission`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-DOUBT-001 | Required field validation | 1. Tap `Submit Doubt` with empty form.<br>2. Observe validation errors.<br>3. Ensure fields highlight with error styling. | Errors display for title/category/description; submit blocked until resolved. |  |  |  |
| STU-DOUBT-002 | Attachment workflow | 1. Tap `Add Attachment`.<br>2. Choose any available option (simulated alert).<br>3. Cancel to return. | Attachment handler shows options via alert; no crash when dismissed. |  |  |  |
| STU-DOUBT-003 | Successful submission flow | 1. Enter valid title/description, choose category, set urgency.<br>2. Press `Submit Doubt`.<br>3. Review confirmation messaging. | Success alert confirms creation; form resets or navigation pops depending on design. |  |  |  |
| STU-DOUBT-004 | AI suggestion usage | 1. Trigger AI recommendation (if button available).<br>2. Accept/decline suggestion.<br>3. Ensure text injected or message shown accordingly. | AI helper populates suggestion or explains unavailability; no duplicate prompts. |  |  |  |
| STU-DOUBT-005 | Saved drafts behaviour | 1. Partially fill the form, then navigate away via back.<br>2. Reopen `Submit Doubt`.<br>3. Confirm draft restored or cleared per requirements. | Draft state respects design (restored if cached or reset cleanly). |  |  |  |
| STU-DOUBT-006 | Priority + tagging | 1. Toggle urgency levels/highlight tags.<br>2. Submit with `urgent` selected.<br>3. Confirm summary alert mentions urgency. | UI highlights urgent state; confirmation references chosen priority/tag set. |  |  |  |

## SimpleDoubtSubmissionScreen (`src/screens/student/SimpleDoubtSubmissionScreen.tsx`)
**Navigation:** `Home` tab -> StudentDashboard quick action `Quick Doubt` (or overflow) -> `SimpleDoubtSubmission`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-SDOUBT-001 | Minimal form validation | 1. Attempt submit without data.<br>2. Observe inline error prompts.<br>3. Fix fields iteratively to confirm error clearing. | Mandatory fields enforce validation; errors disappear once corrected. |  |  |  |
| STU-SDOUBT-002 | Category chips selection | 1. Tap multiple category chips.<br>2. Confirm active styling toggles correctly.<br>3. Ensure only one category remains active if single-select. | Active chip displays highlighted state; state updates used for submission payload. |  |  |  |
| STU-SDOUBT-003 | Submission success toast/alert | 1. Fill all fields.<br>2. Submit doubt.<br>3. Note success alert text and navigation behavior. | Confirmation message matches copy; screen resets or navigates back to dashboard. |  |  |  |
| STU-SDOUBT-004 | Offline queue handling | 1. Disable network.<br>2. Submit a doubt.<br>3. Re-enable network and confirm queued submission notification/snackbar. | Offline submission stored locally; upon reconnection success toast indicates send. |  |  |  |
| STU-SDOUBT-005 | Quick attach actions | 1. Use optional quick shortcuts (camera/gallery if present).<br>2. Verify UI feedback and error handling when permission denied. | Permission denial handled gracefully; attachments added when granted. |  |  |  |

## ActivityDetailScreen (`src/screens/student/ActivityDetailScreen.tsx`)
**Navigation:** `Home` tab -> StudentDashboard -> tap `View All` on Recent Activity -> `ActivityDetail`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-ACT-001 | Filter selector response | 1. Change filter from `All` to other categories.<br>2. Confirm list contents update immediately.<br>3. Switch back to `All`. | List reflects filter; count badges adjust; returning to `All` restores full dataset. |  |  |  |
| STU-ACT-002 | Activity card formatting | 1. Inspect first few cards for title, type, timestamp, status pill.<br>2. Compare with sample data. | Cards show all metadata; status color aligns with config. |  |  |  |
| STU-ACT-003 | Empty state handling | 1. Apply a filter with no matching records (if available).<br>2. Observe empty-state illustration/text. | Empty-state component appears without errors; `Reset` brings back items. |  |  |  |
| STU-ACT-004 | Deep linking to source feature | 1. Tap an activity with action CTA (e.g., `Review Feedback`).<br>2. Verify navigation to associated module (assignment/progress). | App navigates to origin screen; upon back returns to same filter state. |  |  |  |
| STU-ACT-005 | Timeline export/share | 1. Use share/export control if provided.<br>2. Confirm prompt appears and handles cancel/confirm. | Share sheet/alert opens with correct summary text; cancel returns focus to list. |  |  |  |
## ScheduleScreen (`src/screens/student/ScheduleScreen.tsx`)
**Navigation:** Bottom tab `Classes` -> `Schedule`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-SCHED-001 | View mode switching | 1. Use controls to switch Week -> Day -> Month view.<br>2. Validate calendar grid updates each time. | Layout changes per mode without clipping; events reposition appropriately. |  |  |  |
| STU-SCHED-002 | Event detail access | 1. Tap a scheduled class.<br>2. Confirm detail drawer/alert opens with class info.<br>3. Close detail. | Detail surface shows subject/time/instructor; closing returns to schedule. |  |  |  |
| STU-SCHED-003 | Calendar settings modal | 1. Open calendar settings (gear icon).<br>2. Toggle options and save.<br>3. Ensure selections persist for current session. | Settings modal appears; toggled switches remain active after save/close. |  |  |  |
| STU-SCHED-004 | Conflict detection | 1. Add/inspect overlapping events if supported.<br>2. Confirm warning badge appears for conflicting slot.<br>3. Resolve conflict and verify badge clears. | Conflict indicator highlights clashing events; clearing removes badge. |  |  |  |
| STU-SCHED-005 | External calendar sync prompt | 1. Tap `Sync to Calendar` action.<br>2. Validate permission prompt/alert copy.<br>3. Cancel and retry to ensure idempotency. | Sync action surfaces proper prompt; repeated taps do not duplicate events. |  |  |  |

## EnhancedScheduleScreen (`src/screens/student/EnhancedScheduleScreen.tsx`)
**Navigation:** `Classes` tab -> from Schedule screen select `Enhanced View` CTA -> `EnhancedSchedule`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-ESCHED-001 | View mode selector behavior | 1. Toggle between agenda/weekly timeline modes.<br>2. Confirm timeline responds with smooth animation. | Selected mode highlights; entries reposition with correct ordering. |  |  |  |
| STU-ESCHED-002 | Event interaction | 1. Tap a class event card.<br>2. Verify detail sheet with join/notes actions.<br>3. Attempt join action to ensure handler fires. | Detail sheet shows enriched data; join action triggers alert or navigation to live class. |  |  |  |
| STU-ESCHED-003 | Assignment integration | 1. Open Assignments sub-panel.<br>2. Verify due date badges, progress chips.<br>3. Mark an assignment to observe toast/alert. | Assignment info accurate; marking triggers confirmation without UI corruption. |  |  |  |
| STU-ESCHED-004 | Smart suggestions carousel | 1. Scroll to AI schedule suggestions.<br>2. Apply a suggestion (e.g., `Plan Revision Slot`).<br>3. Confirm schedule updates and toast appears. | Suggestion inserts event into timeline; toast summarises action. |  |  |  |
| STU-ESCHED-005 | Focus time toggle | 1. Enable Focus/Do-Not-Disturb block (if present).<br>2. Check UI overlays grey-out conflicting events.<br>3. Disable and confirm restoration. | Focus block draws overlay; disabling removes overlay and reinstates interactions. |  |  |  |

## ClassDetailScreen (`src/screens/student/ClassDetailScreen.tsx`)
**Navigation:** `Classes` tab -> Schedule -> select specific class -> `ClassDetail`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-CLASS-001 | Header summary accuracy | 1. Review class title, instructor, schedule info.<br>2. Cross-reference schedule entry. | Details match source class; no missing labels. |  |  |  |
| STU-CLASS-002 | Materials section | 1. Scroll to learning materials.<br>2. Tap resource action (download/view). | Placeholder alert for resource; list retains scroll position. |  |  |  |
| STU-CLASS-003 | Recordings access | 1. Expand recordings list.<br>2. Play first recording (alert/test stub). | Playback handler fires; icon updates to show selection. |  |  |  |
| STU-CLASS-004 | Class notes integration | 1. Add or edit personal notes (if supported).<br>2. Leave screen and return to ensure persistence.<br>3. Clear notes and confirm removal. | Notes save to local state/storage; clearing resets field. |  |  |  |
| STU-CLASS-005 | Instructor contact link | 1. Tap `Message Instructor` or similar CTA.<br>2. Verify navigation to communication screen or alert.<br>3. Return to class detail. | CTA opens appropriate communication channel; back stack intact. |  |  |  |

## StudentLiveClassScreen (`src/screens/student/StudentLiveClassScreen.tsx`)
**Navigation:** `Classes` tab -> Schedule -> tap `Join Live Class` -> `StudentLiveClass`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-LIVE-001 | Class info banner | 1. Confirm class title, instructor, timers at top.<br>2. Verify status badge (Live/Upcoming). | Banner shows accurate metadata and countdown (if configured). |  |  |  |
| STU-LIVE-002 | Control buttons | 1. Toggle mic/camera/hand raise/recording controls.<br>2. Observe state change (icon highlight, modal). | Controls toggle state visually; modals (hand raise etc.) open and close correctly. |  |  |  |
| STU-LIVE-003 | Engagement panels | 1. Open QA, Poll, Whiteboard, Breakout sections.<br>2. Submit sample question/poll response.<br>3. Close each panel. | Submission triggers alert or updates; closing returns to main view without crash. |  |  |  |
| STU-LIVE-004 | Smart notification cadence | 1. Wait for smart notifications to trigger (timer or manual trigger).<br>2. Mark as read/dismiss.<br>3. Confirm feed updates and snackbar messaging. | Notifications appear periodically; marking read reduces count; snackbar acknowledges. |  |  |  |
| STU-LIVE-005 | Recording lifecycle | 1. Toggle recording on.<br>2. Confirm `Recording` banner + timer increments.<br>3. Stop recording and open `Recording` modal to review metadata. | Recording status updates UI; modal lists duration, storage placeholder; snackbar confirms save. |  |  |  |
| STU-LIVE-006 | Breakout room flow | 1. Join a breakout room from list.<br>2. Confirm room detail view shows participants + tasks.<br>3. Leave room and ensure return to main session state. | Room join success toast; leaving resets breakout state and timer. |  |  |  |

## LiveClassParticipationScreen (`src/screens/student/LiveClassParticipationScreen.tsx`)
**Navigation:** `Classes` tab -> Schedule -> select `Join Simplified View` option -> `LiveClassParticipation`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-LCP-001 | Connection status banner | 1. Observe top banner for connection info.<br>2. Trigger reconnect (if button available). | Banner reflects strong/weak connection; actions show alerts. |  |  |  |
| STU-LCP-002 | Tab selector | 1. Cycle Chat -> Polls -> Notes -> Participants, etc.<br>2. Verify content updates and scroll works. | Tab highlight moves; each panel data loads without layout issues. |  |  |  |
| STU-LCP-003 | Stats modal | 1. Open network stats modal.<br>2. Review metrics (latency, bitrate).<br>3. Close modal. | Modal displays seeded metrics; closing restores previous state. |  |  |  |
| STU-LCP-004 | Participation actions | 1. Raise hand via simplified UI.<br>2. Confirm acknowledgement message.<br>3. Lower hand and ensure indicator clears. | Hand raise toast displays; icon toggles off when lowered. |  |  |  |
| STU-LCP-005 | Notes export | 1. In Notes tab add a note.<br>2. Use `Email Notes` or export CTA.<br>3. Validate alert copy and that note remains saved locally. | Export flow prompts share message; note persists after action. |  |  |  |

## EnhancedLiveClassParticipationScreen (`src/screens/student/EnhancedLiveClassParticipationScreen.tsx`)
**Navigation:** `Classes` tab -> Live session -> choose `Enhanced Live Experience` option -> `EnhancedLiveClass`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-ELC-001 | Tab navigation with badges | 1. Observe default Main tab.<br>2. Switch to Chat/Participants/Whiteboard.<br>3. Note badge count updates. | Badges reflect unread counts; switching tabs resets badge where appropriate. |  |  |  |
| STU-ELC-002 | Chat interactions | 1. Send message in Chat tab.<br>2. React to another message if feature exists.<br>3. Verify message alignment by sender. | Message added instantly; reactions update visual state. |  |  |  |
| STU-ELC-003 | Modal operations | 1. Open Hand Raise, Engagement, Media Control modals sequentially.<br>2. Execute available actions.<br>3. Close modals. | Each modal opens smoothly, triggers alerts for actions, and closes without residual overlay. |  |  |  |
| STU-ELC-004 | Whiteboard multi-tool switch | 1. Select pen/highlighter/laser pointer in whiteboard tab.<br>2. Confirm canvas updates tool indicator.<br>3. Undo/redo actions if provided. | Tool selection echoes in UI; undo stack functions without error. |  |  |  |
| STU-ELC-005 | Engagement analytics modal | 1. Open engagement modal.<br>2. Review metrics charts (attention, sentiment).<br>3. Tap `Download Insights`. | Charts render without distortion; download triggers alert with summary. |  |  |  |
| STU-ELC-006 | Media controls fallback | 1. Kill device camera/mic permissions and open media controls modal.<br>2. Ensure UI shows disabled state with guidance.<br>3. Restore permissions and retry. | Modal displays error/warning states gracefully; re-enabling permissions restores controls. |  |  |  |

## VirtualClassroomInterface (`src/screens/student/VirtualClassroomInterface.tsx`)
**Navigation:** `Classes` tab -> from class detail choose `Virtual Classroom` -> `VirtualClassroom`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-VIRT-001 | Environment gallery | 1. Scroll environment cards.<br>2. Tap `Preview` on one environment. | Detail sheet/alert describing environment appears. |  |  |  |
| STU-VIRT-002 | AR model launch | 1. Switch to AR Models section.<br>2. Tap `Launch` on a model. | Launch handler simulated via alert; no crash. |  |  |  |
| STU-VIRT-003 | Immersive session booking | 1. Open Immersive Sessions list.<br>2. Tap `Join Session`/`Schedule`. | Confirmation alert produced with session metadata. |  |  |  |
| STU-VIRT-004 | Device capability checks | 1. Attempt to launch AR on unsupported device/emulator.<br>2. Confirm fallback message appears.<br>3. Retry on supported hardware if available. | Graceful fallback alert for unsupported hardware; supported launch shows success message. |  |  |  |
| STU-VIRT-005 | Environment filters | 1. Apply filters (subject/complexity) if provided.<br>2. Clear filters.<br>3. Ensure list updates accordingly. | Filter chips adjust dataset; clearing resets to default catalogue. |  |  |  |

## EnhancedInteractiveClassroomScreen (`src/screens/student/EnhancedInteractiveClassroomScreen.tsx`)
**Navigation:** `Classes` tab -> Live session advanced options -> `InteractiveClassroom`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-EIC-001 | Participant management | 1. Inspect participants list.<br>2. Use search/filter if provided.<br>3. Activate interaction (e.g., spotlight). | List shows role/status; actions trigger placeholder alerts. |  |  |  |
| STU-EIC-002 | Real-time messages | 1. Navigate to chat/messages.<br>2. Send new message; verify ordering/time. | Message appended with correct alignment and timestamp. |  |  |  |
| STU-EIC-003 | Feature toggles panel | 1. Interact with interactive feature toggles (quizzes, AR, etc.).<br>2. Note any state change or toast. | Toggles change visual state; handler feedback displayed via alert/log. |  |  |  |
| STU-EIC-004 | AI assistant prompts | 1. Trigger AI classroom assistant suggestion.<br>2. Accept suggestion to launch feature (e.g., poll).<br>3. Decline subsequent suggestion. | Accept navigates to feature; decline dismisses prompt without repeats. |  |  |  |
| STU-EIC-005 | Safety controls | 1. Access safety/compliance panel if available.<br>2. Toggle `Report Issue` or `Request Moderator` options.<br>3. Confirm alerts/permanent logs recorded. | Safety actions produce confirmation; repeated taps handle gracefully. |  |  |  |
## AssignmentDetailScreen (`src/screens/student/AssignmentDetailScreen.tsx`)
**Navigation:** `Study` tab -> default `AssignmentDetail` landing or via StudentDashboard assignment link -> `AssignmentDetail`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-ASSIGN-001 | Assignment overview content | 1. Review header (title, due date, weighting).<br>2. Confirm status chips (e.g., In Progress). | Header displays all metadata accurately; chips styled per status. |  |  |  |
| STU-ASSIGN-002 | Submission modal | 1. Tap `Submit Assignment` button.<br>2. Verify modal fields (upload, comments).<br>3. Close modal without submitting. | Modal opens with interactive controls; closing restores underlying view state. |  |  |  |
| STU-ASSIGN-003 | Discussion thread interaction | 1. Scroll to discussion.<br>2. Post comment or react if available.<br>3. Ensure comment appears at top/bottom as designed. | Comment added with user avatar; reaction counters update. |  |  |  |
| STU-ASSIGN-004 | Rubric visibility | 1. Open rubric/assessment criteria section.<br>2. Expand each criterion.<br>3. Verify scoring guidance aligns with sample data. | Rubric accordion expands; text present; closing collapses smoothly. |  |  |  |
| STU-ASSIGN-005 | AI feedback summary | 1. Trigger AI-generated feedback suggestion (if available).<br>2. Review summary text.<br>3. Save or dismiss suggestion. | AI feedback card displays; save adds to comments; dismiss hides. |  |  |  |

## CollaborativeAssignmentWorkspace (`src/screens/student/CollaborativeAssignmentWorkspace.tsx`)
**Navigation:** `Study` tab -> from Assignment detail select `Open Collaborative Workspace` -> `CollaborativeWorkspace`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-COLLAB-001 | Collaborator roster | 1. Review collaborators list.<br>2. Validate roles/status badges.<br>3. Add collaborator (if option present). | List matches seeded collaborators; add action triggers alert. |  |  |  |
| STU-COLLAB-002 | Resource panel operations | 1. Open resources tab.<br>2. Download/view resource.<br>3. Upload new resource (handler). | Resource actions produce alerts; new uploads appear in list or stub message shown. |  |  |  |
| STU-COLLAB-003 | Comments & timeline | 1. Post comment in workspace chat.<br>2. Review activity timeline chronology.<br>3. Ensure timestamps sorted correctly. | Comment renders immediately; timeline entries ordered descending with correct icons. |  |  |  |
| STU-COLLAB-004 | Task board updates | 1. If Kanban/task lists exist, drag task between columns or mark complete.<br>2. Confirm status indicator updates.<br>3. Refresh view to ensure persistence. | Task moves to new column; completion badges update; re-entry retains state. |  |  |  |
| STU-COLLAB-005 | Live presence indicators | 1. Observe presence avatars/typing indicators.<br>2. Simulate collaborator join (via mock toggle if available). | Presence indicators animate appropriately; no stale states remain. |  |  |  |

## StudyLibraryScreen (`src/screens/student/StudyLibraryScreen.tsx`)
**Navigation:** `Study` tab -> navigate to `StudyLibrary`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-LIB-001 | Subject chip filters | 1. Tap different subject chips.<br>2. Confirm resource cards filter accordingly.<br>3. Leave chip on default subject. | Resource grid updates to relevant subject; active chip highlighted. |  |  |  |
| STU-LIB-002 | Resource detail | 1. Tap a resource card.<br>2. Use `Download` / `Favorite` actions. | Alert/handler acknowledges action; card visual updates for favorites. |  |  |  |
| STU-LIB-003 | Advanced filter modal | 1. Open filters icon.<br>2. Adjust level/content type filters.<br>3. Apply filters and observe results. | Modal closes and list reflects filter selection; clear filters restores default. |  |  |  |
| STU-LIB-004 | Offline availability badge | 1. Identify resources marked available offline.<br>2. Toggle offline download.<br>3. Switch device to offline mode and reopen library. | Offline badge updates; resource accessible offline; non-offline items show warning. |  |  |  |
| STU-LIB-005 | Recommendation rail | 1. Scroll to AI recommended resources row.<br>2. Tap `Why recommended?` if present.<br>3. Verify explanation text accuracy. | Explanation modal shows relevant criteria; closing returns to same scroll position. |  |  |  |

## AIStudyScreen (`src/screens/student/AIStudyScreen.tsx`)
**Navigation:** `Study` tab -> `AI Study Assistant` entry -> `AIStudy`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-AI-001 | Tab switching | 1. Navigate across Recommendations, Study Plans, Practice, Assistant tabs.<br>2. Verify indicator movement. | Active tab styling updates; content replaces without delay. |  |  |  |
| STU-AI-002 | Recommendation actions | 1. In Recommendations tab tap `Start Session` or similar CTA.<br>2. Confirm planned session alert. | Alert/handler triggers; UI stays responsive. |  |  |  |
| STU-AI-003 | Assistant query | 1. Open Assistant tab.<br>2. Submit a question via CTA.<br>3. Observe response card. | Response with guidance appears; fallback alert on failure. |  |  |  |
| STU-AI-004 | Practice progress tracking | 1. Start practice session.<br>2. Complete/skip few questions (if interactive).<br>3. Verify progress bar and accuracy stats update. | Progress indicator increments; accuracy recalculates; summary toast shown. |  |  |  |
| STU-AI-005 | Multi-device resume | 1. Begin study plan on device A; note checkpoint.<br>2. Simulate resume by relaunching (or toggling `Resume` CTA).<br>3. Confirm app resumes at saved section. | Resume feature positions user at saved milestone; no data loss. |  |  |  |

## EnhancedAIStudyAssistantScreen (`src/screens/student/EnhancedAIStudyAssistantScreen.tsx`)
**Navigation:** `Study` tab -> from AI Study screen choose `Enhanced Assistant` -> `EnhancedAIStudy`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-EAI-001 | Segment control | 1. Toggle between Plans, Recommendations, Learning Styles, Insights.<br>2. Check highlight follows selection. | Segment updates UI accordingly without jitter. |  |  |  |
| STU-EAI-002 | Plan detail | 1. Expand a plan card.<br>2. Tap `Apply Plan`/`View Details`.<br>3. Review resulting alert. | Action triggers success alert; plan collapses correctly when done. |  |  |  |
| STU-EAI-003 | Insights carousel | 1. Scroll insights horizontally.<br>2. Ensure each card displays metrics + CTA.<br>3. Trigger CTA to verify handler. | Cards render fully; CTA shows alert or modal. |  |  |  |
| STU-EAI-004 | Learning style diagnostics | 1. Navigate to Learning Styles segment.<br>2. Open diagnostic breakdown modal.<br>3. Verify recommendations align with style type. | Modal lists primary/secondary styles with matching suggestions; closing returns to same scroll offset. |  |  |  |
| STU-EAI-005 | AI coach chat hand-off | 1. Tap `Chat with AI Coach` CTA.<br>2. Confirm navigation to AI tutor chat with pre-filled context.<br>3. Validate back navigation returns to Enhanced Assistant. | AI tutor opens with conversation context summary; back returns to previous segment. |  |  |  |

## AITutorChatInterface (`src/screens/student/AITutorChatInterface.tsx`)
**Navigation:** `Study` tab -> `AI Tutor` entry -> `AITutorChat`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-AICHAT-001 | Conversation history load | 1. Verify initial messages on screen load.<br>2. Confirm alternating alignment by sender. | Chat renders seeded history with correct avatars and timestamps. |  |  |  |
| STU-AICHAT-002 | Sending a message | 1. Enter a query in composer.<br>2. Tap send icon.<br>3. Observe new message appended and composer cleared. | Message appears instantly; composer resets; optional AI reply stub triggers. |  |  |  |
| STU-AICHAT-003 | Quick suggestion chips | 1. Tap suggested prompt chip.<br>2. Confirm message auto-populates/sends.<br>3. Ensure duplicates not created inadvertently. | Chip inserts prompt and optionally sends; no crash or UI freeze. |  |  |  |
| STU-AICHAT-004 | Voice input fallback | 1. Tap mic input (if available).<br>2. Deny permission first time to test error state.<br>3. Allow permission and retry. | Permission denial gracefully handled; enabling permits recording and transcription placeholder. |  |  |  |
| STU-AICHAT-005 | Contextual suggestions | 1. Send a message referencing assignment.<br>2. Observe if AI suggests relevant resource/plan.<br>3. Tap suggestion to navigate. | Suggestion chip appears referencing assignment; navigation works. |  |  |  |

## ProgressDetailScreen (`src/screens/student/ProgressDetailScreen.tsx`)
**Navigation:** `Progress` tab -> default screen `ProgressDetail`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-PROG-001 | Tab navigation coverage | 1. Cycle through Overview, Subjects, Achievements, Insights, Predictive, Real-Time, Comparative.<br>2. Confirm charts update per tab. | Each tab renders correct data visualizations without overlap. |  |  |  |
| STU-PROG-002 | Export/share actions | 1. Tap export/share button in any tab.<br>2. Review confirmation prompt. | Alert indicates report exported; no errors. |  |  |  |
| STU-PROG-003 | Insight drill-down | 1. Open insight card details.<br>2. Evaluate metrics shown.<br>3. Close detail view. | Detail sheet shows actionable info; closing returns focus to previous tab. |  |  |  |
| STU-PROG-004 | Benchmark comparisons | 1. Open Comparative tab.<br>2. Switch comparison cohort (class, grade).<br>3. Confirm charts update baseline lines. | Cohort selector updates chart and legend; no overlapping labels. |  |  |  |
| STU-PROG-005 | Real-time alert thresholds | 1. Visit Real-Time tab.<br>2. Toggle threshold for alerts (e.g., attention < 60%).<br>3. Trigger simulated event to cross threshold. | Alert badge appears when thresholds crossed; toggling resets state. |  |  |  |

## GamifiedLearningHub (`src/screens/student/GamifiedLearningHub.tsx`)
**Navigation:** `Progress` tab -> from ProgressDetail select `Learning Hub` CTA -> `GamifiedHub`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-GAME-001 | Tab navigation | 1. Switch among Overview, Achievements, Challenges, Leaderboard.<br>2. Observe smooth transitions. | Tab highlight follows; correct dataset displayed per tab. |  |  |  |
| STU-GAME-002 | Achievement redemption | 1. In Achievements tab tap `Claim Reward`.<br>2. Confirm reward alert. | Success alert appears; reward status updates if modeled. |  |  |  |
| STU-GAME-003 | Challenge participation | 1. Move to Challenges tab.<br>2. Join/accept a challenge.<br>3. Confirm acknowledgement. | Alert confirms enrollment; challenge card updates to joined state. |  |  |  |
| STU-GAME-004 | Streak tracker integrity | 1. Check streak widget.<br>2. Simulate missed day (via debug toggle if available).<br>3. Ensure streak resets/adjusts correctly. | Streak calculation matches simulated data; UI reflects break. |  |  |  |
| STU-GAME-005 | Leaderboard filter | 1. Filter leaderboard by timeframe or subject.<br>2. Verify ranking reorder.<br>3. Inspect own position highlight. | Filters reorder list; user entry remains highlighted. |  |  |  |

## LiveCollaborationStudio (`src/screens/student/LiveCollaborationStudio.tsx`)
**Navigation:** `Connect` tab -> default `LiveCollaboration`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-LCOL-001 | View selector functionality | 1. Toggle Main / Whiteboard / Breakout / Resources / Chat views.<br>2. Check that current view content changes. | View indicator updates; relevant content loads each time. |  |  |  |
| STU-LCOL-002 | Whiteboard tools | 1. In Whiteboard view select drawing/eraser tools.<br>2. Validate UI feedback (highlight, alert). | Tool activation visually indicated; actions trigger placeholder behavior. |  |  |  |
| STU-LCOL-003 | Resource sharing | 1. Open Resources view.<br>2. Tap `Share` on any resource.<br>3. Confirm confirmation message. | Share handler executes with success alert; resource remains listed. |  |  |  |
| STU-LCOL-004 | Breakout stage indicator | 1. Switch to Breakout view.<br>2. Start timer/agenda (if available).<br>3. Confirm countdown and stage progression update. | Stage indicator tracks time; transitions to next phase automatically or via CTA. |  |  |  |
| STU-LCOL-005 | Collaborative notes sync | 1. Add note in shared notes area.<br>2. Simulate remote update (if stub available).<br>3. Ensure notes merge without duplication. | Shared notes show new entries with author tagging; no UI flicker. |  |  |  |

## PeerLearningNetwork (`src/screens/student/PeerLearningNetwork.tsx`)
**Navigation:** `Connect` tab -> from LiveCollaboration screen select `Peer Network` -> `PeerLearning`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| STU-PEER-001 | Tab content validation | 1. Switch between Peers, Study Groups, Projects, Study Buddies.<br>2. Inspect list contents for each. | Lists populate with seeded entries; no blank screens unless intended. |  |  |  |
| STU-PEER-002 | Connection requests | 1. Tap `Request Mentor`/`Connect` on peer card.<br>2. Observe confirmation. | Alert acknowledges request; button state updates if implemented. |  |  |  |
| STU-PEER-003 | Group enrollment | 1. Go to Study Groups tab.<br>2. Tap `Join Group`.<br>3. Verify response. | Joining triggers success alert; card indicates membership. |  |  |  |
| STU-PEER-004 | Project collaboration board | 1. Open Projects tab.<br>2. View project timeline/milestones.<br>3. Update milestone status. | Milestone toggles update visual state; timeline reorders if necessary. |  |  |  |
| STU-PEER-005 | Safety & privacy controls | 1. Access safety/privacy settings inside Peer Network.<br>2. Block/unblock a peer.<br>3. Confirm blocked peer no longer appears in suggestions. | Blocked state persists; unblock restores default visibility. |  |  |  |

## Teacher Manual Test Cases

_Preconditions:_ Launch the Manushi Coaching app, authenticate with a **teacher** account, ensure classroom data is seeded (sample schedules, students, assignments), and confirm notification permissions are granted for live session tooling. Navigation references the default `TeacherNavigator` tab layout (Home, Classes, Students, Analytics, More).
## TeacherDashboard (`src/screens/teacher/TeacherDashboard.tsx`)
**Navigation:** Login -> Teacher role landing -> `Home` tab (default) -> `TeacherDashboard`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TCH-DASH-001 | Dynamic header + mode switching | 1. Observe hero metrics and schedule summary on load.<br>2. Tap enhanced navigation buttons to switch between `dashboard`, `attendance`, and `communication` views.<br>3. Confirm status bar color/theme adapts per view. | Each view renders tailored content; status bar/background tint updates; data matches seeded metrics. |  |  |  |
| TCH-DASH-002 | Quick action navigation | 1. Use quick actions like `Class Control`, `Start Live Class`, `Create Assignment`.<br>2. Confirm navigation callbacks push correct stack screens or toggle view.<br>3. Return via back navigation to dashboard. | Quick actions trigger appropriate navigation or state changes; back button returns to dashboard without duplicate screens. |  |  |  |
| TCH-DASH-003 | AI enhancement cards | 1. Scroll to AI Assistance area.<br>2. Trigger `AI Insight` and `AI Automation` CTAs.<br>3. Validate generated insight text and snackbar acknowledgement. | AI cards surface context-aware copy; CTA produces confirmation/snackbar; view scroll position preserved. |  |  |  |
| TCH-DASH-004 | Advanced feature tiles | 1. Inspect Phase 85-88 feature list.<br>2. Interact with `Real-time Engagement`, `AI Chat Moderation`, `Breakout Rooms`, `Task Automation` info tiles.<br>3. Ensure haptic feedback and ripple effects fire (if device supports). | Feature tiles display detailed descriptions; interactions provide expected feedback; no console warnings. |  |  |  |
| TCH-DASH-005 | Exit & notification flows | 1. Open notification snackbar via manual trigger (e.g., `View Reports` action).<br>2. Dismiss snackbar and ensure message clears.<br>3. Tap `Back to Role Selection`; confirm alert guard prevents accidental exit unless confirmed. | Snackbar appears/disappears correctly; exit confirmation dialog shows proper copy; cancel keeps user on dashboard. |  |  |  |
## LiveClassScreen (`src/screens/teacher/LiveClassScreen.tsx`)
**Navigation:** `Classes` tab -> `LiveClass`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TCH-LIVE-001 | App bar + session metadata | 1. Confirm session title, schedule, and class code in header.<br>2. Toggle between upcoming/live states via debug controls if available.<br>3. Ensure timers, badges, and action buttons update accordingly. | Session metadata reflects state changes; countdown/live badge updates; no stale values. |  |  |  |
| TCH-LIVE-002 | Core control panel | 1. Toggle mic, camera, recording, screen share controls sequentially.<br>2. Validate icon states, permission prompts, and snackbars.<br>3. Reset all controls to default. | Button states reflect toggles; permission denials handled gracefully; recording indicator appears/disappears. |  |  |  |
| TCH-LIVE-003 | Participant & attendance workflow | 1. Open participant management section.<br>2. Assign spotlight, mute all, and mark attendance for a student.<br>3. Check attendance stats update and actions log to timeline. | Participant list updates with new statuses; attendance counters adjust; timeline entry logged. |  |  |  |
| TCH-LIVE-004 | Chat + moderation | 1. Send announcement in chat.<br>2. Use AI moderation toggle or flag a message.<br>3. Verify moderation banner/snackbar details. | Message appears with correct sender; flagged items show moderation status; AI toggle updates label. |  |  |  |
| TCH-LIVE-005 | Polls & quizzes | 1. Launch a live poll.<br>2. Vote via teacher view (if allowed) or observe student responses simulation.<br>3. Close poll and export results (alert). | Poll countdown runs; results chart updates; closing displays summary and export confirmation. |  |  |  |
| TCH-LIVE-006 | Whiteboard & breakout | 1. Switch to whiteboard tab; draw using multiple tools.<br>2. Create breakout rooms, assign students, broadcast message.<br>3. End breakouts and confirm summary modal. | Whiteboard renders strokes/eraser/undo; breakout creation works with status indicators; closing rooms generates summary toast/modal. |  |  |  |
## AdvancedClassControlScreen (`src/screens/teacher/AdvancedClassControlScreen.tsx`)
**Navigation:** `Classes` tab -> `AdvancedClassControl`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TCH-ACC-001 | Tab navigation layout | 1. Switch between dashboard, whiteboard, breakout, engagement, recording, AI moderation tabs using top navigation.<br>2. Confirm active tab indicator and content change smoothly.<br>3. Return to dashboard tab. | Active tab styling updates; content swaps instantly; navigation stack remains intact. |  |  |  |
| TCH-ACC-002 | Whiteboard control suite | 1. In Whiteboard tab select various tools (pen, highlighter, shapes, eraser).<br>2. Adjust stroke thickness/color.<br>3. Use undo/redo and clear board actions. | Canvas reflects tool changes; undo/redo stack behaves; clearing resets board with confirmation prompt. |  |  |  |
| TCH-ACC-003 | Breakout room orchestration | 1. Create multiple breakout rooms.<br>2. Assign students automatically and manually move one student.<br>3. Broadcast announcement and monitor time-on-task analytics. | Room cards show assigned students; manual moves persist; broadcast banner confirms message; analytics update. |  |  |  |
| TCH-ACC-004 | Engagement analytics | 1. Open engagement tab.<br>2. Review attention, participation, sentiment charts.<br>3. Export analytics to PDF/CSV (placeholder alert). | Charts render with seeded data; export action triggers confirmation; no layout overflow. |  |  |  |
| TCH-ACC-005 | Recording and AI moderation | 1. Toggle recording panel on/off and set markers.<br>2. Enable AI moderation with specific thresholds.<br>3. Trigger sample violation to verify flagging. | Recording status updates; markers listed with timestamps; AI moderation flags entry and surfaces guidance. |  |  |  |
## ClassPreparationScreen (`src/screens/teacher/ClassPreparationScreen.tsx`)
**Navigation:** `Classes` tab -> `ClassPreparation`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TCH-PREP-001 | Tab navigation | 1. Switch through Schedule Management, Lesson Plans, Tech Check, Materials, Notifications tabs.<br>2. Confirm indicator and content update for each tab.<br>3. Ensure scroll position resets appropriately. | Tab transitions smooth; relevant cards display; no duplicate renders. |  |  |  |
| TCH-PREP-002 | Schedule adjustments | 1. Modify class timings or reorder agenda items.<br>2. Save changes.<br>3. Verify confirmation toast and updated list ordering. | Agenda reflects new ordering; toast confirms save; data persists on revisit. |  |  |  |
| TCH-PREP-003 | Lesson plan management | 1. Add resources/notes to lesson plan.<br>2. Duplicate or archive a lesson unit.<br>3. Confirm changes propagate to summary view. | Lesson plan items update; duplication creates new entry; archive removes from active list. |  |  |  |
| TCH-PREP-004 | Device & tech checklist | 1. Run status checks (camera, mic, network) in Tech Check tab.<br>2. Mark items resolved.<br>3. Simulate failure to inspect error messaging. | Tech check shows pass/fail icons; failure surfaces action guidance; resolved items persist. |  |  |  |
| TCH-PREP-005 | Notification scheduling | 1. Compose pre-class notification.<br>2. Schedule send time and audience.<br>3. Save and validate entry appears in scheduled list. | Notification saved with correct metadata; list shows upcoming messages; editing updates entry. |  |  |  |
## AssignmentCreatorScreen (`src/screens/teacher/AssignmentCreatorScreen.tsx`)
**Navigation:** `Classes` tab -> `AssignmentCreator`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TCH-ACRE-001 | Tab navigation | 1. Cycle through `Create`, `Templates`, `Rubric`, `Settings`, `Preview` tabs.<br>2. Ensure tab content loads without losing draft state.<br>3. Return to Create tab. | Draft data persists across tab changes; preview updates to latest edits. |  |  |  |
| TCH-ACRE-002 | Question authoring | 1. Add multiple questions with varied types (MCQ, descriptive).<br>2. Attach media/resources where supported.<br>3. Reorder questions via drag handle. | Questions save with correct metadata; attachments show; ordering updates correctly. |  |  |  |
| TCH-ACRE-003 | Template import | 1. Navigate to Templates tab.<br>2. Apply a template and merge with current draft.<br>3. Confirm imported sections visible in Create tab. | Template content merges without overwriting existing questions; success alert shown. |  |  |  |
| TCH-ACRE-004 | Rubric definition | 1. In Rubric tab, configure criteria, weightage, and descriptors.<br>2. Validate totals calculate to 100%.<br>3. Preview rubric in Preview tab. | Rubric rows editable; total weight validation triggers warnings if mismatch; preview displays formatted rubric. |  |  |  |
| TCH-ACRE-005 | Assignment settings | 1. Set availability window, late policy, AI assistance toggles.<br>2. Enable plagiarism check and proctoring options.<br>3. Save draft and observe confirmation. | Settings persist, toggles reflect state; save toast appears; data reload retains options. |  |  |  |
## AssignmentGradingScreen (`src/screens/teacher/AssignmentGradingScreen.tsx`)
**Navigation:** `Classes` tab -> `AssignmentGrading`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TCH-AGR-001 | Submission list management | 1. Review submissions list with filters (status, class, due date).<br>2. Apply filter and search by student name.<br>3. Clear filters and confirm full list returns. | Filters narrow list; search highlights match; clearing restores full dataset. |  |  |  |
| TCH-AGR-002 | Grading workflow | 1. Open a submission detail.<br>2. Enter score using rubric sliders/text.<br>3. Leave inline comments and publish grade. | Score updates gradebook summary; comments saved; publish triggers snackbar. |  |  |  |
| TCH-AGR-003 | AI feedback assistant | 1. Toggle AI suggestion for feedback.<br>2. Review generated comment.<br>3. Edit before publishing and ensure final message persists. | AI suggestion populates comment field; manual edits retained; published feedback matches edited text. |  |  |  |
| TCH-AGR-004 | Analytics overview | 1. Visit analytics tab.<br>2. Inspect distribution charts and mastery levels.<br>3. Export analytics summary. | Charts load with seeded data; export action displays confirmation; filters adjust chart. |  |  |  |
| TCH-AGR-005 | Bulk actions | 1. Select multiple submissions.<br>2. Apply bulk status change (e.g., mark as returned) or send reminder.<br>3. Verify action summary and state updates. | Bulk operation success toast; selected submissions show updated status; errors handled individually. |  |  |  |
## EnhancedAssignmentGradingScreen (`src/screens/teacher/EnhancedAssignmentGradingScreen.tsx`)
**Navigation:** `Classes` tab -> `EnhancedGrading`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TCH-EGR-001 | Submission card enhancements | 1. Scroll enhanced submission list.<br>2. Verify AI score, plagiarism status, and risk badges render per item.<br>3. Tap a card to expand details. | Cards display additional analytics; expand reveals full context; overflow handled on small screens. |  |  |  |
| TCH-EGR-002 | Plagiarism insights | 1. Within submission detail open plagiarism panel.<br>2. Review matched sources and percentages.<br>3. Mark source as reviewed and confirm badge update. | Matched sources list with highlight; marking reviewed updates status; ability to download report via alert. |  |  |  |
| TCH-EGR-003 | Feedback templates system | 1. Access feedback templates tab.<br>2. Apply template, customize text, save as new template.<br>3. Ensure template library updates and applied feedback reflects changes. | Template applied correctly; edits saved as new entry; applied comment matches final copy. |  |  |  |
| TCH-EGR-004 | AI customization controls | 1. Adjust AI tone sliders (formal/supportive etc.).<br>2. Regenerate feedback.<br>3. Compare tone adjustments in output. | Generated feedback reflects tone settings; previous feedback archived for reference. |  |  |  |
| TCH-EGR-005 | Analytics + export | 1. Review enhanced analytics view (heatmaps, cohort comparisons).<br>2. Export to CSV/PowerPoint placeholder.<br>3. Validate confirmation message and file naming convention in alert. | Analytics render with legend; export prompt shows correct file naming; state resets after export. |  |  |  |
## AttendanceTrackingScreen (`src/screens/teacher/AttendanceTrackingScreen.tsx`)
**Navigation:** `Classes` tab -> `Attendance`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TCH-ATT-001 | Tab navigation | 1. Switch tabs: Overview, Students, Sessions, Reports, Alerts.<br>2. Confirm state updates and charts per tab.<br>3. Return to Overview. | Tab indicator updates; content loads per tab; no blank screens. |  |  |  |
| TCH-ATT-002 | Student check-in/out | 1. In Students tab mark a student present/late via swipe or toggle.<br>2. Use bulk actions if available.<br>3. Verify counts update in Overview tab. | Student status toggles with haptic feedback; counts adjust; undo option available if designed. |  |  |  |
| TCH-ATT-003 | Session management | 1. Create new session entry with date/time.<br>2. Edit existing session details.<br>3. Delete session and confirm confirmation dialog behaviour. | New session appears in list; edits persist; deletion requests confirmation and updates metrics. |  |  |  |
| TCH-ATT-004 | Reports export | 1. Navigate to Reports tab.<br>2. Generate weekly/monthly report.<br>3. Export via available formats. | Report generation spinner completes; export alert displays with file info. |  |  |  |
| TCH-ATT-005 | Alerts + follow-up | 1. Visit Alerts tab.<br>2. Acknowledge or escalate attendance alert.<br>3. Ensure status change reflected and communication options surface. | Alerts update status to acknowledged/escalated; associated actions logged. |  |  |  |
## QuestionBankManagementScreen (`src/screens/teacher/QuestionBankManagementScreen.tsx`)
**Navigation:** `Classes` tab -> `QuestionBank`

| Test ID | Feature / Scenario | Steps | Expected Result | Actual Result | Remarks | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TCH-QBM-001 | Tab navigation & filters | 1. Switch between Overview, Question Banks, Create Question tabs.<br>2. Apply difficulty/subject filters.<br>3. Confirm filtered list accuracy. | Tabs render relevant layouts; filters reduce list correctly; clearing restores full list. |  |  |  |
| TCH-QBM-002 | Question creation form | 1. Open Create Question form.<br>2. Populate metadata (type, tags, difficulty) and add choices.<br>3. Preview and save question to selected bank. | Form validation enforces required fields; preview shows formatted question; saved entry appears in bank. |  |  |  |
| TCH-QBM-003 | Bank analytics | 1. In Overview tab review usage metrics, coverage charts, and recommendation tiles.<br>2. Export analytics summarised data. | Charts display seeded analytics; export produces confirmation message; tiles highlight improvement suggestions. |  |  |  |
| TCH-QBM-004 | Bulk operations | 1. Select multiple questions.<br>2. Perform bulk tag assignment or archive action.<br>3. Verify action summary and state changes. | Bulk action updates all selected items; success toast details count; archived items hidden by default. |  |  |  |
| TCH-QBM-005 | AI assist suggestions | 1. Use AI to generate suggested questions.<br>2. Edit AI output before saving.<br>3. Track attribution marking AI-authored content. | AI-generated question populates form; manual edits allowed; AI attribution flag stored. |  |  |  |
