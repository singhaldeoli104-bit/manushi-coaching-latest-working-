/**
 * NewEnhancedSchedule - Premium Minimal Design
 * Purpose: Enhanced schedule view with calendar integration
 * Used in: StudentNavigator (ClassesStack)
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';

type Props = NativeStackScreenProps<any, 'NewEnhancedSchedule'>;

export default function NewEnhancedSchedule({ navigation }: Props) {
  React.useEffect(() => {
    trackScreenView('NewEnhancedSchedule');
  }, []);

  const todayClasses = [
    { time: '09:00 AM', subject: 'Mathematics', status: 'completed' },
    { time: '11:00 AM', subject: 'Physics', status: 'live' },
    { time: '02:00 PM', subject: 'Chemistry', status: 'upcoming' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return '#EF4444';
      case 'completed': return '#9CA3AF';
      default: return '#3B82F6';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return '🔴';
      case 'completed': return '✅';
      default: return '🔵';
    }
  };

  return (
    <BaseScreen scrollable={false}>
      <ScrollView style={styles.container}>
        <Card style={styles.headerCard}>
          <T variant="h2" weight="bold">
            Today's Schedule
          </T>
          <T variant="caption" style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </T>
        </Card>

        <Card style={styles.classesCard}>
          {todayClasses.map((classItem, index) => (
            <View key={index} style={styles.classItem}>
              <View style={styles.timeContainer}>
                <T variant="caption" weight="semiBold">
                  {classItem.time}
                </T>
              </View>
              <View
                style={[
                  styles.classBar,
                  { backgroundColor: getStatusColor(classItem.status) },
                ]}
              />
              <View style={styles.classInfo}>
                <T variant="body" weight="semiBold">
                  {classItem.subject}
                </T>
                <View style={styles.statusContainer}>
                  <T variant="caption">
                    {getStatusIcon(classItem.status)} {classItem.status.toUpperCase()}
                  </T>
                </View>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerCard: {
    padding: 20,
    marginBottom: 16,
    gap: 4,
  },
  date: {
    color: '#6B7280',
  },
  classesCard: {
    padding: 16,
    gap: 16,
  },
  classItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timeContainer: {
    width: 70,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  classBar: {
    width: 4,
    borderRadius: 2,
  },
  classInfo: {
    flex: 1,
    gap: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
