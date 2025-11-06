import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '../navigation/SimpleNavigation';
import GradientButton from '../components/common/GradientButton';
import { typography, spacing, borderRadius, shadows, colors } from '../theme';
import { fadeIn } from '../utils/animations';
import { authService } from '../services/authService';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    grade: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    fadeIn(fadeAnim, 400).start();
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleRegister = async () => {
    console.log('[RegisterScreen] handleRegister called');
    const { name, email, password, confirmPassword, age, grade } = formData;
    
    console.log('[RegisterScreen] Form data:', { name, email, hasPassword: !!password, hasConfirmPassword: !!confirmPassword, age, grade });
    
    if (!name || !email || !password || !confirmPassword || !age || !grade) {
      console.log('[RegisterScreen] Validation failed: missing fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      console.log('[RegisterScreen] Validation failed: passwords do not match');
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      console.log('[RegisterScreen] Validation failed: password too short');
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13 || ageNum > 19) {
      console.log('[RegisterScreen] Validation failed: invalid age');
      Alert.alert('Error', 'Age must be between 13 and 19');
      return;
    }

    console.log('[RegisterScreen] Validation passed, calling API...');
    setIsLoading(true);
    
    try {
      // Call backend API
      const response = await authService.register({
        email,
        password,
        displayName: name,
        nickname: name,
      });
      
      console.log('[RegisterScreen] Registration successful:', response.user?.email);

      // Map backend user to frontend User type
      const user = {
        id: response.user.id || '',
        name: response.user.displayName || name || 'User',
        email: response.user.email || email,
        age: ageNum,
        grade: grade,
        profileImage: response.user.avatar || '',
        preferences: {
          theme: 'light' as const,
          notifications: {
            schedule: true,
            volunteering: true,
            social: true,
            mentalHealth: true,
          },
          privacy: {
            shareSchedule: false,
            shareVolunteering: true,
            shareMood: false,
          },
        },
        createdAt: response.user.createdAt ? new Date(response.user.createdAt) : new Date(),
        updatedAt: response.user.updatedAt ? new Date(response.user.updatedAt) : new Date(),
      };
      
      // Validate user object before login
      if (!user.id || !user.email) {
        throw new Error('Invalid user data received from server');
      }
      
      // Login with the user and token
      login(user, response.accessToken);
      setIsLoading(false);
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        console.log('[RegisterScreen] Navigating to Main screen');
        navigation.navigate('Main');
      }, 100);
    } catch (error: any) {
      setIsLoading(false);
      console.error('[RegisterScreen] Registration error:', error);
      const errorMessage = error.message || 'Failed to create account. Please try again.';
      Alert.alert('Registration Failed', errorMessage);
    }
  };

  const gradeOptions = [
    '6th Grade', '7th Grade', '8th Grade', '9th Grade',
    '10th Grade', '11th Grade', '12th Grade', 'College Freshman'
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#F8FAFC', '#EDE9FE', '#F3E8FF']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>Create Account 🎉</Text>
            <Text style={styles.subtitle}>Join Teen Life Manager today</Text>
          </View>

          <View style={styles.form}>
            <View style={[styles.inputContainer, shadows.sm]}>
              <Ionicons name="person" size={22} color={colors.profile.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={colors.gray500}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={[styles.inputContainer, shadows.sm]}>
              <Ionicons name="mail" size={22} color={colors.profile.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.gray500}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={[styles.inputContainer, shadows.sm]}>
              <Ionicons name="lock-closed" size={22} color={colors.profile.primary} style={styles.inputIcon} />
              <TextInput
                ref={passwordInputRef}
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.gray500}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="next"
                enablesReturnKeyAutomatically={true}
                blurOnSubmit={false}
                importantForAutofill="no"
                textContentType="none"
                autoComplete="off"
                clearButtonMode="never"
                editable={true}
                selectTextOnFocus={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => {
                  setShowPassword(!showPassword);
                  // Maintain focus after toggling visibility
                  setTimeout(() => {
                    passwordInputRef.current?.focus();
                  }, 100);
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={22} 
                  color={colors.profile.primary} 
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, shadows.sm]}>
              <Ionicons name="lock-closed" size={22} color={colors.profile.primary} style={styles.inputIcon} />
              <TextInput
                ref={confirmPasswordInputRef}
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={colors.gray500}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="done"
                enablesReturnKeyAutomatically={true}
                blurOnSubmit={false}
                importantForAutofill="no"
                textContentType="none"
                autoComplete="off"
                clearButtonMode="never"
                editable={true}
                selectTextOnFocus={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                  // Maintain focus after toggling visibility
                  setTimeout(() => {
                    confirmPasswordInputRef.current?.focus();
                  }, 100);
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={22} 
                  color={colors.profile.primary} 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, shadows.sm, { flex: 1, marginRight: spacing.sm }]}>
                <Ionicons name="calendar" size={22} color={colors.profile.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor={colors.gray500}
                  value={formData.age}
                  onChangeText={(value) => handleInputChange('age', value)}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              <View style={[styles.inputContainer, shadows.sm, { flex: 2, marginLeft: spacing.sm }]}>
                <Ionicons name="school" size={22} color={colors.profile.primary} style={styles.inputIcon} />
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

            <GradientButton
              title={isLoading ? 'Creating Account...' : 'Create Account'}
              onPress={() => {
                console.log('[RegisterScreen] Button pressed!');
                handleRegister();
              }}
              section="auth"
              size="large"
              disabled={isLoading}
              loading={isLoading}
              style={styles.registerButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={[styles.socialButton, shadows.sm]}>
              <Ionicons name="logo-google" size={22} color="#DB4437" />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, shadows.sm]}>
              <Ionicons name="logo-apple" size={22} color="#000" />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h3,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.gray600,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 0,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minHeight: 56,
    overflow: 'visible',
    ...(Platform.OS === 'ios' && {
      zIndex: 0,
    }),
  },
  inputIcon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingRight: spacing.sm,
    ...typography.body,
    color: colors.gray900,
    minHeight: 20,
    ...(Platform.OS === 'ios' && {
      fontSize: 16, // Prevent zoom on iOS
    }),
  },
  eyeIcon: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
    zIndex: 1,
    ...(Platform.OS === 'ios' && {
      pointerEvents: 'box-only',
    }),
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  registerButton: {
    marginBottom: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray300,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    ...typography.bodySmall,
    color: colors.gray500,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 0,
    marginBottom: spacing.md,
  },
  socialButtonText: {
    ...typography.button,
    color: colors.gray900,
    marginLeft: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.gray600,
  },
  footerLink: {
    ...typography.bodySmall,
    color: colors.profile.primary,
    fontWeight: '700',
  },
});
