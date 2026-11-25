import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Car, Plane, Briefcase } from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen';
import TravelModeScreen from '../screens/TravelModeScreen';
import CorporateScreen from '../screens/CorporateScreen';
import { brandColors } from '../theme';
import { useUIStore } from '../store/useUIStore';
import { openCorporatePortalInNewTab } from '../utils/corporatePortal';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { setActiveTab } = useUIStore();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
        tabBarActiveTintColor: brandColors.aoloGreen,
        tabBarInactiveTintColor: brandColors.aoloGray,
        tabBarLabelStyle: {
          fontFamily: 'Roboto',
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Rides"
        component={HomeScreen}
        listeners={{
          tabPress: () => setActiveTab('rides'),
        }}
        options={{
          tabBarLabel: 'City & Intercity',
          tabBarIcon: ({ color, size }) => <Car size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Travel"
        component={TravelModeScreen}
        listeners={{
          tabPress: () => setActiveTab('travel'),
        }}
        options={{
          tabBarLabel: 'Travel Mode',
          tabBarIcon: ({ color, size }) => <Plane size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Corporate"
        component={CorporateScreen}
        listeners={{
          tabPress: (event) => {
            if (openCorporatePortalInNewTab()) {
              event.preventDefault();
              return;
            }
            setActiveTab('corporate');
          },
        }}
        options={{
          tabBarLabel: 'Corporate',
          tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
