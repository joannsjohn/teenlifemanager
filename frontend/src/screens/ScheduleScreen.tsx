import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { ScheduleEvent, EventCategory } from '../types';

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
    <TouchableOpacity style={[styles.eventCard, { borderLeftColor: item.category.color }]}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
      </View>
      {item.description && (
        <Text style={styles.eventDescription}>{item.description}</Text>
      )}
      <Text style={styles.eventTime}>
        {formatTime(item.startTime)} - {formatTime(item.endTime)}
      </Text>
    </TouchableOpacity>
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
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
        <Text style={styles.headerTitle}>My Schedule</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'calendar' && styles.activeViewButton]}
            onPress={() => setViewMode('calendar')}
          >
            <Ionicons name="calendar" size={20} color={viewMode === 'calendar' ? '#fff' : '#6366f1'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'list' && styles.activeViewButton]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={20} color={viewMode === 'list' ? '#fff' : '#6366f1'} />
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'calendar' ? (
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#6366f1' },
            }}
            theme={{
              selectedDayBackgroundColor: '#6366f1',
              todayTextColor: '#6366f1',
              arrowColor: '#6366f1',
            }}
          />
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={mockEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderEvent}
            showsVerticalScrollIndicator={false}
            style={styles.listContainer}
          />
        </View>
      )}

      <View style={styles.selectedDateContainer}>
        <Text style={styles.selectedDateTitle}>
          {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        <Text style={styles.eventCount}>
          {todayEvents.length} event{todayEvents.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.eventsContainer}>
        <FlatList
          data={todayEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          showsVerticalScrollIndicator={false}
          style={styles.eventsContainer}
        />
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  activeViewButton: {
    backgroundColor: '#6366f1',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  selectedDateContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  eventCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  eventsContainer: {
    flex: 1,
    padding: 20,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  eventTime: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
