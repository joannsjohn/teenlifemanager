import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/SimpleNavigation';
import GradientButton from '../components/common/GradientButton';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { eventService, CreateEventRequest } from '../services/eventService';
import { EventCategory } from '../types';

const eventCategories: EventCategory[] = [
  { id: 'homework', name: 'School', color: '#3b82f6', icon: 'school' },
  { id: 'exam', name: 'Study', color: '#10b981', icon: 'book' },
  { id: 'personal', name: 'Personal', color: '#f59e0b', icon: 'calendar' },
  { id: 'volunteer', name: 'Volunteering', color: '#ef4444', icon: 'heart' },
  { id: 'social', name: 'Social', color: '#8b5cf6', icon: 'people' },
];

const quickTemplates = [
  {
    id: 'homework',
    label: 'Homework due tomorrow',
    title: 'Finish homework',
    description: 'Wrap up assignments before class.',
    category: 'homework',
    startOffsetHours: 21,
    durationMinutes: 60,
  },
  {
    id: 'study',
    label: 'Evening study session',
    title: 'Study session',
    description: 'Focused review time.',
    category: 'exam',
    startOffsetHours: 19,
    durationMinutes: 90,
  },
  {
    id: 'club',
    label: 'Club meeting',
    title: 'Club meeting',
    description: 'Remember to bring agenda notes.',
    category: 'personal',
    startOffsetHours: 17,
    durationMinutes: 60,
  },
];

const formatDate = (date: Date) => date.toISOString().split('T')[0];
const formatTime = (date: Date) => date.toISOString().split('T')[1].slice(0, 5);

export default function AddEventScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'homework',
    location: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '17:00',
    endTime: '18:00',
  });

  const handleApplyTemplate = (templateId: string) => {
    const template = quickTemplates.find(item => item.id === templateId);
    if (!template) {
      return;
    }

    const now = new Date();
    const start = new Date(now);
    start.setHours(template.startOffsetHours, 0, 0, 0);
    if (start <= now) {
      start.setDate(start.getDate() + 1);
    }

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + template.durationMinutes);

    setFormData(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      category: template.category,
      date: formatDate(start),
      startTime: formatTime(start),
      endTime: formatTime(end),
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    if (!formData.date) {
      Alert.alert('Error', 'Please select a date');
      return;
    }

    setIsLoading(true);

    try {
      // Combine date and time for startTime
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

      if (endDateTime <= startDateTime) {
        Alert.alert('Error', 'End time must be after start time');
        setIsLoading(false);
        return;
      }

      const eventData: CreateEventRequest = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        location: formData.location.trim() || undefined,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      };

      await eventService.createEvent(eventData);
      
      // Navigate back first, then show success
      navigation.goBack();
      
      // Show success message after a brief delay to allow navigation
      setTimeout(() => {
        Alert.alert('Success', 'Event created successfully!');
      }, 300);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = eventCategories.find(cat => cat.id === formData.category) || eventCategories[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={['#F8FAFC', '#E0E7FF', '#EDE9FE']}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>Add Event</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.quickTemplateSection}>
              <Text style={styles.sectionLabel}>Quick create</Text>
              <View style={styles.templateChips}>
                {quickTemplates.map(template => (
                  <TouchableOpacity
                    key={template.id}
                    style={styles.templateChip}
                    onPress={() => handleApplyTemplate(template.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="flash" size={16} color={colors.schedule.primary} style={styles.templateIcon} />
                    <Text style={styles.templateText}>{template.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Title */}
            <View style={[styles.inputContainer, shadows.sm]}>
              <Ionicons name="create-outline" size={22} color={colors.schedule.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Event Title"
                placeholderTextColor={colors.gray500}
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                autoCapitalize="words"
              />
            </View>

            {/* Description */}
            <View style={[styles.inputContainer, shadows.sm, styles.textAreaContainer]}>
              <Ionicons name="text-outline" size={22} color={colors.schedule.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description (optional)"
                placeholderTextColor={colors.gray500}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Category */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {eventCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      formData.category === category.id && styles.categoryButtonActive,
                      { borderColor: category.color },
                      formData.category === category.id && { backgroundColor: category.color + '20' },
                    ]}
                    onPress={() => handleInputChange('category', category.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={24}
                      color={formData.category === category.id ? category.color : colors.gray600}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        formData.category === category.id && { color: category.color, fontWeight: '700' },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date */}
            <View style={[styles.inputContainer, shadows.sm]}>
              <Ionicons name="calendar-outline" size={22} color={colors.schedule.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Date"
                placeholderTextColor={colors.gray500}
                value={formData.date}
                onChangeText={(value) => handleInputChange('date', value)}
                keyboardType="default"
              />
            </View>

            {/* Time Row */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, shadows.sm, { flex: 1, marginRight: spacing.sm }]}>
                <Ionicons name="time-outline" size={22} color={colors.schedule.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Start Time"
                  placeholderTextColor={colors.gray500}
                  value={formData.startTime}
                  onChangeText={(value) => handleInputChange('startTime', value)}
                  keyboardType="default"
                />
              </View>
              <View style={[styles.inputContainer, shadows.sm, { flex: 1, marginLeft: spacing.sm }]}>
                <Ionicons name="time-outline" size={22} color={colors.schedule.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="End Time"
                  placeholderTextColor={colors.gray500}
                  value={formData.endTime}
                  onChangeText={(value) => handleInputChange('endTime', value)}
                  keyboardType="default"
                />
              </View>
            </View>

            {/* Location */}
            <View style={[styles.inputContainer, shadows.sm]}>
              <Ionicons name="location-outline" size={22} color={colors.schedule.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Location (optional)"
                placeholderTextColor={colors.gray500}
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
                autoCapitalize="words"
              />
            </View>

            {/* Submit Button */}
            <GradientButton
              title={isLoading ? 'Creating...' : 'Create Event'}
              onPress={handleSubmit}
              section="schedule"
              size="large"
              disabled={isLoading}
              loading={isLoading}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.schedule.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: {
    ...typography.h3,
    fontWeight: '600',
    color: colors.gray900,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  form: {
    paddingHorizontal: spacing.lg,
  },
  quickTemplateSection: {
    marginBottom: spacing.lg,
  },
  templateChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  templateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.schedule.primary,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  templateIcon: {
    marginRight: spacing.xs,
  },
  templateText: {
    ...typography.labelSmall,
    color: colors.schedule.primary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 0,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 56,
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
  textAreaContainer: {
    alignItems: 'flex-start',
    minHeight: 120,
  },
  textArea: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.gray700,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    backgroundColor: colors.white,
  },
  categoryButtonActive: {
    borderWidth: 2,
  },
  categoryText: {
    ...typography.labelSmall,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});

