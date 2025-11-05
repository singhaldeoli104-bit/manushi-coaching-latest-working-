/**
 * Student Molecules - MD3 Complex Components
 *
 * Export all molecular-level UI components for student screens
 *
 * Usage:
 * import { Tabs, Modal, BottomSheet, SearchBar, EmptyState, LoadingState } from '@/components/student/molecules';
 * import { EventCard, AssignmentCard, HorizontalCarousel } from '@/components/student/molecules';
 */

// Premium Minimal Card Components (NEW)
export { EventCard } from './EventCard';
export type { EventCardProps } from './EventCard';

export { AssignmentCard } from './AssignmentCard';
export type { AssignmentCardProps } from './AssignmentCard';

export { HorizontalCarousel } from './HorizontalCarousel';
export type { HorizontalCarouselProps } from './HorizontalCarousel';

// Existing Components
export { Tabs } from './Tabs';
export type { TabsProps, TabItem } from './Tabs';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { BottomSheet } from './BottomSheet';
export type { BottomSheetProps } from './BottomSheet';

export { SearchBar } from './SearchBar';
export type { SearchBarProps } from './SearchBar';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { LoadingState } from './LoadingState';
export type { LoadingStateProps } from './LoadingState';
