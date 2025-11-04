/**
 * Navigation Components Barrel Export
 *
 * Material Design 3 compliant navigation components for student screens
 *
 * Usage:
 * import { StudentTopBar, StudentDrawer, StudentBottomNav } from '@/components/student/navigation';
 */

export { StudentTopBar } from './StudentTopBar';
export type { StudentTopBarProps, MenuItem } from './StudentTopBar';

export { StudentDrawer } from './StudentDrawer';
export type {
  StudentDrawerProps,
  DrawerNavigationItem,
  DrawerProfileData,
} from './StudentDrawer';

export { StudentBottomNav } from './StudentBottomNav';
export type { StudentBottomNavProps, BottomNavItem } from './StudentBottomNav';
