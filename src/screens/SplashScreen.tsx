import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

/**
 * Splash Screen
 * - Centered lime-green (#A6E22E) squircle logo with "AO" text & black "CABS" badge
 * - Logo animation: fade-in + scale 0.8 -> 1.0 (500ms, easeOut)
 * - Tagline "BOOKING REDEFINED" staggered fade-in
 * - Bottom circular spinner with "INITIALIZING..." text
 * - After 2.5s, smooth cross-fade transition to onboarding flow
 */
export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  const taglineFade = useRef(new Animated.Value(0)).current;
  const taglineSlide = useRef(new Animated.Value(10)).current;

  const bottomFade = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Logo entrance: fade + scale from 0.8 to 1 (500ms, easeOut)
    Animated.parallel([
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Tagline entrance: slight delay (300ms)
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(taglineFade, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(taglineSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3. Bottom Initializing indicator fade-in
    Animated.sequence([
      Animated.delay(600),
      Animated.timing(bottomFade, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 4. Auto-navigate after ~2.5s with a smooth fade exit
    const timer = setTimeout(() => {
      Animated.timing(screenFade, {
        toValue: 0,
        duration: 350,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [logoFade, logoScale, taglineFade, taglineSlide, bottomFade, screenFade, onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: screenFade }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Main Center Brand Area */}
      <View style={styles.centerContainer}>
        {/* Animated Logo */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoFade,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.squircle}>
            <Text style={styles.aoText}>AO</Text>
          </View>

          {/* Black CABS Pill Badge */}
          <View style={styles.cabsBadge}>
            <Text style={styles.cabsBadgeText}>CABS</Text>
          </View>
        </Animated.View>

        {/* Brand Name */}
        <Animated.Text style={[styles.brandTitle, { opacity: logoFade }]}>
          AOLO
        </Animated.Text>

        {/* Staggered Tagline */}
        <Animated.Text
          style={[
            styles.brandSubtitle,
            {
              opacity: taglineFade,
              transform: [{ translateY: taglineSlide }],
            },
          ]}
        >
          BOOKING REDEFINED
        </Animated.Text>
      </View>

      {/* Bottom Initializing Indicator */}
      <Animated.View style={[styles.bottomContainer, { opacity: bottomFade }]}>
        <ActivityIndicator size="small" color="#A6E22E" style={styles.spinner} />
        <Text style={styles.initializingText}>INITIALIZING...</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  squircle: {
    width: 104,
    height: 104,
    borderRadius: 28,
    backgroundColor: '#A6E22E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A6E22E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  aoText: {
    fontSize: 32,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
    letterSpacing: 0.5,
  },
  cabsBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  cabsBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
    letterSpacing: 2,
    marginTop: 18,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 2.2,
    marginTop: 6,
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  spinner: {
    transform: [{ scale: 0.85 }],
  },
  initializingText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 1.8,
  },
});
