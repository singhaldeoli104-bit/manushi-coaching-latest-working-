/**
 * ScheduleMeetingScreen
 * Schedule parent-teacher meeting
 * Phase 4 - Communication Tab
 */

import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, T, Button, Spacer } from '../../ui';
import { trackAction } from '../../utils/navigationAnalytics';
import type { ParentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ParentStackParamList, 'ScheduleMeeting'>;

const ScheduleMeetingScreen: React.FC<Props> = ({ route, navigation }) => {
  // Track screen view
  React.useEffect(() => {
    trackAction('view_schedule_meeting_screen', 'ScheduleMeeting');
  }, []);

  // Get params with validation
  const { teacherId } = route.params || {};

  return (
    <BaseScreen
      scrollable
      loading={false}
      error={null}
      empty={false}
    >
      <Col sx={{ p: 'xl' }}>
        <T variant="headline" weight="bold">Schedule Meeting</T>
        <Spacer size="md" />
        <T variant="body" color="textSecondary">
          This screen will be implemented in Phase 4.
        </T>
        {teacherId && (
          <>
            <Spacer size="sm" />
            <T variant="caption" color="textSecondary">
              Teacher ID: {teacherId}
            </T>
          </>
        )}
        <Spacer size="md" />
        <T variant="body">
          Features: Teacher selection, available slots, meeting type (in-person/virtual), purpose/agenda, confirmation
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

export default ScheduleMeetingScreen;
