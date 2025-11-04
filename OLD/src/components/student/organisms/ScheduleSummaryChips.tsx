/**
 * ScheduleSummaryChips Organism
 *
 * Displays summary statistics in MD3 chips:
 * - Classes Today
 * - Study Hours
 * - Due Soon (highlighted if > 0)
 * - Attendance Rate
 */

import React from 'react';
import { Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../ui/layout/Row';
import { LightTheme } from '../../../theme/colors';
import { BorderRadius } from '../../../theme/spacing';
import type { ScheduleSummary } from '../../../hooks/useScheduleDetail';

interface ScheduleSummaryChipsProps {
  summary: ScheduleSummary;
}

export const ScheduleSummaryChips: React.FC<ScheduleSummaryChipsProps> = ({ summary }) => {
  const { t } = useTranslation();

  return (
    <Row gap={8} wrap sx={{ px: 16, py: 16 }}>
      <Chip
        icon="school"
        style={{
          backgroundColor: LightTheme.Surface,
          borderRadius: BorderRadius.MD,
        }}
        textStyle={{ fontSize: 12, fontWeight: '600' }}
      >
        {summary.classesToday} {t('schedule.summary.classesToday')}
      </Chip>

      <Chip
        icon="clock-outline"
        style={{
          backgroundColor: LightTheme.Surface,
          borderRadius: BorderRadius.MD,
        }}
        textStyle={{ fontSize: 12, fontWeight: '600' }}
      >
        {Math.floor(summary.studyMinutes / 60)}h {summary.studyMinutes % 60}m
      </Chip>

      <Chip
        icon="alert-circle-outline"
        style={{
          backgroundColor: summary.dueSoonCount > 0 ? '#FEF3C7' : LightTheme.Surface,
          borderRadius: BorderRadius.MD,
        }}
        textStyle={{ fontSize: 12, fontWeight: '600' }}
      >
        {summary.dueSoonCount} {t('schedule.summary.dueSoon')}
      </Chip>

      <Chip
        icon="check-circle-outline"
        style={{
          backgroundColor: LightTheme.Surface,
          borderRadius: BorderRadius.MD,
        }}
        textStyle={{ fontSize: 12, fontWeight: '600' }}
      >
        {summary.attendanceRate}
      </Chip>
    </Row>
  );
};
