import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from './src/store/authStore';
import { RootStackParamList } from './src/types';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  // Get raw value from store
  const rawAuth = useAuthStore((state) => state.isAuthenticated);
  
  // Convert to strict boolean using useMemo to ensure it's always boolean
  const isAuthenticated = useMemo(() => {
    if (rawAuth === true) return true;
    if (rawAuth === false) return false;
    if (typeof rawAuth === 'string') {
      return rawAuth === 'true' || rawAuth === '1';
    }
    if (typeof rawAuth === 'number') {
      return rawAuth !== 0;
    }
    return false;
  }, [rawAuth]);

  // Ensure it's a boolean before using in JSX
  const showMain: boolean = isAuthenticated === true;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showMain ? (
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
