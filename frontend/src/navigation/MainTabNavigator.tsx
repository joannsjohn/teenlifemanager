import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { MainTabParamList } from '../types';
import { TabNavigationProvider, useTabNavigation } from './SimpleNavigation';
import ScheduleScreen from '../screens/ScheduleScreen';
import VolunteeringScreen from '../screens/VolunteeringScreen';
import SocialScreen from '../screens/SocialScreen';
import MentalHealthScreen from '../screens/MentalHealthScreen';
import ProfileScreen from '../screens/ProfileScreen';

const TabContent: React.FC = () => {
  const { currentTab, navigateTab } = useTabNavigation();

  const renderTab = () => {
    switch (currentTab) {
      case 'Schedule':
        return <ScheduleScreen />;
      case 'Volunteering':
        return <VolunteeringScreen />;
      case 'Social':
        return <SocialScreen />;
      case 'MentalHealth':
        return <MentalHealthScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <ScheduleScreen />;
    }
  };

  const getIcon = (tab: keyof MainTabParamList, focused: boolean) => {
    const icons: Record<keyof MainTabParamList, { focused: string; unfocused: string }> = {
      Schedule: { focused: 'calendar', unfocused: 'calendar-outline' },
      Volunteering: { focused: 'heart', unfocused: 'heart-outline' },
      Social: { focused: 'people', unfocused: 'people-outline' },
      MentalHealth: { focused: 'happy', unfocused: 'happy-outline' },
      Profile: { focused: 'person', unfocused: 'person-outline' },
    };
    return focused ? icons[tab].focused : icons[tab].unfocused;
  };

  const getTitle = (tab: keyof MainTabParamList) => {
    const titles: Record<keyof MainTabParamList, string> = {
      Schedule: 'Schedule',
      Volunteering: 'Volunteering',
      Social: 'Social',
      MentalHealth: 'Wellness',
      Profile: 'Profile',
    };
    return titles[tab];
  };

  const tabs: (keyof MainTabParamList)[] = ['Schedule', 'Volunteering', 'Social', 'MentalHealth', 'Profile'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{getTitle(currentTab)}</Text>
      </View>
      <View style={styles.content}>
        {renderTab()}
      </View>
      <View style={[styles.tabBar, { paddingBottom: Platform.OS === 'ios' ? 20 : 5 }]}>
        {tabs.map((tab) => {
          const isFocused = currentTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => navigateTab(tab)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={getIcon(tab, isFocused) as any}
                size={24}
                color={isFocused ? '#6366f1' : 'gray'}
              />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {getTitle(tab)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function MainTabNavigator() {
  return (
    <TabNavigationProvider initialTab="Schedule">
      <TabContent />
    </TabNavigationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    height: Platform.OS === 'ios' ? 85 : 60,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
});
