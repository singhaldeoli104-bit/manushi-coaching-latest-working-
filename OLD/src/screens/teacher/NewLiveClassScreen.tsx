/**
 * NewLiveClassScreen - Production-ready live class control centre
 * - Real Supabase data (sessions, participants, chat, polls)
 * - BaseScreen wrapper with full state handling
 * - Safe navigation and analytics tracking
 * - React Query for all data/mutation flows
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TeacherStackScreenProps } from '../../types/navigation';
import { supabase } from '../../lib/supabase';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import { EnhancedTouchableButton } from '../../components/core/EnhancedTouchableButton';
import ParticipantList from '../../components/teacher/ParticipantList';
import AttendanceWidget from '../../components/teacher/AttendanceWidget';
import type { Participant } from '../../components/teacher/ParticipantCard';
import { Portal, Snackbar } from 'react-native-paper';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

type Props = TeacherStackScreenProps<'LiveClass'>;

type LiveSessionRecord = {
  id: string;
  class_id: string | null;
  teacher_id: string | null;
  scheduled_start: string | null;
  actual_start: string | null;
  actual_end: string | null;
  status: 'scheduled' | 'live' | 'paused' | 'ended' | 'cancelled';
  recording_url: string | null;
  recording_duration_seconds: number | null;
  notes: string | null;
};

type ClassRecord = {
  id: string;
  name?: string | null;
  subject?: string | null;
  grade_level?: string | null;
  section?: string | null;
  start_time?: string | null;
  end_time?: string | null;
};

type ParticipantRow = {
  id: string;
  student_id: string | null;
  profile_id: string | null;
  join_time: string | null;
  leave_time: string | null;
  audio_enabled: boolean;
  video_enabled: boolean;
  hand_raised: boolean;
  connection_status: string | null;
  last_seen_at: string | null;
};

type ChatRow = {
  id: string;
  session_id: string;
  sender_id: string | null;
  message: string;
  message_type: string;
  is_private: boolean;
  recipient_id: string | null;
  created_at: string;
};

type PollRow = {
  id: string;
  session_id: string;
  question: string;
  status: string;
  created_at: string | null;
  closes_at: string | null;
};

type QuizRow = {
  id: string;
  session_id: string;
  title: string;
  status: string;
  created_at: string | null;
  closes_at: string | null;
};

type LiveClassData = {
  session: LiveSessionRecord | null;
  classInfo: ClassRecord | null;
  participants: ParticipantRow[];
  polls: PollRow[];
  quizzes: QuizRow[];
  messages: ChatRow[];
};

type TabKey = 'overview' | 'participants' | 'attendance' | 'chat' | 'polls';

type ChatMessage = {
  id: string;
  senderId: string | null;
  senderName: string;
  content: string;
  createdAt: Date;
  isPrivate: boolean;
};
async function fetchLiveClassData(classId: string, sessionId?: string | null): Promise<LiveClassData> {
  const sessionQuery = supabase
    .from<LiveSessionRecord>('live_class_sessions')
    .select('id, class_id, teacher_id, scheduled_start, actual_start, actual_end, status, recording_url, recording_duration_seconds, notes')
    .order('created_at', { ascending: false })
    .limit(1);

  if (sessionId) {
    sessionQuery.eq('id', sessionId);
  } else if (classId) {
    sessionQuery.eq('class_id', classId);
  }

  const [
    { data: sessionRows, error: sessionError },
    { data: classRows, error: classError },
  ] = await Promise.all([
    sessionQuery,
    classId
      ? supabase
          .from<ClassRecord>('classes')
          .select('id, name, subject, grade_level, section, start_time, end_time')
          .eq('id', classId)
          .limit(1)
      : Promise.resolve({ data: null, error: null } as const),
  ]);

  if (sessionError) throw sessionError;
  if (classError) throw classError;

  const session = Array.isArray(sessionRows) ? sessionRows[0] ?? null : sessionRows;
  const classInfo = Array.isArray(classRows) ? classRows[0] ?? null : classRows;
  const resolvedSessionId = session?.id ?? sessionId ?? null;

  if (!resolvedSessionId) {
    return {
      session,
      classInfo,
      participants: [],
      polls: [],
      quizzes: [],
      messages: [],
    };
  }

  const [
    { data: participantRows, error: participantError },
    { data: pollRows, error: pollError },
    { data: quizRows, error: quizError },
    { data: chatRows, error: chatError },
  ] = await Promise.all([
    supabase
      .from<ParticipantRow>('live_class_participants')
      .select('id, student_id, profile_id, join_time, leave_time, audio_enabled, video_enabled, hand_raised, connection_status, last_seen_at')
      .eq('session_id', resolvedSessionId)
      .order('join_time', { ascending: true }),
    supabase
      .from<PollRow>('live_class_polls')
      .select('id, session_id, question, status, created_at, closes_at')
      .eq('session_id', resolvedSessionId)
      .order('created_at', { ascending: false }),
    supabase
      .from<QuizRow>('live_class_quizzes')
      .select('id, session_id, title, status, created_at, closes_at')
      .eq('session_id', resolvedSessionId)
      .order('created_at', { ascending: false }),
    supabase
      .from<ChatRow>('live_class_chat_messages')
      .select('id, session_id, sender_id, message, message_type, is_private, recipient_id, created_at')
      .eq('session_id', resolvedSessionId)
      .order('created_at', { ascending: true }),
  ]);

  if (participantError) throw participantError;
  if (pollError) throw pollError;
  if (quizError) throw quizError;
  if (chatError) throw chatError;

  return {
    session,
    classInfo,
    participants: participantRows ?? [],
    polls: pollRows ?? [],
    quizzes: quizRows ?? [],
    messages: chatRows ?? [],
  };
}

async function resolveTeacherId(existingTeacherId?: string | null): Promise<string | null> {
  if (existingTeacherId) return existingTeacherId;

  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from('teachers')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (error) {
    console.error('Failed to resolve teacher id', error);
    return null;
  }

  if (Array.isArray(data) && data[0]?.id) {
    return data[0].id;
  }

  return null;
}

function toDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateTime(value: Date | null | undefined): string {
  if (!value) return '—';
  return `${value.toLocaleDateString()} ${value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function formatRelative(value: Date | null | undefined): string {
  if (!value) return 'No data';
  const diff = Date.now() - value.getTime();
  if (diff < 60_000) return 'Just now';
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m ago`;
}

function mapParticipantsSimple(rows: ParticipantRow[]): Participant[] {
  return rows.map(row => ({
    id: row.id,
    name: row.student_id ? `Student ${row.student_id.slice(0, 8)}` : 'Participant',
    avatar: undefined,
    isPresent: !row.leave_time,
    joinTime: toDate(row.join_time) ?? new Date(),
    leaveTime: toDate(row.leave_time) ?? undefined,
    audioEnabled: row.audio_enabled,
    videoEnabled: row.video_enabled,
    handRaised: row.hand_raised,
    connectionStatus: (row.connection_status as Participant['connectionStatus']) ?? 'good',
    role: row.student_id ? 'student' : 'observer',
    attendanceStatus: undefined,
  }));
}

function mapChatMessagesSimple(rows: ChatRow[]): ChatMessage[] {
  return rows.map(row => ({
    id: row.id,
    senderId: row.sender_id,
    senderName: row.sender_id ? row.sender_id.slice(0, 8) : 'System',
    content: row.message,
    createdAt: toDate(row.created_at) ?? new Date(),
    isPrivate: row.is_private,
  }));
}
const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'participants', label: 'Participants' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'chat', label: 'Chat' },
  { key: 'polls', label: 'Polls & Quizzes' },
];

const DEFAULT_TEACHER_ID = '22222222-2222-2222-2222-222222222222';
const NewLiveClassScreen: React.FC<Props> = ({ route, navigation }) => {
  const { classId, sessionId: initialSessionId } = route.params;
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [chatDraft, setChatDraft] = useState('');

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['live-class', classId, initialSessionId ?? null],
    queryFn: () => fetchLiveClassData(classId, initialSessionId),
    staleTime: 30_000,
  });

  const session = data?.session ?? null;
  const classInfo = data?.classInfo ?? null;
  const sessionIdentifier = session?.id ?? null;

  const participants = useMemo(() => mapParticipantsSimple(data?.participants ?? []), [data?.participants]);
  const attendanceExpected = useMemo(() => {
    const ids = (data?.participants ?? [])
      .map(row => row.student_id)
      .filter((value): value is string => Boolean(value));
    return new Set(ids).size;
  }, [data?.participants]);
  const chatMessages = useMemo(() => mapChatMessagesSimple(data?.messages ?? []), [data?.messages]);
  const polls = data?.polls ?? [];
  const quizzes = data?.quizzes ?? [];

  const lastChatTime = useMemo(() => {
    if (!chatMessages.length) return null;
    return chatMessages[chatMessages.length - 1].createdAt;
  }, [chatMessages]);

  useEffect(() => {
    trackScreenView('LiveClass', {
      classId,
      sessionId: sessionIdentifier ?? undefined,
      status: session?.status ?? 'scheduled',
    });
  }, [classId, sessionIdentifier, session?.status]);

  const invalidateLiveQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['live-class', classId, initialSessionId ?? null] });
  }, [classId, initialSessionId, queryClient]);

  const showMessage = useCallback((message: string) => {
    setSnackbarMessage(message);
  }, []);

  const startClassMutation = useMutation({
    mutationFn: async () => {
      if (!classId) throw new Error('Missing classId');

      const teacherId = (await resolveTeacherId(session?.teacher_id)) ?? DEFAULT_TEACHER_ID;
      const now = new Date().toISOString();

      if (sessionIdentifier) {
        const { error: updateError } = await supabase
          .from('live_class_sessions')
          .update({
            status: 'live',
            actual_start: now,
            actual_end: null,
            teacher_id: teacherId,
          })
          .eq('id', sessionIdentifier);

        if (updateError) throw updateError;
        return;
      }

      const { error: insertError } = await supabase
        .from('live_class_sessions')
        .insert({
          class_id: classId,
          teacher_id: teacherId,
          scheduled_start: now,
          actual_start: now,
          status: 'live',
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      trackAction('start_live_class', 'LiveClass', { classId });
      showMessage('Live class started');
      invalidateLiveQueries();
    },
    onError: (mutationError: unknown) => {
      console.error('Failed to start class', mutationError);
      showMessage('Unable to start class. Please try again.');
    },
  });

  const endClassMutation = useMutation({
    mutationFn: async () => {
      if (!sessionIdentifier) throw new Error('No active session');
      const now = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('live_class_sessions')
        .update({
          status: 'ended',
          actual_end: now,
        })
        .eq('id', sessionIdentifier);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      trackAction('end_live_class', 'LiveClass', { classId, sessionId: sessionIdentifier ?? undefined });
      showMessage('Class ended successfully');
      invalidateLiveQueries();
    },
    onError: (mutationError: unknown) => {
      console.error('Failed to end class', mutationError);
      showMessage('Unable to end class. Please try again.');
    },
  });

  const updateParticipantMutation = useMutation({
    mutationFn: async ({
      participantId,
      patch,
    }: {
      participantId: string;
      patch: Partial<ParticipantRow>;
    }) => {
      const { error: updateError } = await supabase
        .from('live_class_participants')
        .update(patch)
        .eq('id', participantId);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      invalidateLiveQueries();
    },
    onError: (mutationError: unknown) => {
      console.error('Failed to update participant', mutationError);
      showMessage('Unable to update participant.');
    },
  });

  const sendChatMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!sessionIdentifier) throw new Error('No active session');

      const { data: authData } = await supabase.auth.getUser();
      const senderId = authData?.user?.id ?? null;

      const { error: insertError } = await supabase
        .from('live_class_chat_messages')
        .insert({
          session_id: sessionIdentifier,
          sender_id: senderId,
          message,
          message_type: 'text',
          is_private: false,
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      setChatDraft('');
      invalidateLiveQueries();
      trackAction('send_live_chat_message', 'LiveClass', { sessionId: sessionIdentifier ?? undefined });
    },
    onError: (mutationError: unknown) => {
      console.error('Failed to send message', mutationError);
      showMessage('Unable to send message.');
    },
  });

  const handleToggleAudio = useCallback((participantId: string) => {
    const target = participants.find(item => item.id === participantId);
    if (!target) return;
    updateParticipantMutation.mutate({
      participantId,
      patch: { audio_enabled: !target.audioEnabled },
    });
  }, [participants, updateParticipantMutation]);

  const handleToggleVideo = useCallback((participantId: string) => {
    const target = participants.find(item => item.id === participantId);
    if (!target) return;
    updateParticipantMutation.mutate({
      participantId,
      patch: { video_enabled: !target.videoEnabled },
    });
  }, [participants, updateParticipantMutation]);

  const handleToggleHandRaise = useCallback((participantId: string) => {
    const target = participants.find(item => item.id === participantId);
    if (!target) return;
    updateParticipantMutation.mutate({
      participantId,
      patch: { hand_raised: !target.handRaised },
    });
  }, [participants, updateParticipantMutation]);

  const handleRemoveParticipant = useCallback((participantId: string) => {
    updateParticipantMutation.mutate({
      participantId,
      patch: { leave_time: new Date().toISOString() },
    });
  }, [updateParticipantMutation]);

  const handleStartClass = useCallback(() => {
    startClassMutation.mutate();
  }, [startClassMutation]);

  const confirmEndClass = useCallback(() => {
    Alert.alert(
      'End Live Class',
      'Are you sure you want to end this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Class',
          style: 'destructive',
          onPress: () => endClassMutation.mutate(),
        },
      ],
    );
  }, [endClassMutation]);

  const handleNavigateBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      safeNavigate('TeacherDashboard');
    }
  }, [navigation]);

  const renderTabButton = (tab: { key: TabKey; label: string }) => (
    <TouchableOpacity
      key={tab.key}
      style={[
        styles.tabButton,
        activeTab === tab.key && [
          styles.tabButtonActive,
          { backgroundColor: `${theme.primary}1A` },
        ],
      ]}
      onPress={() => setActiveTab(tab.key)}
      accessibilityRole="button"
      accessibilityState={{ selected: activeTab === tab.key }}
    >
      <Text
        style={[
          styles.tabButtonText,
          activeTab === tab.key && { color: theme.primary },
        ]}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
  const renderOverviewTab = () => {
    const scheduledStart = toDate(session?.scheduled_start ?? null);
    const actualStart = toDate(session?.actual_start ?? null);
    const actualEnd = toDate(session?.actual_end ?? null);
    const status = session?.status ?? 'scheduled';

    return (
      <View style={styles.section}>
        <View style={[styles.summaryCard, { backgroundColor: theme.SurfaceVariant }]}>
          <Text style={[styles.sectionTitle, { color: theme.OnSurface }]}>Session Status</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: `${theme.primary}1A` }]}>
              <Text style={[styles.statusBadgeText, { color: theme.primary }]}>{status.toUpperCase()}</Text>
            </View>
            <Text style={[styles.statusDetail, { color: theme.OnSurfaceVariant }]}>Last update: {formatRelative(actualEnd ?? actualStart ?? scheduledStart)}</Text>
          </View>

          <View style={styles.overviewGrid}>
            <View style={[styles.overviewItem, { backgroundColor: theme.Surface }]}>
              <Text style={[styles.overviewLabel, { color: theme.OnSurfaceVariant }]}>Scheduled</Text>
              <Text style={[styles.overviewValue, { color: theme.OnSurface }]}>{formatDateTime(scheduledStart)}</Text>
            </View>
            <View style={[styles.overviewItem, { backgroundColor: theme.Surface }]}>
              <Text style={[styles.overviewLabel, { color: theme.OnSurfaceVariant }]}>Started</Text>
              <Text style={[styles.overviewValue, { color: theme.OnSurface }]}>{formatDateTime(actualStart)}</Text>
            </View>
            <View style={[styles.overviewItem, { backgroundColor: theme.Surface }]}>
              <Text style={[styles.overviewLabel, { color: theme.OnSurfaceVariant }]}>Participants</Text>
              <Text style={[styles.overviewValue, { color: theme.OnSurface }]}>{participants.length}</Text>
            </View>
            <View style={[styles.overviewItem, { backgroundColor: theme.Surface }]}>
              <Text style={[styles.overviewLabel, { color: theme.OnSurfaceVariant }]}>Last Message</Text>
              <Text style={[styles.overviewValue, { color: theme.OnSurface }]}>{formatRelative(lastChatTime)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {status === 'live' ? (
            <EnhancedTouchableButton
              label="End Class"
              onPress={confirmEndClass}
              variant="secondary"
              loading={endClassMutation.isLoading}
              accessibilityLabel="End live class"
            />
          ) : (
            <EnhancedTouchableButton
              label="Start Class"
              onPress={handleStartClass}
              loading={startClassMutation.isLoading}
              accessibilityLabel="Start live class"
            />
          )}
          <EnhancedTouchableButton
            label="Back to Dashboard"
            onPress={handleNavigateBack}
            variant="text"
            accessibilityLabel="Return to Teacher Dashboard"
          />
        </View>
      </View>
    );
  };
  const renderParticipantsTab = () => (
    <View style={styles.section}>
      <ParticipantList
        participants={participants}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
        onToggleHandRaise={handleToggleHandRaise}
        onRemoveParticipant={handleRemoveParticipant}
        classStartTime={toDate(session?.actual_start ?? session?.scheduled_start ?? null) ?? undefined}
        showAttendanceIndicators
        maxHeight={420}
      />
    </View>
  );

  const renderAttendanceTab = () => (
    <View style={styles.section}>
      <AttendanceWidget
        participants={participants}
        classStartTime={toDate(session?.actual_start ?? session?.scheduled_start ?? null) ?? undefined}
        expectedStudents={attendanceExpected}
      />
    </View>
  );
  const renderChatTab = () => {
    const renderMessage = ({ item }: { item: ChatMessage }) => (
      <View style={[styles.chatMessage, { backgroundColor: theme.SurfaceVariant }]}>
        <View style={styles.chatMessageHeader}>
          <Text style={[styles.chatSender, { color: theme.primary }]}>{item.senderName}</Text>
          <Text style={[styles.chatTimestamp, { color: theme.OnSurfaceVariant }]}>{formatRelative(item.createdAt)}</Text>
        </View>
        <Text style={[styles.chatContent, { color: theme.OnSurface }]}>{item.content}</Text>
        {item.isPrivate && (
          <Text style={[styles.chatPrivateBadge, { color: theme.error }]}>Private</Text>
        )}
      </View>
    );

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.chatContainer}
      >
        <FlatList
          data={chatMessages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatListContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.OnSurfaceVariant }]}>No messages yet. Start the conversation!</Text>
          }
        />

        <View style={[styles.chatInputRow, { borderColor: theme.Outline }]}
        >
          <TextInput
            style={[styles.chatInput, { color: theme.OnSurface }]}
            placeholder="Send a message..."
            placeholderTextColor={theme.OnSurfaceVariant}
            value={chatDraft}
            onChangeText={setChatDraft}
            accessibilityLabel="Chat message input"
          />
          <TouchableOpacity
            style={[styles.chatSendButton, { backgroundColor: theme.primary }]}
            onPress={() => chatDraft.trim() && sendChatMessageMutation.mutate(chatDraft.trim())}
            accessibilityRole="button"
            accessibilityLabel="Send chat message"
            disabled={!chatDraft.trim() || sendChatMessageMutation.isLoading}
          >
            <Text style={[styles.chatSendLabel, { color: theme.OnPrimary }]}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  };
  const renderPollsTab = () => {
    const renderPoll = ({ item }: { item: PollRow }) => (
      <View style={[styles.pollCard, { borderColor: theme.Outline }]}
      >
        <Text style={[styles.pollQuestion, { color: theme.OnSurface }]}>{item.question}</Text>
        <View style={styles.pollMeta}>
          <Text style={[styles.pollMetaText, { color: theme.OnSurfaceVariant }]}>Status: {item.status}</Text>
          <Text style={[styles.pollMetaText, { color: theme.OnSurfaceVariant }]}>Created: {formatRelative(toDate(item.created_at))}</Text>
        </View>
      </View>
    );

    const renderQuiz = ({ item }: { item: QuizRow }) => (
      <View style={[styles.pollCard, { borderColor: theme.Outline }]}
      >
        <Text style={[styles.pollQuestion, { color: theme.OnSurface }]}>{item.title}</Text>
        <View style={styles.pollMeta}>
          <Text style={[styles.pollMetaText, { color: theme.OnSurfaceVariant }]}>Status: {item.status}</Text>
          <Text style={[styles.pollMetaText, { color: theme.OnSurfaceVariant }]}>Created: {formatRelative(toDate(item.created_at))}</Text>
        </View>
      </View>
    );

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.OnSurface }]}>Live Polls</Text>
        <FlatList
          data={polls}
          keyExtractor={item => item.id}
          renderItem={renderPoll}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.OnSurfaceVariant }]}>No polls have been created for this session.</Text>
          }
        />

        <Text style={[styles.sectionTitle, { color: theme.OnSurface, marginTop: Spacing.lg }]}>Quizzes</Text>
        <FlatList
          data={quizzes}
          keyExtractor={item => item.id}
          renderItem={renderQuiz}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.OnSurfaceVariant }]}>No quizzes have been created for this session.</Text>
          }
        />
      </View>
    );
  };
  let tabContent: React.ReactNode;
  switch (activeTab) {
    case 'participants':
      tabContent = renderParticipantsTab();
      break;
    case 'attendance':
      tabContent = renderAttendanceTab();
      break;
    case 'chat':
      tabContent = renderChatTab();
      break;
    case 'polls':
      tabContent = renderPollsTab();
      break;
    case 'overview':
    default:
      tabContent = renderOverviewTab();
      break;
  }

  const screenTitle = classInfo?.name ?? 'Live Class';
  const subtitle = [
    classInfo?.subject,
    classInfo?.grade_level ? `Grade ${classInfo.grade_level}` : null,
    classInfo?.section,
  ]
    .filter(Boolean)
    .join(' | ');

  return (
    <>
      <BaseScreen
        scrollable
        loading={isLoading || isFetching}
        error={error ? 'Unable to load live class details.' : null}
        empty={!isLoading && !session && !classInfo}
        emptyTitle="No live session"
        emptyBody="Start a live class to enable real-time controls."
        onRetry={refetch}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.OnSurface }]}>{screenTitle}</Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: theme.OnSurfaceVariant }]}>{subtitle}</Text>
            ) : null}
          </View>
          <View style={styles.headerButtons}>
            <EnhancedTouchableButton
              label="Refresh"
              onPress={refetch}
              variant="text"
              accessibilityLabel="Refresh live class data"
            />
          </View>
        </View>

        <View style={styles.tabsContainer}>
          {TABS.map(renderTabButton)}
        </View>

        {tabContent}
      </BaseScreen>

      <Portal>
        <Snackbar
          visible={Boolean(snackbarMessage)}
          onDismiss={() => setSnackbarMessage(null)}
          duration={4000}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </>
  );
};
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: Typography.sizes.titleLarge,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    fontSize: Typography.sizes.bodyMedium,
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  tabButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabButtonActive: {
    borderColor: 'transparent',
  },
  tabButtonText: {
    fontSize: Typography.sizes.labelLarge,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  summaryCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.titleMedium,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusBadgeText: {
    fontSize: Typography.sizes.labelMedium,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statusDetail: {
    fontSize: Typography.sizes.bodySmall,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  overviewItem: {
    flexBasis: '48%',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  overviewLabel: {
    fontSize: Typography.sizes.labelSmall,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    maxHeight: 420,
  },
  chatListContent: {
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  chatMessage: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  chatMessageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  chatSender: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '600',
  },
  chatTimestamp: {
    fontSize: Typography.sizes.labelSmall,
  },
  chatContent: {
    fontSize: Typography.sizes.bodyMedium,
    lineHeight: 20,
  },
  chatPrivateBadge: {
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.labelSmall,
    fontWeight: '600',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  chatInput: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(0,0,0,0.04)',
    fontSize: Typography.sizes.bodyMedium,
  },
  chatSendButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatSendLabel: {
    fontSize: Typography.sizes.labelLarge,
    fontWeight: '600',
  },
  pollCard: {
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  pollQuestion: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  pollMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pollMetaText: {
    fontSize: Typography.sizes.bodySmall,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: Typography.sizes.bodyMedium,
    paddingVertical: Spacing.lg,
  },
});

export default NewLiveClassScreen;
