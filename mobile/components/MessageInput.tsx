import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<boolean>;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type a message..." 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled || isSending) return;

    try {
      setIsSending(true);
      
      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const success = await onSendMessage(trimmedMessage);
      if (success) {
        setMessage('');
        // Success haptic
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        // Error haptic
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', 'Failed to send message. Please try again.');
      }
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsSending(false);
    }
  };

  const canSend = message.trim().length > 0 && !disabled && !isSending;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.textInput, disabled && styles.textInputDisabled]}
          value={message}
          onChangeText={setMessage}
          placeholder={disabled ? 'Not connected...' : placeholder}
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={4000}
          editable={!disabled && !isSending}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            canSend && styles.sendButtonActive,
            !canSend && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.sendButtonText,
            canSend && styles.sendButtonTextActive,
          ]}>
            {isSending ? '...' : '➤'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Character count */}
      {message.length > 3500 && (
        <Text style={styles.characterCount}>
          {message.length}/4000
        </Text>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.bgTertiary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.textPrimary,
    fontSize: 16,
    maxHeight: 120,
    minHeight: 44,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textInputDisabled: {
    backgroundColor: Colors.bgPrimary,
    color: Colors.textMuted,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgTertiary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.bgTertiary,
    borderColor: Colors.border,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  sendButtonTextActive: {
    color: Colors.textPrimary,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'right',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});