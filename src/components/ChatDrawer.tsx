import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Send } from 'lucide-react-native';
import { brandColors, spacing, borderRadius } from '../theme';
import { ChatMessage, Driver } from '../types';

export interface ChatDrawerProps {
  driver?: Driver | null;
  messages?: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
}

export default function ChatDrawer({
  driver = null,
  messages = [],
  onSendMessage,
  onClose,
}: ChatDrawerProps) {
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Smooth auto-scroll to bottom when messages list updates
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 60);

    return () => clearTimeout(timer);
  }, [messages.length]);

  const handleSend = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputText('');
  }, [inputText, onSendMessage]);

  const driverDisplayName = driver?.name || 'Captain';
  const carDetails = driver?.carModel && driver?.carPlate
    ? `${driver.carModel} • ${driver.carPlate}`
    : 'Assigned Cab';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.driverName} numberOfLines={1}>
              {driverDisplayName}
            </Text>
            <Text style={styles.carText} numberOfLines={1}>
              {carDetails}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Close chat"
          >
            <X size={20} color={brandColors.aoloWhite} />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesScrollView}
          contentContainerStyle={styles.messagesContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => {
            const isPassenger = msg.sender === 'passenger';
            return (
              <View
                key={msg.id || `msg-${index}`}
                style={[
                  styles.messageBubble,
                  isPassenger ? styles.passengerBubble : styles.driverBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isPassenger ? styles.passengerText : styles.driverText,
                  ]}
                >
                  {msg.text}
                </Text>
                <Text style={styles.timestampText}>{msg.timestamp}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type message to captain..."
            placeholderTextColor={brandColors.aoloGray}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            enablesReturnKeyAutomatically
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              !inputText.trim() && styles.sendBtnDisabled,
            ]}
            onPress={handleSend}
            activeOpacity={0.8}
            disabled={!inputText.trim()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Send
              size={18}
              color={inputText.trim() ? brandColors.aoloBlack : brandColors.aoloGray}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandColors.aoloBlack,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesScrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.px_4,
    paddingVertical: spacing.px_3,
    backgroundColor: brandColors.aoloCharcoal,
    borderBottomWidth: 1,
    borderColor: brandColors.aoloBorderDark,
  },
  headerInfo: {
    flex: 1,
    marginRight: spacing.px_2,
  },
  driverName: {
    color: brandColors.aoloWhite,
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  carText: {
    color: brandColors.aoloGray,
    fontSize: 12,
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  closeBtn: {
    padding: spacing.px_2,
  },
  messagesContainer: {
    paddingHorizontal: spacing.px_4,
    paddingVertical: spacing.px_3,
    gap: spacing.px_3,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: borderRadius.lg,
    padding: spacing.px_3,
  },
  passengerBubble: {
    alignSelf: 'flex-end',
    backgroundColor: brandColors.aoloGreen,
    borderBottomRightRadius: 4,
  },
  driverBubble: {
    alignSelf: 'flex-start',
    backgroundColor: brandColors.aoloCharcoal,
    borderWidth: 1,
    borderColor: brandColors.aoloBorderDark,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    lineHeight: 20,
  },
  passengerText: {
    color: brandColors.aoloBlack,
    fontFamily: 'Roboto',
  },
  driverText: {
    color: brandColors.aoloWhite,
  },
  timestampText: {
    fontSize: 10,
    fontFamily: 'Roboto',
    color: brandColors.aoloGray,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.px_3,
    paddingVertical: spacing.px_2,
    backgroundColor: brandColors.aoloCharcoal,
    borderTopWidth: 1,
    borderColor: brandColors.aoloBorderDark,
    gap: spacing.px_2,
  },
  input: {
    flex: 1,
    minHeight: 44,
    backgroundColor: brandColors.aoloBlack,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: brandColors.aoloBorderDark,
    paddingHorizontal: spacing.px_3,
    color: brandColors.aoloWhite,
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: brandColors.aoloGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: brandColors.aoloBorderDark,
  },
});
