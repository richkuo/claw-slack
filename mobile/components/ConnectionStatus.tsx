import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function ConnectionStatus({ 
  isConnected, 
  isConnecting, 
  error, 
  onRetry 
}: ConnectionStatusProps) {
  if (isConnected) {
    return (
      <View style={[styles.container, styles.connectedContainer]}>
        <View style={styles.indicator}>
          <Text style={styles.connectedIndicator}>●</Text>
          <Text style={styles.connectedText}>Connected</Text>
        </View>
      </View>
    );
  }

  if (isConnecting) {
    return (
      <View style={[styles.container, styles.connectingContainer]}>
        <View style={styles.indicator}>
          <Text style={styles.connectingIndicator}>●</Text>
          <Text style={styles.connectingText}>Connecting...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.errorContainer]}>
      <View style={styles.indicator}>
        <Text style={styles.errorIndicator}>●</Text>
        <Text style={styles.errorText}>
          {error || 'Disconnected'}
        </Text>
      </View>
      
      {onRetry && (
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  connectedContainer: {
    backgroundColor: Colors.bgSecondary,
  },
  connectingContainer: {
    backgroundColor: Colors.bgSecondary,
  },
  errorContainer: {
    backgroundColor: Colors.bgSecondary,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectedIndicator: {
    color: Colors.success,
    fontSize: 12,
  },
  connectingIndicator: {
    color: '#f59e0b', // Yellow
    fontSize: 12,
  },
  errorIndicator: {
    color: Colors.danger,
    fontSize: 12,
  },
  connectedText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '500',
  },
  connectingText: {
    color: '#f59e0b', // Yellow
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  retryButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  retryButtonText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
});