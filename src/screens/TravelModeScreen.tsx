import React from 'react';
import TravelModeComponent from '../components/TravelModeScreen';
import { useNavigation } from '@react-navigation/native';

export default function TravelModeScreen() {
  const navigation = useNavigation<any>();

  return (
    <TravelModeComponent
      onClose={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('Rides');
        }
      }}
    />
  );
}
