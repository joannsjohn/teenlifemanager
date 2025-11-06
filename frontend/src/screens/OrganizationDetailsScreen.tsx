import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/SimpleNavigation';
import GradientCard from '../components/common/GradientCard';
import GradientButton from '../components/common/GradientButton';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { organizationService } from '../services/organizationService';
import { Organization } from '../types';

export default function OrganizationDetailsScreen({ route }: any) {
  const navigation = useNavigation();
  const { organizationId } = route?.params || {};
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrganization();
  }, [organizationId]);

  const loadOrganization = async () => {
    try {
      setIsLoading(true);
      const org = await organizationService.getOrganizationById(organizationId);
      setOrganization(org);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load organization');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHours = () => {
    navigation.navigate('AddVolunteerHours' as any, { organizationId: organization?.id });
  };

  const handleEdit = () => {
    navigation.navigate('EditOrganization' as any, { organizationId: organization?.id });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Organization',
      'Are you sure you want to delete this organization?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await organizationService.deleteOrganization(organizationId);
              Alert.alert('Success', 'Organization deleted', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete organization');
            }
          },
        },
      ]
    );
  };

  if (isLoading || !organization) {
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
          <Text style={styles.headerTitle} numberOfLines={1}>{organization.name}</Text>
          <View style={styles.placeholder} />
        </View>

        <GradientCard section="volunteering" variant="elevated" style={styles.card}>
          <View style={styles.orgHeader}>
            <Ionicons name="business" size={48} color={colors.volunteering.primary} />
            {organization.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          {organization.description && (
            <>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{organization.description}</Text>
            </>
          )}

          {organization.categories && organization.categories.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.categoriesContainer}>
                {organization.categories.map((category, index) => (
                  <View key={index} style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{category}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {(organization.website || organization.contactEmail || organization.contactPhone || organization.address) && (
            <>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              {organization.website && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => Linking.openURL(organization.website!)}
                >
                  <Ionicons name="globe" size={20} color={colors.volunteering.primary} />
                  <Text style={styles.contactText}>{organization.website}</Text>
                  <Ionicons name="open-outline" size={16} color={colors.gray400} />
                </TouchableOpacity>
              )}
              {organization.contactEmail && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => Linking.openURL(`mailto:${organization.contactEmail}`)}
                >
                  <Ionicons name="mail" size={20} color={colors.volunteering.primary} />
                  <Text style={styles.contactText}>{organization.contactEmail}</Text>
                </TouchableOpacity>
              )}
              {organization.contactPhone && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => Linking.openURL(`tel:${organization.contactPhone}`)}
                >
                  <Ionicons name="call" size={20} color={colors.volunteering.primary} />
                  <Text style={styles.contactText}>{organization.contactPhone}</Text>
                </TouchableOpacity>
              )}
              {organization.address && (
                <View style={styles.contactItem}>
                  <Ionicons name="location" size={20} color={colors.volunteering.primary} />
                  <Text style={styles.contactText}>{organization.address}</Text>
                </View>
              )}
            </>
          )}
        </GradientCard>

        <GradientButton
          title="Log Volunteer Hours"
          onPress={handleAddHours}
          section="volunteering"
          size="large"
          style={styles.actionButton}
        />

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={20} color={colors.volunteering.primary} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
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
  orgHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  verifiedText: {
    ...typography.labelSmall,
    color: colors.success,
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
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryTag: {
    backgroundColor: colors.volunteering.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  categoryText: {
    ...typography.labelSmall,
    color: colors.volunteering.primary,
    fontWeight: '600',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  contactText: {
    ...typography.body,
    color: colors.gray700,
    flex: 1,
  },
  actionButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.volunteering.primary,
    gap: spacing.sm,
    ...shadows.sm,
  },
  editButtonText: {
    ...typography.button,
    color: colors.volunteering.primary,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
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

