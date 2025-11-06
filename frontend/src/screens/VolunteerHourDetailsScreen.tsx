import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/SimpleNavigation';
import GradientCard from '../components/common/GradientCard';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { volunteerService } from '../services/volunteerService';
import { VolunteeringRecord } from '../types';

export default function VolunteerHourDetailsScreen({ route }: any) {
  const navigation = useNavigation();
  const { recordId } = route?.params || {};
  const [record, setRecord] = useState<VolunteeringRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecord();
  }, [recordId]);

  const loadRecord = async () => {
    try {
      setIsLoading(true);
      const records = await volunteerService.getVolunteerHours();
      const found = records.find(r => r.id === recordId);
      if (found) {
        setRecord(found);
      } else {
        throw new Error('Record not found');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load volunteer hour record');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this volunteer hour record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await volunteerService.deleteVolunteerHour(recordId);
              Alert.alert('Success', 'Record deleted', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete record');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return colors.success;
      case 'pending': return colors.warning;
      case 'rejected': return colors.error;
      default: return colors.gray500;
    }
  };

  if (isLoading || !record) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#F8FAFC', '#FEF2F2', '#FEE2E2']}
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
            <Ionicons name="arrow-back" size={24} color={colors.volunteering.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>Volunteer Hours</Text>
          <View style={styles.placeholder} />
        </View>

        <GradientCard section="volunteering" variant="elevated" style={styles.card}>
          <View style={styles.recordHeader}>
            <View style={styles.recordHeaderLeft}>
              <Ionicons name="heart" size={48} color={colors.volunteering.primary} />
              <View style={styles.recordHeaderText}>
                <Text style={styles.organizationName}>{record.organizationName}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) }]}>
                  <Text style={styles.statusText}>{record.status.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time" size={20} color={colors.volunteering.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Hours</Text>
              <Text style={styles.detailValue}>{record.hours} hours</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color={colors.volunteering.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {record.startTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          {record.description && (
            <>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{record.description}</Text>
            </>
          )}

          {record.location && (
            <View style={styles.detailRow}>
              <Ionicons name="location" size={20} color={colors.volunteering.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{record.location}</Text>
              </View>
            </View>
          )}

          {(record.supervisorName || record.supervisorEmail) && (
            <>
              <Text style={styles.sectionTitle}>Supervisor</Text>
              {record.supervisorName && (
                <View style={styles.detailRow}>
                  <Ionicons name="person" size={20} color={colors.volunteering.primary} />
                  <Text style={styles.detailValue}>{record.supervisorName}</Text>
                </View>
              )}
              {record.supervisorEmail && (
                <View style={styles.detailRow}>
                  <Ionicons name="mail" size={20} color={colors.volunteering.primary} />
                  <Text style={styles.detailValue}>{record.supervisorEmail}</Text>
                </View>
              )}
            </>
          )}

          {record.verificationCode && (
            <View style={styles.verificationContainer}>
              <Text style={styles.verificationLabel}>Verification Code</Text>
              <Text style={styles.verificationCode}>{record.verificationCode}</Text>
            </View>
          )}
        </GradientCard>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
          <Text style={styles.deleteButtonText}>Delete Record</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  recordHeader: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  recordHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  recordHeaderText: {
    flex: 1,
  },
  organizationName: {
    ...typography.h3,
    color: colors.gray900,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  statusText: {
    ...typography.labelSmall,
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    ...typography.labelSmall,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  detailValue: {
    ...typography.body,
    color: colors.gray900,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.gray900,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  description: {
    ...typography.body,
    color: colors.gray700,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  verificationContainer: {
    backgroundColor: colors.gray100,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  verificationLabel: {
    ...typography.labelSmall,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  verificationCode: {
    ...typography.bodyLarge,
    color: colors.gray900,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
    gap: spacing.sm,
    ...shadows.sm,
  },
  deleteButtonText: {
    ...typography.button,
    color: colors.error,
  },
});

