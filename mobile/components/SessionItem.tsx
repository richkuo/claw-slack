import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { GatewaySession } from '../lib/types';
import { Colors } from '../constants/colors';

interface SessionItemProps {
  session: GatewaySession;
  isActive: boolean;
  onPress: (sessionKey: string) => void;
}

export default function SessionItem({ session, isActive, onPress }: SessionItemProps) {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(session.sessionKey);
  };

  const formatLastActivity = (timestamp?: string) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMin < 1) return 'now';
      if (diffMin < 60) return `${diffMin}m`;
      if (diffHour < 24) return `${diffHour}h`;
      if (diffDay < 7) return `${diffDay}d`;
      
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return '';
    }
  };

  const getStatusIndicator = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { color: Colors.success, text: '●' };
      case 'idle':
        return { color: '#f59e0b', text: '●' };
      case 'disconnected':
        return { color: Colors.textMuted, text: '●' };
      default:
        return { color: Colors.textMuted, text: '○' };
    }
  };

  const statusIndicator = getStatusIndicator(session.status);
  const displayName = session.label || session.sessionKey;
  const lastActivity = formatLastActivity(session.lastActivity);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && styles.activeContainer,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[
            styles.name,
            isActive && styles.activeName,
          ]} numberOfLines={1}>
            {displayName}
          </Text>
          
          <View style={styles.status}>
            <Text style={[styles.statusIndicator, { color: statusIndicator.color }]}>
              {statusIndicator.text}
            </Text>
            {lastActivity && (
              <Text style={styles.lastActivity}>
                {lastActivity}
              </Text>
            )}
          </View>
        </View>
        
        {session.sessionKey !== displayName && (
          <Text style={styles.sessionKey} numberOfLines={1}>
            {session.sessionKey}
          </Text>
        )}
      </View>
      
      {isActive && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgTertiary,
    marginVertical: 2,
    marginHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  activeContainer: {
    backgroundColor: Colors.accent,
  },
  content: {
    padding: 12,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    flex: 1,
  },
  activeName: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIndicator: {
    fontSize: 8,
  },
  lastActivity: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '400',
  },
  sessionKey: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Colors.textPrimary,
  },
});