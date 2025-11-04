import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoodEntry, MentalHealthResource, Achievement } from '../types';

const mockMoodEntries: MoodEntry[] = [
  {
    id: '1',
    userId: 'user1',
    mood: 8,
    energy: 7,
    stress: 3,
    notes: 'Had a great day at school!',
    tags: ['school', 'friends'],
    activities: ['studying', 'soccer'],
    createdAt: new Date(2024, 0, 15),
  },
  {
    id: '2',
    userId: 'user1',
    mood: 6,
    energy: 5,
    stress: 6,
    notes: 'Feeling a bit overwhelmed with homework',
    tags: ['homework', 'stress'],
    activities: ['studying'],
    createdAt: new Date(2024, 0, 14),
  },
];

const mockResources: MentalHealthResource[] = [
  {
    id: '1',
    title: '5-Minute Breathing Exercise',
    type: 'exercise',
    content: 'A simple breathing technique to reduce stress and anxiety',
    duration: 5,
    category: 'Stress Relief',
    isEmergency: false,
    isFree: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Understanding Teenage Anxiety',
    type: 'article',
    content: 'Learn about common anxiety triggers and coping strategies',
    category: 'Education',
    isEmergency: false,
    isFree: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Crisis Hotline',
    type: 'helpline',
    content: 'National Suicide Prevention Lifeline: 988',
    category: 'Emergency',
    isEmergency: true,
    isFree: true,
    createdAt: new Date(),
  },
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Mood Tracker',
    description: 'Log your mood for 7 consecutive days',
    icon: 'happy',
    category: 'mental_health',
    points: 50,
    isUnlocked: true,
    unlockedAt: new Date(),
    requirements: [
      { type: 'mood_entries', target: 7, current: 7 }
    ],
  },
  {
    id: '2',
    title: 'Stress Buster',
    description: 'Complete 5 stress relief exercises',
    icon: 'leaf',
    category: 'mental_health',
    points: 30,
    isUnlocked: false,
    requirements: [
      { type: 'mood_entries', target: 5, current: 2 }
    ],
  },
];

export default function MentalHealthScreen() {
  const [activeTab, setActiveTab] = useState<'mood' | 'resources' | 'achievements'>('mood');
  const [showMoodModal, setShowMoodModal] = useState<boolean>(false);
  const [currentMood, setCurrentMood] = useState({
    mood: 5,
    energy: 5,
    stress: 5,
    notes: '',
    tags: [] as string[],
    activities: [] as string[],
  });

  const averageMood = mockMoodEntries.length > 0 
    ? mockMoodEntries.reduce((sum, entry) => sum + entry.mood, 0) / mockMoodEntries.length 
    : 0;

  const renderMoodEntry = ({ item }: { item: MoodEntry }) => (
    <View style={styles.moodCard}>
      <View style={styles.moodHeader}>
        <Text style={styles.moodDate}>
          {item.createdAt.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </Text>
        <View style={styles.moodScores}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Mood</Text>
            <Text style={[styles.scoreValue, { color: getMoodColor(item.mood) }]}>
              {item.mood}/10
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Energy</Text>
            <Text style={[styles.scoreValue, { color: getEnergyColor(item.energy) }]}>
              {item.energy}/10
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Stress</Text>
            <Text style={[styles.scoreValue, { color: getStressColor(item.stress) }]}>
              {item.stress}/10
            </Text>
          </View>
        </View>
      </View>
      {item.notes && (
        <Text style={styles.moodNotes}>{item.notes}</Text>
      )}
      {item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderResource = ({ item }: { item: MentalHealthResource }) => (
    <TouchableOpacity style={[styles.resourceCard, item.isEmergency && styles.emergencyCard]}>
      <View style={styles.resourceHeader}>
        <View style={[styles.resourceIcon, { backgroundColor: getResourceColor(item.type) }]}>
          <Ionicons name={getResourceIcon(item.type)} size={20} color="#fff" />
        </View>
        <View style={styles.resourceInfo}>
          <Text style={styles.resourceTitle}>{item.title}</Text>
          <Text style={styles.resourceCategory}>{item.category}</Text>
        </View>
        {item.isEmergency && (
          <View style={styles.emergencyBadge}>
            <Text style={styles.emergencyText}>URGENT</Text>
          </View>
        )}
      </View>
      <Text style={styles.resourceContent}>{item.content}</Text>
      {item.duration && (
        <Text style={styles.resourceDuration}>{item.duration} minutes</Text>
      )}
    </TouchableOpacity>
  );

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <View style={[styles.achievementCard, item.isUnlocked && styles.unlockedAchievement]}>
      <View style={styles.achievementIcon}>
        <Ionicons 
          name={item.icon as any} 
          size={32} 
          color={item.isUnlocked ? '#10b981' : '#9ca3af'} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={[styles.achievementTitle, item.isUnlocked && styles.unlockedText]}>
          {item.title}
        </Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
        <View style={styles.progressContainer}>
          {item.requirements.map((req, index) => (
            <View key={index} style={styles.progressItem}>
              <Text style={styles.progressLabel}>
                {req.type.replace('_', ' ').toUpperCase()}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(req.current / req.target) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {req.current}/{req.target}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>{item.points} pts</Text>
      </View>
    </View>
  );

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return '#10b981';
    if (mood >= 6) return '#f59e0b';
    return '#ef4444';
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 8) return '#10b981';
    if (energy >= 6) return '#f59e0b';
    return '#ef4444';
  };

  const getStressColor = (stress: number) => {
    if (stress <= 3) return '#10b981';
    if (stress <= 6) return '#f59e0b';
    return '#ef4444';
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'exercise': return '#3b82f6';
      case 'article': return '#8b5cf6';
      case 'video': return '#ef4444';
      case 'meditation': return '#10b981';
      case 'helpline': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'exercise': return 'fitness';
      case 'article': return 'document-text';
      case 'video': return 'play-circle';
      case 'meditation': return 'leaf';
      case 'helpline': return 'call';
      default: return 'help';
    }
  };

  const handleMoodSubmit = () => {
    // Handle mood submission
    setShowMoodModal(false);
    setCurrentMood({
      mood: 5,
      energy: 5,
      stress: 5,
      notes: '',
      tags: [],
      activities: [],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mental Health</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{averageMood.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg Mood</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{mockMoodEntries.length}</Text>
          <Text style={styles.statLabel}>Entries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {mockAchievements.filter(a => a.isUnlocked).length}
          </Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mood' && styles.activeTab]}
          onPress={() => setActiveTab('mood')}
        >
          <Text style={[styles.tabText, activeTab === 'mood' && styles.activeTabText]}>
            Mood
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'resources' && styles.activeTab]}
          onPress={() => setActiveTab('resources')}
        >
          <Text style={[styles.tabText, activeTab === 'resources' && styles.activeTabText]}>
            Resources
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        {activeTab === 'mood' && (
          <FlatList
            data={mockMoodEntries}
            keyExtractor={(item) => item.id}
            renderItem={renderMoodEntry}
            showsVerticalScrollIndicator={false}
          />
        )}

        {activeTab === 'resources' && (
          <FlatList
            data={mockResources}
            keyExtractor={(item) => item.id}
            renderItem={renderResource}
            showsVerticalScrollIndicator={false}
          />
        )}

        {activeTab === 'achievements' && (
          <FlatList
            data={mockAchievements}
            keyExtractor={(item) => item.id}
            renderItem={renderAchievement}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowMoodModal(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={Boolean(showMoodModal)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How are you feeling?</Text>
            
            <View style={styles.moodSlider}>
              <Text style={styles.sliderLabel}>Mood: {currentMood.mood}/10</Text>
              {/* Add slider component here */}
            </View>

            <View style={styles.moodSlider}>
              <Text style={styles.sliderLabel}>Energy: {currentMood.energy}/10</Text>
              {/* Add slider component here */}
            </View>

            <View style={styles.moodSlider}>
              <Text style={styles.sliderLabel}>Stress: {currentMood.stress}/10</Text>
              {/* Add slider component here */}
            </View>

            <TextInput
              style={styles.notesInput}
              placeholder="How was your day? (optional)"
              value={currentMood.notes}
              onChangeText={(text) => setCurrentMood({ ...currentMood, notes: text })}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowMoodModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleMoodSubmit}
              >
                <Text style={styles.submitButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  helpButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#6366f1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  moodCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  moodScores: {
    flexDirection: 'row',
    gap: 16,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  moodNotes: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '500',
  },
  resourceCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emergencyCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  resourceCategory: {
    fontSize: 12,
    color: '#6b7280',
  },
  emergencyBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emergencyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  resourceContent: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  resourceDuration: {
    fontSize: 12,
    color: '#9ca3af',
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unlockedAchievement: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  unlockedText: {
    color: '#10b981',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  progressContainer: {
    gap: 4,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressLabel: {
    fontSize: 10,
    color: '#6b7280',
    width: 60,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#6b7280',
    width: 30,
    textAlign: 'right',
  },
  pointsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  moodSlider: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
