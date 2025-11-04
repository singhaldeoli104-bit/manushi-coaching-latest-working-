/**
 * AssignmentDetailScreen
 * View single assignment with submission status and feedback
 * Phase 3 - Academic Tab
 */

import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, T, Button, Spacer } from '../../ui';
import { trackAction } from '../../utils/navigationAnalytics';
import type { ParentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ParentStackParamList, 'AssignmentDetail'>;

const AssignmentDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  // Track screen view
  React.useEffect(() => {
    trackAction('view_assignment_detail_screen', 'AssignmentDetail');
  }, []);

  // Get params with validation
  const { assignmentId } = route.params;

  return (
    <BaseScreen
      scrollable
      loading={false}
      error={null}
      empty={false}
    >
      <Col sx={{ p: 'xl' }}>
        <T variant="headline" weight="bold">Assignment Details</T>
        <Spacer size="md" />
        <T variant="body" color="textSecondary">
          This screen will be implemented in Phase 3.
        </T>
        <Spacer size="sm" />
        <T variant="caption" color="textSecondary">
          Assignment ID: {assignmentId}
        </T>
        <Spacer size="md" />
        <T variant="body">
          Features: Assignment details, due date, submission status, score (if graded), teacher feedback, attachments
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

export default AssignmentDetailScreen;
