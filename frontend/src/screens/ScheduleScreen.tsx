import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ScheduleEvent, EventCategory } from '../types';
import GradientCard from '../components/common/GradientCard';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

const mockEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Math Class',
    description: 'Algebra II - Room 201',
    startTime: new Date(2024, 0, 15, 9, 0),
    endTime: new Date(2024, 0, 15, 10, 0),
    category: { id: '1', name: 'School', color: '#3b82f6', icon: 'school' },
    priority: 'high',
    isRecurring: true,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Study Group',
    description: 'Physics study session with friends',
    startTime: new Date(2024, 0, 15, 14, 0),
    endTime: new Date(2024, 0, 15, 16, 0),
    category: { id: '2', name: 'Study', color: '#10b981', icon: 'book' },
    priority: 'medium',
    isRecurring: false,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Soccer Practice',
    description: 'Team practice at the field',
    startTime: new Date(2024, 0, 15, 17, 0),
    endTime: new Date(2024, 0, 15, 19, 0),
    category: { id: '3', name: 'Sports', color: '#f59e0b', icon: 'football' },
    priority: 'medium',
    isRecurring: true,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockCategories: EventCategory[] = [
  { id: '1', name: 'School', color: '#3b82f6', icon: 'school' },
  { id: '2', name: 'Study', color: '#10b981', icon: 'book' },
  { id: '3', name: 'Sports', color: '#f59e0b', icon: 'football' },
  { id: '4', name: 'Social', color: '#8b5cf6', icon: 'people' },
  { id: '5', name: 'Volunteering', color: '#ef4444', icon: 'heart' },
];

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const getEventsForDate = (date: string) => {
    return mockEvents.filter(event => {
      const eventDate = event.startTime.toISOString().split('T')[0];
      return eventDate === date;
    });
  };

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

  const todayEvents = getEventsForDate(selectedDate);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 My Schedule</Text>
        <View style={styles.headerActions}>
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

      {viewMode === 'calendar' ? (
        <GradientCard section="schedule" variant="elevated" style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: colors.schedule.primary },
            }}
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
            data={mockEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderEvent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
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
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.gray400} />
              <Text style={styles.emptyStateText}>No events scheduled for this day</Text>
            </View>
          }
        />
      </View>

      <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
        <LinearGradient
          colors={[colors.schedule.primary, colors.schedule.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.addButtonGradient}
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
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
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.gray900,
  },
  headerActions: {
    flexDirection: 'row',
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
    padding: spacing.lg,
  },
  selectedDateContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
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
    padding: spacing.lg,
  },
  eventCard: {
    marginBottom: spacing.md,
    padding: 0,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
    marginBottom: spacing.sm,
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
});
