import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import type { SessionMessage } from '../lib/types';
import { Colors, MessageColors } from '../constants/colors';

interface MessageBubbleProps {
  message: SessionMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { role, content, timestamp, toolCall, toolName } = message;
  
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  const roleConfig = MessageColors[role as keyof typeof MessageColors] || {
    background: Colors.bgTertiary,
    text: Colors.textPrimary,
    avatar: '❓',
  };

  const isUser = role === 'user';
  const isSystem = role === 'system';

  return (
    <View style={[
      styles.container,
      isUser && styles.userContainer,
      isSystem && styles.systemContainer,
    ]}>
      {/* Message header */}
      <View style={[
        styles.header,
        isUser && styles.userHeader,
      ]}>
        {!isUser && (
          <View style={styles.roleInfo}>
            <Text style={styles.avatar}>{roleConfig.avatar}</Text>
            <Text style={styles.roleLabel}>
              {toolName || (role === 'assistant' ? 'Assistant' : role)}
            </Text>
          </View>
        )}
        <Text style={styles.timestamp}>
          {formatTime(timestamp)}
        </Text>
      </View>

      {/* Message content */}
      <View style={[
        styles.bubble,
        { backgroundColor: roleConfig.background },
        isUser && styles.userBubble,
        isSystem && styles.systemBubble,
      ]}>
        {toolCall ? (
          <View style={styles.toolCall}>
            <Text style={styles.toolCallHeader}>🔧 Tool Call</Text>
            <Text style={[styles.toolCallContent, { color: roleConfig.text }]}>
              {content}
            </Text>
          </View>
        ) : (
          <Markdown
            style={{
              body: { color: roleConfig.text, fontSize: 16, lineHeight: 22 },
              code_inline: {
                backgroundColor: isUser ? '#1e40af' : Colors.bgPrimary,
                color: roleConfig.text,
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 4,
                fontSize: 14,
              },
              code_block: {
                backgroundColor: isUser ? '#1e40af' : Colors.bgPrimary,
                color: roleConfig.text,
                padding: 12,
                borderRadius: 8,
                fontSize: 14,
                borderWidth: 1,
                borderColor: Colors.border,
              },
              link: {
                color: isUser ? '#93c5fd' : Colors.accent,
              },
              strong: {
                color: roleConfig.text,
                fontWeight: '600',
              },
            }}
          >
            {content}
          </Markdown>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  systemContainer: {
    alignSelf: 'center',
    maxWidth: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  userHeader: {
    justifyContent: 'flex-end',
  },
  roleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avatar: {
    fontSize: 16,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 4,
  },
  systemBubble: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  toolCall: {
    gap: 4,
  },
  toolCallHeader: {
    color: '#c084fc',
    fontSize: 12,
    fontWeight: '500',
  },
  toolCallContent: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 16,
  },
});