import React, { useEffect, useRef } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useMessages } from '../hooks/useMessages';
import type { GatewayClient } from '../lib/gateway';
import { Colors } from '../constants/colors';

interface ChatViewProps {
  client: GatewayClient | null;
  sessionKey: string | null;
  sessionLabel?: string;
}

export default function ChatView({ client, sessionKey, sessionLabel }: ChatViewProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const { 
    messages, 
    isLoading, 
    isSending, 
    error, 
    sendMessage, 
    refetch 
  } = useMessages(client, sessionKey);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async (message: string): Promise<boolean> => {
    const success = await sendMessage(message);
    if (success) {
      // Scroll to bottom after sending
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
    return success;
  };

  if (!sessionKey) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyStateText}>Select a session to start chatting</Text>
          <Text style={styles.emptyHint}>
            Choose from the sessions in the sidebar
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Chat header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {sessionLabel || sessionKey}
        </Text>
        {sessionLabel && sessionLabel !== sessionKey && (
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {sessionKey}
          </Text>
        )}
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={[
          styles.messagesContent,
          messages.length === 0 && styles.emptyMessagesContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
        keyboardShouldPersistTaps="handled"
      >
        {isLoading && messages.length === 0 ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : error && messages.length === 0 ? (
          <View style={styles.errorState}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>Failed to load messages</Text>
            <Text style={styles.errorDetail}>{error}</Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyMessages}>
            <Text style={styles.emptyMessagesIcon}>💭</Text>
            <Text style={styles.emptyMessagesText}>No messages yet</Text>
            <Text style={styles.emptyMessagesHint}>
              Start a conversation by typing below
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))
        )}
      </ScrollView>

      {/* Message input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={!client || isSending}
        placeholder={
          !client 
            ? "Not connected..." 
            : isSending 
            ? "Sending..." 
            : "Type a message..."
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  header: {
    backgroundColor: Colors.bgSecondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  emptyMessagesContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 48,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.danger,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  emptyMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyMessagesIcon: {
    fontSize: 48,
  },
  emptyMessagesText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  emptyMessagesHint: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});