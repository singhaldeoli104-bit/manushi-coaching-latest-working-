/**
 * M3 Expressive Test Screen
 *
 * Comprehensive test/demo screen showcasing ALL components from Phase 0 and Phase 3:
 *
 * PHASE 0 (Foundation Components):
 * - Card (elevated, filled, outlined)
 * - Badge (count, dot indicators)
 * - Tabs (primary, secondary with badges)
 * - Modal & BottomSheet
 * - SearchBar (debounced search)
 * - FilterPanel (slide-in filters)
 * - EmptyState (no-data, no-results, error)
 *
 * PHASE 3A (M3 Expressive - Animations & Feedback):
 * - Button animations with haptic feedback
 * - IconButton variants
 * - LoadingIndicator variants (circular, linear, pulse, dots)
 * - SkeletonLoader components
 * - ShimmerEffect overlays
 * - Haptic feedback patterns
 *
 * PHASE 3B (Advanced UI Patterns):
 * - ButtonGroup (segmented control)
 * - SplitButton (primary action + dropdown)
 * - FABMenu (expandable floating action button)
 * - Toolbar (action bar with badges)
 *
 * PHASE 3C (User Input & Feedback):
 * - ProgressStepper (multi-step indicator)
 * - SnackbarAction (toast notifications)
 * - ChipGroup (filter/input/assist chips)
 * - DateTimePicker (date/time selection)
 *
 * Use this screen to verify all components work correctly on device.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Button } from '../../components/student/atoms/Button';
import { IconButton } from '../../components/student/atoms/IconButton';
import { LoadingIndicator } from '../../components/student/atoms/LoadingIndicator';
import {
  SkeletonLoader,
  SkeletonAvatar,
  SkeletonText,
  SkeletonCard,
  SkeletonListItem,
  SkeletonPost,
} from '../../components/student/atoms/SkeletonLoader';
import {
  ShimmerEffect,
  ShimmerPlaceholder,
  ShimmerList,
} from '../../components/student/atoms/ShimmerEffect';
import { Haptics } from '../../utils/haptics';
import { StudentTopBar } from '../../components/student/navigation/StudentTopBar';
import { StudentBottomNav } from '../../components/student/navigation/StudentBottomNav';
import { ButtonGroup } from '../../components/student/molecules/ButtonGroup';
import { SplitButton } from '../../components/student/molecules/SplitButton';
import { FABMenu } from '../../components/student/molecules/FABMenu';
import { Toolbar } from '../../components/student/molecules/Toolbar';
import { ProgressStepper } from '../../components/student/molecules/ProgressStepper';
import { SnackbarAction } from '../../components/student/molecules/SnackbarAction';
import { ChipGroup } from '../../components/student/molecules/ChipGroup';
import { DateTimePicker } from '../../components/student/molecules/DateTimePicker';
// Phase 0 components
import { Card } from '../../components/student/atoms/Card';
import { Badge } from '../../components/student/atoms/Badge';
import { Tabs } from '../../components/student/molecules/Tabs';
import { Modal } from '../../components/student/molecules/Modal';
import { BottomSheet } from '../../components/student/molecules/BottomSheet';
import { SearchBar } from '../../components/student/molecules/SearchBar';
import { FilterPanel } from '../../components/student/organisms/FilterPanel';
import { EmptyState } from '../../components/student/molecules/EmptyState';
import { QuizInterface } from '../../components/student/organisms/QuizInterface';
import { PollsWidget } from '../../components/student/organisms/PollsWidget';

const M3ExpressiveTestScreen: React.FC = () => {
  const [showSkeletons, setShowSkeletons] = useState(true);
  const [showShimmer, setShowShimmer] = useState(true);
  const [linearProgress, setLinearProgress] = useState(0.6);
  const [activeRoute, setActiveRoute] = useState('Home');

  // Phase 3B state
  const [selectedViewMode, setSelectedViewMode] = useState('day');
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);

  // Phase 3C state
  const [currentStep, setCurrentStep] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState<'default' | 'success' | 'error' | 'warning' | 'info'>('default');
  const [selectedChips, setSelectedChips] = useState<string[]>(['math']);
  const [selectedInputChips, setSelectedInputChips] = useState(['math', 'science', 'english']);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Phase 0 state
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Demo icon component (using Text as placeholder)
  const DemoIcon: React.FC<{ name: string; size: number }> = ({ size }) => (
    <Text style={{ fontSize: size }}>★</Text>
  );

  // Navigation items for bottom nav
  const navigationItems = [
    {
      key: 'Home',
      label: 'Home',
      icon: <Text style={{ fontSize: 24 }}>🏠</Text>,
      onPress: () => {
        setActiveRoute('Home');
        console.log('Home tab pressed');
      },
    },
    {
      key: 'Classes',
      label: 'Classes',
      icon: <Text style={{ fontSize: 24 }}>📚</Text>,
      badge: 3,
      onPress: () => {
        setActiveRoute('Classes');
        console.log('Classes tab pressed');
      },
    },
    {
      key: 'Assignments',
      label: 'Assignments',
      icon: <Text style={{ fontSize: 24 }}>📝</Text>,
      badge: 5,
      onPress: () => {
        setActiveRoute('Assignments');
        console.log('Assignments tab pressed');
      },
    },
    {
      key: 'Profile',
      label: 'Profile',
      icon: <Text style={{ fontSize: 24 }}>👤</Text>,
      onPress: () => {
        setActiveRoute('Profile');
        console.log('Profile tab pressed');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <StudentTopBar
        title="M3E Test Lab"
        showBackButton={false}
        onMenuPress={() => console.log('Menu pressed')}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Complete Component Library</Text>
          <Text style={styles.subtitle}>Phase 0 + 3A + 3B + 3C • 21 Sections • 25+ Components</Text>
        </View>

      {/* Section 1: Button Animations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Button Animations + Haptics</Text>
        <Text style={styles.sectionDesc}>
          Press and hold to feel spring animation + haptic feedback
        </Text>

        <View style={styles.componentGrid}>
          <Button variant="filled" size="large" onPress={() => console.log('Filled pressed')}>
            Filled Large
          </Button>

          <Button variant="filled-tonal" size="medium" onPress={() => console.log('Tonal pressed')}>
            Tonal Medium
          </Button>

          <Button variant="outlined" size="small" onPress={() => console.log('Outlined pressed')}>
            Outlined Small
          </Button>

          <Button variant="text" size="medium" onPress={() => console.log('Text pressed')}>
            Text Button
          </Button>

          <Button variant="elevated" size="medium" onPress={() => console.log('Elevated pressed')}>
            Elevated
          </Button>

          <Button variant="filled" loading size="medium">
            Loading
          </Button>

          <Button variant="filled" disabled size="medium">
            Disabled
          </Button>
        </View>
      </View>

      {/* Section 2: IconButton Variants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. IconButton Variants</Text>
        <Text style={styles.sectionDesc}>
          Tap to feel lighter haptic feedback (impact_light)
        </Text>

        <View style={styles.iconButtonGrid}>
          <View style={styles.iconButtonGroup}>
            <Text style={styles.iconButtonLabel}>Filled</Text>
            <View style={styles.iconButtonRow}>
              <IconButton variant="filled" size="small" onPress={() => console.log('Icon small')}>
                <DemoIcon name="star" size={20} />
              </IconButton>
              <IconButton variant="filled" size="medium" onPress={() => console.log('Icon medium')}>
                <DemoIcon name="star" size={24} />
              </IconButton>
              <IconButton variant="filled" size="large" onPress={() => console.log('Icon large')}>
                <DemoIcon name="star" size={28} />
              </IconButton>
            </View>
          </View>

          <View style={styles.iconButtonGroup}>
            <Text style={styles.iconButtonLabel}>Filled Tonal</Text>
            <View style={styles.iconButtonRow}>
              <IconButton variant="filled-tonal" size="small" onPress={() => console.log('Tonal')}>
                <DemoIcon name="star" size={20} />
              </IconButton>
              <IconButton variant="filled-tonal" size="medium" onPress={() => console.log('Tonal')}>
                <DemoIcon name="star" size={24} />
              </IconButton>
              <IconButton variant="filled-tonal" size="large" onPress={() => console.log('Tonal')}>
                <DemoIcon name="star" size={28} />
              </IconButton>
            </View>
          </View>

          <View style={styles.iconButtonGroup}>
            <Text style={styles.iconButtonLabel}>Outlined</Text>
            <View style={styles.iconButtonRow}>
              <IconButton variant="outlined" size="medium" onPress={() => console.log('Outlined')}>
                <DemoIcon name="star" size={24} />
              </IconButton>
              <IconButton variant="outlined" loading size="medium">
                <DemoIcon name="star" size={24} />
              </IconButton>
            </View>
          </View>

          <View style={styles.iconButtonGroup}>
            <Text style={styles.iconButtonLabel}>Standard</Text>
            <View style={styles.iconButtonRow}>
              <IconButton variant="standard" size="medium" onPress={() => console.log('Standard')}>
                <DemoIcon name="star" size={24} />
              </IconButton>
              <IconButton variant="standard" disabled size="medium">
                <DemoIcon name="star" size={24} />
              </IconButton>
            </View>
          </View>
        </View>
      </View>

      {/* Section 3: LoadingIndicator Variants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Loading Indicator Variants</Text>
        <Text style={styles.sectionDesc}>
          4 different loading animation styles
        </Text>

        <View style={styles.loadingGrid}>
          <View style={styles.loadingItem}>
            <Text style={styles.loadingLabel}>Circular</Text>
            <LoadingIndicator variant="circular" size="large" />
          </View>

          <View style={styles.loadingItem}>
            <Text style={styles.loadingLabel}>Pulse</Text>
            <LoadingIndicator variant="pulse" size="large" />
          </View>

          <View style={styles.loadingItem}>
            <Text style={styles.loadingLabel}>Dots</Text>
            <LoadingIndicator variant="dots" size="large" />
          </View>
        </View>

        <View style={styles.linearProgressContainer}>
          <Text style={styles.loadingLabel}>Linear Progress (60%)</Text>
          <LoadingIndicator variant="linear" size="medium" progress={linearProgress} />

          <Text style={styles.loadingLabel} style={{ marginTop: 16 }}>
            Linear Indeterminate
          </Text>
          <LoadingIndicator variant="linear" size="medium" />
        </View>
      </View>

      {/* Section 4: SkeletonLoader Components */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Skeleton Loaders</Text>
        <Text style={styles.sectionDesc}>
          Placeholder UI with shimmer animation (tap button to toggle)
        </Text>

        <Button
          variant="filled-tonal"
          size="medium"
          fullWidth
          onPress={() => setShowSkeletons(!showSkeletons)}
        >
          {showSkeletons ? '👁️ Hide Skeletons' : '👁️ Show Skeletons'}
        </Button>

        {showSkeletons && (
          <View style={styles.skeletonContainer}>
            <Text style={styles.skeletonLabel}>Basic Shapes</Text>
            <View style={styles.skeletonRow}>
              <SkeletonLoader shape="circle" width={48} height={48} />
              <SkeletonLoader shape="rounded" width={100} height={48} />
              <SkeletonLoader shape="text" width="50%" />
            </View>

            <Text style={styles.skeletonLabel}>Pre-built Layouts</Text>
            <SkeletonAvatar size={64} />
            <SkeletonText width="80%" />
            <SkeletonText width="60%" />
            <SkeletonCard height={150} />

            <Text style={styles.skeletonLabel}>List Item</Text>
            <SkeletonListItem showAvatar={true} />
            <SkeletonListItem showAvatar={true} />

            <Text style={styles.skeletonLabel}>Post/Card</Text>
            <SkeletonPost />
          </View>
        )}
      </View>

      {/* Section 5: ShimmerEffect */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Shimmer Effects</Text>
        <Text style={styles.sectionDesc}>
          Animated shimmer overlays (tap button to toggle)
        </Text>

        <Button
          variant="filled-tonal"
          size="medium"
          fullWidth
          onPress={() => setShowShimmer(!showShimmer)}
        >
          {showShimmer ? '✨ Hide Shimmer' : '✨ Show Shimmer'}
        </Button>

        <View style={styles.shimmerContainer}>
          <Text style={styles.shimmerLabel}>Shimmer Placeholder</Text>
          <ShimmerPlaceholder width="100%" height={120} visible={showShimmer} />

          <Text style={styles.shimmerLabel}>Shimmer List (5 items)</Text>
          <ShimmerList count={3} itemHeight={60} gap={8} />

          <Text style={styles.shimmerLabel}>Shimmer as Overlay</Text>
          <View style={styles.shimmerOverlayDemo}>
            <View style={styles.shimmerContent}>
              <Text style={styles.shimmerContentText}>Content Below</Text>
              <Text style={styles.shimmerContentText}>Shimmer Animation</Text>
            </View>
            {showShimmer && <ShimmerEffect />}
          </View>
        </View>
      </View>

      {/* Section 6: Haptic Feedback Patterns */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Haptic Feedback Patterns</Text>
        <Text style={styles.sectionDesc}>
          Test all 7 haptic patterns (device only, not simulator)
        </Text>

        <View style={styles.hapticGrid}>
          <Button variant="filled-tonal" size="small" onPress={() => Haptics.selection()}>
            Selection
          </Button>
          <Button variant="filled-tonal" size="small" onPress={() => Haptics.success()}>
            Success
          </Button>
          <Button variant="filled-tonal" size="small" onPress={() => Haptics.warning()}>
            Warning
          </Button>
          <Button variant="filled-tonal" size="small" onPress={() => Haptics.error()}>
            Error
          </Button>
          <Button variant="filled-tonal" size="small" onPress={() => Haptics.impactLight()}>
            Impact Light
          </Button>
          <Button variant="filled-tonal" size="small" onPress={() => Haptics.impactMedium()}>
            Impact Medium
          </Button>
          <Button variant="filled-tonal" size="small" onPress={() => Haptics.impactHeavy()}>
            Impact Heavy
          </Button>
        </View>
      </View>

      {/* PHASE 3B COMPONENTS */}

      {/* Section 7: ButtonGroup (Segmented Control) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. ButtonGroup (Segmented Control)</Text>
        <Text style={styles.sectionDesc}>
          Single-select and multi-select button groups with spring animations
        </Text>

        <Text style={styles.subsectionLabel}>Single Select (View Mode)</Text>
        <ButtonGroup
          segments={[
            { id: 'day', label: 'Day', icon: <Text style={{ fontSize: 18 }}>📅</Text> },
            { id: 'week', label: 'Week', icon: <Text style={{ fontSize: 18 }}>📆</Text> },
            { id: 'month', label: 'Month', icon: <Text style={{ fontSize: 18 }}>🗓️</Text> },
          ]}
          selectedId={selectedViewMode}
          onSelectionChange={(id) => {
            setSelectedViewMode(id);
            console.log('View mode:', id);
          }}
          variant="outlined"
          fullWidth
        />

        <Text style={[styles.subsectionLabel, { marginTop: 16 }]}>Multi Select (Filters)</Text>
        <ButtonGroup
          segments={[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'completed', label: 'Done' },
            { id: 'archived', label: 'Archived' },
          ]}
          selectedIds={selectedFilters}
          multiSelect
          onMultiSelectionChange={(ids) => {
            setSelectedFilters(ids);
            console.log('Filters:', ids);
          }}
          variant="filled"
        />
      </View>

      {/* Section 8: SplitButton */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. SplitButton</Text>
        <Text style={styles.sectionDesc}>
          Primary action + dropdown menu for secondary actions
        </Text>

        <View style={styles.splitButtonGrid}>
          <SplitButton
            label="Save"
            onPress={() => console.log('Save pressed')}
            menuItems={[
              { id: '1', label: 'Save as Draft', icon: <Text style={{ fontSize: 18 }}>📄</Text> },
              { id: '2', label: 'Save and Exit', icon: <Text style={{ fontSize: 18 }}>🚪</Text> },
              { id: '3', label: 'Save as Template', icon: <Text style={{ fontSize: 18 }}>📋</Text> },
            ]}
            onMenuItemPress={(id) => console.log('Menu item:', id)}
            variant="filled"
            size="medium"
          />

          <SplitButton
            label="Export"
            onPress={() => console.log('Export pressed')}
            menuItems={[
              { id: '1', label: 'Export as PDF', icon: <Text style={{ fontSize: 18 }}>📕</Text> },
              { id: '2', label: 'Export as CSV', icon: <Text style={{ fontSize: 18 }}>📊</Text> },
              { id: '3', label: 'Export as JSON', icon: <Text style={{ fontSize: 18 }}>📄</Text> },
            ]}
            onMenuItemPress={(id) => console.log('Export:', id)}
            variant="filled-tonal"
            size="medium"
          />

          <SplitButton
            label="Share"
            onPress={() => console.log('Share pressed')}
            menuItems={[
              { id: '1', label: 'Copy Link', icon: <Text style={{ fontSize: 18 }}>🔗</Text> },
              { id: '2', label: 'Share via Email', icon: <Text style={{ fontSize: 18 }}>📧</Text> },
              { id: '3', label: 'Share on Social', icon: <Text style={{ fontSize: 18 }}>📱</Text> },
            ]}
            onMenuItemPress={(id) => console.log('Share:', id)}
            variant="outlined"
            size="medium"
          />
        </View>
      </View>

      {/* Section 9: Toolbar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>9. Toolbar</Text>
        <Text style={styles.sectionDesc}>
          Horizontal action bar with icons (compact) or icons + labels (extended)
        </Text>

        <Text style={styles.subsectionLabel}>Compact Mode (Icons Only)</Text>
        <Toolbar
          actions={[
            { id: '1', label: 'Copy', icon: <Text style={{ fontSize: 20 }}>📋</Text>, onPress: () => console.log('Copy') },
            { id: '2', label: 'Paste', icon: <Text style={{ fontSize: 20 }}>📄</Text>, onPress: () => console.log('Paste') },
            { id: '3', label: 'Cut', icon: <Text style={{ fontSize: 20 }}>✂️</Text>, onPress: () => console.log('Cut') },
            { id: '4', label: 'Undo', icon: <Text style={{ fontSize: 20 }}>↩️</Text>, onPress: () => console.log('Undo') },
            { id: '5', label: 'Redo', icon: <Text style={{ fontSize: 20 }}>↪️</Text>, onPress: () => console.log('Redo') },
            { id: '6', label: 'Notifications', icon: <Text style={{ fontSize: 20 }}>🔔</Text>, onPress: () => console.log('Notifications'), badge: true, badgeCount: 3 },
          ]}
          variant="compact"
          elevated
        />

        <Text style={[styles.subsectionLabel, { marginTop: 16 }]}>Extended Mode (Icons + Labels)</Text>
        <Toolbar
          actions={[
            { id: '1', label: 'Inbox', icon: <Text style={{ fontSize: 20 }}>📥</Text>, onPress: () => console.log('Inbox'), badge: true, badgeCount: 12 },
            { id: '2', label: 'Drafts', icon: <Text style={{ fontSize: 20 }}>✏️</Text>, onPress: () => console.log('Drafts') },
            { id: '3', label: 'Sent', icon: <Text style={{ fontSize: 20 }}>📤</Text>, onPress: () => console.log('Sent') },
            { id: '4', label: 'Archive', icon: <Text style={{ fontSize: 20 }}>📦</Text>, onPress: () => console.log('Archive') },
          ]}
          variant="extended"
          elevated
        />
      </View>

      {/* Section 10: FABMenu Info (shown via floating button below) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>10. FABMenu (Floating Action Button)</Text>
        <Text style={styles.sectionDesc}>
          Expandable FAB with action menu (see bottom-right corner)
        </Text>
        <Text style={styles.fabInfo}>
          👉 Tap the + button in the bottom-right corner to see the expandable FAB menu with staggered animations!
        </Text>
      </View>

      {/* PHASE 3C COMPONENTS */}

      {/* Section 11: ProgressStepper */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>11. ProgressStepper</Text>
        <Text style={styles.sectionDesc}>
          Multi-step progress indicator with completed, active, and upcoming states
        </Text>

        <Text style={styles.subsectionLabel}>Horizontal Stepper (scroll if needed)</Text>
        <ProgressStepper
          steps={[
            { id: '1', label: 'Account' },
            { id: '2', label: 'Profile' },
            { id: '3', label: 'Settings' },
            { id: '4', label: 'Done' },
          ]}
          currentStep={currentStep}
          onStepPress={(index) => setCurrentStep(index)}
          allowStepNavigation
          orientation="horizontal"
        />

        <View style={styles.stepperControls}>
          {currentStep >= 4 ? (
            <>
              <View style={{ flex: 1 }} />
              <Text style={styles.stepperStatus}>✅ Complete!</Text>
              <Button
                variant="filled"
                size="small"
                onPress={() => setCurrentStep(0)}
              >
                Reset
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="filled-tonal"
                size="small"
                onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Text style={styles.stepperStatus}>
                Step {currentStep + 1} of 4
              </Text>
              <Button
                variant="filled"
                size="small"
                onPress={() => {
                  if (currentStep === 3) {
                    // Complete the last step (go to step 4 which doesn't exist, marking step 3 as completed)
                    setCurrentStep(4);
                  } else {
                    setCurrentStep(Math.min(3, currentStep + 1));
                  }
                }}
              >
                {currentStep === 3 ? 'Finish' : 'Next'}
              </Button>
            </>
          )}
        </View>
      </View>

      {/* Section 12: SnackbarAction */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>12. SnackbarAction (Toasts)</Text>
        <Text style={styles.sectionDesc}>
          Toast notifications with optional action buttons
        </Text>

        <View style={styles.snackbarGrid}>
          <Button
            variant="filled"
            size="medium"
            onPress={() => {
              setSnackbarMessage('✅ Item saved successfully!');
              setSnackbarVariant('success');
              setShowSnackbar(true);
            }}
          >
            Success Toast
          </Button>

          <Button
            variant="filled"
            size="medium"
            onPress={() => {
              setSnackbarMessage('❌ Failed to load data');
              setSnackbarVariant('error');
              setShowSnackbar(true);
            }}
          >
            Error Toast
          </Button>

          <Button
            variant="filled-tonal"
            size="medium"
            onPress={() => {
              setSnackbarMessage('⚠️ Please review your input');
              setSnackbarVariant('warning');
              setShowSnackbar(true);
            }}
          >
            Warning Toast
          </Button>

          <Button
            variant="outlined"
            size="medium"
            onPress={() => {
              setSnackbarMessage('ℹ️ New update available');
              setSnackbarVariant('info');
              setShowSnackbar(true);
            }}
          >
            Info Toast
          </Button>
        </View>
      </View>

      {/* Section 13: ChipGroup */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>13. ChipGroup (Filter Chips)</Text>
        <Text style={styles.sectionDesc}>
          Chip collections with selection, icons, and close buttons
        </Text>

        <Text style={styles.subsectionLabel}>Filter Chips (Multi-Select)</Text>
        <ChipGroup
          chips={[
            { id: 'math', label: 'Math', icon: <Text style={{ fontSize: 14 }}>📐</Text> },
            { id: 'science', label: 'Science', icon: <Text style={{ fontSize: 14 }}>🔬</Text> },
            { id: 'english', label: 'English', icon: <Text style={{ fontSize: 14 }}>📚</Text> },
            { id: 'history', label: 'History', icon: <Text style={{ fontSize: 14 }}>🏛️</Text> },
            { id: 'art', label: 'Art', icon: <Text style={{ fontSize: 14 }}>🎨</Text> },
          ]}
          type="filter"
          selectedIds={selectedChips}
          onSelectionChange={(ids) => {
            setSelectedChips(ids);
            console.log('Selected:', ids);
          }}
          multiSelect
        />

        <Text style={[styles.subsectionLabel, { marginTop: 16 }]}>Input Chips (Removable)</Text>
        <ChipGroup
          chips={selectedInputChips.map((subject) => ({
            id: subject,
            label: subject.charAt(0).toUpperCase() + subject.slice(1),
          }))}
          type="input"
          onChipClose={(id) => {
            setSelectedInputChips(selectedInputChips.filter((s) => s !== id));
            console.log('Removed:', id);
          }}
        />

        <Text style={[styles.subsectionLabel, { marginTop: 16 }]}>Assist Chips</Text>
        <ChipGroup
          chips={[
            { id: '1', label: 'Set Reminder', icon: <Text style={{ fontSize: 14 }}>⏰</Text> },
            { id: '2', label: 'Share', icon: <Text style={{ fontSize: 14 }}>📤</Text> },
            { id: '3', label: 'Download', icon: <Text style={{ fontSize: 14 }}>⬇️</Text> },
          ]}
          type="assist"
          onSelectionChange={(ids) => console.log('Assist chip:', ids)}
        />
      </View>

      {/* Section 14: DateTimePicker */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>14. DateTimePicker</Text>
        <Text style={styles.sectionDesc}>
          Date and time selection with quick presets
        </Text>

        <DateTimePicker
          mode="date"
          value={selectedDate}
          onValueChange={(date) => {
            setSelectedDate(date);
            console.log('Selected date:', date);
          }}
          label="Select Assignment Due Date"
        />

        <Text style={styles.datePickerNote}>
          Selected: {selectedDate?.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* PHASE 0 COMPONENTS */}

      {/* Section 15: Card Component */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>15. Card Component</Text>
        <Text style={styles.sectionDesc}>
          MD3 cards with 3 variants: elevated, filled, outlined
        </Text>

        <View style={styles.cardGrid}>
          <Card variant="elevated" style={styles.cardExample}>
            <Text style={styles.cardTitle}>Elevated Card</Text>
            <Text style={styles.cardBody}>
              This card has elevation shadow
            </Text>
          </Card>

          <Card variant="filled" style={styles.cardExample}>
            <Text style={styles.cardTitle}>Filled Card</Text>
            <Text style={styles.cardBody}>
              This card has filled background
            </Text>
          </Card>

          <Card variant="outlined" style={styles.cardExample}>
            <Text style={styles.cardTitle}>Outlined Card</Text>
            <Text style={styles.cardBody}>
              This card has outline border
            </Text>
          </Card>
        </View>
      </View>

      {/* Section 16: Badge Component */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>16. Badge Component</Text>
        <Text style={styles.sectionDesc}>
          Notification badges with numbers and dot indicators
        </Text>

        <View style={styles.badgeGrid}>
          <View style={styles.badgeExample}>
            <View style={styles.badgeIcon}>
              <Text style={{ fontSize: 32 }}>🔔</Text>
              <Badge count={5} variant="standard" />
            </View>
            <Text style={styles.badgeLabel}>Count: 5</Text>
          </View>

          <View style={styles.badgeExample}>
            <View style={styles.badgeIcon}>
              <Text style={{ fontSize: 32 }}>📧</Text>
              <Badge count={99} variant="standard" />
            </View>
            <Text style={styles.badgeLabel}>Count: 99</Text>
          </View>

          <View style={styles.badgeExample}>
            <View style={styles.badgeIcon}>
              <Text style={{ fontSize: 32 }}>💬</Text>
              <Badge count={150} variant="standard" />
            </View>
            <Text style={styles.badgeLabel}>Count: 99+</Text>
          </View>

          <View style={styles.badgeExample}>
            <View style={styles.badgeIcon}>
              <Text style={{ fontSize: 32 }}>⭐</Text>
              <Badge dot variant="small" />
            </View>
            <Text style={styles.badgeLabel}>Dot indicator</Text>
          </View>
        </View>
      </View>

      {/* Section 17: Tabs Component */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>17. Tabs Component</Text>
        <Text style={styles.sectionDesc}>
          Primary and secondary tabs with badge support
        </Text>

        <Tabs
          tabs={[
            { key: '0', label: 'All', badge: 12 },
            { key: '1', label: 'Active', badge: 5 },
            { key: '2', label: 'Completed' },
            { key: '3', label: 'Archived' },
          ]}
          activeTab={activeTab.toString()}
          onTabChange={(key) => {
            setActiveTab(parseInt(key));
            console.log('Tab changed:', key);
          }}
          variant="primary"
        />

        <Text style={[styles.tabContent, { marginTop: 16 }]}>
          Tab {activeTab + 1} Content
        </Text>
      </View>

      {/* Section 18: SearchBar Component */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>18. SearchBar Component</Text>
        <Text style={styles.sectionDesc}>
          Search input with debounce and clear button
        </Text>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={(query) => console.log('Search:', query)}
          placeholder="Search assignments..."
        />

        {searchQuery ? (
          <Text style={styles.searchResult}>
            Searching for: "{searchQuery}"
          </Text>
        ) : null}
      </View>

      {/* Section 19: Modal & BottomSheet */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>19. Modal & BottomSheet</Text>
        <Text style={styles.sectionDesc}>
          Dialog modal and bottom sheet with animations
        </Text>

        <View style={styles.modalGrid}>
          <Button
            variant="filled"
            size="medium"
            onPress={() => setShowModal(true)}
          >
            Show Modal
          </Button>

          <Button
            variant="filled-tonal"
            size="medium"
            onPress={() => setShowBottomSheet(true)}
          >
            Show Bottom Sheet
          </Button>
        </View>

        <Modal
          visible={showModal}
          onClose={() => setShowModal(false)}
          title="Dialog Modal"
        >
          <Text style={styles.modalContentText}>
            This is a centered dialog modal with backdrop.
          </Text>
          <Button
            variant="filled"
            size="medium"
            onPress={() => setShowModal(false)}
            fullWidth
          >
            Close Modal
          </Button>
        </Modal>

        <BottomSheet
          visible={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          title="Bottom Sheet"
        >
          <Text style={styles.modalContentText}>
            This is a bottom sheet that slides up from the bottom.
          </Text>
          <Button
            variant="filled"
            size="medium"
            onPress={() => setShowBottomSheet(false)}
            fullWidth
          >
            Close Sheet
          </Button>
        </BottomSheet>
      </View>

      {/* Section 20: EmptyState Component */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>20. EmptyState Component</Text>
        <Text style={styles.sectionDesc}>
          Empty states for no data, no results, and errors
        </Text>

        <EmptyState
          variant="no-data"
          title="No Assignments"
          description="You don't have any assignments yet"
          actionLabel="Create Assignment"
          onActionPress={() => console.log('Create assignment')}
        />
      </View>

      {/* Section 21: FilterPanel */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>21. FilterPanel</Text>
        <Text style={styles.sectionDesc}>
          Slide-in filter panel with multiple filter options
        </Text>

        <Button
          variant="filled-tonal"
          size="medium"
          onPress={() => setShowFilterPanel(true)}
        >
          Show Filters
        </Button>

        <FilterPanel
          visible={showFilterPanel}
          onClose={() => setShowFilterPanel(false)}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setShowFilterPanel(false);
            console.log('Applied filters:', newFilters);
          }}
          filters={[
            {
              category: 'Status',
              type: 'multi-select',
              options: ['Active', 'Completed', 'Pending'],
              selected: filters.Status || [],
            },
            {
              category: 'Priority',
              type: 'single-select',
              options: ['High', 'Medium', 'Low'],
              selected: filters.Priority || [],
            },
          ]}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>✅ Phase 0 + 3A + 3B + 3C: All Components</Text>
        <Text style={styles.footerSubtext}>
          20+ components with MD3 styling, animations, and haptic feedback
        </Text>
      </View>
    </ScrollView>

      {/* SnackbarAction (overlays at bottom) */}
      <SnackbarAction
        visible={showSnackbar}
        message={snackbarMessage}
        variant={snackbarVariant}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
      />

      {/* Bottom Navigation */}
      <StudentBottomNav
        activeRoute={activeRoute}
        navigationItems={navigationItems}
      />

      {/* FABMenu (Floating Action Button) */}
      <FABMenu
        icon={<Text style={{ fontSize: 24, color: LightTheme.OnPrimaryContainer }}>+</Text>}
        actions={[
          {
            id: '1',
            label: 'Create Post',
            icon: <Text style={{ fontSize: 20 }}>📝</Text>,
            onPress: () => console.log('Create Post'),
          },
          {
            id: '2',
            label: 'Upload Photo',
            icon: <Text style={{ fontSize: 20 }}>📷</Text>,
            onPress: () => console.log('Upload Photo'),
          },
          {
            id: '3',
            label: 'Record Video',
            icon: <Text style={{ fontSize: 20 }}>🎥</Text>,
            onPress: () => console.log('Record Video'),
          },
          {
            id: '4',
            label: 'Create Event',
            icon: <Text style={{ fontSize: 20 }}>📅</Text>,
            onPress: () => console.log('Create Event'),
          },
        ]}
        position="bottom-right"
        variant="primary"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: LightTheme.Background,
  },
  container: {
    flex: 1,
    backgroundColor: LightTheme.Background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Extra padding for bottom nav
  },
  header: {
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: LightTheme.PrimaryContainer,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  title: {
    ...Typography.headlineMedium,
    color: LightTheme.OnPrimaryContainer,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: LightTheme.OnPrimaryContainer,
    opacity: 0.8,
  },
  section: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: LightTheme.Surface,
    borderRadius: 12,
    elevation: 1,
    shadowColor: LightTheme.Shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    ...Typography.titleLarge,
    color: LightTheme.OnSurface,
    marginBottom: 4,
  },
  sectionDesc: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: 16,
  },
  componentGrid: {
    gap: 12,
  },
  iconButtonGrid: {
    gap: 20,
  },
  iconButtonGroup: {
    gap: 8,
  },
  iconButtonLabel: {
    ...Typography.labelMedium,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: 4,
  },
  iconButtonRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  loadingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  loadingItem: {
    alignItems: 'center',
    gap: 12,
  },
  loadingLabel: {
    ...Typography.labelMedium,
    color: LightTheme.OnSurfaceVariant,
  },
  linearProgressContainer: {
    gap: 8,
  },
  skeletonContainer: {
    gap: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: LightTheme.Outline,
  },
  skeletonLabel: {
    ...Typography.labelMedium,
    color: LightTheme.OnSurfaceVariant,
    marginTop: 8,
    marginBottom: 4,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  shimmerContainer: {
    gap: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: LightTheme.Outline,
  },
  shimmerLabel: {
    ...Typography.labelMedium,
    color: LightTheme.OnSurfaceVariant,
    marginTop: 8,
    marginBottom: 4,
  },
  shimmerOverlayDemo: {
    height: 100,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  shimmerContent: {
    alignItems: 'center',
    gap: 4,
  },
  shimmerContentText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
  },
  hapticGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: LightTheme.TertiaryContainer,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.titleMedium,
    color: LightTheme.OnTertiaryContainer,
    marginBottom: 4,
  },
  footerSubtext: {
    ...Typography.bodySmall,
    color: LightTheme.OnTertiaryContainer,
    textAlign: 'center',
    opacity: 0.8,
  },
  // Phase 3B styles
  subsectionLabel: {
    ...Typography.labelLarge,
    color: LightTheme.OnSurface,
    marginBottom: 8,
    marginTop: 4,
  },
  splitButtonGrid: {
    gap: 12,
  },
  fabInfo: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  // Phase 3C styles
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  stepperStatus: {
    ...Typography.labelLarge,
    color: LightTheme.OnSurfaceVariant,
  },
  snackbarGrid: {
    gap: 12,
  },
  datePickerNote: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  // Phase 0 styles
  cardGrid: {
    gap: 12,
  },
  cardExample: {
    padding: 16,
  },
  cardTitle: {
    ...Typography.titleMedium,
    color: LightTheme.OnSurface,
    marginBottom: 4,
  },
  cardBody: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'space-around',
  },
  badgeExample: {
    alignItems: 'center',
    gap: 8,
  },
  badgeIcon: {
    position: 'relative',
  },
  badgeLabel: {
    ...Typography.labelSmall,
    color: LightTheme.OnSurfaceVariant,
  },
  tabContent: {
    ...Typography.bodyLarge,
    color: LightTheme.OnSurface,
    padding: 16,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 8,
    textAlign: 'center',
  },
  searchResult: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    marginTop: 12,
    fontStyle: 'italic',
  },
  modalGrid: {
    gap: 12,
  },
  modalContentText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    marginBottom: 16,
  },
});

export default M3ExpressiveTestScreen;
