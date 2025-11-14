import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/SimpleNavigation';
import GradientButton from '../components/common/GradientButton';
import GradientCard from '../components/common/GradientCard';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { eventService, ExtractedEventSuggestion } from '../services/eventService';

interface SuggestionState extends ExtractedEventSuggestion {
  id: string;
  selected: boolean;
  titleInput: string;
  startTimeInput: string;
  endTimeInput: string;
  categoryInput: string;
  notesInput: string;
}

function formatDateInput(value?: string): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString().slice(0, 16);
}

function formatDisplayDate(value?: string): string {
  if (!value) {
    return 'Please add a date';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Please add a valid date';
  }
  return date.toLocaleString();
}

export default function ImportEventsScreen() {
  const navigation = useNavigation();
  const [sourceText, setSourceText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SuggestionState[]>([]);

  const timezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      if (__DEV__) {
        console.log('[ImportEventsScreen] Failed to determine timezone:', error);
      }
      return undefined;
    }
  }, []);

  const handleExtract = async () => {
    if (!sourceText.trim()) {
      Alert.alert('Paste something first', 'Add the text you want me to scan for assignments or events.');
      return;
    }

    setIsExtracting(true);
    setSummary('');
    setSuggestions([]);

    try {
      const response = await eventService.extractEventsFromText({
        text: sourceText,
        timezone,
      });

      const nextSuggestions = (response.events || []).map((event, index) => ({
        id: `${index}`,
        selected: true,
        titleInput: event.title || 'Untitled',
        startTimeInput: formatDateInput(event.startTime || event.dueTime),
        endTimeInput: formatDateInput(event.endTime),
        categoryInput: event.category || 'personal',
        notesInput: event.notes || '',
        description: event.description,
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
        dueTime: event.dueTime,
        category: event.category,
        confidence: event.confidence ?? 0,
        notes: event.notes,
      }));

      setSummary(response.summary || 'Here is what I found. Review before saving.');
      setSuggestions(nextSuggestions);

      if (nextSuggestions.length === 0) {
        Alert.alert('No events found', 'I could not detect any deadlines or events in that text. Try pasting more details.');
      }
    } catch (error: any) {
      if (__DEV__) {
        console.error('[ImportEventsScreen] extractEvents error', error);
      }
      Alert.alert('Could not extract events', error?.message || 'Please try again in a moment.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleToggle = (id: string) => {
    setSuggestions(prev => prev.map(item => (item.id === id ? { ...item, selected: !item.selected } : item)));
  };

  const handleChange = (id: string, field: keyof SuggestionState, value: string) => {
    setSuggestions(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleSave = async () => {
    const selected = suggestions.filter(item => item.selected);

    if (selected.length === 0) {
      Alert.alert('Nothing selected', 'Choose at least one event to add to your schedule.');
      return;
    }

    setIsSaving(true);

    try {
      for (const event of selected) {
        if (!event.titleInput.trim()) {
          throw new Error('Every event needs a title before saving.');
        }

        if (!event.startTimeInput) {
          throw new Error(`Set a start time for "${event.titleInput}" before saving.`);
        }

        const start = new Date(event.startTimeInput);
        if (Number.isNaN(start.getTime())) {
          throw new Error(`The start time for "${event.titleInput}" is invalid.`);
        }

        let endISO: string | undefined;
        if (event.endTimeInput) {
          const end = new Date(event.endTimeInput);
          if (Number.isNaN(end.getTime())) {
            throw new Error(`The end time for "${event.titleInput}" is invalid.`);
          }
          endISO = end.toISOString();
        }

        const description = [event.description, event.notesInput]
          .filter(Boolean)
          .join('\n\n') || undefined;

        await eventService.createEvent({
          title: event.titleInput.trim(),
          description,
          startTime: start.toISOString(),
          endTime: endISO,
          category: event.categoryInput || 'personal',
        });
      }

      Alert.alert('Events added', 'I added those items to your schedule. You can tweak them in the calendar anytime.', [
        {
          text: 'Great!',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error: any) {
      if (__DEV__) {
        console.error('[ImportEventsScreen] save error', error);
      }
      Alert.alert('Could not save events', error?.message || 'Please review the details and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#F8FAFC', '#E0E7FF', '#EDE9FE']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Import Schedule Items
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <GradientCard section="schedule" variant="elevated" style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Paste your notes or assignments</Text>
          <Text style={styles.instructionsSubtitle}>
            I’ll scan for due dates, meetings, volunteer hours, and other time-bound tasks.
          </Text>
        </GradientCard>

        <View style={[styles.textAreaContainer, shadows.md]}>
          <TextInput
            style={styles.textArea}
            placeholder="Paste text here..."
            placeholderTextColor={colors.gray500}
            value={sourceText}
            onChangeText={setSourceText}
            multiline
            textAlignVertical="top"
          />
        </View>

        <GradientButton
          title={isExtracting ? 'Finding events...' : 'Find events'}
          onPress={handleExtract}
          section="schedule"
          size="large"
          disabled={isExtracting || !sourceText.trim()}
          loading={isExtracting}
          style={styles.extractButton}
        />

        {summary ? (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}

        {isExtracting && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.schedule.primary} />
            <Text style={styles.loaderText}>Let me read through that…</Text>
          </View>
        )}

        {suggestions.map(item => (
          <GradientCard key={item.id} section="schedule" variant="border" style={styles.suggestionCard}>
            <TouchableOpacity style={styles.selectRow} onPress={() => handleToggle(item.id)} activeOpacity={0.7}>
              <View style={[styles.checkbox, item.selected && styles.checkboxSelected]}>
                {item.selected ? <Ionicons name="checkmark" size={20} color={colors.white} /> : null}
              </View>
              <View style={styles.selectTextContainer}>
                <Text style={styles.suggestionTitle}>{item.titleInput || 'Untitled'}</Text>
                <Text style={styles.suggestionMeta} numberOfLines={1}>
                  {`Starts ${formatDisplayDate(item.startTimeInput)}`}
                </Text>
              </View>
              <Text style={styles.confidenceTag}>{Math.round((item.confidence ?? 0) * 100)}%</Text>
            </TouchableOpacity>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={item.titleInput}
                onChangeText={value => handleChange(item.id, 'titleInput', value)}
                placeholder="Event title"
                placeholderTextColor={colors.gray500}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.rowItem]}>
                <Text style={styles.label}>Start</Text>
                <TextInput
                  style={styles.input}
                  value={item.startTimeInput}
                  onChangeText={value => handleChange(item.id, 'startTimeInput', value)}
                  placeholder="YYYY-MM-DDTHH:mm"
                  placeholderTextColor={colors.gray500}
                  autoCapitalize="none"
                />
              </View>
              <View style={[styles.fieldGroup, styles.rowItem]}>
                <Text style={styles.label}>End (optional)</Text>
                <TextInput
                  style={styles.input}
                  value={item.endTimeInput}
                  onChangeText={value => handleChange(item.id, 'endTimeInput', value)}
                  placeholder="YYYY-MM-DDTHH:mm"
                  placeholderTextColor={colors.gray500}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                value={item.categoryInput}
                onChangeText={value => handleChange(item.id, 'categoryInput', value)}
                placeholder="school / study / extracurricular / personal"
                placeholderTextColor={colors.gray500}
                autoCapitalize="none"
              />
            </View>

            {item.description ? (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>
              </View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={item.notesInput}
                onChangeText={value => handleChange(item.id, 'notesInput', value)}
                placeholder="Add any extra details you want to remember"
                placeholderTextColor={colors.gray500}
                multiline
              />
            </View>
          </GradientCard>
        ))}

        {suggestions.length > 0 && (
          <GradientButton
            title={isSaving ? 'Adding…' : 'Add to schedule'}
            onPress={handleSave}
            section="schedule"
            size="large"
            disabled={isSaving}
            loading={isSaving}
            style={styles.saveButton}
          />
        )}

        {Platform.OS === 'ios' ? <View style={{ height: spacing.xl }} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.schedule.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  instructionsCard: {
    marginBottom: spacing.lg,
  },
  instructionsTitle: {
    ...typography.h4,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  instructionsSubtitle: {
    ...typography.body,
    color: colors.gray600,
  },
  textAreaContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    minHeight: 160,
    marginBottom: spacing.md,
  },
  textArea: {
    flex: 1,
    ...typography.body,
    color: colors.gray900,
  },
  extractButton: {
    marginBottom: spacing.lg,
  },
  summaryContainer: {
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    ...typography.label,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  summaryText: {
    ...typography.body,
    color: colors.gray900,
  },
  loaderContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  loaderText: {
    marginTop: spacing.sm,
    ...typography.bodySmall,
    color: colors.gray600,
  },
  suggestionCard: {
    marginBottom: spacing.lg,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.schedule.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkboxSelected: {
    backgroundColor: colors.schedule.primary,
  },
  selectTextContainer: {
    flex: 1,
  },
  suggestionTitle: {
    ...typography.bodyLarge,
    fontWeight: '600',
    color: colors.gray900,
  },
  suggestionMeta: {
    ...typography.bodySmall,
    color: colors.gray600,
  },
  confidenceTag: {
    ...typography.labelSmall,
    color: colors.schedule.primary,
    fontWeight: '600',
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.labelSmall,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.gray900,
  },
  notesInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowItem: {
    flex: 1,
  },
  descriptionText: {
    ...typography.bodySmall,
    color: colors.gray700,
  },
  saveButton: {
    marginTop: spacing.xl,
  },
});
