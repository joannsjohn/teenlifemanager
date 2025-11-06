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

export default function HelpScreen() {
  const navigation = useNavigation();

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@teenlifemanager.com');
  };

  const handleFAQ = () => {
    // Navigate to FAQ or show FAQ content
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
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.placeholder} />
        </View>

        <GradientCard section="profile" variant="elevated" style={styles.card}>
          <TouchableOpacity style={styles.helpItem}>
            <View style={styles.helpItemLeft}>
              <Ionicons name="help-circle" size={24} color={colors.profile.primary} />
              <View style={styles.helpTextContainer}>
                <Text style={styles.helpTitle}>Frequently Asked Questions</Text>
                <Text style={styles.helpDescription}>
                  Find answers to common questions
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <View style={styles.helpItemLeft}>
              <Ionicons name="book-outline" size={24} color={colors.profile.primary} />
              <View style={styles.helpTextContainer}>
                <Text style={styles.helpTitle}>User Guide</Text>
                <Text style={styles.helpDescription}>
                  Learn how to use all features
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem} onPress={handleContactSupport}>
            <View style={styles.helpItemLeft}>
              <Ionicons name="mail-outline" size={24} color={colors.profile.primary} />
              <View style={styles.helpTextContainer}>
                <Text style={styles.helpTitle}>Contact Support</Text>
                <Text style={styles.helpDescription}>
                  Get help from our support team
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <View style={styles.helpItemLeft}>
              <Ionicons name="bug-outline" size={24} color={colors.profile.primary} />
              <View style={styles.helpTextContainer}>
                <Text style={styles.helpTitle}>Report a Bug</Text>
                <Text style={styles.helpDescription}>
                  Help us improve the app
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </TouchableOpacity>
        </GradientCard>

        <GradientCard section="profile" variant="elevated" style={styles.card}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.tipText}>
              Create events to stay organized with your schedule
            </Text>
          </View>

          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.tipText}>
              Log your volunteer hours to track your community service
            </Text>
          </View>

          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.tipText}>
              Track your mood to monitor your mental wellness
            </Text>
          </View>
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
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  helpItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    ...typography.body,
    color: colors.gray900,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  helpDescription: {
    ...typography.bodySmall,
    color: colors.gray600,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tipText: {
    ...typography.bodySmall,
    color: colors.gray700,
    flex: 1,
  },
});

