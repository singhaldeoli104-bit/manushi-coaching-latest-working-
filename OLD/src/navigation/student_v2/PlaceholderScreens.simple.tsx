import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../../components/student/atoms/Button';
import { Card } from '../../components/student/atoms/Card';
import { LightTheme } from '../../theme/colors';
import { useStudent } from '../../context/StudentContext';
import { useDrawer } from './DrawerContext';

export const DashboardScreen = ({ navigation }: any) => {
  const { student } = useStudent();
  const { openDrawer, closeDrawer } = useDrawer();

  return (
    <ScrollView style={styles.container}>
      <Card variant="elevated" style={styles.card}>
        <Text style={styles.title}>Student Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {student?.name || 'Student'}!</Text>
        <Button label="OPEN Drawer" variant="filled" onPress={() => {
          console.log('[TEST] OPEN clicked');
          openDrawer();
        }} />
        <View style={{ height: 8 }} />
        <Button label="CLOSE Drawer" variant="outlined" onPress={() => {
          console.log('[TEST] CLOSE clicked');
          closeDrawer();
        }} />
        <View style={{ height: 8 }} />
        <Button label="View Schedule" variant="outlined" onPress={() => navigation.navigate('Schedule')} />
      </Card>
    </ScrollView>
  );
};

export const ScheduleScreen = () => (
  <ScrollView style={styles.container}>
    <Card variant="elevated" style={styles.card}>
      <Text style={styles.title}>Class Schedule</Text>
    </Card>
  </ScrollView>
);

export const AssignmentListScreen = () => (
  <ScrollView style={styles.container}>
    <Card variant="elevated" style={styles.card}>
      <Text style={styles.title}>Assignments</Text>
    </Card>
  </ScrollView>
);

export const ProgressScreen = () => (
  <ScrollView style={styles.container}>
    <Card variant="elevated" style={styles.card}>
      <Text style={styles.title}>My Progress</Text>
    </Card>
  </ScrollView>
);

export const MoreScreen = () => (
  <ScrollView style={styles.container}>
    <Card variant="elevated" style={styles.card}>
      <Text style={styles.title}>More Options</Text>
    </Card>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LightTheme.Background, padding: 16 },
  card: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: LightTheme.OnSurface, marginBottom: 8 },
  subtitle: { fontSize: 16, color: LightTheme.OnSurfaceVariant, marginBottom: 16 },
});
