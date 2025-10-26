/**
 * AnnouncementsScreen
 * All school announcements with filter and search
 * Phase 5 - Info Tab
 */

import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, T, Button, Spacer } from '../../ui';
import { trackAction } from '../../utils/navigationAnalytics';
import type { ParentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ParentStackParamList, 'Announcements'>;

const AnnouncementsScreen: React.FC<Props> = ({ navigation }) => {
  // Track screen view
  React.useEffect(() => {
    trackAction('view_announcements_screen', 'Announcements');
  }, []);

  return (
    <BaseScreen
      scrollable
      loading={false}
      error={null}
      empty={false}
    >
      <Col sx={{ p: 'xl' }}>
        <T variant="headline" weight="bold">School Announcements</T>
        <Spacer size="md" />
        <T variant="body" color="textSecondary">
          This screen will be implemented in Phase 5.
        </T>
        <Spacer size="md" />
        <T variant="body">
          Features: All announcements, filter by category, important announcements, search
        </T>
        <Spacer size="lg" />
        <Button
          variant="primary"
          onPress={() => navigation.goBack()}
        >
          Go Back
        </Button>
      </Col>
    </BaseScreen>
  );
};

export default AnnouncementsScreen;
