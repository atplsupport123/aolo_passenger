import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';

/**
 * SPLASH_ANIMATION
 * Extracted 1:1 from web splash choreography (durations, delays, scales, easing & offsets).
 */
export const SPLASH_ANIMATION = {
  // 1. AO Logo Entrance (Scale + Fade-In)
  LOGO_SCALE_START: 0.65,
  LOGO_SCALE_END: 1.0,
  LOGO_SCALE_DURATION: 600,
  LOGO_FADE_DURATION: 500,
  LOGO_DELAY: 80,

  // 2. Ambient Neon Glow Pulse
  GLOW_SCALE_START: 0.9,
  GLOW_SCALE_END: 1.15,
  GLOW_OPACITY_START: 0.35,
  GLOW_OPACITY_END: 0.85,
  GLOW_LOOP_DURATION: 1800,

  // 3. CABS Badge Pop
  BADGE_SCALE_START: 0,
  BADGE_SCALE_OVERSHOOT: 1.18,
  BADGE_SCALE_END: 1.0,
  BADGE_DURATION: 400,
  BADGE_DELAY: 450,

  // 4. Logo Upward Shift (making room for tagline)
  LOGO_SHIFT_START: 0,
  LOGO_SHIFT_END: -18,
  LOGO_SHIFT_DURATION: 500,
  LOGO_SHIFT_DELAY: 850,

  // 5. Tagline Fade-Up ("RIDE SMARTER. RIDE AOLO.")
  TAGLINE_FADE_DURATION: 500,
  TAGLINE_TRANSLATE_START: 16,
  TAGLINE_TRANSLATE_END: 0,
  TAGLINE_DELAY: 1050,

  // 6. Subtitle Fade-In ("Preparing your luxury travel experience...")
  SUBTITLE_FADE_DURATION: 600,
  SUBTITLE_TRANSLATE_START: 10,
  SUBTITLE_TRANSLATE_END: 0,
  SUBTITLE_DELAY: 1300,

  // 7. Background Sparkles Looping Pulse
  SPARKLE_OPACITY_START: 0.25,
  SPARKLE_OPACITY_END: 0.95,
  SPARKLE_SCALE_START: 0.85,
  SPARKLE_SCALE_END: 1.2,
  SPARKLE_LOOP_DURATION: 1600,

  // 8. Final Cross-Fade Transition to Login Screen
  CROSSFADE_DELAY: 2800,
  CROSSFADE_DURATION: 450,
};

function SparkleStar({ size = 24, color = '#B45309' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2 C12 7.5 7.5 12 2 12 C7.5 12 12 16.5 12 22 C12 16.5 16.5 12 22 12 C16.5 12 12 7.5 12 2 Z"
        fill={color}
      />
      <Circle cx="19" cy="5" r="1.5" fill={color} />
      <Circle cx="5" cy="19" r="1.5" fill={color} />
    </Svg>
  );
}

function DarkGridBackground() {
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
      {Array.from({ length: 24 }).map((_, i) => (
        <Line
          key={`h-${i}`}
          x1="0"
          y1={i * 42}
          x2="100%"
          y2={i * 42}
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <Line
          key={`v-${i}`}
          x1={i * 38}
          y1="0"
          x2={i * 38}
          y2="100%"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth="1"
        />
      ))}
    </Svg>
  );
}

interface LuxurySplashTransitionProps {
  onComplete: () => void;
}

export default function LuxurySplashTransition({ onComplete }: LuxurySplashTransitionProps) {
  // Animated Values (all native-driver compatible)
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(SPLASH_ANIMATION.LOGO_SCALE_START)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(SPLASH_ANIMATION.LOGO_SHIFT_START)).current;

  const badgeScale = useRef(new Animated.Value(SPLASH_ANIMATION.BADGE_SCALE_START)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;

  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(SPLASH_ANIMATION.TAGLINE_TRANSLATE_START)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(SPLASH_ANIMATION.SUBTITLE_TRANSLATE_START)).current;

  const sparklePulse = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Looping Glow Animation
    const glowLoopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: SPLASH_ANIMATION.GLOW_LOOP_DURATION / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0,
          duration: SPLASH_ANIMATION.GLOW_LOOP_DURATION / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    glowLoopAnim.start();

    // 2. Looping Sparkles Pulse Animation
    const sparkleLoopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(sparklePulse, {
          toValue: 1,
          duration: SPLASH_ANIMATION.SPARKLE_LOOP_DURATION / 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sparklePulse, {
          toValue: 0,
          duration: SPLASH_ANIMATION.SPARKLE_LOOP_DURATION / 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    sparkleLoopAnim.start();

    // 3. Choreographed Entrance Sequence
    const entranceAnim = Animated.parallel([
      // AO Logo Scale + Fade
      Animated.sequence([
        Animated.delay(SPLASH_ANIMATION.LOGO_DELAY),
        Animated.parallel([
          Animated.timing(logoScale, {
            toValue: SPLASH_ANIMATION.LOGO_SCALE_END,
            duration: SPLASH_ANIMATION.LOGO_SCALE_DURATION,
            easing: Easing.out(Easing.back(1.6)),
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: SPLASH_ANIMATION.LOGO_FADE_DURATION,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),

      // CABS Badge Pop
      Animated.sequence([
        Animated.delay(SPLASH_ANIMATION.BADGE_DELAY),
        Animated.parallel([
          Animated.timing(badgeOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(badgeScale, {
            toValue: SPLASH_ANIMATION.BADGE_SCALE_END,
            friction: 5,
            tension: 50,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Logo Upward Shift
      Animated.sequence([
        Animated.delay(SPLASH_ANIMATION.LOGO_SHIFT_DELAY),
        Animated.timing(logoTranslateY, {
          toValue: SPLASH_ANIMATION.LOGO_SHIFT_END,
          duration: SPLASH_ANIMATION.LOGO_SHIFT_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // Tagline Fade-Up
      Animated.sequence([
        Animated.delay(SPLASH_ANIMATION.TAGLINE_DELAY),
        Animated.parallel([
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: SPLASH_ANIMATION.TAGLINE_FADE_DURATION,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(taglineTranslateY, {
            toValue: SPLASH_ANIMATION.TAGLINE_TRANSLATE_END,
            duration: SPLASH_ANIMATION.TAGLINE_FADE_DURATION,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Subtitle Fade-In
      Animated.sequence([
        Animated.delay(SPLASH_ANIMATION.SUBTITLE_DELAY),
        Animated.parallel([
          Animated.timing(subtitleOpacity, {
            toValue: 1,
            duration: SPLASH_ANIMATION.SUBTITLE_FADE_DURATION,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(subtitleTranslateY, {
            toValue: SPLASH_ANIMATION.SUBTITLE_TRANSLATE_END,
            duration: SPLASH_ANIMATION.SUBTITLE_FADE_DURATION,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]);

    entranceAnim.start();

    // 4. Auto-Crossfade to Login Screen
    const crossfadeTimer = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: SPLASH_ANIMATION.CROSSFADE_DURATION,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    }, SPLASH_ANIMATION.CROSSFADE_DELAY);

    // Clean up all animations and timers on unmount
    return () => {
      glowLoopAnim.stop();
      sparkleLoopAnim.stop();
      entranceAnim.stop();
      clearTimeout(crossfadeTimer);
    };
  }, [
    containerOpacity,
    logoScale,
    logoOpacity,
    logoTranslateY,
    badgeScale,
    badgeOpacity,
    taglineOpacity,
    taglineTranslateY,
    subtitleOpacity,
    subtitleTranslateY,
    sparklePulse,
    glowPulse,
    onComplete,
  ]);

  // Interpolations for looping effects
  const glowScale = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [SPLASH_ANIMATION.GLOW_SCALE_START, SPLASH_ANIMATION.GLOW_SCALE_END],
  });

  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [SPLASH_ANIMATION.GLOW_OPACITY_START, SPLASH_ANIMATION.GLOW_OPACITY_END],
  });

  const sparkleOpacity = sparklePulse.interpolate({
    inputRange: [0, 1],
    outputRange: [SPLASH_ANIMATION.SPARKLE_OPACITY_START, SPLASH_ANIMATION.SPARKLE_OPACITY_END],
  });

  const sparkleScale = sparklePulse.interpolate({
    inputRange: [0, 1],
    outputRange: [SPLASH_ANIMATION.SPARKLE_SCALE_START, SPLASH_ANIMATION.SPARKLE_SCALE_END],
  });

  return (
    <Animated.View style={[styles.darkLuxuryContainer, { opacity: containerOpacity }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onComplete}
        style={styles.touchableWrapper}
      >
        <StatusBar barStyle="light-content" backgroundColor="#0B0E07" />
        <DarkGridBackground />

        {/* Top-Left Golden Sparkle */}
        <Animated.View
          style={[
            styles.sparkleTopLeft,
            {
              opacity: sparkleOpacity,
              transform: [{ scale: sparkleScale }],
            },
          ]}
        >
          <SparkleStar size={24} color="#B45309" />
        </Animated.View>

        {/* Bottom-Right Golden Sparkle */}
        <Animated.View
          style={[
            styles.sparkleBottomRight,
            {
              opacity: sparkleOpacity,
              transform: [{ scale: sparkleScale }],
            },
          ]}
        >
          <SparkleStar size={26} color="#A16207" />
        </Animated.View>

        {/* Centered Logo & Text with Upward Shift */}
        <Animated.View
          style={[
            styles.centerContent,
            {
              transform: [{ translateY: logoTranslateY }],
            },
          ]}
        >
          {/* Ambient Neon Glow centered directly behind squircle */}
          <Animated.View
            style={[
              styles.ambientGlow,
              {
                transform: [{ scale: glowScale }],
                opacity: glowOpacity,
              },
            ]}
          />

          {/* Logo Squircle with Scale & Fade */}
          <Animated.View
            style={[
              styles.darkLogoWrap,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >

            <View style={styles.darkSquircle}>
              <Text style={styles.darkAoText}>AO</Text>
            </View>

            {/* CABS Badge with Elastic Pop */}
            <Animated.View
              style={[
                styles.darkCabsBadge,
                {
                  opacity: badgeOpacity,
                  transform: [{ scale: badgeScale }],
                },
              ]}
            >
              <Text style={styles.darkCabsBadgeText}>CABS</Text>
            </Animated.View>
          </Animated.View>

          {/* Tagline ("RIDE SMARTER. RIDE AOLO.") */}
          <Animated.Text
            style={[
              styles.luxuryTitle,
              {
                opacity: taglineOpacity,
                transform: [{ translateY: taglineTranslateY }],
              },
            ]}
          >
            RIDE SMARTER. RIDE AOLO.
          </Animated.Text>

          {/* Subtitle ("Preparing your luxury travel experience...") */}
          <Animated.Text
            style={[
              styles.luxurySubtitle,
              {
                opacity: subtitleOpacity,
                transform: [{ translateY: subtitleTranslateY }],
              },
            ]}
          >
            Preparing your luxury travel experience...
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  darkLuxuryContainer: {
    flex: 1,
    backgroundColor: '#0A0C08',
    position: 'relative',
    overflow: 'hidden',
  },
  touchableWrapper: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    top: -45,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(168, 230, 60, 0.16)',
    alignSelf: 'center',
  },

  sparkleTopLeft: {
    position: 'absolute',
    top: '18%',
    left: '14%',
  },
  sparkleBottomRight: {
    position: 'absolute',
    bottom: '22%',
    right: '15%',
  },
  darkLogoWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  darkSquircle: {
    width: 112,
    height: 112,
    borderRadius: 30,
    backgroundColor: '#A8E63C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A8E63C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 28,
  },
  darkAoText: {
    fontSize: 28,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
    letterSpacing: 0.5,
  },
  darkCabsBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#000000',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  darkCabsBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  luxuryTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#A8E63C',
    letterSpacing: 1.4,
    marginTop: 20,
    textAlign: 'center',
  },
  luxurySubtitle: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },
});
