/**
 * QuickActionRow Organism
 *
 * Three-up button row for quick actions:
 * - Add Study Block
 * - Request Leave
 * - Export Schedule
 */

import React from 'react';
import { Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../ui/layout/Row';
import { LightTheme } from '../../../theme/colors';

interface QuickActionRowProps {
  onAddStudyBlock?: () => void;
  onRequestLeave?: () => void;
  onExportSchedule?: () => void;
}

export const QuickActionRow: React.FC<QuickActionRowProps> = ({
  onAddStudyBlock,
  onRequestLeave,
  onExportSchedule,
}) => {
  const { t } = useTranslation();

  return (
    <Row gap={8} sx={{ px: 16, pt: 16, pb: 8 }}>
      <Button
        mode="outlined"
        onPress={onAddStudyBlock}
        style={{ flex: 1, borderColor: LightTheme.Primary }}
        labelStyle={{ fontSize: 14, fontWeight: '600' }}
        contentStyle={{ height: 48 }}
      >
        Study
      </Button>

      <Button
        mode="outlined"
        onPress={onRequestLeave}
        style={{ flex: 1, borderColor: LightTheme.Primary }}
        labelStyle={{ fontSize: 14, fontWeight: '600' }}
        contentStyle={{ height: 48 }}
      >
        Leave
      </Button>

      <Button
        mode="outlined"
        onPress={onExportSchedule}
        style={{ flex: 1, borderColor: LightTheme.Primary }}
        labelStyle={{ fontSize: 14, fontWeight: '600' }}
        contentStyle={{ height: 48 }}
      >
        Export
      </Button>
    </Row>
  );
};
