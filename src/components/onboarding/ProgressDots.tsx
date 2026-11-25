import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ProgressDotsProps {
  totalSteps: number;
  activeIndex: number;
  activeColor?: string;
  inactiveColor?: string;
}

function SingleDot({
  isActive,
  activeColor = '#A6E22E',
  inactiveColor = '#E2E8F0',
}: {
  isActive: boolean;
  activeColor?: string;
  inactiveColor?: string;
}) {
  const widthAnim = useRef(new Animated.Value(isActive ? 28 : 8)).current;
  const colorAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(widthAnim, {
        toValue: isActive ? 28 : 8,
        friction: 8,
        tension: 50,
        useNativeDriver: false, // width requires layout animated driver
      }),
      Animated.timing(colorAnim, {
        toValue: isActive ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isActive, widthAnim, colorAnim]);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  return (
    <Animated.View
      style={[
        styles.dotBase,
        {
          width: widthAnim,
          backgroundColor,
        },
      ]}
    />
  );
}

/**
 * ProgressDots renders pill-shaped indicators where the active dot
 * smoothly expands from 8px to 28px and transitions color.
 */
export default function ProgressDots({
  totalSteps,
  activeIndex,
  activeColor = '#A6E22E',
  inactiveColor = '#E2E8F0',
}: ProgressDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <SingleDot
          key={idx}
          isActive={idx === activeIndex}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 14,
  },
  dotBase: {
    height: 8,
    borderRadius: 4,
  },
});
