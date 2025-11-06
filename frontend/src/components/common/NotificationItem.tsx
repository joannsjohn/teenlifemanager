import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientCard from './GradientCard';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { Notification } from '../../types';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getNotificationIcon = (type: string): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'schedule':
      return 'calendar';
    case 'volunteering':
      return 'heart';
    case 'social':
      return 'people';
    case 'mental_health':
      return 'happy';
    case 'achievement':
      return 'trophy';
    default:
      return 'notifications';
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'schedule':
      return colors.schedule.primary;
    case 'volunteering':
      return colors.volunteering.primary;
    case 'social':
      return colors.social.primary;
    case 'mental_health':
      return colors.mentalHealth.primary;
    case 'achievement':
      return colors.warning;
    default:
      return colors.gray500;
  }
};

export default function NotificationItem({
  notification,
  onPress,
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  const icon = getNotificationIcon(notification.type);
  const color = getNotificationColor(notification.type);

  const handlePress = () => {
    if (!notification.isRead) {
      onMarkRead(notification.id);
    }
    onPress();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <GradientCard
      section={notification.type === 'schedule' ? 'schedule' : notification.type === 'volunteering' ? 'volunteering' : notification.type === 'social' ? 'social' : notification.type === 'mental_health' ? 'mentalHealth' : 'profile'}
      variant="elevated"
      style={[styles.container, !notification.isRead && styles.unread]}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, !notification.isRead && styles.titleUnread]} numberOfLines={1}>
              {notification.title}
            </Text>
            {!notification.isRead && (
              <View style={[styles.unreadDot, { backgroundColor: color }]} />
            )}
          </View>
          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>
          <View style={styles.footerRow}>
            <Text style={styles.time}>{formatTime(notification.createdAt)}</Text>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              style={styles.deleteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle-outline" size={20} color={colors.gray400} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </GradientCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.profile.primary,
  },
  content: {
    flexDirection: 'row',
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    ...shadows.sm,
  },
  textContainer: {
    flex: 1,
    minWidth: 0, // Allow text to shrink
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  title: {
    ...typography.bodyLarge,
    color: colors.gray900,
    fontWeight: '600',
    flex: 1,
  },
  titleUnread: {
    fontWeight: '700',
  },
  message: {
    ...typography.body,
    color: colors.gray700,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    ...typography.labelSmall,
    color: colors.gray500,
    fontSize: 11,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  deleteButton: {
    padding: spacing.xs,
  },
});

