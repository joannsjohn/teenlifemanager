import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/SimpleNavigation';
import GradientCard from '../components/common/GradientCard';
import GradientButton from '../components/common/GradientButton';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { volunteerService, CreateVolunteerHourData } from '../services/volunteerService';
import { organizationService } from '../services/organizationService';
import { Organization } from '../types';

export default function AddVolunteerHoursScreen({ route }: any) {
  const navigation = useNavigation();
  const preSelectedOrgId = route?.params?.organizationId;
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showOrgPicker, setShowOrgPicker] = useState(false);
  const [formData, setFormData] = useState<CreateVolunteerHourData>({
    organizationId: preSelectedOrgId || '',
    organization: '',
    description: '',
    hours: 0,
    date: new Date().toISOString().split('T')[0],
    location: '',
    supervisorName: '',
    supervisorEmail: '',
  });

  useEffect(() => {
    loadOrganizations();
    if (preSelectedOrgId) {
      loadSelectedOrganization(preSelectedOrgId);
    }
  }, [preSelectedOrgId]);

  const loadOrganizations = async () => {
    try {
      const orgs = await organizationService.getOrganizations();
      setOrganizations(orgs);
    } catch (error) {
      // Silently fail - network errors are expected when backend is not available
      if (__DEV__) {
        console.log('Organization service unavailable - backend may not be running');
      }
      setOrganizations([]); // Set empty array on error
    }
  };

  const loadSelectedOrganization = async (orgId: string) => {
    try {
      const org = await organizationService.getOrganizationById(orgId);
      setFormData({
        ...formData,
        organizationId: org.id,
        organization: org.name,
      });
    } catch (error) {
      // Silently fail - network errors are expected when backend is not available
      if (__DEV__) {
        console.log('Organization service unavailable - backend may not be running');
      }
      // If organization load fails, just use the ID as the name
      setFormData({
        ...formData,
        organizationId: orgId,
        organization: orgId,
      });
    }
  };

  const handleSelectOrganization = (org: Organization) => {
    setFormData({
      ...formData,
      organizationId: org.id,
      organization: org.name,
    });
    setShowOrgPicker(false);
  };

  const handleAddNewOrganization = () => {
    setShowOrgPicker(false);
    navigation.navigate('AddOrganization' as any, {
      onComplete: (newOrgId: string) => {
        loadOrganizations();
        loadSelectedOrganization(newOrgId);
      },
    });
  };

  const handleSubmit = async () => {
    if (!formData.organization.trim()) {
      Alert.alert('Error', 'Organization is required');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Description is required');
      return;
    }
    if (!formData.hours || formData.hours <= 0) {
      Alert.alert('Error', 'Hours must be greater than 0');
      return;
    }
    if (!formData.date) {
      Alert.alert('Error', 'Date is required');
      return;
    }

    try {
      setIsLoading(true);
      await volunteerService.createVolunteerHour({
        ...formData,
        date: new Date(formData.date),
      });
      Alert.alert('Success', 'Volunteer hours logged successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to log volunteer hours');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={['#F8FAFC', '#FEF2F2', '#FEE2E2']}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
            <Text style={styles.headerTitle}>Log Hours</Text>
            <View style={styles.placeholder} />
          </View>

          <GradientCard section="volunteering" variant="elevated" style={styles.card}>
            <Text style={styles.label}>
              <Ionicons name="business" size={16} color={colors.volunteering.primary} /> Organization *
            </Text>
            <TouchableOpacity
              style={styles.orgPicker}
              onPress={() => setShowOrgPicker(true)}
            >
              <Text style={[styles.orgPickerText, !formData.organization && styles.orgPickerPlaceholder]}>
                {formData.organization || 'Select or add organization'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.gray400} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addOrgButton}
              onPress={handleAddNewOrganization}
            >
              <Ionicons name="add-circle" size={18} color={colors.volunteering.primary} />
              <Text style={styles.addOrgText}>Add New Organization</Text>
            </TouchableOpacity>

            <Text style={styles.label}>
              <Ionicons name="document-text" size={16} color={colors.volunteering.primary} /> Description *
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What did you do? (e.g., Helped distribute food to families)"
              placeholderTextColor={colors.gray400}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>
                  <Ionicons name="time" size={16} color={colors.volunteering.primary} /> Hours *
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={colors.gray400}
                  value={formData.hours ? formData.hours.toString() : ''}
                  onChangeText={(text) => setFormData({ ...formData, hours: parseFloat(text) || 0 })}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>
                  <Ionicons name="calendar" size={16} color={colors.volunteering.primary} /> Date *
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.gray400}
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                />
              </View>
            </View>

            <Text style={styles.label}>
              <Ionicons name="location" size={16} color={colors.volunteering.primary} /> Location
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Where did you volunteer?"
              placeholderTextColor={colors.gray400}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />

            <Text style={styles.label}>
              <Ionicons name="person" size={16} color={colors.volunteering.primary} /> Supervisor Name
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Supervisor's name"
              placeholderTextColor={colors.gray400}
              value={formData.supervisorName}
              onChangeText={(text) => setFormData({ ...formData, supervisorName: text })}
            />

            <Text style={styles.label}>
              <Ionicons name="mail" size={16} color={colors.volunteering.primary} /> Supervisor Email
            </Text>
            <TextInput
              style={styles.input}
              placeholder="supervisor@example.org"
              placeholderTextColor={colors.gray400}
              value={formData.supervisorEmail}
              onChangeText={(text) => setFormData({ ...formData, supervisorEmail: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </GradientCard>

          <GradientButton
            title="Log Hours"
            onPress={handleSubmit}
            section="volunteering"
            size="large"
            style={styles.submitButton}
            disabled={isLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Organization Picker Modal */}
      {showOrgPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Organization</Text>
              <TouchableOpacity onPress={() => setShowOrgPicker(false)}>
                <Ionicons name="close" size={24} color={colors.gray600} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {organizations.map((org) => (
                <TouchableOpacity
                  key={org.id}
                  style={styles.orgOption}
                  onPress={() => handleSelectOrganization(org)}
                >
                  <Text style={styles.orgOptionText}>{org.name}</Text>
                  {org.isVerified && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalAddButton}
              onPress={handleAddNewOrganization}
            >
              <Ionicons name="add-circle" size={20} color={colors.volunteering.primary} />
              <Text style={styles.modalAddText}>Add New Organization</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    marginBottom: spacing.lg,
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
    ...typography.h4,
    color: colors.gray900,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  label: {
    ...typography.body,
    color: colors.gray900,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.gray900,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  orgPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  orgPickerText: {
    ...typography.body,
    color: colors.gray900,
    flex: 1,
  },
  orgPickerPlaceholder: {
    color: colors.gray400,
  },
  addOrgButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.volunteering.primary + '10',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  addOrgText: {
    ...typography.label,
    color: colors.volunteering.primary,
    fontWeight: '600',
  },
  submitButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    width: '90%',
    maxHeight: '70%',
    ...shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.gray900,
    fontWeight: '600',
  },
  modalList: {
    maxHeight: 400,
  },
  orgOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  orgOptionText: {
    ...typography.body,
    color: colors.gray900,
    flex: 1,
  },
  modalAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    gap: spacing.sm,
  },
  modalAddText: {
    ...typography.body,
    color: colors.volunteering.primary,
    fontWeight: '600',
  },
});

