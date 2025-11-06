import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '../navigation/SimpleNavigation';
import GradientButton from '../components/common/GradientButton';
import GradientCard from '../components/common/GradientCard';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { fadeIn } from '../utils/animations';
import { userService } from '../services/userService';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuthStore();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age?.toString() || '',
    grade: user?.grade || '',
    profileImage: user?.profileImage || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fadeIn(fadeAnim, 300).start();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    setIsLoading(true);

    try {
      // Map frontend fields to backend fields
      const updateData = {
        displayName: formData.name,
        nickname: formData.name, // Use name as nickname for now
        avatar: formData.profileImage || undefined,
        // Note: age and grade are not in backend schema yet
        // We'll store them in user preferences or add to schema later
      };

      // Call backend API
      const updatedProfile = await userService.updateProfile(updateData);

      // Update local state
      updateUser({
        name: updatedProfile.displayName,
        email: updatedProfile.email,
        profileImage: updatedProfile.avatar,
        // Keep age and grade from form data (stored locally for now)
        age: parseInt(formData.age) || user?.age,
        grade: formData.grade || user?.grade,
      });

      Alert.alert('Success', 'Profile updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const gradeOptions = [
    '6th Grade',
    '7th Grade',
    '8th Grade',
    '9th Grade',
    '10th Grade',
    '11th Grade',
    '12th Grade',
    'College Freshman',
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={['#F8FAFC', '#EDE9FE', '#F3E8FF']}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
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
              <Text style={styles.headerTitle} numberOfLines={1}>Edit Profile</Text>
              <View style={styles.placeholder} />
            </View>

          {/* Profile Image Section */}
          <GradientCard section="profile" variant="elevated" style={styles.imageCard}>
            <View style={styles.imageContainer}>
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={48} color={colors.profile.primary} />
              </View>
              <TouchableOpacity style={styles.editImageButton} activeOpacity={0.7}>
                <LinearGradient
                  colors={[colors.profile.primary, colors.profile.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.editImageButtonGradient}
                >
                  <Ionicons name="camera" size={18} color={colors.white} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.imageHint}>Tap to change profile picture</Text>
          </GradientCard>

          {/* Form */}
          <GradientCard section="profile" variant="elevated" style={styles.formCard}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <View style={styles.label}>
                  <Ionicons name="person-outline" size={16} color={colors.profile.primary} />
                  <Text style={styles.labelText}>Full Name</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.gray500}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.label}>
                  <Ionicons name="mail-outline" size={16} color={colors.profile.primary} />
                  <Text style={styles.labelText}>Email</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.gray500}
                  value={formData.email}
                  editable={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={styles.hintText}>Email cannot be changed</Text>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
                  <View style={styles.label}>
                    <Ionicons name="calendar-outline" size={16} color={colors.profile.primary} />
                    <Text style={styles.labelText}>Age</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Age"
                    placeholderTextColor={colors.gray500}
                    value={formData.age}
                    onChangeText={(value) => handleInputChange('age', value.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 2, marginLeft: spacing.sm }]}>
                  <View style={styles.label}>
                    <Ionicons name="school-outline" size={16} color={colors.profile.primary} />
                    <Text style={styles.labelText}>Grade</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Grade"
                    placeholderTextColor={colors.gray500}
                    value={formData.grade}
                    onChangeText={(value) => handleInputChange('grade', value)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.label}>
                  <Ionicons name="image-outline" size={16} color={colors.profile.primary} />
                  <Text style={styles.labelText}>Profile Image URL</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor={colors.gray500}
                  value={formData.profileImage}
                  onChangeText={(value) => handleInputChange('profileImage', value)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />
                <Text style={styles.hintText}>Optional: Enter a URL for your profile picture</Text>
              </View>
            </View>
          </GradientCard>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <GradientButton
              title="Save Changes"
              onPress={handleSave}
              section="profile"
              size="large"
              disabled={isLoading}
              loading={isLoading}
              style={styles.saveButton}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
    minHeight: 44, // Minimum touch target height
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
    width: 40,
  },
  imageCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.profile.primary,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.md,
  },
  editImageButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageHint: {
    ...typography.bodySmall,
    color: colors.gray600,
  },
  formCard: {
    marginBottom: spacing.lg,
    padding: 0,
  },
  form: {
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  labelText: {
    ...typography.label,
    color: colors.gray900,
  },
  input: {
    ...typography.body,
    color: colors.gray900,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  disabledInput: {
    backgroundColor: colors.gray100,
    color: colors.gray600,
  },
  hintText: {
    ...typography.bodySmall,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
  },
  actions: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  saveButton: {
    marginBottom: spacing.md,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.gray600,
  },
});

