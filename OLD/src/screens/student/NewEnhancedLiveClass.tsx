/**
 * NewEnhancedLiveClass - Premium Minimal Design
 * Purpose: Enhanced live class with advanced features
 * Used in: StudentNavigator (ClassesStack)
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, Modal } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { VideoPlaceholder } from '../../shared/components/VideoPlaceholder';
import { Card, CardHeader, CardContent } from '../../ui/surfaces/Card';
import { Badge } from '../../ui/data-display/Badge';
import { Button } from '../../ui/inputs/Button';
import { Chip } from '../../ui/inputs/Chip';
import { Row } from '../../ui/layout/Row';
import { T } from '../../ui';
import { trackScreenView, trackAction } from '../../utils/navigationAnalytics';
import { safeNavigate } from '../../utils/navigationService';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

type Props = NativeStackScreenProps<any, 'NewEnhancedLiveClass'>;

interface LiveClassDetails {
  id: string;
  subject: string;
  teacher_name: string;
  start_time: string;
  status: 'live' | 'scheduled' | 'ended';
  duration_minutes: number;
}

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: number[];
  myVote: number | null;
}

interface BreakoutRoom {
  id: string;
  name: string;
  participants: number;
  topic: string;
}

interface SharedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
}

interface AttendeeInfo {
  id: string;
  name: string;
  status: 'present' | 'late' | 'absent';
  joinTime: string;
}

interface ClassNote {
  id: string;
  content: string;
  timestamp: string;
}

export default function NewEnhancedLiveClass({ route, navigation }: Props) {
  const { user } = useAuth();
  const classId = route.params?.classId;

  // State for new features
  const [showPoll, setShowPoll] = useState(false);
  const [showBreakoutRooms, setShowBreakoutRooms] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');

  const [activePoll, setActivePoll] = useState<Poll>({
    id: '1',
    question: 'Do you understand the current topic?',
    options: ['Yes, completely', 'Mostly', 'Need clarification', 'No'],
    votes: [12, 8, 3, 1],
    myVote: null,
  });

  const [breakoutRooms, setBreakoutRooms] = useState<BreakoutRoom[]>([
    { id: '1', name: 'Room 1', participants: 5, topic: 'Problem solving' },
    { id: '2', name: 'Room 2', participants: 4, topic: 'Theory discussion' },
    { id: '3', name: 'Room 3', participants: 6, topic: 'Practice questions' },
  ]);

  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([
    { id: '1', name: 'Lecture_Notes.pdf', type: 'pdf', size: '2.5 MB', uploadedBy: 'Teacher' },
    { id: '2', name: 'Practice_Problems.pdf', type: 'pdf', size: '1.8 MB', uploadedBy: 'Teacher' },
  ]);

  const [attendance, setAttendance] = useState<AttendeeInfo[]>([
    { id: '1', name: 'Sarah Johnson', status: 'present', joinTime: '10:00 AM' },
    { id: '2', name: 'Mike Chen', status: 'present', joinTime: '10:02 AM' },
    { id: '3', name: 'Emma Davis', status: 'late', joinTime: '10:15 AM' },
  ]);

  const [classNotes, setClassNotes] = useState<ClassNote[]>([]);

  React.useEffect(() => {
    trackScreenView('NewEnhancedLiveClass', { classId });
  }, [classId]);

  // Handlers
  const handleVote = (optionIndex: number) => {
    setActivePoll(prev => ({
      ...prev,
      myVote: optionIndex,
      votes: prev.votes.map((v, i) => i === optionIndex ? v + 1 : v),
    }));
    trackAction('vote_poll', 'NewEnhancedLiveClass', { optionIndex, classId });
  };

  const handleJoinBreakoutRoom = (roomId: string) => {
    trackAction('join_breakout_room', 'NewEnhancedLiveClass', { roomId, classId });
    Alert.alert('Breakout Room', 'Joining breakout room...');
  };

  const handleDownloadFile = (fileId: string, fileName: string) => {
    trackAction('download_class_file', 'NewEnhancedLiveClass', { fileId, classId });
    Alert.alert('Download', `Downloading ${fileName}...`);
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    const newNote: ClassNote = {
      id: Date.now().toString(),
      content: noteText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setClassNotes(prev => [...prev, newNote]);
    setNoteText('');
    trackAction('save_class_note', 'NewEnhancedLiveClass', { classId });
  };

  const handleDrawOnWhiteboard = () => {
    trackAction('use_whiteboard', 'NewEnhancedLiveClass', { classId });
    Alert.alert('Whiteboard', 'Whiteboard drawing tools activated');
  };

  // Fetch live class details
  const { data: liveClass, isLoading, error } = useQuery({
    queryKey: ['enhanced-live-class', classId],
    queryFn: async () => {
      if (!classId) throw new Error('No class ID provided');

      const { data, error } = await supabase
        .from('class_sessions')
        .select('*, teachers(name)')
        .eq('id', classId)
        .single();

      if (error) throw error;

      // Calculate elapsed time
      const start = new Date(data.start_time);
      const now = new Date();
      const elapsedMinutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));

      return {
        id: data.id,
        subject: data.subject || 'Class',
        teacher_name: (data.teachers as any)?.name || 'Teacher',
        start_time: data.start_time,
        status: data.status || 'live',
        duration_minutes: elapsedMinutes,
      } as LiveClassDetails;
    },
    enabled: !!classId,
  });


  return (
    <BaseScreen
      scrollable={false}
      loading={isLoading}
      error={error ? 'Failed to load live class' : null}
      empty={!liveClass}
      emptyMessage="Live class not found"
    >
      {liveClass && (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            {/* Header */}
            <Card style={styles.statusCard}>
              <Badge variant="error" label="🔴 LIVE" />
              <T variant="h2" weight="bold" style={styles.className}>
                {liveClass.subject}
              </T>
              <T variant="body" style={styles.teacher}>
                {liveClass.teacher_name}
              </T>
              <T variant="caption" style={styles.time}>
                Started {liveClass.duration_minutes} {liveClass.duration_minutes === 1 ? 'minute' : 'minutes'} ago
              </T>
            </Card>

            {/* Video */}
            <VideoPlaceholder
              streamId={classId}
              isLive={true}
              showControls={true}
              placeholderMessage="Enhanced Live Stream"
            />

            {/* Feature Buttons */}
            <Card style={styles.controlCard}>
              <Row gap="xs" wrap>
                <Button variant={showPoll ? 'primary' : 'outline'} onPress={() => setShowPoll(!showPoll)}>
                  📊 Poll
                </Button>
                <Button variant={showBreakoutRooms ? 'primary' : 'outline'} onPress={() => setShowBreakoutRooms(!showBreakoutRooms)}>
                  🚪 Rooms
                </Button>
                <Button variant={showWhiteboard ? 'primary' : 'outline'} onPress={() => setShowWhiteboard(!showWhiteboard)}>
                  ✍️ Board
                </Button>
                <Button variant={showFiles ? 'primary' : 'outline'} onPress={() => setShowFiles(!showFiles)}>
                  📁 Files
                </Button>
                <Button variant={showAttendance ? 'primary' : 'outline'} onPress={() => setShowAttendance(!showAttendance)}>
                  ✅ Attend
                </Button>
                <Button variant={showNotes ? 'primary' : 'outline'} onPress={() => setShowNotes(!showNotes)}>
                  📝 Notes
                </Button>
              </Row>
            </Card>

            {/* 1. Poll/Quiz */}
            {showPoll && (
              <Card style={styles.featureCard}>
                <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
                  📊 Live Poll
                </T>
                <T variant="body" weight="semiBold" style={{ marginBottom: 12 }}>
                  {activePoll.question}
                </T>
                {activePoll.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pollOption,
                      activePoll.myVote === index && styles.pollOptionSelected,
                    ]}
                    onPress={() => handleVote(index)}
                    disabled={activePoll.myVote !== null}
                    accessibilityRole="button"
                    accessibilityLabel={`Vote for ${option}`}
                  >
                    <T variant="body" style={{ flex: 1 }}>{option}</T>
                    <View style={styles.pollVotes}>
                      <T variant="caption">{activePoll.votes[index]}</T>
                    </View>
                  </TouchableOpacity>
                ))}
              </Card>
            )}

            {/* 2. Breakout Rooms */}
            {showBreakoutRooms && (
              <Card style={styles.featureCard}>
                <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
                  🚪 Breakout Rooms
                </T>
                {breakoutRooms.map(room => (
                  <View key={room.id} style={styles.breakoutRoom}>
                    <View style={{ flex: 1 }}>
                      <T variant="body" weight="semiBold">{room.name}</T>
                      <T variant="caption" style={{ color: '#6B7280' }}>{room.topic}</T>
                      <T variant="caption" style={{ color: '#9CA3AF' }}>
                        👥 {room.participants} participants
                      </T>
                    </View>
                    <Button variant="outline" onPress={() => handleJoinBreakoutRoom(room.id)}>
                      Join
                    </Button>
                  </View>
                ))}
              </Card>
            )}

            {/* 3. Whiteboard */}
            {showWhiteboard && (
              <Card style={styles.featureCard}>
                <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
                  ✍️ Collaborative Whiteboard
                </T>
                <View style={styles.whiteboardCanvas}>
                  <T variant="h1">🖌️</T>
                  <T variant="body" style={{ color: '#6B7280', textAlign: 'center' }}>
                    Whiteboard canvas
                  </T>
                  <Button variant="primary" onPress={handleDrawOnWhiteboard}>
                    Start Drawing
                  </Button>
                </View>
              </Card>
            )}

            {/* 4. File Sharing */}
            {showFiles && (
              <Card style={styles.featureCard}>
                <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
                  📁 Shared Files
                </T>
                {sharedFiles.map(file => (
                  <View key={file.id} style={styles.fileItem}>
                    <T variant="h3">📄</T>
                    <View style={{ flex: 1 }}>
                      <T variant="body" weight="semiBold">{file.name}</T>
                      <T variant="caption" style={{ color: '#9CA3AF' }}>
                        {file.size} • by {file.uploadedBy}
                      </T>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDownloadFile(file.id, file.name)}
                      accessibilityRole="button"
                      accessibilityLabel={`Download ${file.name}`}
                    >
                      <T variant="h3">⬇️</T>
                    </TouchableOpacity>
                  </View>
                ))}
              </Card>
            )}

            {/* 5. Attendance Tracking */}
            {showAttendance && (
              <Card style={styles.featureCard}>
                <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
                  ✅ Attendance ({attendance.length} present)
                </T>
                {attendance.map(attendee => (
                  <View key={attendee.id} style={styles.attendeeItem}>
                    <T variant="body">{attendee.name}</T>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <Badge
                        variant={attendee.status === 'present' ? 'success' : attendee.status === 'late' ? 'warning' : 'error'}
                        label={attendee.status.toUpperCase()}
                      />
                      <T variant="caption" style={{ color: '#9CA3AF' }}>
                        {attendee.joinTime}
                      </T>
                    </View>
                  </View>
                ))}
              </Card>
            )}

            {/* 6. Class Notes */}
            {showNotes && (
              <Card style={styles.featureCard}>
                <T variant="title" weight="semiBold" style={{ marginBottom: 12 }}>
                  📝 Class Notes
                </T>
                <View style={styles.notesInput}>
                  <TextInput
                    style={styles.notesTextInput}
                    value={noteText}
                    onChangeText={setNoteText}
                    placeholder="Take notes during class..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    accessibilityLabel="Class notes input"
                  />
                  <Button variant="primary" onPress={handleSaveNote}>
                    Save
                  </Button>
                </View>
                {classNotes.length > 0 && (
                  <View style={styles.notesList}>
                    {classNotes.map(note => (
                      <View key={note.id} style={styles.noteItem}>
                        <T variant="caption" style={{ color: '#3B82F6' }}>
                          {note.timestamp}
                        </T>
                        <T variant="body">{note.content}</T>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            )}
          </View>
        </ScrollView>
      )}
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 16,
  },
  statusCard: {
    padding: 16,
    gap: 8,
  },
  className: {
    marginTop: 4,
  },
  teacher: {
    color: '#6B7280',
  },
  time: {
    color: '#6B7280',
  },
  controlCard: {
    padding: 16,
  },
  featureCard: {
    padding: 16,
  },
  pollOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pollOptionSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  pollVotes: {
    minWidth: 30,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
  },
  breakoutRoom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  whiteboardCanvas: {
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  attendeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notesInput: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  notesTextInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  notesList: {
    gap: 12,
  },
  noteItem: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    gap: 4,
  },
});
