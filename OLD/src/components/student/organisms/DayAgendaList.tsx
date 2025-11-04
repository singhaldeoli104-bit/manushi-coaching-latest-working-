/**
 * DayAgendaList Organism
 *
 * Timeline list for selected day
 * Shows time, subject, teacher, duration, status, action buttons
 *
 * Example entry:
 * 08:30  Algebra II               [Join]
 *        Live · Room 204          ⏱ 60m
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Button, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Col } from '../../../ui/layout/Col';
import { Row } from '../../../ui/layout/Row';
import { LightTheme } from '../../../theme/colors';
import { Spacing, BorderRadius } from '../../../theme/spacing';
import type { ScheduleEvent } from '../../../hooks/useScheduleDetail';

interface DayAgendaListProps {
  /** Events for the selected day */
  events: ScheduleEvent[];

  /** Event press handler */
  onEventPress: (event: ScheduleEvent) => void;

  /** Join button press handler (for live classes) */
  onJoinPress?: (event: ScheduleEvent) => void;
}

export const DayAgendaList: React.FC<DayAgendaListProps> = ({
  events,
  onEventPress,
  onJoinPress,
}) => {
  const { t } = useTranslation();

  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyText}>{t('schedule.empty.noClassesDay')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
      {events.map((event) => {
        const timeStr = event.start.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const duration = Math.round((event.end.getTime() - event.start.getTime()) / 60000);

        return (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => onEventPress(event)}
            accessibilityLabel={`${timeStr} ${event.title} with ${event.teacher || 'teacher'}`}
            accessibilityRole="button"
          >
            <Row gap={12}>
              {/* Time column */}
              <Col style={styles.timeColumn}>
                <Text style={styles.timeText}>{timeStr}</Text>
                <View style={[styles.statusDot, { backgroundColor: event.color }]} />
              </Col>

              {/* Content column */}
              <Col flex={1}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                {event.teacher && (
                  <Text style={styles.eventMeta}>{event.teacher}</Text>
                )}
                {event.location && (
                  <Text style={styles.eventLocation}>{event.location}</Text>
                )}

                <Row gap={8} centerV sx={{ mt: 4 }}>
                  <Text style={styles.duration}>⏱ {duration}m</Text>

                  {event.status === 'live' && (
                    <Chip
                      mode="flat"
                      style={styles.liveChip}
                      textStyle={styles.liveChipText}
                    >
                      {t('schedule.status.live')}
                    </Chip>
                  )}
                </Row>
              </Col>

              {/* Action column */}
              <Col style={styles.actionColumn}>
                {event.status === 'live' && onJoinPress ? (
                  <Button
                    mode="contained"
                    compact
                    onPress={() => onJoinPress(event)}
                    style={styles.joinButton}
                    labelStyle={styles.joinButtonText}
                  >
                    {t('schedule.agenda.join')}
                  </Button>
                ) : (
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => onEventPress(event)}
                    style={styles.detailsButton}
                    labelStyle={styles.detailsButtonText}
                  >
                    {t('schedule.agenda.details')}
                  </Button>
                )}
              </Col>
            </Row>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  eventCard: {
    paddingVertical: Spacing.MD,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.Outline,
  },
  timeColumn: {
    width: 60,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: LightTheme.OnSurface,
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: LightTheme.OnSurface,
    marginBottom: 2,
  },
  eventMeta: {
    fontSize: 14,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 12,
    color: LightTheme.OnSurfaceVariant,
  },
  duration: {
    fontSize: 12,
    color: LightTheme.OnSurfaceVariant,
  },
  liveChip: {
    backgroundColor: '#FEE2E2',
    height: 24,
  },
  liveChipText: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '700',
  },
  actionColumn: {
    justifyContent: 'center',
  },
  joinButton: {
    backgroundColor: LightTheme.Primary,
  },
  joinButtonText: {
    fontSize: 12,
    color: LightTheme.OnPrimary,
  },
  detailsButton: {
    borderColor: LightTheme.Primary,
  },
  detailsButtonText: {
    fontSize: 12,
    color: LightTheme.Primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.XL * 3,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.MD,
  },
  emptyText: {
    fontSize: 14,
    color: LightTheme.OnSurfaceVariant,
  },
});
