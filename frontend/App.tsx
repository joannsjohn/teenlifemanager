import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from './src/store/authStore';
import { RootStackParamList } from './src/types';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

// Helper function to ensure boolean type
const toBoolean = (value: any): boolean => {
  if (value === true) return true;
  if (value === false) return false;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return lower === 'true' || lower === '1';
  }
  if (typeof value === 'number') return value !== 0;
  return false;
};

export default function App() {
  // Use selector with explicit boolean conversion - ensure it's ALWAYS a boolean
  const isAuthenticated: boolean = useAuthStore((state) => {
    const auth = state.isAuthenticated;
    return toBoolean(auth);
  });

  // Double-check: ensure it's a boolean before using
  const authValue: boolean = Boolean(isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: Boolean(false) }}>
        {authValue ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
