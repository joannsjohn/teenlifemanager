import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/SimpleNavigation';
import { ScheduleEvent, EventCategory } from '../types';
import GradientCard from '../components/common/GradientCard';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { eventService } from '../services/eventService';

export default function ScheduleScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const prevScreenRef = useRef<string>('');

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedEvents = await eventService.getEvents();
      setEvents(loadedEvents);
    } catch (error) {
      // Silently fail - network errors are expected when backend is not available
      if (__DEV__) {
        console.log('Event service unavailable - backend may not be running');
      }
      setEvents([]); // Set empty array on error
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Reload events when returning from AddEvent screen
  useEffect(() => {
    const currentScreen = navigation.currentScreen;
    const wasOnAddEvent = prevScreenRef.current === 'AddEvent';
    const wasOnImportEvents = prevScreenRef.current === 'ImportEvents';
    const isNowOnMain = currentScreen === 'Main';

    // If we were on AddEvent and are now on Main, reload events
    if ((wasOnAddEvent || wasOnImportEvents) && isNowOnMain) {
      setTimeout(() => {
        loadEvents();
      }, 500);
    }

    // Update previous screen reference
    prevScreenRef.current = currentScreen;
  }, [navigation.currentScreen, loadEvents]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadEvents();
  };

  const handleOpenImport = () => {
    navigation.navigate('ImportEvents' as any);
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => {
      const eventDate = event.startTime.toISOString().split('T')[0];
      return eventDate === date;
    });
  };

  // Prepare marked dates for calendar
  const markedDates = events.reduce((acc, event) => {
    const dateStr = event.startTime.toISOString().split('T')[0];
    if (!acc[dateStr]) {
      acc[dateStr] = {
        marked: true,
        dotColor: event.category.color,
        selected: dateStr === selectedDate,
        selectedColor: colors.schedule.primary,
      };
    }
    return acc;
  }, {} as any);

  // Mark selected date
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: colors.schedule.primary,
    };
  }

  const renderEvent = ({ item }: { item: ScheduleEvent }) => (
    <GradientCard section="schedule" variant="elevated" style={[styles.eventCard, { borderLeftColor: item.category.color, borderLeftWidth: 4 }]}>
      <TouchableOpacity activeOpacity={0.7}>
        <View style={styles.eventHeader}>
          <View style={styles.eventTitleContainer}>
            <Ionicons name={item.category.icon as any} size={20} color={item.category.color} style={styles.categoryIcon} />
            <Text style={styles.eventTitle}>{item.title}</Text>
          </View>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
        </View>
        {item.description && (
          <Text style={styles.eventDescription}>{item.description}</Text>
        )}
        <View style={styles.eventTimeContainer}>
          <Ionicons name="time-outline" size={14} color={colors.schedule.primary} />
          <Text style={styles.eventTime}>
            {formatTime(item.startTime)} - {formatTime(item.endTime)}
          </Text>
        </View>
      </TouchableOpacity>
    </GradientCard>
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.gray500;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    if (diff <= 0) {
      return 'Starting now';
    }
    const minutes = Math.round(diff / 60000);
    if (minutes < 60) {
      return `Starts in ${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) {
      if (remainingMinutes === 0) {
        return `Starts in ${hours}h`;
      }
      return `Starts in ${hours}h ${remainingMinutes}m`;
    }
    const days = Math.floor(hours / 24);
    return `Starts in ${days} day${days === 1 ? '' : 's'}`;
  };
 
  const todayEvents = getEventsForDate(selectedDate);
  const upcomingEvent = useMemo(() => {
    const now = new Date();
    const upcoming = events
      .filter(item => item.startTime > now)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];
    return upcoming || null;
  }, [events]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>📅 My Schedule</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.importButton}
            onPress={handleOpenImport}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text-outline" size={18} color={colors.white} />
            <Text style={styles.importButtonText}>Import</Text>
          </TouchableOpacity>
          <View style={styles.viewToggleGroup}>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'calendar' && styles.activeViewButton]}
              onPress={() => setViewMode('calendar')}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar" size={20} color={viewMode === 'calendar' ? colors.white : colors.schedule.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'list' && styles.activeViewButton]}
              onPress={() => setViewMode('list')}
              activeOpacity={0.7}
            >
              <Ionicons name="list" size={20} color={viewMode === 'list' ? colors.white : colors.schedule.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.overviewContainer}>
        <GradientCard section="schedule" variant="elevated" style={styles.overviewCard}>
          {upcomingEvent ? (
            <>
              <Text style={styles.overviewLabel}>Next up</Text>
              <Text style={styles.overviewTitle}>{upcomingEvent.title}</Text>
              <Text style={styles.overviewMeta}>
                {upcomingEvent.category.name} • {upcomingEvent.startTime.toLocaleString()}
              </Text>
              <View style={styles.overviewFooter}>
                <View style={styles.overviewBadge}>
                  <Ionicons name="time-outline" size={16} color={colors.schedule.primary} />
                  <Text style={styles.overviewBadgeText}>{formatTimeUntil(upcomingEvent.startTime)}</Text>
                </View>
                {upcomingEvent.description ? (
                  <Text style={styles.overviewDescription} numberOfLines={2}>
                    {upcomingEvent.description}
                  </Text>
                ) : null}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.overviewLabel}>All clear</Text>
              <Text style={styles.overviewTitle}>You’re caught up</Text>
              <Text style={styles.overviewMeta}>
                Paste a syllabus or add an event to plan ahead.
              </Text>
              <TouchableOpacity style={styles.overviewAction} onPress={handleOpenImport} activeOpacity={0.7}>
                <Ionicons name="document-text-outline" size={18} color={colors.schedule.primary} />
                <Text style={styles.overviewActionText}>Import from text</Text>
              </TouchableOpacity>
            </>
          )}
        </GradientCard>
      </View>

      {viewMode === 'calendar' ? (
        <GradientCard section="schedule" variant="elevated" style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              selectedDayBackgroundColor: colors.schedule.primary,
              todayTextColor: colors.schedule.primary,
              arrowColor: colors.schedule.primary,
              textDayFontWeight: '600',
              textMonthFontWeight: '700',
            }}
          />
        </GradientCard>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={renderEvent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={colors.schedule.primary}
              />
            }
            ListEmptyComponent={
              !isLoading ? (
                <View style={styles.emptyState}>
                  <Ionicons name="calendar-outline" size={48} color={colors.gray400} />
                  <Text style={styles.emptyStateText}>No events scheduled</Text>
                </View>
              ) : null
            }
          />
        </View>
      )}

      <GradientCard section="schedule" variant="border" style={styles.selectedDateContainer}>
        <Text style={styles.selectedDateTitle}>
          {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        <View style={styles.eventCountContainer}>
          <Ionicons name="calendar-outline" size={16} color={colors.schedule.primary} />
          <Text style={styles.eventCount}>
            {todayEvents.length} event{todayEvents.length !== 1 ? 's' : ''} today
          </Text>
        </View>
      </GradientCard>

      <View style={styles.eventsContainer}>
        <FlatList
          data={todayEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.eventsContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.schedule.primary}
            />
          }
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color={colors.gray400} />
                <Text style={styles.emptyStateText}>No events scheduled for this day</Text>
              </View>
            ) : null
          }
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('AddEvent' as any);
        }}
      >
        <LinearGradient
          colors={[colors.schedule.primary, colors.schedule.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.addButtonGradient}
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
  },
  headerTitle: {
    ...typography.h3,
    fontWeight: '600',
    color: colors.gray900,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  viewButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.schedule.primary,
    backgroundColor: colors.white,
  },
  activeViewButton: {
    backgroundColor: colors.schedule.primary,
  },
  calendarContainer: {
    margin: spacing.lg,
    padding: spacing.sm,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  selectedDateContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  selectedDateTitle: {
    ...typography.h4,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  eventCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  eventCount: {
    ...typography.bodySmall,
    color: colors.schedule.primary,
    fontWeight: '600',
  },
  eventsContainer: {
    flex: 1,
  },
  eventsContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  eventCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  eventTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    marginRight: spacing.sm,
  },
  eventTitle: {
    ...typography.bodyLarge,
    color: colors.gray900,
    fontWeight: '600',
    flex: 1,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  eventDescription: {
    ...typography.bodySmall,
    color: colors.gray600,
    marginBottom: spacing.md,
  },
  eventTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  eventTime: {
    ...typography.labelSmall,
    color: colors.gray500,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.gray500,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    ...shadows.xl,
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.schedule.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  importButtonText: {
    ...typography.labelSmall,
    color: colors.white,
    fontWeight: '600',
  },
  viewToggleGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  overviewContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  overviewCard: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  overviewLabel: {
    ...typography.labelSmall,
    color: colors.gray600,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  overviewTitle: {
    ...typography.h4,
    color: colors.gray900,
    fontWeight: '600',
  },
  overviewMeta: {
    ...typography.bodySmall,
    color: colors.gray600,
  },
  overviewFooter: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  overviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#EEF2FF',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  overviewBadgeText: {
    ...typography.labelSmall,
    color: colors.schedule.primary,
    fontWeight: '600',
  },
  overviewDescription: {
    ...typography.bodySmall,
    color: colors.gray600,
  },
  overviewAction: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  overviewActionText: {
    ...typography.labelSmall,
    color: colors.schedule.primary,
    fontWeight: '600',
  },
});
