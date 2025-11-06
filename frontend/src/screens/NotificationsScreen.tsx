import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/SimpleNavigation';
import { notificationService } from '../services/notificationService';
import { useAuthStore } from '../store/authStore';
import NotificationItem from '../components/common/NotificationItem';
import GradientButton from '../components/common/GradientButton';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { fadeIn } from '../utils/animations';
import { Notification } from '../types';

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { updateUser } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fadeIn(fadeAnim, 300).start();
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getNotifications({ limit: 50 });
      setNotifications(response.notifications);
      setUnreadCount(response.notifications.filter(n => !n.isRead).length);
    } catch (error) {
      // Show user-friendly error but don't crash
      if (__DEV__) {
        console.log('Notification service unavailable - backend may not be running');
      }
      // Keep existing notifications or show empty state
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotifications();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      const deleted = notifications.find(n => n.id === notificationId);
      if (deleted && !deleted.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: new Date() })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Navigate to relevant screen based on actionUrl
    if (notification.actionUrl) {
      // Parse actionUrl and navigate
      // For now, we'll just mark as read
      if (!notification.isRead) {
        handleMarkAsRead(notification.id);
      }
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item)}
      onMarkRead={handleMarkAsRead}
      onDelete={handleDelete}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-outline" size={64} color={colors.gray400} />
      <Text style={styles.emptyStateTitle}>No Notifications</Text>
      <Text style={styles.emptyStateText}>
        You're all caught up! New notifications will appear here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#F8FAFC', '#EDE9FE', '#F3E8FF']}
        style={StyleSheet.absoluteFill}
      />
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
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 ? (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllAsRead}
              activeOpacity={0.7}
            >
              <Text style={styles.markAllText}>Mark All Read</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            notifications.length === 0 ? styles.emptyContainer : styles.listContainer
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshing} 
              onRefresh={handleRefresh}
              tintColor={colors.profile.primary}
              colors={[colors.profile.primary]}
            />
          }
          ListEmptyComponent={!isLoading ? renderEmptyState : null}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
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
  markAllButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.profile.primary,
  },
  markAllText: {
    ...typography.labelSmall,
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  placeholder: {
    width: 80,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyStateTitle: {
    ...typography.h3,
    color: colors.gray900,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.gray600,
    textAlign: 'center',
  },
});

