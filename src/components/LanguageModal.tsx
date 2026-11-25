import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { useLanguageStore } from '../store/useLanguageStore';
import { LanguageCode } from '../i18n/translations';

interface LanguageModalProps {
  onClose: () => void;
  currentLanguage?: string;
  onSelectLanguage?: (langCode: string) => void;
}

interface LanguageOption {
  id: LanguageCode;
  label: string;
  sub: string;
}

const LANGUAGES: LanguageOption[] = [
  { id: 'en', label: 'English', sub: 'Default' },
  { id: 'hi', label: 'हिन्दी (Hindi)', sub: 'भारतीय भाषा' },
];

export default function LanguageModal({
  onClose,
  onSelectLanguage,
}: LanguageModalProps) {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useLanguageStore();

  const handleSelect = async (id: LanguageCode) => {
    await setLanguage(id);
    if (onSelectLanguage) {
      onSelectLanguage(id);
    }
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
      <View style={[styles.card, { paddingBottom: Math.max(insets.bottom, 20) + 16 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('changeLanguage', 'CHANGE LANGUAGE').toUpperCase()}</Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <X size={18} color="#71717A" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Select your preferred language interface below:</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Languages List */}
        <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
          <View style={styles.languagesContainer}>
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.id;
              return (
                <TouchableOpacity
                  key={lang.id}
                  style={[
                    styles.langItem,
                    isSelected ? styles.langItemSelected : styles.langItemUnselected,
                  ]}
                  onPress={() => handleSelect(lang.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.langTextCol}>
                    <Text
                      style={[
                        styles.langLabel,
                        isSelected ? styles.langLabelSelected : styles.langLabelUnselected,
                      ]}
                    >
                      {lang.label}
                    </Text>
                    <Text style={styles.langSub}>{lang.sub}</Text>
                  </View>

                  {isSelected ? (
                    <View style={styles.selectedBadge}>
                      <Check size={12} color="#0A0A0A" strokeWidth={3} />
                      <Text style={styles.selectedBadgeText}>SELECTED</Text>
                    </View>
                  ) : (
                    <View style={styles.unselectedRadio} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Done / Apply Button */}
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={onClose}
          activeOpacity={0.85}
        >
          <Text style={styles.doneBtnText}>{t('done', 'DONE')}</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 22,
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
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
  },
  subtitle: {
    fontSize: 13,
    color: '#71717A',
    fontFamily: 'Roboto',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
    marginBottom: 18,
  },
  languagesContainer: {
    gap: 12,
  },
  langItem: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  langItemUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langItemSelected: {
    backgroundColor: '#F4FBE4',
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  langLabel: {
    fontSize: 14.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  langLabelUnselected: {
    color: '#0F172A',
  },
  langLabelSelected: {
    color: '#0F172A',
  },
  selectedBadge: {
    backgroundColor: '#A8E63C',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0A0A0A',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
  },
  scrollList: {
    maxHeight: 340,
    marginBottom: 16,
  },
  langTextCol: {
    justifyContent: 'center',
  },
  langSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  unselectedRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  doneBtn: {
    backgroundColor: '#0F172A',
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    letterSpacing: 0.8,
  },
});
