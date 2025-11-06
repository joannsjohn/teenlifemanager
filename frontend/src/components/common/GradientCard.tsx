import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, shadows } from '../../theme';

type Section = 'schedule' | 'volunteering' | 'social' | 'mentalHealth' | 'profile';

interface GradientCardProps {
  children: ReactNode;
  section?: Section;
  variant?: 'gradient' | 'border' | 'elevated';
  style?: ViewStyle;
}

const getGradientColors = (section: Section = 'profile'): string[] => {
  const gradientMap: Record<Section, string[]> = {
    schedule: ['#0066FF', '#00CCFF'],
    volunteering: ['#FF6B6B', '#FF8E8E'],
    social: ['#B026FF', '#FF6B9D'],
    mentalHealth: ['#00D4AA', '#00FFCC'],
    profile: ['#6366F1', '#8B5CF6'],
  };
  return gradientMap[section];
};

export default function GradientCard({
  children,
  section = 'profile',
  variant = 'elevated',
  style,
}: GradientCardProps) {
  const gradientColors = getGradientColors(section);

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[gradientColors[0], gradientColors[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles.gradientCard, shadows.lg, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  if (variant === 'border') {
    return (
      <View
        style={[
          styles.card,
          styles.borderCard,
          { borderColor: gradientColors[0] },
          shadows.md,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  // Elevated variant (default)
  return (
    <View style={[styles.card, styles.elevatedCard, shadows.lg, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: 16,
    backgroundColor: colors.white,
  },
  gradientCard: {
    // Gradient background
  },
  borderCard: {
    borderWidth: 2,
    backgroundColor: colors.white,
  },
  elevatedCard: {
    backgroundColor: colors.white,
  },
});
