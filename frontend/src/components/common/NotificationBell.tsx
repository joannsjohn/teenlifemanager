import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notificationService } from '../../services/notificationService';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface NotificationBellProps {
  onPress: () => void;
  size?: number;
}

export default function NotificationBell({ onPress, size = 24 }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    loadUnreadCount();
    // Poll for unread count every 30 seconds, but only if we successfully loaded once
    let interval: NodeJS.Timeout | null = null;
    const startPolling = () => {
      interval = setInterval(() => {
        loadUnreadCount();
      }, 30000);
    };
    
    // Only start polling after initial load succeeds
    // For now, we'll start polling anyway but handle errors gracefully
    startPolling();
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (unreadCount > 0) {
      // Pulse animation when there are unread notifications
      const canUseNativeDriver = Platform.OS !== 'web';
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: canUseNativeDriver,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: canUseNativeDriver,
          }),
        ])
      ).start();
    }
  }, [unreadCount]);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      // Silently fail - network errors are expected when backend is not available
      // Only log in development mode
      if (__DEV__) {
        console.log('Notification service unavailable - this is expected if backend is not running');
      }
      setUnreadCount(0); // Default to 0 when unavailable
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Ionicons name="notifications-outline" size={size} color={colors.gray900} />
      </Animated.View>
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount.toString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: borderRadius.round,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    ...typography.labelSmall,
    color: colors.white,
    fontWeight: '700',
    fontSize: 10,
  },
});

