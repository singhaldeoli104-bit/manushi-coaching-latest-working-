/**
 * ChildDetailScreen
 * Full child profile with tabs (Overview | Academic | Attendance | Assignments | Behavior)
 * Phase 1 - Overview Tab
 */

import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, T, Button, Spacer } from '../../ui';
import { trackAction } from '../../utils/navigationAnalytics';
import type { ParentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ParentStackParamList, 'ChildDetail'>;

const ChildDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  // Track screen view
  React.useEffect(() => {
    trackAction('view_child_detail_screen', 'ChildDetail');
  }, []);

  // Get params with validation
  const { childId } = route.params;

  return (
    <BaseScreen
      scrollable
      loading={false}
      error={null}
      empty={false}
    >
      <Col sx={{ p: 'xl' }}>
        <T variant="headline" weight="bold">Child Details</T>
        <Spacer size="md" />
        <T variant="body" color="textSecondary">
          This screen will be implemented in Phase 1.
        </T>
        <Spacer size="sm" />
        <T variant="caption" color="textSecondary">
          Child ID: {childId}
        </T>
        <Spacer size="md" />
        <T variant="body">
          Full child profile with tabs: Overview | Academic | Attendance | Assignments | Behavior
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

export default ChildDetailScreen;
