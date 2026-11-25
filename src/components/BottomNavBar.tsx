import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Calendar, Wallet, User } from 'lucide-react-native';
import { useUIStore } from '../store/useUIStore';
import { useLanguageStore } from '../store/useLanguageStore';

export type BottomNavTab = 'home' | 'bookings' | 'wallet' | 'account';

interface BottomNavBarProps {
  activeTab?: BottomNavTab;
  onTabPress?: (tab: BottomNavTab) => void;
}

export default function BottomNavBar({ activeTab, onTabPress }: BottomNavBarProps) {
  const insets = useSafeAreaInsets();
  const { currentSheet, setCurrentSheet, setActiveTab, setDrawerOpen } = useUIStore();
  const { t } = useLanguageStore();

  // Determine active tab if not explicitly overridden
  const currentActiveTab: BottomNavTab =
    activeTab ||
    (currentSheet === 'HISTORY'
      ? 'bookings'
      : currentSheet === 'WALLET'
      ? 'wallet'
      : currentSheet === 'PROFILE'
      ? 'account'
      : 'home');

  const handlePress = (tab: BottomNavTab) => {
    if (onTabPress) {
      onTabPress(tab);
      return;
    }

    if (tab === 'home') {
      const wasInSheet = currentSheet !== 'NONE';
      setActiveTab('home');
      setCurrentSheet('NONE');
      if (wasInSheet) {
        setDrawerOpen(true);
      }
    } else if (tab === 'bookings') {
      setActiveTab('bookings');
      setDrawerOpen(false);
      setCurrentSheet('HISTORY');
    } else if (tab === 'wallet') {
      setActiveTab('wallet');
      setDrawerOpen(false);
      setCurrentSheet('WALLET');
    } else if (tab === 'account') {
      setActiveTab('account');
      setDrawerOpen(false);
      setCurrentSheet('PROFILE');
    }
  };

  const bottomPad =
    Platform.OS === 'ios'
      ? Math.max(insets.bottom, 20)
      : Math.max(insets.bottom, 10);

  return (
    <View style={[styles.bottomNavContainer, { paddingBottom: bottomPad }]}>
      {/* Home Tab */}
      <TouchableOpacity
        style={[styles.navItem, currentActiveTab === 'home' && styles.activeNavItem]}
        onPress={() => handlePress('home')}
        activeOpacity={0.75}
      >
        <Home
          size={21}
          color={currentActiveTab === 'home' ? '#3F6212' : '#64748B'}
          strokeWidth={currentActiveTab === 'home' ? 2.8 : 2}
        />
        <Text style={[styles.navText, currentActiveTab === 'home' && styles.activeNavText]}>
          {t('tabHome', 'Home')}
        </Text>
      </TouchableOpacity>

      {/* Bookings Tab */}
      <TouchableOpacity
        style={[styles.navItem, currentActiveTab === 'bookings' && styles.activeNavItem]}
        onPress={() => handlePress('bookings')}
        activeOpacity={0.75}
      >
        <Calendar
          size={21}
          color={currentActiveTab === 'bookings' ? '#3F6212' : '#64748B'}
          strokeWidth={currentActiveTab === 'bookings' ? 2.8 : 2}
        />
        <Text style={[styles.navText, currentActiveTab === 'bookings' && styles.activeNavText]}>
          {t('tabBookings', 'Bookings')}
        </Text>
      </TouchableOpacity>

      {/* Wallet Tab */}
      <TouchableOpacity
        style={[styles.navItem, currentActiveTab === 'wallet' && styles.activeNavItem]}
        onPress={() => handlePress('wallet')}
        activeOpacity={0.75}
      >
        <Wallet
          size={21}
          color={currentActiveTab === 'wallet' ? '#3F6212' : '#64748B'}
          strokeWidth={currentActiveTab === 'wallet' ? 2.8 : 2}
        />
        <Text style={[styles.navText, currentActiveTab === 'wallet' && styles.activeNavText]}>
          {t('tabWallet', 'Wallet')}
        </Text>
      </TouchableOpacity>

      {/* Account Tab */}
      <TouchableOpacity
        style={[styles.navItem, currentActiveTab === 'account' && styles.activeNavItem]}
        onPress={() => handlePress('account')}
        activeOpacity={0.75}
      >
        <User
          size={21}
          color={currentActiveTab === 'account' ? '#3F6212' : '#64748B'}
          strokeWidth={currentActiveTab === 'account' ? 2.8 : 2}
        />
        <Text style={[styles.navText, currentActiveTab === 'account' && styles.activeNavText]}>
          {t('tabAccount', 'Account')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    paddingTop: Platform.OS === 'ios' ? 5 : 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 0,
    marginBottom: 5,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 14,
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    marginHorizontal: 3,
    borderRadius: 16,
  },
  activeNavItem: {
    backgroundColor: '#A3E635',
    borderWidth: 1,
    borderColor: '#84CC16',
    shadowColor: '#65A30D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  navText: {
    fontSize: 10.5,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 3,
    letterSpacing: 0.2,
  },
  activeNavText: {
    color: '#3F6212',
    fontWeight: '900',
  },
});
