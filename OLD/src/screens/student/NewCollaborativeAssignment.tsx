/**
 * NewCollaborativeAssignment - Premium Minimal Design
 * Purpose: Group assignment collaboration workspace
 * Used in: StudentNavigator (AssignmentsStack)
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

type Props = NativeStackScreenProps<any, 'NewCollaborativeAssignment'>;

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  is_current_user: boolean;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  due_date: string;
}

export default function NewCollaborativeAssignment({ route, navigation }: Props) {
  const { user } = useAuth();
  const assignmentId = route.params?.assignmentId;

  React.useEffect(() => {
    trackScreenView('NewCollaborativeAssignment', { assignmentId });
  }, [assignmentId]);

  // Fetch assignment details
  const { data: assignment, isLoading: assignmentLoading } = useQuery({
    queryKey: ['assignment-detail', assignmentId],
    queryFn: async () => {
      if (!assignmentId) throw new Error('No assignment ID');

      const { data, error } = await supabase
        .from('assignments')
        .select('id, title, subject, due_date')
        .eq('id', assignmentId)
        .single();

      if (error) throw error;
      return data as Assignment;
    },
    enabled: !!assignmentId,
  });

  // Fetch team members
  const { data: teamMembers, isLoading: teamLoading } = useQuery({
    queryKey: ['team-members', assignmentId],
    queryFn: async () => {
      if (!assignmentId) throw new Error('No assignment ID');

      const { data, error } = await supabase
        .from('assignment_team_members')
        .select('*, students(id, name, email)')
        .eq('assignment_id', assignmentId)
        .order('role', { ascending: false });

      if (error) throw error;

      return (data || []).map(member => ({
        id: member.id,
        name: (member.students as any)?.name || 'Unknown',
        role: member.role || 'Member',
        avatar: member.student_id === user?.id ? '👤' : '👨',
        is_current_user: member.student_id === user?.id,
      })) as TeamMember[];
    },
    enabled: !!assignmentId,
  });

  const getDaysRemaining = () => {
    if (!assignment?.due_date) return 0;
    const dueDate = new Date(assignment.due_date);
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const isLoading = assignmentLoading || teamLoading;
  const daysRemaining = getDaysRemaining();

  return (
    <BaseScreen
      scrollable={false}
      loading={isLoading}
      error={!assignmentId ? 'No assignment ID provided' : null}
      empty={!assignment}
      emptyMessage="Assignment not found"
    >
      {assignment && (
        <ScrollView style={styles.container}>
          <Card style={styles.headerCard}>
            <T variant="h2" weight="bold">
              {assignment.title}
            </T>
            <T variant="caption" style={styles.subject}>
              {assignment.subject} • Due in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
            </T>
          </Card>

          <Card style={styles.teamCard}>
            <T variant="title" weight="semiBold" style={styles.sectionTitle}>
              Team Members ({teamMembers?.length || 0})
            </T>
            {teamMembers && teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <View key={member.id} style={styles.memberItem}>
                  <View style={styles.memberAvatar}>
                    <T variant="body">{member.avatar}</T>
                  </View>
                  <View style={styles.memberInfo}>
                    <T variant="body" weight="semiBold">
                      {member.name} {member.is_current_user && '(You)'}
                    </T>
                    <T variant="caption" style={styles.memberRole}>
                      {member.role}
                    </T>
                  </View>
                </View>
              ))
            ) : (
              <T variant="body" style={styles.emptyText}>
                No team members found
              </T>
            )}
          </Card>

          <Card style={styles.progressCard}>
            <T variant="title" weight="semiBold" style={styles.sectionTitle}>
              Progress
            </T>
            <T variant="body">Research: ✅ Complete</T>
            <T variant="body">Draft: 🔄 In Progress</T>
            <T variant="body">Review: ⏳ Pending</T>
          </Card>
        </ScrollView>
      )}
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerCard: {
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  subject: {
    color: '#6B7280',
  },
  teamCard: {
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  memberItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInfo: {
    flex: 1,
    gap: 2,
  },
  memberRole: {
    color: '#6B7280',
  },
  progressCard: {
    padding: 16,
    marginBottom: 32,
    gap: 12,
  },
  emptyText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
});
