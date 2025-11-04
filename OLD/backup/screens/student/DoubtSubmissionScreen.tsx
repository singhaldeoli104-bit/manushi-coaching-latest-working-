import React, { useState, useCallback, useEffect, useRef } from 'react';
import {  } from 'react-native-gesture-handler';
import { View, Text, SafeAreaView, StatusBar, BackHandler, Alert, Platform, AppState, AppStateStatus } from 'react-native';
import {
  Appbar,
  Portal,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Import Phase 24 components
import DoubtDashboard from '../../components/student/DoubtDashboard';
import DoubtSubmissionForm, { DoubtSubmission } from '../../components/student/DoubtSubmissionForm';

// Import Supabase services
import { createDoubt, updateDoubt } from '../../services/doubtsService';
import { useAuth } from '../../context/AuthContext';

export interface DoubtSubmissionScreenProps {
  navigation?: any; // React Navigation prop
  route?: any; // React Navigation route
  userId: string;
  userName?: string;
  onNavigateBack?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToSettings?: () => void;
}

export interface OfflineAction {
  id: string;
  type: 'submit' | 'save_draft' | 'delete';
  data: any;
  timestamp: string;
  retryCount: number;
}

export const DoubtSubmissionScreen: React.FC<DoubtSubmissionScreenProps> = ({
  navigation,
  route,
  userId,
  userName = 'Student',
  onNavigateBack,
  onNavigateToProfile,
  onNavigateToSettings,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const appState = useRef(AppState.currentState);
  const syncInterval = useRef<NodeJS.Timeout>();

  // Screen state management
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'submission'>('dashboard');
  const [syncInProgress, setSyncInProgress] = useState(false);

  // Initialize screen
  useEffect(() => {
    initializeScreen();
    setupNetworkListener();
    setupBackHandler();
    setupAppStateListener();
    
    return cleanup;
  }, []);

  // Screen initialization
  const initializeScreen = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Check initial network state
      const netInfo = await NetInfo.fetch();
      setIsOnline(netInfo.isConnected ?? false);
      
      // Load offline actions
      await loadOfflineActions();
      
      // Auto-sync if online
      if (netInfo.isConnected) {
        await performSync();
      }
      
    } catch (error) {
      console.error('Error initializing screen:', error);
      showSnackbar('Failed to initialize screen');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Network connectivity listener
  const setupNetworkListener = useCallback(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOnline = isOnline;
      const nowOnline = state.isConnected ?? false;
      
      setIsOnline(nowOnline);
      
      // Handle connection restoration
      if (!wasOnline && nowOnline) {
        showSnackbar('Connection restored - syncing data...');
        performSync();
      }
      
      // Handle connection loss
      if (wasOnline && !nowOnline) {
        showSnackbar('You are now offline - changes will be saved locally');
      }
    });
    
    return unsubscribe;
  }, [isOnline]);

  // Back button handler
  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentView === 'submission') {
        // Ask user if they want to save draft before leaving
        Alert.alert(
          'Save Draft?',
          'Do you want to save your current progress as a draft?',
          [
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => setCurrentView('dashboard'),
            },
            {
              text: 'Save Draft',
              onPress: async () => {
                // Auto-save functionality would be implemented here
                showSnackbar('Draft saved');
                setCurrentView('dashboard');
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
        return true;
      }
      
      // Allow default back behavior for dashboard
      if (onNavigateBack) {
        onNavigateBack();
        return true;
      }
      
      return false;
    });
    
    return () => backHandler.remove();
  }, [currentView, onNavigateBack]);

  // App state listener for background sync
  const setupAppStateListener = useCallback(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground - check for sync
        if (isOnline && offlineActions.length > 0) {
          performSync();
        }
      }
      
      appState.current = nextAppState;
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => subscription?.remove();
  }, [isOnline, offlineActions.length]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (syncInterval.current) {
      clearInterval(syncInterval.current);
    }
  }, []);

  // Load offline actions from storage
  const loadOfflineActions = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('offline_actions');
      if (stored) {
        const actions: OfflineAction[] = JSON.parse(stored);
        setOfflineActions(actions);
      }
    } catch (error) {
      console.error('Error loading offline actions:', error);
    }
  }, []);

  // Save offline actions to storage
  const saveOfflineActions = useCallback(async (actions: OfflineAction[]) => {
    try {
      await AsyncStorage.setItem('offline_actions', JSON.stringify(actions));
      setOfflineActions(actions);
    } catch (error) {
      console.error('Error saving offline actions:', error);
    }
  }, []);

  // Add offline action
  const addOfflineAction = useCallback(async (type: OfflineAction['type'], data: any) => {
    const newAction: OfflineAction = {
      id: `${Date.now()}_${Math.random()}`,
      type,
      data,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };
    
    const updatedActions = [...offlineActions, newAction];
    await saveOfflineActions(updatedActions);
    
    showSnackbar(`Action queued for sync (${updatedActions.length} pending)`);
  }, [offlineActions, saveOfflineActions]);

  // Perform sync with server
  const performSync = useCallback(async () => {
    if (!isOnline || offlineActions.length === 0 || syncInProgress) {
      return;
    }

    setSyncInProgress(true);

    try {
      const successfulActions: string[] = [];
      const currentUserId = user?.id || userId;

      if (!currentUserId) {
        showSnackbar('User not authenticated - cannot sync');
        setSyncInProgress(false);
        return;
      }

      for (const action of offlineActions) {
        try {
          switch (action.type) {
            case 'submit': {
              // Submit doubt to Supabase
              const submission = action.data as DoubtSubmission;
              const result = await createDoubt({
                student_id: currentUserId,
                subject_code: submission.subject,
                title: submission.title,
                description: submission.description,
                attachments: submission.attachments || [],
                priority: submission.priority || 'medium',
                status: 'open',
              });

              if (!result.success) {
                throw new Error(result.error || 'Failed to sync submission');
              }
              console.log('Synced submission:', submission.title);
              break;
            }

            case 'save_draft': {
              // Save draft to Supabase
              const draft = action.data;
              const result = await createDoubt({
                student_id: currentUserId,
                subject_code: draft.subject,
                title: draft.title || 'Untitled Draft',
                description: draft.description || '',
                attachments: draft.attachments || [],
                priority: draft.priority || 'medium',
                status: 'draft',
              });

              if (!result.success) {
                throw new Error(result.error || 'Failed to sync draft');
              }
              console.log('Synced draft:', draft.title);
              break;
            }

            case 'delete': {
              // Delete from Supabase
              // Note: We would need a deleteDoubt service function for this
              console.log('Delete sync not implemented:', action.data.id);
              break;
            }
          }

          successfulActions.push(action.id);

        } catch (error) {
          console.error(`Error syncing action ${action.id}:`, error);

          // Increment retry count
          action.retryCount += 1;

          // Remove action if too many retries
          if (action.retryCount > 3) {
            successfulActions.push(action.id);
            showSnackbar(`Failed to sync ${action.type} after multiple attempts`);
          }
        }
      }

      // Remove successful actions
      if (successfulActions.length > 0) {
        const remainingActions = offlineActions.filter(action =>
          !successfulActions.includes(action.id)
        );
        await saveOfflineActions(remainingActions);

        if (remainingActions.length === 0) {
          showSnackbar('All changes synced successfully');
        } else {
          showSnackbar(`${successfulActions.length} items synced, ${remainingActions.length} remaining`);
        }
      }

    } catch (error) {
      console.error('Error during sync:', error);
      showSnackbar('Sync failed - will retry later');
    } finally {
      setSyncInProgress(false);
    }
  }, [isOnline, offlineActions, syncInProgress, saveOfflineActions, user, userId]);

  // Handle submission (online or offline)
  const handleSubmission = useCallback(async (submission: DoubtSubmission) => {
    try {
      if (isOnline) {
        // Submit directly to Supabase
        setIsLoading(true);

        const currentUserId = user?.id || userId;
        if (!currentUserId) {
          showSnackbar('User not authenticated');
          return;
        }

        const result = await createDoubt({
          student_id: currentUserId,
          subject_code: submission.subject,
          title: submission.title,
          description: submission.description,
          attachments: submission.attachments || [],
          priority: submission.priority || 'medium',
          status: 'open',
        });

        if (result.success) {
          showSnackbar('Doubt submitted successfully!');
          setCurrentView('dashboard');
        } else {
          throw new Error(result.error || 'Failed to submit doubt');
        }

      } else {
        // Queue for offline sync
        await addOfflineAction('submit', submission);
        showSnackbar('Saved for offline sync');
        setCurrentView('dashboard');
      }

    } catch (error) {
      console.error('Error submitting doubt:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit doubt';
      showSnackbar(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, addOfflineAction, user, userId]);

  // Handle draft save (online or offline)
  const handleDraftSave = useCallback(async (draft: Partial<DoubtSubmission>) => {
    try {
      if (isOnline) {
        // Save to server immediately
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // Queue for offline sync
        await addOfflineAction('save_draft', draft);
      }
      
    } catch (error) {
      console.error('Error saving draft:', error);
      showSnackbar('Failed to save draft');
    }
  }, [isOnline, addOfflineAction]);

  // Show snackbar message
  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  // Render app bar
  const renderAppBar = () => (
    <Appbar.Header elevated style={{ backgroundColor: theme.Surface }}>
      <Appbar.BackAction 
        onPress={() => {
          if (currentView === 'submission') {
            setCurrentView('dashboard');
          } else if (onNavigateBack) {
            onNavigateBack();
          } else if (navigation?.goBack) {
            navigation.goBack();
          }
        }}
      />
      
      <Appbar.Content 
        title={currentView === 'dashboard' ? 'Doubt Dashboard' : 'Submit Doubt'}
        subtitle={!isOnline ? '📱 Offline Mode' : undefined}
      />
      
      {currentView === 'dashboard' && (
        <>
          {/* Sync indicator */}
          {syncInProgress && (
            <ActivityIndicator 
              size={20} 
              color={theme.primary}
              style={{ marginRight: 8 }}
            />
          )}
          
          {/* Offline actions indicator */}
          {offlineActions.length > 0 && (
            <Appbar.Action
              icon="sync"
              onPress={performSync}
              disabled={!isOnline || syncInProgress}
            />
          )}
          
          {/* Profile action */}
          {onNavigateToProfile && (
            <Appbar.Action
              icon="account"
              onPress={onNavigateToProfile}
            />
          )}
          
          {/* Settings action */}
          {onNavigateToSettings && (
            <Appbar.Action
              icon="cog"
              onPress={onNavigateToSettings}
            />
          )}
        </>
      )}
    </Appbar.Header>
  );

  // Render loading state
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar backgroundColor={theme.Surface} barStyle="dark-content" />
        {renderAppBar()}
        
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
        }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{
            fontSize: 16,
            color: theme.OnSurfaceVariant,
          }}>
            Loading dashboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar backgroundColor={theme.Surface} barStyle="dark-content" />
      {renderAppBar()}
      
      {currentView === 'dashboard' ? (
        <DoubtDashboard
          userId={userId}
          userName={userName}
          onSubmissionComplete={handleSubmission}
          onNavigateToHistory={() => {
            // Dashboard handles this internally
          }}
          onNavigateToProfile={onNavigateToProfile}
          showNotifications={true}
          enableOfflineMode={true}
        />
      ) : (
        <DoubtSubmissionForm
          onSubmit={handleSubmission}
          onSaveDraft={handleDraftSave}
          onCancel={() => setCurrentView('dashboard')}
          showSimilarQuestions={true}
          autoSaveInterval={30000} // 30 seconds
        />
      )}
      
      {/* Snackbar for notifications */}
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
          action={
            snackbarMessage.includes('sync') && offlineActions.length > 0
              ? {
                  label: 'Sync Now',
                  onPress: performSync,
                }
              : undefined
          }
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </SafeAreaView>
  );
};

export default DoubtSubmissionScreen;