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
import { organizationService, UpdateOrganizationData } from '../services/organizationService';
import { Organization } from '../types';

export default function EditOrganizationScreen({ route }: any) {
  const navigation = useNavigation();
  const { organizationId } = route?.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<UpdateOrganizationData>({
    name: '',
    description: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    categories: [],
  });
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    loadOrganization();
  }, [organizationId]);

  const loadOrganization = async () => {
    try {
      setIsLoadingOrg(true);
      const org = await organizationService.getOrganizationById(organizationId);
      setOrganization(org);
      setFormData({
        name: org.name,
        description: org.description || '',
        website: org.website || '',
        contactEmail: org.contactEmail || '',
        contactPhone: org.contactPhone || '',
        address: org.address || '',
        categories: org.categories || [],
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load organization');
      navigation.goBack();
    } finally {
      setIsLoadingOrg(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !formData.categories?.includes(newCategory.trim())) {
      setFormData({
        ...formData,
        categories: [...(formData.categories || []), newCategory.trim()],
      });
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setFormData({
      ...formData,
      categories: formData.categories?.filter(c => c !== category) || [],
    });
  };

  const handleSubmit = async () => {
    if (!formData.name?.trim()) {
      Alert.alert('Error', 'Organization name is required');
      return;
    }

    try {
      setIsLoading(true);
      await organizationService.updateOrganization(organizationId, formData);
      Alert.alert('Success', 'Organization updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update organization');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingOrg || !organization) {
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
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
            <Text style={styles.headerTitle} numberOfLines={1}>Edit Organization</Text>
            <View style={styles.placeholder} />
          </View>

          <GradientCard section="volunteering" variant="elevated" style={styles.card}>
            <Text style={styles.label}>
              <Ionicons name="business" size={16} color={colors.volunteering.primary} /> Organization Name *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Local Food Bank"
              placeholderTextColor={colors.gray400}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <Text style={styles.label}>
              <Ionicons name="document-text" size={16} color={colors.volunteering.primary} /> Description
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the organization..."
              placeholderTextColor={colors.gray400}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>
              <Ionicons name="globe" size={16} color={colors.volunteering.primary} /> Website
            </Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.org"
              placeholderTextColor={colors.gray400}
              value={formData.website}
              onChangeText={(text) => setFormData({ ...formData, website: text })}
              keyboardType="url"
              autoCapitalize="none"
            />

            <Text style={styles.label}>
              <Ionicons name="mail" size={16} color={colors.volunteering.primary} /> Contact Email
            </Text>
            <TextInput
              style={styles.input}
              placeholder="volunteer@example.org"
              placeholderTextColor={colors.gray400}
              value={formData.contactEmail}
              onChangeText={(text) => setFormData({ ...formData, contactEmail: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>
              <Ionicons name="call" size={16} color={colors.volunteering.primary} /> Contact Phone
            </Text>
            <TextInput
              style={styles.input}
              placeholder="(555) 123-4567"
              placeholderTextColor={colors.gray400}
              value={formData.contactPhone}
              onChangeText={(text) => setFormData({ ...formData, contactPhone: text })}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>
              <Ionicons name="location" size={16} color={colors.volunteering.primary} /> Address
            </Text>
            <TextInput
              style={styles.input}
              placeholder="123 Main St, City, State 12345"
              placeholderTextColor={colors.gray400}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />

            <Text style={styles.label}>
              <Ionicons name="pricetags" size={16} color={colors.volunteering.primary} /> Categories
            </Text>
            <View style={styles.categoryInputContainer}>
              <TextInput
                style={styles.categoryInput}
                placeholder="Add a category (e.g., Hunger Relief)"
                placeholderTextColor={colors.gray400}
                value={newCategory}
                onChangeText={setNewCategory}
                onSubmitEditing={handleAddCategory}
              />
              <TouchableOpacity style={styles.addCategoryButton} onPress={handleAddCategory}>
                <Ionicons name="add" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
            {formData.categories && formData.categories.length > 0 && (
              <View style={styles.categoriesContainer}>
                {formData.categories.map((category, index) => (
                  <View key={index} style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{category}</Text>
                    <TouchableOpacity onPress={() => handleRemoveCategory(category)}>
                      <Ionicons name="close-circle" size={18} color={colors.gray600} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </GradientCard>

          <GradientButton
            title="Update Organization"
            onPress={handleSubmit}
            section="volunteering"
            size="large"
            style={styles.submitButton}
            disabled={isLoading || !formData.name?.trim()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardContainer: {
    flex: 1,
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
  categoryInputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  categoryInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.gray900,
    backgroundColor: colors.white,
  },
  addCategoryButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.volunteering.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.volunteering.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    gap: spacing.xs,
  },
  categoryTagText: {
    ...typography.labelSmall,
    color: colors.volunteering.primary,
    fontWeight: '600',
  },
  submitButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
});

