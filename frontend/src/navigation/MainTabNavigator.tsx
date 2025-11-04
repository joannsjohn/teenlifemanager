import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { MainTabParamList } from '../types';
import ScheduleScreen from '../screens/ScheduleScreen';
import VolunteeringScreen from '../screens/VolunteeringScreen';
import SocialScreen from '../screens/SocialScreen';
import MentalHealthScreen from '../screens/MentalHealthScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // Ensure focused is a boolean
          const isFocused = Boolean(focused);
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Schedule') {
            iconName = isFocused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Volunteering') {
            iconName = isFocused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Social') {
            iconName = isFocused ? 'people' : 'people-outline';
          } else if (route.name === 'MentalHealth') {
            iconName = isFocused ? 'happy' : 'happy-outline';
          } else if (route.name === 'Profile') {
            iconName = isFocused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: Boolean(true),
        tabBarStyle: {
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        },
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Schedule" 
        component={ScheduleScreen}
        options={{ title: 'Schedule' }}
      />
      <Tab.Screen 
        name="Volunteering" 
        component={VolunteeringScreen}
        options={{ title: 'Volunteering' }}
      />
      <Tab.Screen 
        name="Social" 
        component={SocialScreen}
        options={{ title: 'Social' }}
      />
      <Tab.Screen 
        name="MentalHealth" 
        component={MentalHealthScreen}
        options={{ title: 'Wellness' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
