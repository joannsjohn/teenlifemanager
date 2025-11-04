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
import { VolunteeringRecord, Organization } from '../types';

const mockRecords: VolunteeringRecord[] = [
  {
    id: '1',
    organizationId: '1',
    organizationName: 'Local Food Bank',
    activity: 'Food Distribution',
    description: 'Helped distribute food to families in need',
    startTime: new Date(2024, 0, 10, 9, 0),
    endTime: new Date(2024, 0, 10, 13, 0),
    hours: 4,
    status: 'approved',
    supervisorName: 'John Smith',
    supervisorEmail: 'john@foodbank.org',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    organizationId: '2',
    organizationName: 'Animal Shelter',
    activity: 'Dog Walking',
    description: 'Walked dogs and helped with feeding',
    startTime: new Date(2024, 0, 12, 14, 0),
    endTime: new Date(2024, 0, 12, 17, 0),
    hours: 3,
    status: 'pending',
    supervisorName: 'Sarah Johnson',
    supervisorEmail: 'sarah@animalshelter.org',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Local Food Bank',
    description: 'Helping fight hunger in our community',
    website: 'https://localfoodbank.org',
    contactEmail: 'volunteer@localfoodbank.org',
    contactPhone: '(555) 123-4567',
    address: '123 Main St, City, State 12345',
    categories: ['Hunger Relief', 'Community Service'],
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Animal Shelter',
    description: 'Caring for abandoned and rescued animals',
    website: 'https://animalshelter.org',
    contactEmail: 'volunteer@animalshelter.org',
    contactPhone: '(555) 987-6543',
    address: '456 Oak Ave, City, State 12345',
    categories: ['Animal Welfare', 'Community Service'],
    isVerified: true,
    createdAt: new Date(),
  },
];

export default function VolunteeringScreen() {
  const [activeTab, setActiveTab] = useState<'records' | 'organizations' | 'add'>('records');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    organizationId: '',
    activity: '',
    description: '',
    startTime: '',
    endTime: '',
  });

  const totalHours = mockRecords
    .filter(record => record.status === 'approved')
    .reduce((sum, record) => sum + record.hours, 0);

  const pendingHours = mockRecords
    .filter(record => record.status === 'pending')
    .reduce((sum, record) => sum + record.hours, 0);

  const renderRecord = ({ item }: { item: VolunteeringRecord }) => (
    <TouchableOpacity style={[styles.recordCard, { borderLeftColor: getStatusColor(item.status) }]}>
      <View style={styles.recordHeader}>
        <Text style={styles.organizationName}>{item.organizationName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.activityTitle}>{item.activity}</Text>
      {item.description && (
        <Text style={styles.description}>{item.description}</Text>
      )}
      <View style={styles.recordFooter}>
        <Text style={styles.hoursText}>{item.hours} hours</Text>
        <Text style={styles.dateText}>
          {item.startTime.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderOrganization = ({ item }: { item: Organization }) => (
    <TouchableOpacity style={styles.organizationCard}>
      <View style={styles.organizationHeader}>
        <Text style={styles.organizationName}>{item.name}</Text>
        {item.isVerified && (
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
        )}
      </View>
      <Text style={styles.organizationDescription}>{item.description}</Text>
      <View style={styles.categoriesContainer}>
        {item.categories.map((category, index) => (
          <View key={index} style={styles.categoryTag}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        ))}
      </View>
      <View style={styles.organizationFooter}>
        <Text style={styles.contactText}>{item.contactEmail}</Text>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleAddRecord = () => {
    // Handle adding new record
    setShowAddModal(false);
    setNewRecord({
      organizationId: '',
      activity: '',
      description: '',
      startTime: '',
      endTime: '',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalHours}</Text>
          <Text style={styles.statLabel}>Total Hours</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pendingHours}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{mockRecords.length}</Text>
          <Text style={styles.statLabel}>Records</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'records' && styles.activeTab]}
          onPress={() => setActiveTab('records')}
        >
          <Text style={[styles.tabText, activeTab === 'records' && styles.activeTabText]}>
            Records
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'organizations' && styles.activeTab]}
          onPress={() => setActiveTab('organizations')}
        >
          <Text style={[styles.tabText, activeTab === 'organizations' && styles.activeTabText]}>
            Organizations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'add' && styles.activeTab]}
          onPress={() => setActiveTab('add')}
        >
          <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
            Add Hours
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        {activeTab === 'records' && (
          <FlatList
            data={mockRecords}
            keyExtractor={(item) => item.id}
            renderItem={renderRecord}
            showsVerticalScrollIndicator={false}
          />
        )}

        {activeTab === 'organizations' && (
          <FlatList
            data={mockOrganizations}
            keyExtractor={(item) => item.id}
            renderItem={renderOrganization}
            showsVerticalScrollIndicator={false}
          />
        )}

        {activeTab === 'add' && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Add Volunteer Hours</Text>
            <TextInput
              style={styles.input}
              placeholder="Activity"
              value={newRecord.activity}
              onChangeText={(text) => setNewRecord({ ...newRecord, activity: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description (optional)"
              value={newRecord.description}
              onChangeText={(text) => setNewRecord({ ...newRecord, description: text })}
              multiline
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAddRecord}>
              <Text style={styles.submitButtonText}>Add Record</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

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
  recordCard: {
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
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  organizationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  organizationCard: {
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
  organizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  organizationDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryTag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '500',
  },
  organizationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  contactButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  contactButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  addForm: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
