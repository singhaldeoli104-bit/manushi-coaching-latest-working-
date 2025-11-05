/**
 * NewAITutorChat - Premium Minimal Design
 * Purpose: AI tutor chat interface for student questions
 * Used in: StudentNavigator (AssignmentsStack)
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { T } from '../../ui';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

type Props = NativeStackScreenProps<any, 'NewAITutorChat'>;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  followUpQuestions?: string[];
}

export default function NewAITutorChat({ navigation }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI tutor. How can I help you with your studies today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Track screen view
  React.useEffect(() => {
    trackScreenView('NewAITutorChat');
  }, []);

  // Fetch student's subjects and weak areas for dynamic suggestions
  const { data: suggestions } = useQuery({
    queryKey: ['ai-suggestions', user?.id],
    queryFn: async () => {
      if (!user?.id) return getDefaultSuggestions();

      // Get student's subjects
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('subjects')
        .eq('id', user.id)
        .single();

      if (studentError || !studentData) return getDefaultSuggestions();

      // Get student's recent low grades to identify weak areas
      const { data: gradesData, error: gradesError } = await supabase
        .from('grades')
        .select('subject, score, assignment_id')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (gradesError) return getDefaultSuggestions();

      // Calculate weak areas (subjects with avg score < 70%)
      const subjectScores: { [key: string]: number[] } = {};
      gradesData?.forEach((grade) => {
        if (!subjectScores[grade.subject]) {
          subjectScores[grade.subject] = [];
        }
        subjectScores[grade.subject].push(grade.score || 0);
      });

      const weakSubjects = Object.entries(subjectScores)
        .map(([subject, scores]) => ({
          subject,
          avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        }))
        .filter((item) => item.avgScore < 70)
        .sort((a, b) => a.avgScore - b.avgScore)
        .slice(0, 3)
        .map((item) => item.subject);

      // Generate suggestions based on weak areas
      if (weakSubjects.length > 0) {
        return weakSubjects.map((subject) => ({
          text: `Help me improve in ${subject}`,
          subject,
        }));
      }

      // Fallback to student's subjects
      const subjects = studentData.subjects?.split(',').map((s: string) => s.trim()) || [];
      if (subjects.length > 0) {
        return subjects.slice(0, 3).map((subject: string) => ({
          text: `Explain ${subject} concepts`,
          subject,
        }));
      }

      return getDefaultSuggestions();
    },
    enabled: !!user?.id,
  });

  // Default suggestions if no data available
  function getDefaultSuggestions() {
    return [
      { text: 'Explain photosynthesis', subject: 'Biology' },
      { text: 'Help with algebra', subject: 'Mathematics' },
      { text: 'What is Newton\'s law?', subject: 'Physics' },
    ];
  }

  // Handle send message
  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsSending(true);

    trackAction('send_ai_message', 'NewAITutorChat', {
      messageLength: inputText.length,
    });

    // TODO: Replace with real AI API integration
    // This is a placeholder simulation. In production, replace with:
    // - OpenAI API call (GPT-4, GPT-3.5)
    // - Anthropic Claude API
    // - Google Gemini API
    // - Or custom AI tutor backend
    // Include proper error handling, rate limiting, and response streaming
    setTimeout(() => {
      // Generate context-aware response and follow-up questions
      let responseText = 'I understand your question. Let me help you with that...';
      let followUps: string[] = [];

      const lowerInput = inputText.toLowerCase();

      if (lowerInput.includes('math') || lowerInput.includes('equation') || lowerInput.includes('solve')) {
        responseText = "I'd be happy to help you solve that! Here's my step-by-step approach:\n\n1. First, let me identify the type of equation\n2. Then I'll apply the appropriate solving method\n3. Finally, I'll verify the solution\n\nCould you please share the specific equation you'd like me to solve?";
        followUps = [
          'Show me another example',
          'Explain the formula used',
          'Give me similar problems',
        ];
      } else if (lowerInput.includes('science') || lowerInput.includes('physics') || lowerInput.includes('chemistry')) {
        responseText = "I love helping with science! I can explain complex concepts in simple terms, provide real-world examples, and help you understand the 'why' behind scientific phenomena.\n\nWhich science topic would you like to explore?";
        followUps = [
          'Explain with examples',
          'Show me experiments',
          'Connect to daily life',
        ];
      } else if (lowerInput.includes('code') || lowerInput.includes('program')) {
        responseText = "Great! I can help with programming concepts. I can:\n\n• Explain code line by line\n• Help debug errors\n• Suggest best practices\n• Provide examples in multiple languages\n\nWhat specific programming topic would you like help with?";
        followUps = [
          'Show me code examples',
          'Explain common errors',
          'Best practices for beginners',
        ];
      } else {
        responseText = "I'm here to help you learn! I can assist with:\n\n📚 Mathematics - equations, calculus, algebra\n🔬 Sciences - physics, chemistry, biology\n💻 Programming - coding, debugging, concepts\n\nWhat specific topic would you like to explore?";
        followUps = [
          'Help with homework',
          'Practice problems',
          'Concept explanation',
          'Study tips',
        ];
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        followUpQuestions: followUps,
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsSending(false);
    }, 1500);
  }, [inputText, isSending]);

  // Render message
  const renderMessage = ({ item }: { item: Message }) => (
    <View>
      <View
        style={[
          styles.messageContainer,
          item.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        {!item.isUser && (
          <View style={styles.aiAvatar}>
            <T variant="body">🤖</T>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            item.isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <T variant="body" style={item.isUser ? styles.userText : styles.aiText}>
            {item.text}
          </T>
          <T
            variant="caption"
            style={[
              styles.messageTime,
              item.isUser && styles.userMessageTime,
            ]}
          >
            {item.timestamp.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </T>
        </View>
        {item.isUser && (
          <View style={styles.userAvatar}>
            <T variant="body">👤</T>
          </View>
        )}
      </View>

      {/* Follow-up Questions */}
      {!item.isUser && item.followUpQuestions && item.followUpQuestions.length > 0 && (
        <View style={styles.followUpContainer}>
          <T variant="caption" style={styles.followUpTitle}>
            💡 Quick follow-ups:
          </T>
          <View style={styles.followUpList}>
            {item.followUpQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.followUpButton}
                onPress={() => {
                  trackAction('select_followup', 'NewAITutorChat', { question });
                  setInputText(question);
                  // Auto-send the follow-up question
                  setTimeout(() => {
                    setInputText('');
                    const userMessage: Message = {
                      id: Date.now().toString(),
                      text: question,
                      isUser: true,
                      timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, userMessage]);
                    setIsSending(true);
                    setTimeout(() => {
                      const aiResponse: Message = {
                        id: (Date.now() + 1).toString(),
                        text: `Let me help you with "${question}"...`,
                        isUser: false,
                        timestamp: new Date(),
                      };
                      setMessages(prev => [...prev, aiResponse]);
                      setIsSending(false);
                    }, 1500);
                  }, 100);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Ask: ${question}`}
              >
                <T variant="caption" style={styles.followUpText}>
                  {question}
                </T>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <BaseScreen scrollable={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          inverted={false}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything..."
            multiline
            maxLength={500}
            editable={!isSending}
            accessibilityLabel="Message input"
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isSending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <T variant="body" style={styles.sendButtonText}>
              {isSending ? '⏳' : '📤'}
            </T>
          </TouchableOpacity>
        </View>

        {/* Dynamic Suggested Questions */}
        {messages.length === 1 && suggestions && (
          <View style={styles.suggestionsContainer}>
            <T variant="caption" style={styles.suggestionsTitle}>
              {suggestions.some((s: any) => s.subject) ? 'Based on your study areas:' : 'Suggested questions:'}
            </T>
            <View style={styles.suggestionsList}>
              {suggestions.map((suggestion: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => {
                    trackAction('select_suggestion', 'NewAITutorChat', { suggestion: suggestion.text });
                    setInputText(suggestion.text);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Ask: ${suggestion.text}`}
                >
                  <T variant="caption" style={styles.suggestionText}>
                    {suggestion.text}
                  </T>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
    gap: 4,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#111827',
  },
  messageTime: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  userMessageTime: {
    color: '#E0E7FF',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    fontFamily: 'System',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendButtonText: {
    fontSize: 20,
  },
  suggestionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  suggestionsTitle: {
    color: '#6B7280',
    marginBottom: 8,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  suggestionText: {
    color: '#4B5563',
  },
  followUpContainer: {
    marginLeft: 40,
    marginTop: 8,
    marginBottom: 12,
  },
  followUpTitle: {
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '600',
  },
  followUpList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  followUpButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  followUpText: {
    color: '#1E40AF',
    fontWeight: '500',
  },
});
