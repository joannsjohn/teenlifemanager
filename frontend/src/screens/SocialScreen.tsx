import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SocialConnection, SocialActivity } from '../types';
import GradientCard from '../components/common/GradientCard';
import GradientButton from '../components/common/GradientButton';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

const mockConnections: SocialConnection[] = [
  {
    id: '1',
    userId: 'user1',
    friendId: 'friend1',
    friendName: 'Alex Johnson',
    friendProfileImage: 'https://via.placeholder.com/50',
    status: 'accepted',
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: 'user1',
    friendId: 'friend2',
    friendName: 'Sarah Chen',
    friendProfileImage: 'https://via.placeholder.com/50',
    status: 'accepted',
    createdAt: new Date(),
  },
  {
    id: '3',
    userId: 'user1',
    friendId: 'friend3',
    friendName: 'Mike Rodriguez',
    friendProfileImage: 'https://via.placeholder.com/50',
    status: 'pending',
    createdAt: new Date(),
  },
];

const mockActivities: SocialActivity[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'study_group',
    title: 'Physics Study Group',
    description: 'Preparing for the midterm exam together',
    participants: ['friend1', 'friend2'],
    scheduledTime: new Date(2024, 0, 20, 15, 0),
    location: 'Library Study Room 3',
    isPublic: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: 'user1',
    type: 'social_event',
    title: 'Movie Night',
    description: 'Watching the latest Marvel movie',
    participants: ['friend1', 'friend2', 'friend3'],
    scheduledTime: new Date(2024, 0, 22, 19, 0),
    location: 'Alex\'s House',
    isPublic: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    userId: 'user1',
    type: 'volunteer_together',
    title: 'Beach Cleanup',
    description: 'Community service at the local beach',
    participants: ['friend1'],
    scheduledTime: new Date(2024, 0, 25, 9, 0),
    location: 'Sunset Beach',
    isPublic: true,
    createdAt: new Date(),
  },
];

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState<'friends' | 'activities' | 'discover'>('friends');
  const [searchQuery, setSearchQuery] = useState('');

  const acceptedFriends = mockConnections.filter(conn => conn.status === 'accepted');
  const pendingRequests = mockConnections.filter(conn => conn.status === 'pending');

  const renderFriend = ({ item }: { item: SocialConnection }) => (
    <TouchableOpacity style={styles.friendCard}>
      <Image source={{ uri: item.friendProfileImage }} style={styles.profileImage} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.friendName}</Text>
        <Text style={styles.friendStatus}>
          {item.status === 'accepted' ? 'Online' : 'Pending'}
        </Text>
      </View>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="chatbubble" size={20} color="#6366f1" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderActivity = ({ item }: { item: SocialActivity }) => (
    <TouchableOpacity style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <View style={[styles.activityIcon, { backgroundColor: getActivityColor(item.type) }]}>
          <Ionicons name={getActivityIcon(item.type)} size={20} color="#fff" />
        </View>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text style={styles.activityType}>{getActivityTypeName(item.type)}</Text>
        </View>
        <View style={[styles.privacyBadge, { backgroundColor: item.isPublic ? '#10b981' : '#f59e0b' }]}>
          <Text style={styles.privacyText}>{item.isPublic ? 'Public' : 'Private'}</Text>
        </View>
      </View>
      {item.description && (
        <Text style={styles.activityDescription}>{item.description}</Text>
      )}
      {item.scheduledTime && (
        <View style={styles.activityTime}>
          <Ionicons name="time" size={16} color="#6b7280" />
          <Text style={styles.timeText}>
            {item.scheduledTime.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </Text>
        </View>
      )}
      {item.location && (
        <View style={styles.activityLocation}>
          <Ionicons name="location" size={16} color="#6b7280" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
      )}
      <View style={styles.participantsContainer}>
        <Text style={styles.participantsText}>
          {item.participants.length} participant{item.participants.length !== 1 ? 's' : ''}
        </Text>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'study_group': return '#3b82f6';
      case 'social_event': return '#8b5cf6';
      case 'volunteer_together': return '#ef4444';
      case 'mood_share': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'study_group': return 'book';
      case 'social_event': return 'people';
      case 'volunteer_together': return 'heart';
      case 'mood_share': return 'happy';
      default: return 'help';
    }
  };

  const getActivityTypeName = (type: string) => {
    switch (type) {
      case 'study_group': return 'Study Group';
      case 'social_event': return 'Social Event';
      case 'volunteer_together': return 'Volunteering';
      case 'mood_share': return 'Mood Share';
      default: return 'Activity';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Friends ({acceptedFriends.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
          onPress={() => setActiveTab('activities')}
        >
          <Text style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}>
            Activities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
          onPress={() => setActiveTab('discover')}
        >
          <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>
            Discover
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'friends' && (
        <View style={styles.contentContainer}>
          {pendingRequests.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Friend Requests ({pendingRequests.length})</Text>
              <FlatList
                data={pendingRequests}
                keyExtractor={(item) => item.id}
                renderItem={renderFriend}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Friends ({acceptedFriends.length})</Text>
            <FlatList
              data={acceptedFriends}
              keyExtractor={(item) => item.id}
              renderItem={renderFriend}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      )}

      {activeTab === 'activities' && (
        <View style={styles.contentContainer}>
          <FlatList
            data={mockActivities}
            keyExtractor={(item) => item.id}
            renderItem={renderActivity}
            showsVerticalScrollIndicator={false}
            style={styles.contentContainer}
          />
        </View>
      )}

      {activeTab === 'discover' && (
        <View style={styles.contentContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for friends or activities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.discoverGrid}>
            <TouchableOpacity style={styles.discoverCard}>
              <Ionicons name="people" size={32} color="#6366f1" />
              <Text style={styles.discoverTitle}>Find Friends</Text>
              <Text style={styles.discoverDescription}>Connect with classmates</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.discoverCard}>
              <Ionicons name="calendar" size={32} color="#10b981" />
              <Text style={styles.discoverTitle}>Join Events</Text>
              <Text style={styles.discoverDescription}>Discover activities</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.discoverCard}>
              <Ionicons name="heart" size={32} color="#ef4444" />
              <Text style={styles.discoverTitle}>Volunteer Together</Text>
              <Text style={styles.discoverDescription}>Make a difference</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.discoverCard}>
              <Ionicons name="book" size={32} color="#f59e0b" />
              <Text style={styles.discoverTitle}>Study Groups</Text>
              <Text style={styles.discoverDescription}>Learn together</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
  searchButton: {
    padding: 8,
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
    fontSize: 12,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  friendStatus: {
    fontSize: 12,
    color: '#10b981',
  },
  actionButton: {
    padding: 8,
  },
  activityCard: {
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
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  activityType: {
    fontSize: 12,
    color: '#6b7280',
  },
  privacyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  privacyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  activityDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  activityTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  activityLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  participantsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  joinButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  joinButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  discoverGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  discoverCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  discoverTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  discoverDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
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
