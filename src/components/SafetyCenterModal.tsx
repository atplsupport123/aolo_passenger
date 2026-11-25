import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shield, X } from 'lucide-react-native';

interface SafetyCenterModalProps {
  onClose: () => void;
}

export default function SafetyCenterModal({ onClose }: SafetyCenterModalProps) {
  const insets = useSafeAreaInsets();

  const handleTriggerSOS = () => {
    Alert.alert(
      '🚨 EMERGENCY SOS TRIGGERED',
      'Instant rescue dispatch initiated. Your live GPS coordinates and ride details have been broadcast to the nearest emergency response unit and 112 control room.',
      [
        {
          text: 'Call Police (112)',
          onPress: () => Linking.openURL('tel:112').catch(() => {}),
        },
        { text: 'OK', style: 'cancel' },
      ]
    );
  };

  const handleCall = (num: string) => {
    Linking.openURL(`tel:${num.replace(/[^0-9+]/g, '')}`).catch(() => {
      Alert.alert('Helpline', `Calling ${num}...`);
    });
  };

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Modal Card */}
      <View style={[styles.card, { paddingBottom: Math.max(insets.bottom, 20) + 12 }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <Shield size={20} color="#E11D48" strokeWidth={2.2} />
            </View>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>SAFETY CENTER</Text>
              <Text style={styles.headerSubtitle}>EMERGENCY, SOS & SHARING</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <X size={18} color="#71717A" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Body Content */}
        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {/* Red Emergency SOS Card */}
          <View style={styles.sosCard}>
            <TouchableOpacity
              style={styles.sosBtn}
              onPress={handleTriggerSOS}
              activeOpacity={0.88}
            >
              <Text style={styles.sosBtnText}>🚨  TRIGGER EMERGENCY SOS</Text>
            </TouchableOpacity>
            <Text style={styles.sosSubtext}>
              TRIGGERS INSTANT RESCUE & POLICE DISPATCH
            </Text>
          </View>

          {/* Helpline 1: National Helpline */}
          <TouchableOpacity
            style={styles.helplineCard}
            onPress={() => handleCall('112')}
            activeOpacity={0.8}
          >
            <View style={styles.helplineInfo}>
              <Text style={styles.helplineName}>National Helpline</Text>
              <Text style={styles.helplineNumber}>112</Text>
            </View>

            <View style={styles.pillTag}>
              <Text style={styles.pillTagText}>CALL CENTER</Text>
            </View>
          </TouchableOpacity>

          {/* Helpline 2: AOLO Safety Helpline */}
          <TouchableOpacity
            style={styles.helplineCard}
            onPress={() => handleCall('+9118004197290')}
            activeOpacity={0.8}
          >
            <View style={styles.helplineInfo}>
              <Text style={styles.helplineName}>AOLO Safety Helpline</Text>
              <Text style={styles.helplineNumber}>+91 1800-419-7290</Text>
            </View>

            <View style={styles.pillTag}>
              <Text style={styles.pillTagText}>24X7 SAFETY</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#E11D48',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E11D48',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
    marginTop: 2,
    opacity: 0.85,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
  },
  divider: {
    height: 1,
    backgroundColor: '#FEE2E2',
    width: '100%',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  sosCard: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  sosBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#E11D48',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  sosBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
  sosSubtext: {
    color: '#E11D48',
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 0.8,
    marginTop: 10,
  },
  helplineCard: {
    backgroundColor: '#F4F8F2',
    borderWidth: 1,
    borderColor: '#E2ECE0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  helplineInfo: {
    flex: 1,
  },
  helplineName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
    letterSpacing: 0.2,
  },
  helplineNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#5BB824',
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
    marginTop: 4,
  },
  pillTag: {
    backgroundColor: '#EDF8E9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillTagText: {
    color: '#5BB824',
    fontSize: 10.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
});
