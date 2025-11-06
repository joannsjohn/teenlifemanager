import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/SimpleNavigation';
import GradientCard from '../components/common/GradientCard';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

export default function AboutScreen() {
  const navigation = useNavigation();

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://teenlifemanager.com/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://teenlifemanager.com/terms');
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
          <Text style={styles.headerTitle} numberOfLines={1}>About</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="calendar" size={48} color={colors.profile.primary} />
          </View>
          <Text style={styles.appName}>Teen Life Manager</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <GradientCard section="profile" variant="elevated" style={styles.card}>
          <Text style={styles.description}>
            Teen Life Manager helps teenagers organize their schedules, track volunteer hours,
            manage social connections, and monitor mental wellness all in one place.
          </Text>
        </GradientCard>

        <GradientCard section="profile" variant="elevated" style={styles.card}>
          <TouchableOpacity style={styles.linkItem} onPress={handlePrivacyPolicy}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={handleTermsOfService}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </TouchableOpacity>
        </GradientCard>

        <GradientCard section="profile" variant="elevated" style={styles.card}>
          <Text style={styles.sectionTitle}>Credits</Text>
          <Text style={styles.creditText}>
            Built with React Native and Expo
          </Text>
          <Text style={styles.creditText}>
            Icons by Ionicons
          </Text>
        </GradientCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Teen Life Manager</Text>
          <Text style={styles.footerText}>All rights reserved</Text>
        </View>
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
    paddingTop: spacing.md,
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
  logoContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.profile.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  appName: {
    ...typography.h2,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  version: {
    ...typography.bodySmall,
    color: colors.gray600,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  description: {
    ...typography.body,
    color: colors.gray700,
    lineHeight: 24,
    textAlign: 'center',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  linkText: {
    ...typography.body,
    color: colors.profile.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  creditText: {
    ...typography.bodySmall,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.gray500,
    marginBottom: spacing.xs,
  },
});

