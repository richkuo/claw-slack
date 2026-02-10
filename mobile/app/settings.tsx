import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useGateway } from '../hooks/useGateway';
import { clearStorage } from '../lib/storage';
import { Colors } from '../constants/colors';

export default function SettingsPage() {
  const [gatewayUrl, setGatewayUrl] = useState('');
  const [gatewayToken, setGatewayToken] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const { 
    config, 
    status, 
    isConnected, 
    isConnecting, 
    connectionError, 
    updateConfig, 
    checkStatus 
  } = useGateway();

  // Load current config
  useEffect(() => {
    if (config) {
      setGatewayUrl(config.url);
      setGatewayToken(config.token);
    }
  }, [config]);

  const handleSave = async () => {
    const trimmedUrl = gatewayUrl.trim();
    const trimmedToken = gatewayToken.trim();

    if (!trimmedUrl || !trimmedToken) {
      Alert.alert('Error', 'Please enter both gateway URL and token.');
      return;
    }

    // Validate URL format
    try {
      new URL(trimmedUrl);
    } catch {
      Alert.alert('Error', 'Please enter a valid gateway URL (e.g., https://gateway.example.com).');
      return;
    }

    try {
      setIsSaving(true);
      await updateConfig({
        url: trimmedUrl,
        token: trimmedToken,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Gateway settings saved successfully!');
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!config?.url || !config?.token) {
      Alert.alert('Error', 'Please save your settings first.');
      return;
    }

    try {
      setIsTesting(true);
      await checkStatus();
      
      if (isConnected) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Connected to gateway successfully!');
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Connection Failed', connectionError || 'Unable to connect to gateway.');
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all saved settings and session data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearStorage();
              setGatewayUrl('');
              setGatewayToken('');
              
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Success', 'All data cleared successfully!');
            } catch (error) {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleClose = () => {
    router.back();
  };

  const hasUnsavedChanges = 
    gatewayUrl.trim() !== (config?.url || '') || 
    gatewayToken.trim() !== (config?.token || '');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            {/* Gateway Configuration */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gateway Configuration</Text>
              
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Gateway URL</Text>
                <TextInput
                  style={styles.textInput}
                  value={gatewayUrl}
                  onChangeText={setGatewayUrl}
                  placeholder="https://gateway.example.com"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  returnKeyType="next"
                />
                <Text style={styles.fieldHint}>
                  The base URL of your OpenClaw Gateway
                </Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Gateway Token</Text>
                <TextInput
                  style={styles.textInput}
                  value={gatewayToken}
                  onChangeText={setGatewayToken}
                  placeholder="your-gateway-token"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  returnKeyType="done"
                />
                <Text style={styles.fieldHint}>
                  Your authentication token for the gateway
                </Text>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.primaryButton,
                    (!hasUnsavedChanges || isSaving) && styles.buttonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={!hasUnsavedChanges || isSaving}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.buttonText,
                    styles.primaryButtonText,
                    (!hasUnsavedChanges || isSaving) && styles.buttonTextDisabled,
                  ]}>
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.secondaryButton,
                    (!config?.url || !config?.token || isTesting) && styles.buttonDisabled,
                  ]}
                  onPress={handleTestConnection}
                  disabled={!config?.url || !config?.token || isTesting}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.buttonText,
                    styles.secondaryButtonText,
                    (!config?.url || !config?.token || isTesting) && styles.buttonTextDisabled,
                  ]}>
                    {isTesting ? 'Testing...' : 'Test Connection'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Connection Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Connection Status</Text>
              
              <View style={styles.statusCard}>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Status:</Text>
                  <View style={styles.statusIndicator}>
                    <Text style={[
                      styles.statusDot,
                      { color: isConnected ? Colors.success : Colors.danger }
                    ]}>●</Text>
                    <Text style={[
                      styles.statusText,
                      { color: isConnected ? Colors.success : Colors.danger }
                    ]}>
                      {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
                    </Text>
                  </View>
                </View>

                {status?.version && (
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Version:</Text>
                    <Text style={styles.statusValue}>{status.version}</Text>
                  </View>
                )}

                {status?.uptime && (
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Uptime:</Text>
                    <Text style={styles.statusValue}>
                      {Math.floor(status.uptime / 3600)}h {Math.floor((status.uptime % 3600) / 60)}m
                    </Text>
                  </View>
                )}

                {connectionError && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{connectionError}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Danger Zone */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Danger Zone</Text>
              
              <TouchableOpacity
                style={[styles.button, styles.dangerButton]}
                onPress={handleClearData}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, styles.dangerButtonText]}>
                  Clear All Data
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.dangerHint}>
                This will remove all settings and cached data
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  textInput: {
    backgroundColor: Colors.bgTertiary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  fieldHint: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.accent,
  },
  secondaryButton: {
    backgroundColor: Colors.bgTertiary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dangerButton: {
    backgroundColor: Colors.danger,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: Colors.textPrimary,
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
  },
  dangerButtonText: {
    color: Colors.textPrimary,
  },
  buttonTextDisabled: {
    color: Colors.textMuted,
  },
  statusCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    fontSize: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'monospace',
  },
  errorContainer: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 4,
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    fontFamily: 'monospace',
  },
  dangerHint: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});