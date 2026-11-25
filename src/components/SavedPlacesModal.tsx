import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, X } from 'lucide-react-native';

interface SavedPlacesModalProps {
  onClose: () => void;
  onSelectPlace?: (name: string, addr: string) => void;
}

interface SavedPlaceItem {
  id: string;
  emoji: string;
  name: string;
  address: string;
}

const DEFAULT_SAVED_PLACES: SavedPlaceItem[] = [
  {
    id: 'sp_1',
    emoji: '🏠',
    name: 'Home',
    address: 'Ward No. 15, Stadium Road, Saharsa, Bihar',
  },
  {
    id: 'sp_2',
    emoji: '💼',
    name: 'Work',
    address: 'IT Park Tower B, Exhibition Road, Patna, Bihar',
  },
  {
    id: 'sp_3',
    emoji: '⭐',
    name: 'Favorite Gym',
    address: 'FitPro Fitness Center, Bypass Crossing, Saharsa',
  },
];

export default function SavedPlacesModal({ onClose, onSelectPlace }: SavedPlacesModalProps) {
  const [places, setPlaces] = useState<SavedPlaceItem[]>(DEFAULT_SAVED_PLACES);
  const insets = useSafeAreaInsets();

  const handleUsePlace = (place: SavedPlaceItem) => {
    if (onSelectPlace) {
      onSelectPlace(place.name, place.address);
    }
    onClose();
  };

  const handleAddNewLocation = () => {
    Alert.prompt
      ? Alert.prompt(
          'Add New Saved Place',
          'Enter place name and address:',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Save',
              onPress: (text?: string) => {
                if (text && text.trim()) {
                  const newPlace: SavedPlaceItem = {
                    id: `sp_${Date.now()}`,
                    emoji: '📍',
                    name: text.trim(),
                    address: 'Saved Custom Location, Bihar',
                  };
                  setPlaces((prev) => [...prev, newPlace]);
                }
              },
            },
          ],
          'plain-text'
        )
      : Alert.alert('Add New Location', 'Enter destination on map to save it to favorites.', [
          { text: 'OK' },
        ]);
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
              <MapPin size={20} color="#5BB824" strokeWidth={2.2} />
            </View>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>SAVED PLACES</Text>
              <Text style={styles.headerSubtitle}>HOME, WORK & FAVORITES</Text>
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
          {places.map((place) => (
            <View key={place.id} style={styles.placeCard}>
              <View style={styles.placeInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.placeEmoji}>{place.emoji}</Text>
                  <Text style={styles.placeName}>{place.name}</Text>
                </View>
                <Text style={styles.placeAddress} numberOfLines={2}>
                  {place.address}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.useBtn}
                onPress={() => handleUsePlace(place)}
                activeOpacity={0.8}
              >
                <Text style={styles.useBtnText}>USE</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Add New Location (Dashed border) */}
          <TouchableOpacity
            style={styles.addLocationBtn}
            onPress={handleAddNewLocation}
            activeOpacity={0.75}
          >
            <Text style={styles.addLocationText}>+ ADD NEW LOCATION</Text>
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
    paddingBottom: 12,
  },
  placeCard: {
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
    gap: 12,
  },
  placeInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  placeEmoji: {
    fontSize: 14,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
    letterSpacing: 0.2,
  },
  placeAddress: {
    fontSize: 12,
    color: '#8A9184',
    fontFamily: 'Roboto',
    lineHeight: 17,
  },
  useBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECE0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  useBtnText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
  addLocationBtn: {
    borderWidth: 1.5,
    borderColor: '#D4DDD2',
    borderStyle: 'dashed',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  addLocationText: {
    color: '#8A9184',
    fontSize: 11.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 0.8,
  },
});
