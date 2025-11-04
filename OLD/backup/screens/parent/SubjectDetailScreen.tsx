/**
 * SubjectDetailScreen
 * Detailed subject performance with grade trends
 * Phase 3 - Academic Tab
 */

import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, T, Button, Spacer } from '../../ui';
import { trackAction } from '../../utils/navigationAnalytics';
import type { ParentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ParentStackParamList, 'SubjectDetail'>;

const SubjectDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  // Track screen view
  React.useEffect(() => {
    trackAction('view_subject_detail_screen', 'SubjectDetail');
  }, []);

  // Get params with validation
  const { studentId, subject } = route.params;

  return (
    <BaseScreen
      scrollable
      loading={false}
      error={null}
      empty={false}
    >
      <Col sx={{ p: 'xl' }}>
        <T variant="headline" weight="bold">Subject Details</T>
        <Spacer size="md" />
        <T variant="body" color="textSecondary">
          This screen will be implemented in Phase 3.
        </T>
        <Spacer size="sm" />
        <T variant="caption" color="textSecondary">
          Student ID: {studentId}
        </T>
        <Spacer size="sm" />
        <T variant="caption" color="textSecondary">
          Subject: {subject}
        </T>
        <Spacer size="md" />
        <T variant="body">
          Features: Grade trends (chart), all assessments, upcoming exams, study materials, teacher notes
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

export default SubjectDetailScreen;
