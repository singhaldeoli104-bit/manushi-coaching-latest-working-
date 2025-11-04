/**
 * ReminderList Organism
 *
 * Shows upcoming deadlines & reminders
 * • Assignment title  — due date   [Action Button]
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../ui/layout/Row';
import { Col } from '../../../ui/layout/Col';
import { LightTheme } from '../../../theme/colors';
import { Spacing, BorderRadius } from '../../../theme/spacing';
import type { ScheduleReminder } from '../../../hooks/useScheduleDetail';

interface ReminderListProps {
  reminders: ScheduleReminder[];
  onReminderAction?: (reminder: ScheduleReminder) => void;
}

export const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onReminderAction,
}) => {
  const { t } = useTranslation();

  if (reminders.length === 0) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{t('schedule.reminders.title')}</Text>

        {reminders.map((reminder, index) => {
          const daysUntilDue = Math.ceil((reminder.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          let dueText = '';

          if (daysUntilDue === 0) {
            dueText = t('schedule.reminders.dueToday');
          } else if (daysUntilDue === 1) {
            dueText = t('schedule.reminders.dueTomorrow');
          } else {
            dueText = `${t('schedule.reminders.dueAt')} ${reminder.dueDate.toLocaleDateString()}`;
          }

          return (
            <View key={reminder.id}>
              <Row spaceBetween centerV sx={{ py: 8 }}>
                <Col flex={1}>
                  <Text style={styles.reminderTitle}>• {reminder.title}</Text>
                  <Text style={styles.reminderDue}>— {dueText}</Text>
                </Col>

                {onReminderAction && (
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => onReminderAction(reminder)}
                    style={styles.button}
                  >
                    {reminder.actionLabel}
                  </Button>
                )}
              </Row>

              {index < reminders.length - 1 && <Divider style={styles.divider} />}
            </View>
          );
        })}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: LightTheme.Surface,
    borderRadius: BorderRadius.MD,
    marginHorizontal: Spacing.MD,
    marginTop: Spacing.MD,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: LightTheme.OnSurface,
    marginBottom: Spacing.MD,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: LightTheme.OnSurface,
  },
  reminderDue: {
    fontSize: 12,
    color: LightTheme.OnSurfaceVariant,
    marginTop: 2,
  },
  button: {
    marginLeft: Spacing.MD,
  },
  divider: {
    marginVertical: Spacing.SM,
  },
});
