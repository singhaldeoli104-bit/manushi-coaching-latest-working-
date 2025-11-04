/**
 * Student Organisms - MD3 Complex Composite Components
 *
 * Export all organism-level UI components for student screens
 *
 * Usage:
 * import { FilterPanel } from '@/components/student/organisms';
 */

export { FilterPanel } from './FilterPanel';
export type { FilterPanelProps, FilterCategory } from './FilterPanel';


// Week 4: Live Class Components
export { default as ParticipantsList } from './ParticipantsList';
export type { Participant, ParticipantRole, ParticipantStatus } from './ParticipantsList';

export { default as ChatPanel } from './ChatPanel';
export type { ChatMessage } from './ChatPanel';

export { default as PollsWidget } from './PollsWidget';
export type { Poll, PollOption, PollStatus } from './PollsWidget';

export { default as ScreenShareViewer } from './ScreenShareViewer';
export type { AspectRatio } from './ScreenShareViewer';

export { default as LiveClassControls } from './LiveClassControls';
export type { ConnectionQuality } from './LiveClassControls';

export { default as QuizInterface } from './QuizInterface';
export type {
  Quiz,
  QuizQuestion,
  QuizOption,
  StudentAnswer,
  QuizResult,
  QuizState,
} from './QuizInterface';

// Schedule organisms
export { ScheduleSummaryChips } from './ScheduleSummaryChips';
export { CalendarStrip } from './CalendarStrip';
export { DayAgendaList } from './DayAgendaList';
export { ReminderList } from './ReminderList';
export { QuickActionRow } from './QuickActionRow';
export { FilterBottomSheet } from './FilterBottomSheet';
export type { FilterOptions, FilterBottomSheetProps } from './FilterBottomSheet';
