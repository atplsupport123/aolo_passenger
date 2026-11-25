import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

export interface OnboardingStepConfig {
  id: string;
  title: string;
  subtitle: string;
  renderIllustration: (floatingAnim: Animated.Value) => React.ReactNode;
}

interface OnboardingStepProps {
  step: OnboardingStepConfig;
  direction: 'next' | 'back';
  stepIndex: number;
}

/**
 * TUNING CONFIGURATION:
 * - SLIDE_DISTANCE: 60px horizontal slide offset
 * - SLIDE_DURATION: 360ms slide-in duration
 * - STAGGER_DELAY: 70ms delay between elements
 * - FLOAT_AMPLITUDE: 4px floating vertical shift
 * - FLOAT_DURATION: 3000ms full floating loop
 */
export const ANIMATION_CONFIG = {
  SLIDE_DISTANCE: 60,
  SLIDE_DURATION: 360,
  STAGGER_DELAY: 70,
  FLOAT_AMPLITUDE: 4,
  FLOAT_DURATION: 3000,
};

export default function OnboardingStep({
  step,
  direction,
  stepIndex,
}: OnboardingStepProps) {
  // 1. Illustration entrance animation values
  const illustSlide = useRef(
    new Animated.Value(direction === 'next' ? ANIMATION_CONFIG.SLIDE_DISTANCE : -ANIMATION_CONFIG.SLIDE_DISTANCE)
  ).current;
  const illustFade = useRef(new Animated.Value(0)).current;

  // 2. Title entrance animation values
  const titleSlide = useRef(
    new Animated.Value(direction === 'next' ? ANIMATION_CONFIG.SLIDE_DISTANCE : -ANIMATION_CONFIG.SLIDE_DISTANCE)
  ).current;
  const titleFade = useRef(new Animated.Value(0)).current;

  // 3. Subtitle entrance animation values
  const subtitleSlide = useRef(
    new Animated.Value(direction === 'next' ? ANIMATION_CONFIG.SLIDE_DISTANCE : -ANIMATION_CONFIG.SLIDE_DISTANCE)
  ).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;

  // 4. Subtle continuous floating loop for floating cards/chips
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset values for entrance
    const initialSlide = direction === 'next' ? ANIMATION_CONFIG.SLIDE_DISTANCE : -ANIMATION_CONFIG.SLIDE_DISTANCE;
    illustSlide.setValue(initialSlide);
    illustFade.setValue(0);
    titleSlide.setValue(initialSlide);
    titleFade.setValue(0);
    subtitleSlide.setValue(initialSlide);
    subtitleFade.setValue(0);

    // Staggered sequence entrance
    Animated.parallel([
      // Illustration entrance (delay 0ms)
      Animated.timing(illustFade, {
        toValue: 1,
        duration: ANIMATION_CONFIG.SLIDE_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(illustSlide, {
        toValue: 0,
        duration: ANIMATION_CONFIG.SLIDE_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      // Title entrance (staggered delay)
      Animated.sequence([
        Animated.delay(ANIMATION_CONFIG.STAGGER_DELAY),
        Animated.parallel([
          Animated.timing(titleFade, {
            toValue: 1,
            duration: ANIMATION_CONFIG.SLIDE_DURATION,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(titleSlide, {
            toValue: 0,
            duration: ANIMATION_CONFIG.SLIDE_DURATION,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Subtitle entrance (staggered delay * 2)
      Animated.sequence([
        Animated.delay(ANIMATION_CONFIG.STAGGER_DELAY * 2),
        Animated.parallel([
          Animated.timing(subtitleFade, {
            toValue: 1,
            duration: ANIMATION_CONFIG.SLIDE_DURATION,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(subtitleSlide, {
            toValue: 0,
            duration: ANIMATION_CONFIG.SLIDE_DURATION,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [stepIndex, direction]);

  // Subtle floating loop for badges and cards
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: ANIMATION_CONFIG.FLOAT_DURATION / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: -1,
          duration: ANIMATION_CONFIG.FLOAT_DURATION / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [floatingAnim]);

  return (
    <View style={styles.container}>
      {/* 1. Illustration Area */}
      <Animated.View
        style={[
          styles.illustrationWrap,
          {
            opacity: illustFade,
            transform: [{ translateX: illustSlide }],
          },
        ]}
      >
        {step.renderIllustration(floatingAnim)}
      </Animated.View>

      {/* 2. Text Content Area with Staggered Entrance */}
      <View style={styles.textWrap}>
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleFade,
              transform: [{ translateX: titleSlide }],
            },
          ]}
        >
          {step.title}
        </Animated.Text>

        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: subtitleFade,
              transform: [{ translateX: subtitleSlide }],
            },
          ]}
        >
          {step.subtitle}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustrationWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 330,
  },
  textWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
  },
});
