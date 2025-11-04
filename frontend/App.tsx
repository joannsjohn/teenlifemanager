import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from './src/store/authStore';
import { RootStackParamList } from './src/types';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  // Use selector to get boolean value, ensuring it's always a boolean type
  const isAuthenticated = useAuthStore((state) => {
    const auth = state.isAuthenticated;
    // Handle any type conversion issues
    if (auth === true) return true;
    if (auth === false) return false;
    if (typeof auth === 'string') return auth === 'true';
    return false;
  });

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated === true ? (
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
