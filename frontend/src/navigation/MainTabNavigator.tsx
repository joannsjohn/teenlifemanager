import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MainTabParamList } from '../types';
import { TabNavigationProvider, useTabNavigation } from './SimpleNavigation';
import ScheduleScreen from '../screens/ScheduleScreen';
import VolunteeringScreen from '../screens/VolunteeringScreen';
import SocialScreen from '../screens/SocialScreen';
import MentalHealthScreen from '../screens/MentalHealthScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationBell from '../components/common/NotificationBell';
import { getSectionGradient, getSectionColors, typography, spacing, shadows } from '../theme';
import { fadeIn } from '../utils/animations';
import { useNavigation } from './SimpleNavigation';

type Section = 'schedule' | 'volunteering' | 'social' | 'mentalHealth' | 'profile';

const TabContent: React.FC = () => {
  const { currentTab, navigateTab } = useTabNavigation();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    fadeIn(fadeAnim, 250).start();
  }, [currentTab]);

  const getSection = (tab: keyof MainTabParamList): Section => {
    const sectionMap: Record<keyof MainTabParamList, Section> = {
      Schedule: 'schedule',
      Volunteering: 'volunteering',
      Social: 'social',
      MentalHealth: 'mentalHealth',
      Profile: 'profile',
    };
    return sectionMap[tab];
  };

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

  const currentSection = getSection(currentTab);
  const sectionColors = getSectionColors(currentSection);
  const headerGradient = getSectionGradient(currentSection);

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

  const tabs: (keyof MainTabParamList)[] = ['Schedule', 'Volunteering', 'MentalHealth', 'Profile'];

  const getTabColors = (tab: keyof MainTabParamList) => {
    const section = getSection(tab);
    return getSectionColors(section);
  };

  return (
    <View style={styles.container}>
          <LinearGradient
            colors={headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
              <Text style={styles.headerTitle}>{getTitle(currentTab)}</Text>
              <NotificationBell
                onPress={() => navigation.navigate('Notifications' as any)}
                size={24}
              />
            </Animated.View>
          </LinearGradient>
      <View style={styles.content}>
        <Animated.View style={[styles.contentInner, { opacity: fadeAnim }]}>
          {renderTab()}
        </Animated.View>
      </View>
      <View style={[styles.tabBar, shadows.md, { paddingBottom: Platform.OS === 'ios' ? 20 : 5 }]}>
        {tabs.map((tab) => {
          const isFocused = currentTab === tab;
          const tabColors = getTabColors(tab);
          const iconColor = isFocused ? tabColors.primary : '#9CA3AF';
          const labelColor = isFocused ? tabColors.primary : '#6B7280';
          
          return (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => navigateTab(tab)}
              activeOpacity={0.7}
            >
              <View style={isFocused && styles.tabIconContainer}>
                <Ionicons
                  name={getIcon(tab, isFocused) as any}
                  size={isFocused ? 26 : 24}
                  color={iconColor}
                />
              </View>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive, { color: labelColor }]}>
                {getTitle(tab)}
              </Text>
              {isFocused && (
                <View style={[styles.tabIndicator, { backgroundColor: tabColors.primary }]} />
              )}
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
    backgroundColor: '#F8FAFC',
  },
      header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
        ...shadows.md,
      },
      headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      headerTitle: {
        ...typography.h2,
        color: '#FFFFFF',
        flex: 1,
      },
  content: {
    flex: 1,
  },
  contentInner: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 85 : 60,
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabIconContainer: {
    marginBottom: 2,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 0,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    borderRadius: 2,
  },
  tabLabel: {
    ...typography.labelSmall,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});
