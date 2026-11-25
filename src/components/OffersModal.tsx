import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gift, X, Check } from 'lucide-react-native';

interface OffersModalProps {
  onClose: () => void;
}

const MONO_FONT = 'Roboto';

const COUPONS = [
  {
    id: 'c1',
    code: 'AOLONEW',
    title: 'Flat 20% Off',
    desc: 'Valid on your first 3 rides in Patna & Saharsa',
    expiry: 'Expires in 7 days',
  },
  {
    id: 'c2',
    code: 'RENTAL50',
    title: 'Save ₹150',
    desc: 'Applicable on rentals of 4 hours or more',
    expiry: 'Expires in 30 days',
  },
  {
    id: 'c3',
    code: 'AIRPORT10',
    title: 'Airport Express 10% Off',
    desc: 'Valid on all Patna Airport transfer cab bookings',
    expiry: 'Expires in 15 days',
  },
];

export default function OffersModal({ onClose }: OffersModalProps) {
  const insets = useSafeAreaInsets();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <View style={styles.overlay}>
      {/* Dimmed Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Centered Modal Card */}
      <View style={[styles.card, { paddingBottom: Math.max(insets.bottom, 16) + 6 }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <Gift size={22} color="#84CC16" strokeWidth={2.2} />
            </View>
            <View style={styles.titleCol}>
              <Text style={styles.headerTitle}>OFFERS & COUPONS</Text>
              <Text style={styles.headerSubtitle}>SAVE BIG ON EVERY RIDE</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <X size={18} color="#94A3B8" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Coupon Cards */}
        <ScrollView
          style={styles.cardsScroll}
          contentContainerStyle={styles.cardsScrollContent}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled
        >
          {COUPONS.map((coupon) => {
            const isCopied = copiedCode === coupon.code;
            return (
              <View key={coupon.id} style={styles.couponCard}>
                <Text style={styles.couponTitle}>{coupon.title}</Text>
                <Text style={styles.couponDesc}>{coupon.desc}</Text>

                {/* Dashed Coupon Code Box */}
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>{coupon.code}</Text>

                  <TouchableOpacity
                    style={[styles.copyBtn, isCopied && styles.copiedBtn]}
                    onPress={() => handleCopy(coupon.code)}
                    activeOpacity={0.85}
                  >
                    {isCopied && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                    <Text style={styles.copyBtnText}>
                      {isCopied ? 'COPIED' : 'COPY'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Expiry Subtext */}
                <Text style={styles.expiryText}>{coupon.expiry}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '82%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCol: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A9184',
    fontFamily: 'Roboto',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  cardsScroll: {
    flexGrow: 0,
  },
  cardsScrollContent: {
    gap: 14,
    paddingBottom: 8,
  },
  couponCard: {
    backgroundColor: '#F8FAF8',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
  },
  couponTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
  },
  couponDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'Roboto',
    marginTop: 4,
    lineHeight: 17,
  },
  codeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#84CC16',
    fontFamily: MONO_FONT,
    letterSpacing: 0.8,
  },
  copyBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  copiedBtn: {
    backgroundColor: '#059669',
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  expiryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8A9184',
    fontFamily: MONO_FONT,
    textAlign: 'right',
    marginTop: 8,
    letterSpacing: 0.3,
  },
});
