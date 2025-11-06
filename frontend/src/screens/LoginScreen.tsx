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
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '../navigation/SimpleNavigation';
import GradientButton from '../components/common/GradientButton';
import { gradients, typography, spacing, borderRadius, shadows, colors } from '../theme';
import { fadeIn } from '../utils/animations';
import { authService } from '../services/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeIn(fadeAnim, 400).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Call backend API
      const response = await authService.login({
        email,
        password,
      });

      // Map backend user to frontend User type
      // Note: Backend doesn't return age/grade, so we use defaults
      // These should be stored in user preferences or profile
      const user = {
        id: response.user.id || '',
        name: response.user.displayName || response.user.nickname || 'User',
        email: response.user.email || email,
        age: 16, // Default - should be fetched from user profile
        grade: '11th Grade', // Default - should be fetched from user profile
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
        navigation.navigate('Main');
      }, 100);
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error.message || 'Failed to login. Please check your credentials.';
      Alert.alert('Login Failed', errorMessage);
      if (__DEV__) {
        console.error('Login error:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#F8FAFC', '#EDE9FE', '#F3E8FF']}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back! 👋</Text>
          <Text style={styles.subtitle}>Sign in to manage your teen life</Text>
        </View>

        <View style={styles.form}>
          <View style={[styles.inputContainer, shadows.sm]}>
            <Ionicons name="mail" size={22} color={colors.profile.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.gray500}
              value={email}
              onChangeText={setEmail}
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
              value={password}
              onChangeText={setPassword}
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

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <GradientButton
            title={isLoading ? 'Signing In...' : 'Sign In'}
            onPress={handleLogin}
            section="auth"
            size="large"
            disabled={isLoading}
            loading={isLoading}
            style={styles.loginButton}
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
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
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
    ...shadows.md,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    ...typography.bodySmall,
    color: colors.profile.primary,
    fontWeight: '600',
  },
  loginButton: {
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
    ...shadows.sm,
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
