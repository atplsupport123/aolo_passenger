import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Users, X, Copy, Check } from 'lucide-react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface ReferralModalProps {
  onClose: () => void;
  referralCode?: string;
}

function GiftBoxGraphic({ size = 44 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Box bottom shadow / base */}
      <Rect x="9" y="19" width="30" height="23" rx="4" fill="#FBBF24" />
      {/* Box depth accent */}
      <Rect x="9" y="19" width="30" height="4" fill="#F59E0B" />
      {/* Box lid */}
      <Rect x="7" y="14" width="34" height="7" rx="3.5" fill="#FCD34D" />
      {/* Vertical Ribbon */}
      <Rect x="21" y="14" width="6" height="28" fill="#EF4444" />
      {/* Bow Left Loop */}
      <Path
        d="M24 14C19 8 11 8 13 13C14 15.5 19.5 14.5 24 14Z"
        fill="#EF4444"
      />
      {/* Bow Right Loop */}
      <Path
        d="M24 14C29 8 37 8 35 13C34 15.5 28.5 14.5 24 14Z"
        fill="#DC2626"
      />
      {/* Bow Center Knot */}
      <Circle cx="24" cy="14" r="3" fill="#B91C1C" />
    </Svg>
  );
}

export default function ReferralModal({ onClose, referralCode = 'AOLO_SAURABH729' }: ReferralModalProps) {
  const [copied, setCopied] = useState(false);
  const insets = useSafeAreaInsets();

  const handleCopyCode = async () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(referralCode);
      }
    } catch {
      // fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <Users size={20} color="#5BB824" strokeWidth={2.2} />
            </View>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>REFER & EARN</Text>
              <Text style={styles.headerSubtitle}>EARN RIDE CREDITS</Text>
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
          {/* 3D Gift Icon Badge */}
          <View style={styles.giftCircle}>
            <GiftBoxGraphic size={46} />
          </View>

          {/* Heading */}
          <Text style={styles.heroTitle}>GET ₹100 FREE RIDE CREDIT</Text>

          {/* Description */}
          <Text style={styles.heroDescription}>
            Share your unique referral code with your friends. Once they finish their first ride, both of you get ₹100 credited to your AOLO wallet instantly!
          </Text>

          {/* Referral Code Box */}
          <View style={styles.codeContainer}>
            <View style={styles.codeLeft}>
              <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
              <Text style={styles.codeText}>{referralCode}</Text>
            </View>

            <TouchableOpacity
              style={[styles.copyBtn, copied && styles.copyBtnSuccess]}
              onPress={handleCopyCode}
              activeOpacity={0.85}
            >
              {copied ? (
                <Check size={14} color="#4ADE80" strokeWidth={2.5} />
              ) : (
                <Copy size={14} color="#FFFFFF" strokeWidth={2.2} />
              )}
              <Text style={styles.copyBtnText}>{copied ? 'COPIED' : 'COPY CODE'}</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 22,
    paddingTop: 24,
    alignItems: 'center',
  },
  giftCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F3F8EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: 'Roboto',
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'Roboto',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  codeContainer: {
    width: '100%',
    backgroundColor: '#F3F7F1',
    borderWidth: 1,
    borderColor: '#E2ECE0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codeLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A9184',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#5BB824',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
  copyBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  copyBtnSuccess: {
    backgroundColor: '#1E293B',
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
});
