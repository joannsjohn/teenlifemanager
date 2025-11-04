import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';

export default function SettingsScreen() {
  const { user, updateUser, setTheme } = useAuthStore();
  const [notifications, setNotifications] = useState({
    schedule: true,
    volunteering: true,
    social: true,
    mentalHealth: true,
  });
  const [privacy, setPrivacy] = useState({
    shareSchedule: false,
    shareVolunteering: true,
    shareMood: false,
  });

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          notifications: newNotifications,
        },
      });
    }
  };

  const handlePrivacyToggle = (key: keyof typeof privacy) => {
    const newPrivacy = { ...privacy, [key]: !privacy[key] };
    setPrivacy(newPrivacy);
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          privacy: newPrivacy,
        },
      });
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setTheme(theme);
    Alert.alert('Theme Changed', `Switched to ${theme} theme`);
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Your data will be exported to your email');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="color-palette" size={20} color="#6366f1" />
            </View>
            <Text style={styles.settingText}>Theme</Text>
          </View>
          <View style={styles.themeButtons}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                user.preferences.theme === 'light' && styles.themeButtonActive
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Text style={[
                styles.themeButtonText,
                user.preferences.theme === 'light' && styles.themeButtonTextActive
              ]}>
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                user.preferences.theme === 'dark' && styles.themeButtonActive
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text style={[
                styles.themeButtonText,
                user.preferences.theme === 'dark' && styles.themeButtonTextActive
              ]}>
                Dark
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="calendar" size={20} color="#6366f1" />
            </View>
            <Text style={styles.settingText}>Schedule Reminders</Text>
          </View>
          <Switch
            value={notifications.schedule}
            onValueChange={() => handleNotificationToggle('schedule')}
            trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="heart" size={20} color="#6366f1" />
            </View>
            <Text style={styles.settingText}>Volunteering Updates</Text>
          </View>
          <Switch
            value={notifications.volunteering}
            onValueChange={() => handleNotificationToggle('volunteering')}
            trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="people" size={20} color="#6366f1" />
            </View>
            <Text style={styles.settingText}>Social Activities</Text>
          </View>
          <Switch
            value={notifications.social}
            onValueChange={() => handleNotificationToggle('social')}
            trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="happy" size={20} color="#6366f1" />
            </View>
            <Text style={styles.settingText}>Mental Health Reminders</Text>
          </View>
          <Switch
            value={notifications.mentalHealth}
            onValueChange={() => handleNotificationToggle('mentalHealth')}
            trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="calendar-outline" size={20} color="#6366f1" />
            </View>
            <Text style={styles.settingText}>Share Schedule with Friends</Text>
          </View>
          <Switch
            value={privacy.shareSchedule}
            onValueChange={() => handlePrivacyToggle('shareSchedule')}
            trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="heart-outline" size={20} color="#6366f1" />
            </View>
            <Text style={styles.settingText}>Share Volunteering Hours</Text>
          </View>
          <Switch
            value={privacy.shareVolunteering}
            onValueChange={() => handlePrivacyToggle('shareVolunteering')}
            trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="happy-outline" size={20} color="#6366f1" />
            </View>
            <Text style={styles.settingText}>Share Mood Updates</Text>
          </View>
          <Switch
            value={privacy.shareMood}
            onValueChange={() => handlePrivacyToggle('shareMood')}
            trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Storage</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="download" size={20} color="#6366f1" />
            </View>
            <Text style={styles.settingText}>Export My Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="trash" size={20} color="#6366f1" />
            </View>
            <Text style={styles.settingText}>Clear Cache</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="key" size={20} color="#6366f1" />
            </View>
            <Text style={styles.settingText}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="mail" size={20} color="#6366f1" />
            </View>
            <Text style={styles.settingText}>Change Email</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingItem, styles.dangerItem]} 
          onPress={handleDeleteAccount}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, styles.dangerIcon]}>
              <Ionicons name="warning" size={20} color="#ef4444" />
            </View>
            <Text style={[styles.settingText, styles.dangerText]}>Delete Account</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Teen Life Manager v1.0.0</Text>
        <Text style={styles.footerText}>© 2024 All rights reserved</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  themeButtons: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 2,
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  themeButtonActive: {
    backgroundColor: '#6366f1',
  },
  themeButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  themeButtonTextActive: {
    color: '#fff',
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerIcon: {
    backgroundColor: '#fef2f2',
  },
  dangerText: {
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
});
