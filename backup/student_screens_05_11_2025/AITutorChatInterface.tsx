/**
 * AITutorChatInterface - Phase 47.2: AI Tutor Chat Interface
 * 24/7 AI tutor chatbot with subject-specific assistance and interactive problem solving
 * Features: Multi-language support, code explanation, math assistance, voice input, smart suggestions
 * Manushi Coaching Platform
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  BackHandler,
} from 'react-native';
import {
  Appbar,
  Portal,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';

import { LightTheme } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import * as AIStudyAssistantService from '../../services/aiStudyAssistantService';

const { width, height } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'equation' | 'code' | 'image' | 'suggestion';
  subject?: string;
  confidence?: number;
  followUpQuestions?: string[];
}

interface SubjectContext {
  subject: string;
  topic?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  recentTopics: string[];
}

interface AICapability {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'mathematics' | 'science' | 'language' | 'programming' | 'general';
  isActive: boolean;
}

interface SmartSuggestion {
  id: string;
  text: string;
  type: 'question' | 'topic' | 'explanation' | 'practice';
  confidence: number;
}

interface AITutorChatInterfaceProps {
  navigation?: any;
  studentId?: string;
  initialSubject?: string;
  onNavigate?: (screen: string, params?: any) => void;
}

const AITutorChatInterface: React.FC<AITutorChatInterfaceProps> = ({
  navigation,
  studentId = 'student_123',
  initialSubject = 'mathematics',
  onNavigate,
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'english' | 'hindi'>('english');
  const [subjectContext, setSubjectContext] = useState<SubjectContext>({
    subject: initialSubject,
    difficulty: 'intermediate',
    recentTopics: []
  });
  const [aiCapabilities, setAICapabilities] = useState<AICapability[]>([]);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const scrollViewRef = useRef<ScrollView>(null);

  const initializeAITutor = useCallback(async () => {
    // Initialize AI capabilities
    const capabilities: AICapability[] = [
      {
        id: 'math_solver',
        name: 'Math Problem Solver',
        icon: '🔢',
        description: 'Solve equations, calculus, algebra problems step by step',
        category: 'mathematics',
        isActive: true
      },
      {
        id: 'code_explainer',
        name: 'Code Explanation',
        icon: '💻',
        description: 'Explain programming concepts and debug code',
        category: 'programming',
        isActive: true
      },
      {
        id: 'science_helper',
        name: 'Science Assistant',
        icon: '🔬',
        description: 'Help with physics, chemistry, biology concepts',
        category: 'science',
        isActive: true
      },
      {
        id: 'language_tutor',
        name: 'Language Support',
        icon: '🗣️',
        description: 'Support in Hindi and English with translations',
        category: 'language',
        isActive: true
      }
    ];

    setAICapabilities(capabilities);

    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      content: getCurrentLanguageText(
        "Hello! I'm your AI tutor, ready to help you 24/7. What would you like to learn today?",
        "नमस्ते! मैं आपका AI ट्यूटर हूं, 24/7 आपकी मदद के लिए तैयार हूं। आज आप क्या सीखना चाहते हैं?"
      ),
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      confidence: 100,
      followUpQuestions: [
        'Help me with a math problem',
        'Explain a science concept',
        'Review my homework',
        'Practice questions'
      ]
    };

    setMessages([welcomeMessage]);
    generateSmartSuggestions();
  }, [generateSmartSuggestions, getCurrentLanguageText]);

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  const handleGoBack = useCallback((): boolean => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return true;
    }

    if (navigation?.goBack) {
      navigation.goBack();
      return true;
    }

    if (onNavigate) {
      onNavigate('ai-learning-dashboard');
      return true;
    }

    return false;
  }, [navigation, onNavigate]);

  const setupBackHandler = useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      return handleGoBack();
    });

    return subscription;
  }, [handleGoBack]);

  const cleanup = useCallback(() => {}, []);

  const initializeScreen = useCallback(async () => {
    setIsLoading(true);

    try {
      await initializeAITutor();
    } catch (error) {
      console.error('Error initializing AI Tutor interface:', error);
      showSnackbar('Failed to load tutor experience. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [initializeAITutor, showSnackbar]);

  useEffect(() => {
    initializeScreen();
    const backHandlerSubscription = setupBackHandler();

    return () => {
      backHandlerSubscription?.remove();
      cleanup();
    };
  }, [initializeScreen, setupBackHandler, cleanup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: LightTheme.Primary }}>
      <Appbar.BackAction onPress={handleGoBack} />
      <Appbar.Content title="AI Tutor" />
    </Appbar.Header>
  );

  function getCurrentLanguageText(english: string, hindi: string): string {
    return currentLanguage === 'english' ? english : hindi;
  }

  const generateSmartSuggestions = useCallback(() => {
    const suggestions: SmartSuggestion[] = [
      {
        id: '1',
        text: getCurrentLanguageText(
          'Solve this equation step by step',
          'इस समीकरण को चरणबद्ध तरीके से हल करें'
        ),
        type: 'question',
        confidence: 95
      },
      {
        id: '2',
        text: getCurrentLanguageText(
          'Explain photosynthesis process',
          'प्रकाश संश्लेषण की प्रक्रिया समझाएं'
        ),
        type: 'explanation',
        confidence: 92
      },
      {
        id: '3',
        text: getCurrentLanguageText(
          'Give me practice problems on calculus',
          'कैलकुलस पर अभ्यास के प्रश्न दें'
        ),
        type: 'practice',
        confidence: 88
      },
      {
        id: '4',
        text: getCurrentLanguageText(
          'Review organic chemistry reactions',
          'कार्बनिक रसायन की अभिक्रियाओं की समीक्षा करें'
        ),
        type: 'topic',
        confidence: 85
      }
    ];

    setSmartSuggestions(suggestions);
  }, [currentLanguage]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputText.trim();
    if (!text) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
      subject: selectedSubject
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsAITyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      generateAIResponse(text);
    }, 1500);
  };

  const generateAIResponse = (userInput: string) => {
    // Simulate AI response based on input
    let aiResponse = '';
    let responseType: 'text' | 'equation' | 'code' = 'text';
    let confidence = 85;
    let followUpQuestions: string[] = [];

    // Simple AI logic simulation
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('solve') || lowerInput.includes('equation') || lowerInput.includes('math')) {
      aiResponse = getCurrentLanguageText(
        "I'd be happy to help you solve that! Here's my step-by-step approach:\n\n1. First, let me identify the type of equation\n2. Then I'll apply the appropriate solving method\n3. Finally, I'll verify the solution\n\nCould you please share the specific equation you'd like me to solve?",
        "मैं इसे हल करने में आपकी मदद करने में खुश हूं! यहाँ मेरा चरणबद्ध तरीका है:\n\n1. पहले, मैं समीकरण का प्रकार पहचानूंगा\n2. फिर उपयुक्त हल करने की विधि लागू करूंगा\n3. अंत में, समाधान को सत्यापित करूंगा\n\nक्या आप कृपया वह विशिष्ट समीकरण साझा कर सकते हैं जिसे आप हल कराना चाहते हैं?"
      );
      responseType = 'equation';
      confidence = 92;
      followUpQuestions = [
        'Show me another example',
        'Explain the formula used',
        'Give me similar problems'
      ];
    } else if (lowerInput.includes('code') || lowerInput.includes('program') || lowerInput.includes('coding')) {
      aiResponse = getCurrentLanguageText(
        "Great! I can help with programming concepts. I can:\n\n• Explain code line by line\n• Help debug errors\n• Suggest best practices\n• Provide examples in multiple languages\n\nWhat specific programming topic or code would you like help with?",
        "बेहतरीन! मैं प्रोग्रामिंग अवधारणाओं में मदद कर सकता हूं। मैं कर सकता हूं:\n\n• कोड को लाइन बाई लाइन समझा सकता हूं\n• त्रुटियों को ठीक करने में मदद कर सकता हूं\n• सर्वोत्तम प्रथाओं का सुझाव दे सकता हूं\n• कई भाषाओं में उदाहरण प्रदान कर सकता हूं\n\nआप किस विशिष्ट प्रोग्रामिंग विषय या कोड के साथ मदद चाहते हैं?"
      );
      responseType = 'code';
      confidence = 88;
      followUpQuestions = [
        'Show me code examples',
        'Explain common errors',
        'Best practices for beginners'
      ];
    } else if (lowerInput.includes('science') || lowerInput.includes('physics') || lowerInput.includes('chemistry') || lowerInput.includes('biology')) {
      aiResponse = getCurrentLanguageText(
        "I love helping with science! I can explain complex concepts in simple terms, provide real-world examples, and help you understand the 'why' behind scientific phenomena.\n\nWhich science topic would you like to explore? I'm here to make it interesting and easy to understand!",
        "मुझे विज्ञान में मदद करना पसंद है! मैं जटिल अवधारणाओं को सरल शब्दों में समझा सकता हूं, वास्तविक जीवन के उदाहरण दे सकता हूं, और वैज्ञानिक घटनाओं के पीछे की 'क्यों' को समझने में मदद कर सकता हूं।\n\nआप कौन सा विज्ञान विषय एक्सप्लोर करना चाहते हैं? मैं इसे दिलचस्प और समझने में आसान बनाने के लिए यहां हूं!"
      );
      confidence = 90;
      followUpQuestions = [
        'Explain with examples',
        'Show me experiments',
        'Connect to daily life'
      ];
    } else {
      aiResponse = getCurrentLanguageText(
        "I'm here to help you learn! I can assist with:\n\n📚 Mathematics - equations, calculus, algebra\n🔬 Sciences - physics, chemistry, biology\n💻 Programming - coding, debugging, concepts\n🗣️ Languages - Hindi/English support\n\nWhat specific topic would you like to explore together?",
        "मैं आपको सीखने में मदद करने के लिए यहां हूं! मैं इसमें सहायता कर सकता हूं:\n\n📚 गणित - समीकरण, कैलकुलस, बीजगणित\n🔬 विज्ञान - भौतिकी, रसायन, जीव विज्ञान\n💻 प्रोग्रामिंग - कोडिंग, डिबगिंग, अवधारणाएं\n🗣️ भाषाएं - हिंदी/अंग्रेजी सपोर्ट\n\nआप कौन सा विशिष्ट विषय एक्सप्लोर करना चाहते हैं?"
      );
      followUpQuestions = [
        'Help with homework',
        'Practice problems',
        'Concept explanation',
        'Study tips'
      ];
    }

    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      content: aiResponse,
      sender: 'ai',
      timestamp: new Date(),
      type: responseType,
      confidence,
      followUpQuestions
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsAITyping(false);

    // Update context based on conversation
    setSubjectContext(prev => ({
      ...prev,
      recentTopics: [...prev.recentTopics.slice(-4), userInput.toLowerCase()].filter(Boolean)
    }));
  };

  const handleSuggestionPress = (suggestion: SmartSuggestion) => {
    handleSendMessage(suggestion.text);
  };

  const handleFollowUpQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'english' ? 'hindi' : 'english');
    Alert.alert(
      'Language Changed',
      `Switched to ${currentLanguage === 'english' ? 'Hindi' : 'English'}. AI responses will be in the selected language.`
    );
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = (message: ChatMessage) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.sender === 'user' ? styles.userMessage : styles.aiMessage
    ]}>
      {message.sender === 'ai' && (
        <View style={styles.aiHeader}>
          <Text style={styles.aiIcon}>🤖</Text>
          <Text style={styles.aiLabel}>AI Tutor</Text>
          {message.confidence && (
            <Text style={styles.confidenceText}>{message.confidence}%</Text>
          )}
        </View>
      )}
      
      <Text style={[
        styles.messageText,
        message.sender === 'user' ? styles.userMessageText : styles.aiMessageText
      ]}>
        {message.content}
      </Text>
      
      {message.type === 'equation' && (
        <View style={styles.equationContainer}>
          <Text style={styles.equationText}>Example: ax² + bx + c = 0</Text>
        </View>
      )}
      
      {message.type === 'code' && (
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>// Example code will be shown here</Text>
        </View>
      )}
      
      <Text style={styles.messageTime}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      
      {message.followUpQuestions && message.followUpQuestions.length > 0 && (
        <View style={styles.followUpContainer}>
          <Text style={styles.followUpTitle}>Quick actions:</Text>
          <View style={styles.followUpButtons}>
            {message.followUpQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.followUpButton}
                onPress={() => handleFollowUpQuestion(question)}
              >
                <Text style={styles.followUpButtonText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
        <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
        {renderAppBar()}

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={LightTheme.Primary} />
          <Text style={styles.loadingText}>
            {getCurrentLanguageText('Loading tutor experience...', 'Loading tutor experience...')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LightTheme.Background }}>
      <StatusBar backgroundColor={LightTheme.Primary} barStyle="light-content" />
      {renderAppBar()}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.overviewContainer}>
            <View style={styles.overviewText}>
              <Text style={styles.overviewTitle}>AI Tutor</Text>
              <Text style={styles.overviewSubtitle}>
                {getCurrentLanguageText('Available 24/7', '24/7 �%��������?�')}
              </Text>
            </View>

            <View style={styles.headerControls}>
              <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
                <Text style={styles.languageButtonText}>
                  {currentLanguage === 'english' ? '�1���,' : 'EN'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.voiceButton} onPress={handleVoiceInput}>
                <Text style={styles.voiceButtonText}>dYZ</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.capabilitiesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {aiCapabilities.filter(cap => cap.isActive).map(capability => (
                <TouchableOpacity key={capability.id} style={styles.capabilityChip}>
                  <Text style={styles.capabilityIcon}>{capability.icon}</Text>
                  <Text style={styles.capabilityText}>{capability.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.chatWrapper}>
            {messages.map(renderMessage)}

            {isAITyping && (
              <View style={[styles.messageContainer, styles.aiMessage]}>
                <View style={styles.aiHeader}>
                  <Text style={styles.aiIcon}>dY-</Text>
                  <Text style={styles.aiLabel}>AI Tutor</Text>
                </View>
                <View style={styles.typingIndicator}>
                  <Text style={styles.typingText}>
                    {getCurrentLanguageText('Thinking...', '�,��<�s ���1�_ �1��,�,...')}
                  </Text>
                  <View style={styles.typingDots}>
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                  </View>
                </View>
              </View>
            )}
          </View>

          {smartSuggestions.length > 0 && !isAITyping && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>
                {getCurrentLanguageText('Suggestions:', '�,��?�?�_��:')}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.suggestionsList}>
                  {smartSuggestions.map(suggestion => (
                    <TouchableOpacity
                      key={suggestion.id}
                      style={styles.suggestionChip}
                      onPress={() => handleSuggestionPress(suggestion)}
                    >
                      <Text style={styles.suggestionText}>{suggestion.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={getCurrentLanguageText(
              'Ask me anything about your studies...',
              '�.���"��? �������_�^ ���� ���_����� �r��؅, �r��?�?�,��� ���?�> �-��? ����,�>��؅,...'
            )}
            placeholderTextColor={LightTheme.OnSurfaceVariant}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isAITyping) && styles.disabledSendButton]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim() || isAITyping}
          >
            <Text style={styles.sendButtonText}>dY"</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: Spacing.LG,
  },
  loadingText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: Spacing.XXL,
    gap: Spacing.LG,
  },
  overviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: LightTheme.Primary,
    marginHorizontal: Spacing.LG,
    marginTop: Spacing.LG,
    marginBottom: Spacing.SM,
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.LG,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  overviewText: {
    flex: 1,
    marginRight: Spacing.MD,
  },
  overviewTitle: {
    ...Typography.titleLarge,
    color: LightTheme.OnPrimary,
    fontWeight: 'bold',
  },
  overviewSubtitle: {
    ...Typography.bodyMedium,
    color: LightTheme.OnPrimary,
    opacity: 0.85,
  },
  headerControls: {
    flexDirection: 'row',
    gap: Spacing.SM,
  },
  languageButton: {
    padding: Spacing.SM,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 40,
    alignItems: 'center',
  },
  languageButtonText: {
    ...Typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  voiceButton: {
    padding: Spacing.SM,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  voiceButtonText: {
    fontSize: 18,
  },
  capabilitiesContainer: {
    backgroundColor: LightTheme.SurfaceVariant,
    paddingVertical: Spacing.MD,
    paddingHorizontal: Spacing.SM,
    marginHorizontal: Spacing.LG,
    borderRadius: 16,
  },
  capabilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightTheme.Surface,
    borderRadius: 20,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    marginHorizontal: Spacing.SM,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  capabilityIcon: {
    fontSize: 16,
    marginRight: Spacing.SM,
  },
  capabilityText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    fontWeight: '500',
  },
  chatWrapper: {
    paddingHorizontal: Spacing.LG,
    gap: Spacing.LG,
  },
  messageContainer: {
    marginBottom: Spacing.LG,
    maxWidth: width * 0.85,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: LightTheme.Primary,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    padding: Spacing.MD,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: LightTheme.Surface,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    padding: Spacing.MD,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  aiIcon: {
    fontSize: 18,
    marginRight: Spacing.SM,
  },
  aiLabel: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    fontWeight: 'bold',
    flex: 1,
  },
  confidenceText: {
    ...Typography.labelSmall,
    color: LightTheme.Primary,
    fontWeight: 'bold',
  },
  messageText: {
    ...Typography.bodyMedium,
    lineHeight: 22,
  },
  userMessageText: {
    color: LightTheme.OnPrimary,
  },
  aiMessageText: {
    color: LightTheme.OnSurface,
  },
  messageTime: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginTop: Spacing.SM,
    textAlign: 'right',
    opacity: 0.7,
  },
  equationContainer: {
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 8,
    padding: Spacing.MD,
    marginTop: Spacing.SM,
  },
  equationText: {
    ...Typography.bodyMedium,
    fontFamily: 'monospace',
    color: LightTheme.OnSurfaceVariant,
  },
  codeContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: Spacing.MD,
    marginTop: Spacing.SM,
  },
  codeText: {
    ...Typography.bodyMedium,
    fontFamily: 'monospace',
    color: '#FFFFFF',
  },
  followUpContainer: {
    marginTop: Spacing.LG,
  },
  followUpTitle: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    marginBottom: Spacing.SM,
    fontWeight: 'bold',
  },
  followUpButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.SM,
  },
  followUpButton: {
    backgroundColor: LightTheme.PrimaryContainer,
    borderRadius: 16,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
  },
  followUpButtonText: {
    ...Typography.bodySmall,
    color: LightTheme.OnPrimaryContainer,
    fontWeight: '500',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.SM,
  },
  typingText: {
    ...Typography.bodyMedium,
    color: LightTheme.OnSurfaceVariant,
    fontStyle: 'italic',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: LightTheme.Primary,
    opacity: 0.6,
  },
  suggestionsContainer: {
    backgroundColor: LightTheme.SurfaceVariant,
    paddingVertical: Spacing.MD,
    paddingHorizontal: Spacing.LG,
    borderTopWidth: 1,
    borderTopColor: LightTheme.OutlineVariant,
    marginHorizontal: Spacing.LG,
    borderRadius: 12,
  },
  suggestionsTitle: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurfaceVariant,
    fontWeight: 'bold',
    marginBottom: Spacing.SM,
  },
  suggestionsList: {
    flexDirection: 'row',
    gap: Spacing.SM,
  },
  suggestionChip: {
    backgroundColor: LightTheme.Surface,
    borderRadius: 16,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderWidth: 1,
    borderColor: LightTheme.OutlineVariant,
  },
  suggestionText: {
    ...Typography.bodySmall,
    color: LightTheme.OnSurface,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    backgroundColor: LightTheme.Surface,
    borderTopWidth: 1,
    borderTopColor: LightTheme.OutlineVariant,
    gap: Spacing.MD,
  },
  textInput: {
    flex: 1,
    ...Typography.bodyMedium,
    color: LightTheme.OnSurface,
    backgroundColor: LightTheme.SurfaceVariant,
    borderRadius: 20,
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: LightTheme.Primary,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  disabledSendButton: {
    backgroundColor: LightTheme.SurfaceVariant,
    elevation: 0,
  },
  sendButtonText: {
    fontSize: 20,
  },
});

export default AITutorChatInterface;
