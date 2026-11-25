import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShieldCheck, X } from 'lucide-react-native';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export default function PrivacyPolicyModal({ onClose }: PrivacyPolicyModalProps) {
  const insets = useSafeAreaInsets();

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
              <ShieldCheck size={22} color="#0F172A" strokeWidth={2.2} />
            </View>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>PRIVACY POLICY</Text>
              <Text style={styles.headerSubtitle}>YOUR PRIVACY IS SECURE</Text>
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
          {/* Section 1 */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>1. DATA COLLECTION</Text>
            <Text style={styles.sectionParagraph}>
              We process active location metrics solely to coordinate your cabs, simulate actual live rides, and compute accurate travel routes.
            </Text>
          </View>

          {/* Section 2 */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>2. PAYMENT VAULT</Text>
            <Text style={styles.sectionParagraph}>
              All virtual wallet amounts, cards, and recharges are held locally in your secure sandbox database.
            </Text>
          </View>

          {/* Section 3 */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>3. NO MARKETING SPAM</Text>
            <Text style={styles.sectionParagraph}>
              We do not forward or monetize your name, telephone number, or email records with unauthorized brokers.
            </Text>
          </View>

          {/* Got It Button */}
          <TouchableOpacity
            style={styles.gotItBtn}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.gotItBtnText}>GOT IT</Text>
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
  sectionBlock: {
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  sectionParagraph: {
    fontSize: 12.5,
    color: '#64748B',
    fontFamily: 'Roboto',
    lineHeight: 18,
  },
  gotItBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#A8E63C',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 8,
    shadowColor: '#A8E63C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  gotItBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
  },
});
