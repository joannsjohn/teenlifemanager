import 'react-native-gesture-handler';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationProvider, useNavigation } from './src/navigation/SimpleNavigation';

import TestScreen from './src/screens/TestScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import EditProfileScreen from './src/screens/EditProfileScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import HelpScreen from './src/screens/HelpScreen';
import AboutScreen from './src/screens/AboutScreen';
import AddOrganizationScreen from './src/screens/AddOrganizationScreen';
import EditOrganizationScreen from './src/screens/EditOrganizationScreen';
import OrganizationDetailsScreen from './src/screens/OrganizationDetailsScreen';
import AddVolunteerHoursScreen from './src/screens/AddVolunteerHoursScreen';
import VolunteerHourDetailsScreen from './src/screens/VolunteerHourDetailsScreen';
import AddEventScreen from './src/screens/AddEventScreen';
import ImportEventsScreen from './src/screens/ImportEventsScreen';

const ScreenRenderer: React.FC = () => {
  const { currentScreen, currentParams } = useNavigation();

  switch (currentScreen) {
    case 'Test':
      return <TestScreen />;
    case 'Login':
      return <LoginScreen />;
    case 'Register':
      return <RegisterScreen />;
    case 'Main':
      return <MainTabNavigator />;
    case 'EditProfile':
      return <EditProfileScreen />;
    case 'Notifications':
      return <NotificationsScreen />;
    case 'Settings':
      return <SettingsScreen />;
    case 'Privacy':
      return <PrivacyScreen />;
    case 'Help':
      return <HelpScreen />;
    case 'About':
      return <AboutScreen />;
    case 'AddOrganization':
      return <AddOrganizationScreen />;
    case 'EditOrganization':
      return <EditOrganizationScreen route={{ params: currentParams }} />;
    case 'OrganizationDetails':
      return <OrganizationDetailsScreen route={{ params: currentParams }} />;
    case 'AddVolunteerHours':
      return <AddVolunteerHoursScreen route={{ params: currentParams }} />;
    case 'VolunteerHourDetails':
      return <VolunteerHourDetailsScreen route={{ params: currentParams }} />;
    case 'AddEvent':
      return <AddEventScreen />;
    case 'ImportEvents':
      return <ImportEventsScreen />;
    default:
      return <TestScreen />;
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationProvider initialScreen="Login">
        <View style={{ flex: 1 }}>
          <ScreenRenderer />
        </View>
      </NavigationProvider>
    </SafeAreaProvider>
  );
}
