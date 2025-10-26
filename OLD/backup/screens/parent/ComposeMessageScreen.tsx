/**
 * ComposeMessageScreen
 * Send message to teacher/admin with file attachments
 * Phase 4 - Communication Tab
 */

import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Col, T, Button, Spacer } from '../../ui';
import { trackAction } from '../../utils/navigationAnalytics';
import type { ParentStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ParentStackParamList, 'ComposeMessage'>;

const ComposeMessageScreen: React.FC<Props> = ({ route, navigation }) => {
  // Track screen view
  React.useEffect(() => {
    trackAction('view_compose_message_screen', 'ComposeMessage');
  }, []);

  // Get params with validation
  const { recipientId, subject } = route.params || {};

  return (
    <BaseScreen
      scrollable
      loading={false}
      error={null}
      empty={false}
    >
      <Col sx={{ p: 'xl' }}>
        <T variant="headline" weight="bold">Compose Message</T>
        <Spacer size="md" />
        <T variant="body" color="textSecondary">
          This screen will be implemented in Phase 4.
        </T>
        {recipientId && (
          <>
            <Spacer size="sm" />
            <T variant="caption" color="textSecondary">
              Recipient ID: {recipientId}
            </T>
          </>
        )}
        {subject && (
          <>
            <Spacer size="sm" />
            <T variant="caption" color="textSecondary">
              Subject: {subject}
            </T>
          </>
        )}
        <Spacer size="md" />
        <T variant="body">
          Features: Recipient selection, subject & message, attach files, send button
        </T>
        <Spacer size="sm" />
        <T variant="caption" color="warning">
          Note: This screen uses useBlockBack to prevent accidental exit while composing
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

export default ComposeMessageScreen;
