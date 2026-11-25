import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HelpCircle, X } from 'lucide-react-native';

interface SupportModalProps {
  onClose: () => void;
}

export default function SupportModal({ onClose }: SupportModalProps) {
  const insets = useSafeAreaInsets();

  const handleCall = () => {
    Linking.openURL('tel:18001027000').catch(() => {
      Alert.alert('Call Support', 'Calling +91 1800 102 7000...');
    });
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@aolo-cabs.com').catch(() => {
      Alert.alert('Email Support', 'Opening mail to support@aolo-cabs.com...');
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
              <HelpCircle size={22} color="#0F172A" strokeWidth={2.2} />
            </View>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>AOLO SUPPORT</Text>
              <Text style={styles.headerSubtitle}>WE ARE HERE TO HELP YOU 24/7</Text>
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
        <View style={styles.body}>
          {/* Helpline Card */}
          <TouchableOpacity
            style={styles.supportCard}
            onPress={handleCall}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardIcon}>📞</Text>
              <Text style={styles.cardTitle}>Helpline Call Center</Text>
            </View>
            <Text style={styles.phoneText}>+91 1800 102 7000</Text>
          </TouchableOpacity>

          {/* Email Support Card */}
          <TouchableOpacity
            style={styles.supportCard}
            onPress={handleEmail}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardIcon}>✉️</Text>
              <Text style={styles.cardTitle}>Email Support</Text>
            </View>
            <Text style={styles.emailText}>support@aolo-cabs.com</Text>
          </TouchableOpacity>

          {/* Close CTA Button */}
          <TouchableOpacity
            style={styles.closeCtaBtn}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.closeCtaText}>CLOSE</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#EDF8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A9184',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  supportCard: {
    backgroundColor: '#F4F8F2',
    borderWidth: 1,
    borderColor: '#E2ECE0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  cardIcon: {
    fontSize: 14,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
    letterSpacing: 0.2,
  },
  phoneText: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#5BB824',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
  emailText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#64748B',
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
  },
  closeCtaBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#A8E63C',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 8,
    shadowColor: '#A8E63C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  closeCtaText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
  },
});
