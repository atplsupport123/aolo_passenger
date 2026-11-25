import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  Platform,
  BackHandler,
  StatusBar as RNStatusBar,
  Modal,
  TextInput,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { brandColors } from '../theme';
import { useLanguageStore } from '../store/useLanguageStore';

const TAB_BAR_H = Platform.OS === 'ios' ? 78 : 64;
const MONO_FONT = 'Roboto';

// Named constants for header background cover image & overlay opacity
const DEFAULT_HEADER_COVER_IMAGE = 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop';
const HEADER_OVERLAY_OPACITY = 0.65;
const COVER_IMAGE_STORAGE_KEY = '@aolo_drawer_cover_image';

// Curated luxury presets for instant customization
const COVER_PRESETS = [
  {
    id: 'supercar',
    title: 'Supercar',
    url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'cybercity',
    title: 'Cyber City',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'phantom',
    title: 'Phantom',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'highway',
    title: 'Night Road',
    url: 'https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'carbon',
    title: 'Minimalist',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
  },
];

import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Check,
  RefreshCw,
  X,
  Wallet,
  Calendar,
  Compass,
  Tag,
  Share2,
  Briefcase,
  Bookmark,
  Clock,
  Heart,
  ShieldCheck,
  Sparkles,
  Headphones,
  Lock,
  FileText,
  Settings,
  Globe,
  LogOut,
  ChevronRight,
  Package,
  LucideIcon,
} from 'lucide-react-native';
import { UserProfile } from '../types';

export interface SidebarDrawerProps {
  userProfile: UserProfile | null;
  currentRideType?: string;
  coverImage?: ImageSourcePropType | string;
  onChangeCoverImage?: (newImageUri: string) => void;
  onClose: () => void;
  onOpenHistory: () => void;
  onOpenParcel?: () => void;
  onOpenWallet: () => void;
  onOpenProfile: () => void;
  onOpenCorporate: () => void;
  onLogout: () => void;
  onOpenRoadTrips?: () => void;
  onOpenOffers?: () => void;
  onOpenReferral?: () => void;
  onOpenSavedPlaces?: () => void;
  onOpenSchedule?: () => void;
  onOpenFavourites?: () => void;
  onOpenSafety?: () => void;
  onOpenUpdates?: () => void;
  onOpenSupport?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenLanguage?: () => void;
  onOpenPolicies?: () => void;
  onOpenSheet?: (sheet: any) => void;
}

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  route?: string;
  badge?: string;
  tone?: 'normal' | 'safety' | 'danger';
  section?: string;
  onPress: () => void;
}

function MenuRow({ item }: { item: MenuItem }) {
  const Icon = item.icon;
  const isSafety = item.tone === 'safety';
  const isDanger = item.tone === 'danger';

  return (
    <TouchableOpacity
      style={[
        styles.menuRow,
        isSafety && styles.safetyRow,
        isDanger && styles.dangerRow,
      ]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconTile,
          isSafety && styles.safetyIconTile,
          isDanger && styles.dangerIconTile,
        ]}
      >
        <Icon
          size={20}
          color={isDanger ? '#FFFFFF' : isSafety ? '#15803D' : '#475569'}
          strokeWidth={2}
        />
      </View>

      <View style={styles.textCol}>
        <Text style={[styles.itemTitle, isDanger && styles.dangerText]}>
          {item.title}
        </Text>
        {item.subtitle ? (
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        ) : null}
      </View>

      {item.badge ? (
        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      ) : (
        <ChevronRight size={18} color={isDanger ? '#FFFFFF' : '#8A9184'} />
      )}
    </TouchableOpacity>
  );
}

export default function SidebarDrawer({
  userProfile,
  currentRideType = 'RENTAL',
  coverImage = DEFAULT_HEADER_COVER_IMAGE,
  onChangeCoverImage,
  onClose,
  onOpenHistory,
  onOpenParcel,
  onOpenWallet,
  onOpenProfile,
  onOpenCorporate,
  onLogout,
  onOpenRoadTrips,
  onOpenOffers,
  onOpenReferral,
  onOpenSavedPlaces,
  onOpenSchedule,
  onOpenFavourites,
  onOpenSafety,
  onOpenUpdates,
  onOpenSupport,
  onOpenPrivacy,
  onOpenTerms,
  onOpenLanguage,
  onOpenPolicies,
}: SidebarDrawerProps) {
  const { top } = useSafeAreaInsets();
  const topPad = Platform.OS === 'ios' ? Math.max(top, 8) : 8;
  const slideAnim = useRef(new Animated.Value(-320)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentCover, setCurrentCover] = useState<ImageSourcePropType | string>(coverImage);
  const [imageError, setImageError] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Load custom cover image from persistent storage on mount
  useEffect(() => {
    AsyncStorage.getItem(COVER_IMAGE_STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          setCurrentCover(stored);
          setImageError(false);
        }
      })
      .catch(() => {});
  }, []);

  const handleApplyCover = async (uri: string) => {
    setCurrentCover(uri);
    setImageError(false);
    setShowCoverModal(false);
    try {
      await AsyncStorage.setItem(COVER_IMAGE_STORAGE_KEY, uri);
      onChangeCoverImage?.(uri);
    } catch {
      // Ignore storage error
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Needed', 'Please allow gallery access to choose a cover image.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        await handleApplyCover(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Could not open image picker.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Needed', 'Please allow camera access to take a photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.85,
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        await handleApplyCover(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Could not open camera.');
    }
  };

  const handleResetCover = async () => {
    setCurrentCover(DEFAULT_HEADER_COVER_IMAGE);
    setImageError(false);
    setShowCoverModal(false);
    try {
      await AsyncStorage.removeItem(COVER_IMAGE_STORAGE_KEY);
      onChangeCoverImage?.(DEFAULT_HEADER_COVER_IMAGE);
    } catch {
      // Ignore storage error
    }
  };


  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -320,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  }, [slideAnim, fadeAnim, onClose]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    const onBackPress = () => {
      handleClose();
      return true;
    };
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => subscription.remove();
  }, [slideAnim, fadeAnim, handleClose]);

  const { language, t } = useLanguageStore();
  const walletBalanceText = `₹${userProfile?.walletBalance ?? 250}`;

  const handleItemNavigate = (navAction?: () => void) => {
    onClose();
    if (navAction) navAction();
  };

  // ONE clean array of all menu items rendered via a single .map()
  const menuItems: MenuItem[] = [
    {
      id: 'wallet',
      icon: Wallet,
      title: t('myWallet', 'Wallet'),
      route: 'WALLET',
      badge: walletBalanceText,
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(onOpenWallet);
      },
    },
    {
      id: 'rides',
      icon: Calendar,
      title: t('rideHistory', 'My Rides'),
      route: 'HISTORY',
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(onOpenHistory);
      },
    },
    {
      id: 'parcel',
      icon: Package,
      title: 'AOLO Parcel',
      subtitle: 'Send & receive packages within city',
      route: 'PARCEL',
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(onOpenParcel);
      },
    },
    {
      id: 'road_trips',
      icon: Compass,
      title: 'Road Trips For You',
      subtitle: 'Popular intercity routes',
      route: 'ROAD_TRIPS',
      tone: 'normal',
      section: 'FEATURES',
      onPress: () => {
        handleItemNavigate(() => {
          if (onOpenRoadTrips) onOpenRoadTrips();
          else Alert.alert('Road Trips', 'Browse top scenic intercity routes.');
        });
      },
    },
    {
      id: 'offers',
      icon: Tag,
      title: 'Offers & Coupons',
      subtitle: 'Promo codes and discounts',
      route: 'OFFERS',
      badge: 'NEW',
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(() => {
          if (onOpenOffers) onOpenOffers();
          else Alert.alert('Offers', 'Explore current discounts & deals.');
        });
      },
    },
    {
      id: 'refer',
      icon: Share2,
      title: t('referAndEarn', 'Refer & Earn'),
      subtitle: 'Invite friends, get credits',
      route: 'REFERRAL',
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(() => {
          if (onOpenReferral) onOpenReferral();
          else Alert.alert('Refer & Earn', 'Earn ₹100 credit per invite.');
        });
      },
    },
    {
      id: 'corporate',
      icon: Briefcase,
      title: t('corporate', 'Corporate Booking'),
      subtitle: 'For business travel',
      route: 'CORPORATE',
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(onOpenCorporate);
      },
    },
    {
      id: 'saved_places',
      icon: Bookmark,
      title: t('savedPlaces', 'Saved Places'),
      subtitle: 'Home, Work & Favorites',
      route: 'SAVED_PLACES',
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(() => {
          if (onOpenSavedPlaces) onOpenSavedPlaces();
          else Alert.alert('Saved Places', 'Manage your frequent destinations.');
        });
      },
    },
    {
      id: 'schedule',
      icon: Clock,
      title: 'Ride Schedule',
      subtitle: 'Manage scheduled bookings',
      route: 'SCHEDULE',
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(() => {
          if (onOpenSchedule) onOpenSchedule();
          else Alert.alert('Ride Schedule', 'Manage upcoming scheduled rides.');
        });
      },
    },
    {
      id: 'drivers',
      icon: Heart,
      title: 'Favourite Drivers',
      subtitle: 'Preferred driver bookings',
      route: 'FAVOURITES',
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(() => {
          if (onOpenFavourites) onOpenFavourites();
          else Alert.alert('Favourite Drivers', 'Save captains after completing a ride.');
        });
      },
    },
    {
      id: 'safety',
      icon: ShieldCheck,
      title: t('emergencyContacts', 'Safety Center'),
      subtitle: 'SOS, emergency & sharing',
      route: 'SAFETY',
      tone: 'safety',
      onPress: () => {
        handleItemNavigate(() => {
          if (onOpenSafety) onOpenSafety();
          else Alert.alert('AOLO Safety Center', '24x7 SOS emergency helpline and live GPS tracking are active on all rides.');
        });
      },
    },
    {
      id: 'updates',
      icon: Sparkles,
      title: "What's New",
      subtitle: 'App updates & announcements',
      route: 'UPDATES',
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(() => {
          if (onOpenUpdates) onOpenUpdates();
          else Alert.alert("What's New in v1.2.5", 'Check out our latest releases.');
        });
      },
    },
    {
      id: 'support',
      icon: Headphones,
      title: t('support', 'Support'),
      route: 'SUPPORT',
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(() => {
          if (onOpenSupport) onOpenSupport();
          else Alert.alert('AOLO Support', 'Call toll-free: +91 1800 102 7000 or email support@aolo-cabs.com');
        });
      },
    },
    {
      id: 'privacy',
      icon: Lock,
      title: t('privacyPolicy', 'Privacy & Policy'),
      route: 'PRIVACY',
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(() => {
          if (onOpenPrivacy) onOpenPrivacy();
          else Alert.alert('Privacy Policy', 'Your personal data is encrypted & secured.');
        });
      },
    },
    {
      id: 'terms',
      icon: FileText,
      title: t('termsOfService', 'Terms of Service'),
      route: 'TERMS',
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(() => {
          if (onOpenTerms) onOpenTerms();
          else if (onOpenPolicies) onOpenPolicies();
          else Alert.alert('Terms of Service', 'Read our passenger terms and conditions.');
        });
      },
    },
    {
      id: 'profile_settings',
      icon: Settings,
      title: t('myProfile', 'Profile Settings'),
      route: 'PROFILE',
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(onOpenProfile);
      },
    },
    {
      id: 'language',
      icon: Globe,
      title: t('changeLanguage', 'Change Language'),
      route: 'LANGUAGE',
      badge: language.toUpperCase(),
      tone: 'normal',
      onPress: () => {
        handleItemNavigate(onOpenLanguage);
      },
    },
    {
      id: 'logout',
      icon: LogOut,
      title: t('signOut', 'Log out'),
      route: 'LOGOUT',
      tone: 'danger',
      onPress: () => {
        handleClose();
        onLogout();
      },
    },
  ];

  const firstLetter = (userProfile?.name?.charAt(0) || 'P').toUpperCase();

  return (
    <View style={styles.overlay}>
      <StatusBar style="light" />
      {/* Dimmed Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          activeOpacity={1}
        />
      </Animated.View>

        {/* Slide-out Drawer Panel */}
        <Animated.View
          style={[styles.drawerPanel, { transform: [{ translateX: slideAnim }] }]}
        >
          {/* Dark Header with Cover Image & Overlay */}
          <View style={[styles.darkHeader, { paddingTop: topPad }]}>
            {/* Background Cover Image with resizeMode cover and fallback on error */}
            {currentCover && !imageError ? (
              <Image
                source={typeof currentCover === 'string' ? { uri: currentCover } : currentCover}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : null}

            {/* Dark Readability Overlay */}
            {currentCover && !imageError ? (
              <View style={styles.headerDarkOverlay} pointerEvents="none" />
            ) : null}

            {/* Round Back-Arrow Button & Edit Cover Action */}
            <View style={styles.headerLeftGroup}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <ArrowLeft size={18} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changeCoverBtn}
                onPress={() => setShowCoverModal(true)}
                activeOpacity={0.75}
              >
                <Camera size={13} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.changeCoverBtnText}>Cover</Text>
              </TouchableOpacity>
            </View>

            {/* Ride Type Badge & Subtitle (Commented out per client request)
            <View style={styles.headerRightCol}>
              <View style={styles.rideTypeBadge}>
                <Text style={styles.rideTypeBadgeText}>
                  {currentRideType.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.headerSubtitle}>INTERCITY CABS</Text>
            </View>
            */}
          </View>


          {/* Profile Card */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => handleItemNavigate(onOpenProfile)}
            activeOpacity={0.8}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{firstLetter}</Text>
            </View>
            <View style={styles.profileTextWrap}>
              <Text style={styles.profileName} numberOfLines={1}>
                {userProfile?.name || 'Passenger'}
              </Text>
              <Text style={styles.profilePhone} numberOfLines={1}>
                {userProfile?.phone || '+91 98765 43210'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Vertically Scrollable Menu Items */}
          <ScrollView
            style={styles.menuScroll}
            contentContainerStyle={styles.menuScrollContent}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {menuItems.map(item => (
              <React.Fragment key={item.id}>
                {item.section && (
                  <Text style={styles.sectionLabel}>{item.section}</Text>
                )}
                <MenuRow item={item} />
              </React.Fragment>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Change Cover Modal Sheet */}
        <Modal
          visible={showCoverModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCoverModal(false)}
        >
          <TouchableOpacity
            style={styles.coverModalBackdrop}
            activeOpacity={1}
            onPress={() => setShowCoverModal(false)}
          >
            <View style={styles.coverModalSheet} onStartShouldSetResponder={() => true}>
              <View style={styles.coverModalHeader}>
                <View>
                  <Text style={styles.coverModalTitle}>Change Header Cover</Text>
                  <Text style={styles.coverModalSubtitle}>Personalize your drawer header</Text>
                </View>
                <TouchableOpacity
                  style={styles.coverModalCloseBtn}
                  onPress={() => setShowCoverModal(false)}
                >
                  <X size={18} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              {/* Quick Actions: Gallery, Camera & Reset */}
              <View style={styles.coverQuickActionsRow}>
                <TouchableOpacity
                  style={styles.coverQuickBtn}
                  onPress={handlePickFromGallery}
                  activeOpacity={0.8}
                >
                  <View style={[styles.coverQuickIconWrap, { backgroundColor: '#EBF4FF' }]}>
                    <ImageIcon size={20} color="#007AFF" />
                  </View>
                  <Text style={styles.coverQuickBtnText}>Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.coverQuickBtn}
                  onPress={handleTakePhoto}
                  activeOpacity={0.8}
                >
                  <View style={[styles.coverQuickIconWrap, { backgroundColor: '#F0FDF4' }]}>
                    <Camera size={20} color="#16A34A" />
                  </View>
                  <Text style={styles.coverQuickBtnText}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.coverQuickBtn}
                  onPress={handleResetCover}
                  activeOpacity={0.8}
                >
                  <View style={[styles.coverQuickIconWrap, { backgroundColor: '#F3F4F6' }]}>
                    <RefreshCw size={18} color="#6B7280" />
                  </View>
                  <Text style={styles.coverQuickBtnText}>Default</Text>
                </TouchableOpacity>
              </View>

              {/* Presets */}
              <Text style={styles.coverSectionTitle}>Luxury Presets</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.coverPresetsScroll}
              >
                {COVER_PRESETS.map((preset) => {
                  const isSelected =
                    typeof currentCover === 'string' && currentCover === preset.url;
                  return (
                    <TouchableOpacity
                      key={preset.id}
                      style={[
                        styles.coverPresetCard,
                        isSelected && styles.coverPresetCardActive,
                      ]}
                      onPress={() => handleApplyCover(preset.url)}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: preset.url }}
                        style={styles.coverPresetThumb}
                        resizeMode="cover"
                      />
                      {isSelected && (
                        <View style={styles.coverPresetCheckBadge}>
                          <Check size={11} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      )}
                      <Text style={styles.coverPresetName} numberOfLines={1}>
                        {preset.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Custom Web URL Option */}
              <Text style={styles.coverSectionTitle}>Or Image Web URL</Text>
              <View style={styles.coverUrlRow}>
                <TextInput
                  style={styles.coverUrlInput}
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor="#9CA3AF"
                  value={customUrlInput}
                  onChangeText={setCustomUrlInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={[
                    styles.coverUrlApplyBtn,
                    !customUrlInput.trim() && styles.coverUrlApplyBtnDisabled,
                  ]}
                  disabled={!customUrlInput.trim()}
                  onPress={() => {
                    if (customUrlInput.trim()) {
                      handleApplyCover(customUrlInput.trim());
                      setCustomUrlInput('');
                    }
                  }}
                >
                  <Text style={styles.coverUrlApplyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: TAB_BAR_H,
    zIndex: 90,
    elevation: 9,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  drawerPanel: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  darkHeader: {
    backgroundColor: brandColors.aoloDarkBg,
    paddingBottom: 72,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  headerDarkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: brandColors.aoloDarkBg,
    opacity: HEADER_OVERLAY_OPACITY,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#383838',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  changeCoverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    gap: 4,
  },
  changeCoverBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
  },
  headerRightCol: {
    alignItems: 'flex-end',
  },
  rideTypeBadge: {
    backgroundColor: '#A8E63C',
    paddingHorizontal: 13,
    paddingVertical: 4.5,
    borderRadius: 10,
  },
  rideTypeBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
    marginTop: 3,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    gap: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2.2,
    borderColor: '#A8E63C',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#84CC16',
  },
  profileTextWrap: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
  },
  profilePhone: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: MONO_FONT,
    color: '#8A9184',
    marginTop: 2,
  },
  menuScroll: {
    flex: 1,
  },
  menuScrollContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#8A9184',
    letterSpacing: 1.2,
    marginTop: 18,
    marginBottom: 6,
    paddingHorizontal: 6,
    textTransform: 'uppercase',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginVertical: 1,
    gap: 14,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F4F6F2',
    borderWidth: 1,
    borderColor: '#E5E9E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
  },
  itemSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#8A9184',
    marginTop: 2,
  },
  badgePill: {
    backgroundColor: '#A3E635',
    borderWidth: 1,
    borderColor: '#84CC16',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: MONO_FONT,
    color: '#1A2E05',
  },
  safetyRow: {
    backgroundColor: '#F0FDF4',
  },
  safetyIconTile: {
    backgroundColor: '#DCFCE7',
    borderColor: '#BBF7D0',
  },
  dangerRow: {
    backgroundColor: '#DC2626',
    borderWidth: 1,
    borderColor: '#B91C1C',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  dangerIconTile: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  dangerText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  coverModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  coverModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 24,
  },
  coverModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  coverModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
  },
  coverModalSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#6B7280',
    marginTop: 2,
  },
  coverModalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverQuickActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  coverQuickBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  coverQuickIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  coverQuickBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#1F2937',
  },
  coverSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#374151',
    marginBottom: 10,
  },
  coverPresetsScroll: {
    paddingBottom: 16,
    gap: 10,
  },
  coverPresetCard: {
    width: 86,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    position: 'relative',
  },
  coverPresetCardActive: {
    borderColor: brandColors.aoloGreen,
  },
  coverPresetThumb: {
    width: '100%',
    height: 58,
    borderRadius: 10,
  },
  coverPresetCheckBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: brandColors.aoloGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPresetName: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#1F2937',
    paddingVertical: 4,
  },
  coverUrlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  coverUrlInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    fontSize: 12.5,
    fontFamily: 'Roboto',
    color: '#111827',
  },
  coverUrlApplyBtn: {
    backgroundColor: brandColors.aoloGreen,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverUrlApplyBtnDisabled: {
    opacity: 0.45,
  },
  coverUrlApplyText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
});
