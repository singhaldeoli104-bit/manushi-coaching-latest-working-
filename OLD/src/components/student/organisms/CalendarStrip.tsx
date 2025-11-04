/**
 * CalendarStrip Organism
 *
 * HORIZONTAL week strip with inline dots format:
 * Mon 23 •• | Tue 24 (Today) ••• | Wed 25 • | Thu 26 ••
 *
 * Ultra-compact MS Teams style implementation:
 * - Item width 56dp, height 48dp (minimum WCAG 2.1 AA touch target)
 * - Day name: Typography.caption (13sp)
 * - Day number: Typography.title (18sp)
 * - Blue dot = class, Red dot = deadline
 * - Pipe separator | between days
 */

import React from 'react';
import { FlatList, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LightTheme } from '../../../theme/colors';
import { Spacing } from '../../../theme/spacing';
import type { ScheduleEvent } from '../../../hooks/useScheduleDetail';

interface DayData {
  date: Date;
  dayShort: string;
  dayNumber: number;
  isToday: boolean;
  isSelected: boolean;
  eventCount: number;      // count of classes (blue dots)
  deadlineCount: number;   // count of deadlines (red dots)
}

interface CalendarStripProps {
  /** Current week range */
  weekStart: Date;

  /** Selected date */
  selectedDate: Date;

  /** All events to determine dots */
  events: ScheduleEvent[];

  /** Date selection handler */
  onSelectDate: (date: Date) => void;
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({
  weekStart,
  selectedDate,
  events,
  onSelectDate,
}) => {
  // Generate week data
  const weekData: DayData[] = [];
  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayStr = new Date().toISOString().split('T')[0];
  const selectedStr = selectedDate.toISOString().split('T')[0];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const dayEvents = events.filter(e => e.start.toISOString().split('T')[0] === dateStr);

    weekData.push({
      date,
      dayShort: dayNamesShort[date.getDay()] || 'Day',
      dayNumber: date.getDate(),
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedStr,
      eventCount: dayEvents.filter(e => !e.isDeadline).length,
      deadlineCount: dayEvents.filter(e => e.isDeadline).length,
    });
  }

  const renderDay = ({ item, index }: { item: DayData; index: number }) => {
    // Build inline dots string
    const blueDots = '•'.repeat(Math.min(item.eventCount, 3));      // Max 3 blue dots
    const redDots = '•'.repeat(Math.min(item.deadlineCount, 3));     // Max 3 red dots

    return (
      <View style={styles.dayContainer}>
        <TouchableOpacity
          style={styles.dayButton}
          onPress={() => onSelectDate(item.date)}
          accessibilityLabel={`${item.dayShort}, ${item.dayNumber}${item.isToday ? ', Today' : ''}`}
          accessibilityRole="button"
          accessibilityState={{ selected: item.isSelected }}
        >
          {/* Day name */}
          <Text style={[styles.dayShort, item.isSelected && styles.textSelected]}>
            {item.dayShort} {item.dayNumber}
            {item.isToday && <Text style={styles.todayLabel}> (Today)</Text>}
          </Text>

          {/* Inline dots row */}
          <View style={styles.dotsRow}>
            {blueDots && <Text style={styles.blueDots}>{blueDots}</Text>}
            {redDots && <Text style={styles.redDots}>{redDots}</Text>}
          </View>
        </TouchableOpacity>

        {/* Pipe separator (not after last item) */}
        {index < 6 && <Text style={styles.separator}>|</Text>}
      </View>
    );
  };

  return (
    <FlatList
      data={weekData}
      renderItem={renderDay}
      keyExtractor={(item) => item.date.toISOString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.SM, // Further reduced for MS Teams minimal style
    paddingVertical: 4, // Ultra-compact padding
    backgroundColor: LightTheme.SurfaceVariant,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayButton: {
    width: 56,        // Ultra-compact (MS Teams style)
    height: 48,       // Minimum WCAG 2.1 AA compliant touch target
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  dayShort: {
    fontSize: 13,     // Blueprint spec: Typography.caption 13sp
    fontWeight: '600',
    color: LightTheme.OnSurface,
    textAlign: 'center',
  },
  todayLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: LightTheme.Tertiary,
  },
  textSelected: {
    color: LightTheme.Primary,
    fontWeight: '700',
  },
  dotsRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 2,
  },
  blueDots: {
    fontSize: 16,
    color: LightTheme.Primary,    // Blue for classes
    lineHeight: 16,
  },
  redDots: {
    fontSize: 16,
    color: '#EF4444',              // Red for deadlines
    lineHeight: 16,
  },
  separator: {
    fontSize: 14,
    color: LightTheme.OutlineVariant,
    marginHorizontal: 4,
  },
});
