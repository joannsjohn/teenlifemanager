import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/SimpleNavigation';
import { useAuthStore } from '../store/authStore';
import GradientCard from '../components/common/GradientCard';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

export default function PrivacyScreen() {
  const navigation = useNavigation();
  const { user, updateUser } = useAuthStore();

  const [privacy, setPrivacy] = React.useState({
    shareSchedule: user?.preferences?.privacy?.shareSchedule || false,
    shareVolunteering: user?.preferences?.privacy?.shareVolunteering || true,
    shareMood: user?.preferences?.privacy?.shareMood || false,
  });

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#F8FAFC', '#EDE9FE', '#F3E8FF']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.profile.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy & Security</Text>
          <View style={styles.placeholder} />
        </View>

        <GradientCard section="profile" variant="elevated" style={styles.card}>
          <Text style={styles.sectionTitle}>Data Sharing</Text>
          <Text style={styles.sectionDescription}>
            Control what information you share with friends and the community
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="calendar-outline" size={20} color={colors.profile.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Share Schedule</Text>
                <Text style={styles.settingDescription}>
                  Allow friends to see your upcoming events
                </Text>
              </View>
            </View>
            <Switch
              value={privacy.shareSchedule}
              onValueChange={() => handlePrivacyToggle('shareSchedule')}
              trackColor={{ false: colors.gray300, true: colors.profile.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="heart-outline" size={20} color={colors.profile.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Share Volunteering Hours</Text>
                <Text style={styles.settingDescription}>
                  Show your volunteer hours on your profile
                </Text>
              </View>
            </View>
            <Switch
              value={privacy.shareVolunteering}
              onValueChange={() => handlePrivacyToggle('shareVolunteering')}
              trackColor={{ false: colors.gray300, true: colors.profile.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="happy-outline" size={20} color={colors.profile.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Share Mood Updates</Text>
                <Text style={styles.settingDescription}>
                  Allow friends to see your mood entries
                </Text>
              </View>
            </View>
            <Switch
              value={privacy.shareMood}
              onValueChange={() => handlePrivacyToggle('shareMood')}
              trackColor={{ false: colors.gray300, true: colors.profile.primary }}
              thumbColor={colors.white}
            />
          </View>
        </GradientCard>

        <GradientCard section="profile" variant="elevated" style={styles.card}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          <Text style={styles.sectionDescription}>
            Manage your account security settings
          </Text>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="key-outline" size={20} color={colors.profile.primary} />
              <Text style={styles.settingLabel}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.profile.primary} />
              <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </TouchableOpacity>
        </GradientCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    minHeight: 44,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...shadows.sm,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.gray900,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
    fontWeight: '600',
  },
  placeholder: {
    width: 44,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    ...typography.bodySmall,
    color: colors.gray600,
    marginBottom: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    ...typography.body,
    color: colors.gray900,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  settingDescription: {
    ...typography.bodySmall,
    color: colors.gray600,
  },
});

