import React from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import SessionItem from './SessionItem';
import type { SessionGroup } from '../lib/types';
import { Colors } from '../constants/colors';

interface SessionListProps {
  sessionGroups: SessionGroup[];
  activeSessionKey: string | null;
  onSessionSelect: (sessionKey: string) => void;
  isLoading: boolean;
  error?: string | null;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function SessionList({
  sessionGroups,
  activeSessionKey,
  onSessionSelect,
  isLoading,
  error,
  onRefresh,
  refreshing = false,
}: SessionListProps) {
  const formatKindLabel = (kind: string) => {
    switch (kind.toLowerCase()) {
      case 'main':
        return 'Main Sessions';
      case 'isolated':
        return 'Isolated Sessions';
      case 'agent':
        return 'Agent Sessions';
      case 'system':
        return 'System Sessions';
      default:
        return `${kind.charAt(0).toUpperCase() + kind.slice(1)} Sessions`;
    }
  };

  const renderEmptyState = () => {
    if (isLoading && sessionGroups.length === 0) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.emptyStateText}>Loading sessions...</Text>
        </View>
      );
    }

    if (error && sessionGroups.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.emptyStateText}>Failed to load sessions</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (sessionGroups.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyStateText}>No sessions found</Text>
          <Text style={styles.emptyHint}>
            Check your gateway connection
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.accent}
              colors={[Colors.accent]}
            />
          ) : undefined
        }
      >
        {renderEmptyState()}
        
        {sessionGroups.map((group) => (
          <View key={group.kind} style={styles.group}>
            <Text style={styles.groupHeader}>
              {formatKindLabel(group.kind)}
            </Text>
            
            <View style={styles.sessions}>
              {group.sessions.map((session) => (
                <SessionItem
                  key={session.sessionKey}
                  session={session}
                  isActive={session.sessionKey === activeSessionKey}
                  onPress={onSessionSelect}
                />
              ))}
            </View>
          </View>
        ))}
        
        {/* Bottom padding for last item */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Refresh hint */}
      {sessionGroups.length > 0 && (
        <View style={styles.refreshHint}>
          <Text style={styles.refreshHintText}>
            Pull to refresh • Auto-refresh every 30s
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  group: {
    marginBottom: 24,
  },
  groupHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bgSecondary,
  },
  sessions: {
    paddingVertical: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyIcon: {
    fontSize: 48,
  },
  errorIcon: {
    fontSize: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  bottomPadding: {
    height: 32,
  },
  refreshHint: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bgSecondary,
  },
  refreshHintText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});