import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, borderRadius, shadows } from '../../theme';

type Section = 'schedule' | 'volunteering' | 'social' | 'mentalHealth' | 'profile' | 'auth';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  section?: Section;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const getGradientColors = (section: Section = 'auth'): string[] => {
  const gradientMap: Record<Section, string[]> = {
    schedule: ['#0066FF', '#00CCFF'],
    volunteering: ['#FF6B6B', '#FF8E8E'],
    social: ['#B026FF', '#FF6B9D'],
    mentalHealth: ['#00D4AA', '#00FFCC'],
    profile: ['#6366F1', '#8B5CF6'],
    auth: ['#6366F1', '#8B5CF6', '#EC4899'],
  };
  return gradientMap[section];
};

export default function GradientButton({
  title,
  onPress,
  section = 'auth',
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}: GradientButtonProps) {
  const gradientColors = getGradientColors(section);
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14 };
      case 'large':
        return { paddingVertical: 18, paddingHorizontal: 32, fontSize: 18 };
      default:
        return { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16 };
    }
  };

  const sizeStyles = getSizeStyles();

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          styles.outlineButton,
          { borderColor: gradientColors[0] },
          { paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal },
          style,
          (disabled || loading) && styles.disabled,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={gradientColors[0]} size="small" />
        ) : (
          <Text
            style={[
              styles.text,
              styles.outlineText,
              { color: gradientColors[0], fontSize: sizeStyles.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        { paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal },
        style,
        (disabled || loading) && styles.disabled,
      ]}
    >
      <LinearGradient
        colors={disabled || loading ? [colors.gray400, colors.gray500] : gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, styles.gradientButton, shadows.md]}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <Text
            style={[
              styles.text,
              { fontSize: sizeStyles.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gradientButton: {
    ...Platform.select({
      ios: shadows.md,
      android: {
        elevation: 4,
      },
    }),
  },
  outlineButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  text: {
    ...typography.button,
    color: colors.white,
  },
  outlineText: {
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  },
});
