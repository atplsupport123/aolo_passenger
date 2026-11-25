import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, X } from 'lucide-react-native';

interface WhatsNewModalProps {
  onClose: () => void;
}

interface ReleaseItem {
  id: string;
  version: string;
  date: string;
  emoji: string;
  title: string;
  description: string;
}

const RELEASES: ReleaseItem[] = [
  {
    id: 'rel_1',
    version: 'v1.2.5',
    date: 'July 2026',
    emoji: '🚀',
    title: 'First-Time Onboarding Experience',
    description:
      'Added seamless onboarding flow, animated logo welcome slides, and persistent splash launch engines.',
  },
  {
    id: 'rel_2',
    version: 'v1.2.0',
    date: 'June 2026',
    emoji: '💎',
    title: 'Corporate sandboxes & SafetySOS',
    description:
      'Introduced advanced safety center SOS buttons, saved location templates, and favorite driver portals.',
  },
  {
    id: 'rel_3',
    version: 'v1.1.2',
    date: 'May 2026',
    emoji: '💸',
    title: 'One-Click Demo Login',
    description:
      'Allows testing entire passenger experience seamlessly with sandbox credentials and wallet preloads.',
  },
  {
    id: 'rel_4',
    version: 'v1.0.0',
    date: 'April 2026',
    emoji: '✨',
    title: 'AOLO Cabs Initial Launch',
    description:
      'Launch of one-way, round trip, airport, and rental cab booking engine with live map tracking.',
  },
];

export default function WhatsNewModal({ onClose }: WhatsNewModalProps) {
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
      <View style={[styles.card, { paddingBottom: Math.max(insets.bottom, 20) + 8 }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <Bell size={20} color="#5BB824" strokeWidth={2.2} />
            </View>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>{"WHAT'S NEW"}</Text>
              <Text style={styles.headerSubtitle}>LATEST SANDBOX RELEASES</Text>
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

        {/* Scrollable Release List */}
        <ScrollView
          style={styles.scrollList}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {RELEASES.map((item, index) => (
            <View key={item.id} style={styles.releaseItem}>
              {/* Version & Date Row */}
              <View style={styles.versionRow}>
                <View style={styles.versionBadge}>
                  <Text style={styles.versionText}>{item.version}</Text>
                </View>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>

              {/* Title with emoji */}
              <Text style={styles.itemTitle}>
                {item.emoji} {item.title}
              </Text>

              {/* Description */}
              <Text style={styles.itemDesc}>{item.description}</Text>

              {/* Separator between items except last */}
              {index < RELEASES.length - 1 && <View style={styles.itemSeparator} />}
            </View>
          ))}
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
    maxHeight: '80%',
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
  scrollList: {
    maxHeight: 400,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  releaseItem: {
    marginBottom: 16,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  versionBadge: {
    backgroundColor: '#EDF8E9',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#5BB824',
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A9184',
    fontFamily: 'Roboto',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  itemDesc: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Roboto',
    lineHeight: 18,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginTop: 16,
    width: '100%',
  },
});
