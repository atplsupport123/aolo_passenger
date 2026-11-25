import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import {
  TripBooking,
  INITIAL_TRIPS,
} from './corporateTypes';
import CorporateEmployeeView from './CorporateEmployeeView';

interface CorporateAppProps {
  onClose?: () => void;
}

export default function CorporateApp({ onClose }: CorporateAppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [passwordOrOtp, setPasswordOrOtp] = useState('');

  const [trips, setTrips] = useState<TripBooking[]>(INITIAL_TRIPS);

  const handleAddTrip = (newTrip: TripBooking) => {
    setTrips((prev) => [newTrip, ...prev]);
  };

  const handleCancelTrip = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: 'CANCELLED' as const } : t))
    );
  };

  const handleStartTrip = (tripId: string) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? { ...trip, status: 'ON_THE_WAY', progressStep: 'Cab assigned' }
          : trip,
      ),
    );
  };

  const handleCompleteTrip = (tripId: string) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? { ...trip, status: 'COMPLETED', progressStep: 'Trip completed', driverEta: '0' }
          : trip,
      ),
    );
  };

  const handleExit = () => {
    if (onClose) onClose();
  };

  return (
    <SafeAreaView style={[styles.appContainer, !isLoggedIn && styles.loginScreenRoot]}>
      {!isLoggedIn ? (
        <View style={styles.loginContainer}>
          <View style={styles.loginHeading}>
            <Text style={styles.loginTitle}>AOLO</Text>
            <Text style={styles.loginTitle}>Corporate</Text>
            <Text style={styles.loginSubtitle}>Company rides, billed to your organisation.</Text>
          </View>

          <View style={styles.loginForm}>
            <Text style={styles.loginLabel}>Employee ID</Text>
            <TextInput
              style={styles.loginInput}
              value={employeeId}
              onChangeText={setEmployeeId}
              placeholder="[Employee ID]"
              placeholderTextColor="#777777"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.loginLabel, styles.passwordLabel]}>Password or OTP</Text>
            <TextInput
              style={styles.loginInput}
              value={passwordOrOtp}
              onChangeText={setPasswordOrOtp}
              placeholder="••••••"
              placeholderTextColor="#777777"
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.85}
              onPress={() => {
                setIsLoggedIn(true);
              }}
            >
              <Text style={styles.loginButtonText}>LOG IN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => Alert.alert('Admin Help', 'Please contact your corporate administrator to reset your credentials.')}
            >
              <Text style={styles.forgotPasswordText}>Forgot password? Contact your admin.</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
      {/* ================= TOP CORPORATE MODE SWITCHER BAR ================= */}
      <View style={styles.topModeBar}>
        <View style={styles.topModeBarLeft}>
          <Text style={styles.topModeBarBrand}>AOLO Corporate</Text>
          <View style={styles.modeTabsGroup}>
            <View style={[styles.modeTabPill, styles.modeTabPillActive]}>
              <Text style={[styles.modeTabPillText, styles.modeTabPillTextActive]}>Employee App</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.exitBtn} onPress={handleExit}>
          <Text style={styles.exitBtnText}>✕ Exit Corporate</Text>
        </TouchableOpacity>
      </View>

      {/* ================= ACTIVE VIEW PORTAL ================= */}
      <View style={styles.portalContentWrapper}>
        <View style={styles.mobileFrameContainer}>
          <CorporateEmployeeView
            trips={trips}
            onAddTrip={handleAddTrip}
            onCancelTrip={handleCancelTrip}
            onStartTrip={handleStartTrip}
            onCompleteTrip={handleCompleteTrip}
            onExit={handleExit}
          />
        </View>
      </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loginScreenRoot: {
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
  },
  loginContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 460,
    alignSelf: 'flex-start',
    backgroundColor: '#000000',
    paddingHorizontal: '6%' as any,
    paddingTop: '7%' as any,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  loginHeading: {
    width: '100%',
  },
  loginTitle: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -1,
  },
  loginSubtitle: {
    color: '#B8B8B8',
    fontFamily: 'Roboto',
    fontSize: 18,
    lineHeight: 26,
    marginTop: 20,
  },
  loginForm: {
    width: '100%',
    paddingBottom: 0,
  },
  loginLabel: {
    color: '#B8B8B8',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  passwordLabel: {
    marginTop: 18,
  },
  loginInput: {
    width: '100%',
    height: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  loginButton: {
    height: 58,
    marginTop: 18,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#000000',
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: '700',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#B8B8B8',
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  topModeBar: {
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9999,
  },
  topModeBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  topModeBarBrand: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  modeTabsGroup: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 3,
    gap: 4,
  },
  modeTabPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modeTabPillActive: {
    backgroundColor: '#000000',
  },
  modeTabPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    fontFamily: 'Roboto',
  },
  modeTabPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  exitBtn: {
    backgroundColor: '#334155',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  exitBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F8FAFC',
    fontFamily: 'Roboto',
  },
  portalContentWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mobileFrameContainer: {
    flex: 1,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
});
