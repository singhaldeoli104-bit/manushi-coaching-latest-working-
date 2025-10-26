/**
 * ActionItemsScreen
 * View all action items with filter by type/priority
 * Phase 1 - Overview Tab
 */

import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, T, Button, Spacer } from '../../ui';
import { trackAction } from '../../utils/navigationAnalytics';
import type { ParentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ParentStackParamList, 'ActionItems'>;

const ActionItemsScreen: React.FC<Props> = ({ navigation }) => {
  // Track screen view
  React.useEffect(() => {
    trackAction('view_action_items_screen', 'ActionItems');
  }, []);

  return (
    <BaseScreen
      scrollable
      loading={false}
      error={null}
      empty={false}
    >
      <Col sx={{ p: 'xl' }}>
        <T variant="headline" weight="bold">Action Items</T>
        <Spacer size="md" />
        <T variant="body" color="textSecondary">
          This screen will be implemented in Phase 1.
        </T>
        <Spacer size="md" />
        <T variant="body">
          Features: Pending action items, completed items, filter by type/priority, mark complete
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

export default ActionItemsScreen;
