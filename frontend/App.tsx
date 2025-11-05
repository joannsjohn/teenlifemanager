import 'react-native-gesture-handler';
import React from 'react';
import { View } from 'react-native';
import { NavigationProvider, useNavigation } from './src/navigation/SimpleNavigation';

import TestScreen from './src/screens/TestScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

const ScreenRenderer: React.FC = () => {
  const { currentScreen } = useNavigation();

  switch (currentScreen) {
    case 'Test':
      return <TestScreen />;
    case 'Login':
      return <LoginScreen />;
    case 'Register':
      return <RegisterScreen />;
    case 'Main':
      return <MainTabNavigator />;
    default:
      return <TestScreen />;
  }
};

export default function App() {
  return (
    <NavigationProvider initialScreen="Login">
      <View style={{ flex: 1 }}>
        <ScreenRenderer />
      </View>
    </NavigationProvider>
  );
}
