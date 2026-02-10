import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Text, 
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useGateway } from '../hooks/useGateway';
import { useSessions } from '../hooks/useSessions';
import { getActiveSession, setActiveSession } from '../lib/storage';

import ConnectionStatus from '../components/ConnectionStatus';
import SessionList from '../components/SessionList';
import ChatView from '../components/ChatView';
import { Colors } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(screenWidth * 0.8, 300);

export default function HomePage() {
  const [activeSessionKey, setActiveSessionKey] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refreshingSessions, setRefreshingSessions] = useState(false);

  const { 
    client, 
    config, 
    isConnected, 
    isConfigured, 
    isConnecting, 
    connectionError, 
    checkStatus 
  } = useGateway();

  const { 
    sessionGroups, 
    isLoading: sessionsLoading, 
    error: sessionsError, 
    refetch: refetchSessions 
  } = useSessions(client);

  // Load active session on mount
  useEffect(() => {
    const loadActiveSession = async () => {
      try {
        const saved = await getActiveSession();
        if (saved) {
          setActiveSessionKey(saved);
        }
      } catch (error) {
        console.warn('Failed to load active session:', error);
      }
    };
    
    loadActiveSession();
  }, []);

  // Save active session when it changes
  useEffect(() => {
    if (activeSessionKey) {
      setActiveSession(activeSessionKey).catch(console.warn);
    }
  }, [activeSessionKey]);

  const handleSessionSelect = async (sessionKey: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveSessionKey(sessionKey);
    setIsDrawerOpen(false);
  };

  const handleOpenDrawer = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSettingsPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/settings');
  };

  const handleRefreshSessions = async () => {
    setRefreshingSessions(true);
    await refetchSessions();
    setRefreshingSessions(false);
  };

  const handleRetryConnection = async () => {
    if (!isConfigured) {
      Alert.alert(
        'Not Configured',
        'Please configure your gateway URL and token in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: handleSettingsPress },
        ]
      );
      return;
    }
    
    await checkStatus();
  };

  // Find active session for display
  const activeSession = sessionGroups
    .flatMap(group => group.sessions)
    .find(session => session.sessionKey === activeSessionKey);

  return (
    <SafeAreaView style={styles.container}>
      {/* Connection Status */}
      <ConnectionStatus
        isConnected={isConnected}
        isConnecting={isConnecting}
        error={connectionError}
        onRetry={handleRetryConnection}
      />

      <View style={styles.content}>
        {/* Main Chat Area */}
        <View style={styles.chatContainer}>
          {/* Header with menu and settings */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={handleOpenDrawer}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            
            <View style={styles.headerTitle}>
              <Text style={styles.appTitle}>🦞 claw-slack</Text>
            </View>
            
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleSettingsPress}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Chat View */}
          <ChatView
            client={client}
            sessionKey={activeSessionKey}
            sessionLabel={activeSession?.label}
          />
        </View>

        {/* Drawer Modal */}
        <Modal
          visible={isDrawerOpen}
          transparent
          animationType="none"
          onRequestClose={handleCloseDrawer}
        >
          {/* Backdrop */}
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleCloseDrawer}
          >
            <View />
          </TouchableOpacity>

          {/* Drawer */}
          <View style={[styles.drawer, { width: DRAWER_WIDTH }]}>
            <SafeAreaView style={styles.drawerContent}>
              {/* Drawer Header */}
              <View style={styles.drawerHeader}>
                <View style={styles.drawerTitleContainer}>
                  <Text style={styles.drawerTitle}>Sessions</Text>
                </View>
                
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseDrawer}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Session List */}
              <SessionList
                sessionGroups={sessionGroups}
                activeSessionKey={activeSessionKey}
                onSessionSelect={handleSessionSelect}
                isLoading={sessionsLoading}
                error={sessionsError}
                onRefresh={handleRefreshSessions}
                refreshing={refreshingSessions}
              />
            </SafeAreaView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  content: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 16,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  headerTitle: {
    flex: 1,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  drawer: {
    backgroundColor: Colors.bgSecondary,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bgTertiary,
  },
  drawerTitleContainer: {
    flex: 1,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});