import React, { useState, useRef, useEffect } from 'react';
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

  useEffect(() => {
    fadeIn(fadeAnim, 400).start();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { name, email, password, confirmPassword, age, grade } = formData;
    
    if (!name || !email || !password || !confirmPassword || !age || !grade) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const ageNum = parseInt(age);
    if (ageNum < 13 || ageNum > 19) {
      Alert.alert('Error', 'Age must be between 13 and 19');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock user data
      const mockUser = {
        id: '1',
        name: name,
        email: email,
        age: ageNum,
        grade: grade,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      login(mockUser);
      setIsLoading(false);
      navigation.navigate('Main');
    }, 1000);
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
            <Text style={styles.title}>Create Account 🎉</Text>
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
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.gray500}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
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
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={colors.gray500}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
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
              onPress={handleRegister}
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
    ...typography.h1,
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
  },
  inputIcon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.gray900,
  },
  eyeIcon: {
    padding: spacing.xs,
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
