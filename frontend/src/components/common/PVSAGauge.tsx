import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';

interface PVSAGaugeProps {
  level: 'bronze' | 'silver' | 'gold';
  currentHours: number;
  threshold: number;
  isAchieved: boolean;
  progress: number; // 0-100
}

const levelColors = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
};

const levelNames = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
};

export default function PVSAGauge({ level, currentHours, threshold, isAchieved, progress }: PVSAGaugeProps) {
  const color = levelColors[level];
  const name = levelNames[level];
  
  // Calculate progress percentage (capped at 100%)
  const progressPercent = Math.min(100, progress);
  
  // Create circular progress using border radius
  const size = 80;
  const strokeWidth = 8;
  const radius = size / 2;

  return (
    <View style={styles.container}>
      <View style={styles.gaugeContainer}>
        {/* Background circle */}
        <View style={[styles.circle, styles.backgroundCircle, { width: size, height: size, borderRadius: radius }]} />
        
        {/* Progress circle - using border colors to show progress */}
        {progressPercent > 0 && (
          <View
            style={[
              styles.circle,
              {
                width: size,
                height: size,
                borderRadius: radius,
                borderWidth: strokeWidth,
                borderColor: 'transparent',
                borderTopColor: progressPercent >= 25 ? color : colors.gray200,
                borderRightColor: progressPercent >= 50 ? color : colors.gray200,
                borderBottomColor: progressPercent >= 75 ? color : colors.gray200,
                borderLeftColor: progressPercent >= 100 ? color : colors.gray200,
                transform: [{ rotate: '-90deg' }],
              },
            ]}
          />
        )}
        
        {/* Center content */}
        <View style={styles.centerContent}>
          {isAchieved ? (
            <Ionicons name="checkmark-circle" size={32} color={color} />
          ) : (
            <View style={styles.centerText}>
              <Text style={[styles.hoursText, { color }]}>
                {Math.min(currentHours, threshold)}
              </Text>
              <Text style={styles.slashText}>/</Text>
              <Text style={styles.thresholdText}>{threshold}</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={[styles.levelName, { color }]}>{name}</Text>
      {!isAchieved && (
        <Text style={styles.hoursNeeded}>
          {Math.max(0, threshold - currentHours)}h needed
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.xs,
  },
  gaugeContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    position: 'relative',
  },
  circle: {
    position: 'absolute',
  },
  backgroundCircle: {
    borderWidth: 8,
    borderColor: colors.gray200,
    backgroundColor: 'transparent',
  },
  progressCircle: {
    backgroundColor: 'transparent',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hoursText: {
    ...typography.label,
    fontWeight: '700',
    fontSize: 14,
  },
  slashText: {
    ...typography.labelSmall,
    color: colors.gray500,
    marginHorizontal: 2,
    fontSize: 12,
  },
  thresholdText: {
    ...typography.labelSmall,
    color: colors.gray500,
    fontSize: 12,
  },
  levelName: {
    ...typography.label,
    fontWeight: '700',
    marginBottom: spacing.xs / 2,
    fontSize: 14,
  },
  hoursNeeded: {
    ...typography.labelSmall,
    color: colors.gray600,
    fontSize: 10,
    textAlign: 'center',
  },
});

