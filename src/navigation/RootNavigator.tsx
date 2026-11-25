import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import { useAuthStore } from '../store/useAuthStore';
import { brandColors } from '../theme';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const [showSplash, setShowSplash] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { isAuthenticated } = useAuthStore();

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: brandColors.aoloGreen,
          background: brandColors.aoloBg,
          card: brandColors.aoloCardBg,
          text: brandColors.aoloText,
          border: brandColors.aoloBorderLight,
          notification: brandColors.aoloRed,
        },
        fonts: {
          regular: { fontFamily: 'Roboto', fontWeight: '400' },
          medium: { fontFamily: 'Roboto', fontWeight: '500' },
          bold: { fontFamily: 'Roboto', fontWeight: '700' },
          heavy: { fontFamily: 'Roboto', fontWeight: '900' },
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding">
            {() => <OnboardingScreen onComplete={() => setHasCompletedOnboarding(true)} />}
          </Stack.Screen>
        ) : !isAuthenticated ? (
          <>
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

