import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black,
} from '@expo-google-fonts/roboto';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import CorporateApp from './src/components/corporate/CorporateApp';
import { brandColors } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto: Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-Bold': Roboto_700Bold,
    'Roboto-Black': Roboto_900Black,
  });

  if (!fontsLoaded) {
    const loadingContent = (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={brandColors.aoloGreen} />
      </View>
    );

    if (Platform.OS === 'web') {
      return (
        <View style={styles.webOuterContainer}>
          <View style={styles.webPhoneFrame}>{loadingContent}</View>
        </View>
      );
    }
    return loadingContent;
  }

  const isCorporatePortal =
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('corporate') === '1';

  if (isCorporatePortal) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <CorporateApp
            onClose={() => {
              if (typeof window !== 'undefined') {
                const passengerUrl = new URL(window.location.href);
                passengerUrl.searchParams.delete('corporate');
                window.location.assign(passengerUrl.toString());
              }
            }}
          />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  const appContent = (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webOuterContainer}>
        <View style={styles.webPhoneFrame}>{appContent}</View>
      </View>
    );
  }

  return appContent;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandColors.aoloBlack,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: brandColors.aoloBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webOuterContainer: {
    flex: 1,
    width: '100%',
    height: '100vh' as any,
    backgroundColor: '#121417',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  webPhoneFrame: {
    width: '100%',
    maxWidth: 430,
    height: '100%',
    maxHeight: 932,
    backgroundColor: brandColors.aoloBlack,
    overflow: 'hidden',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#262B1E',
    // @ts-ignore
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
  },
});
