import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Animated,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/SimpleNavigation';
import { VolunteeringRecord, Organization } from '../types';
import GradientCard from '../components/common/GradientCard';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { volunteerService } from '../services/volunteerService';
import { organizationService } from '../services/organizationService';
import { fadeIn } from '../utils/animations';
import { useAuthStore } from '../store/authStore';
import { calculatePVSAEligibility, getPVSALevelName, getPVSALevelColor } from '../utils/pvsa';
import PVSAGauge from '../components/common/PVSAGauge';

export default function VolunteeringScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState<'records' | 'organizations' | 'calendar'>('records');
  const [records, setRecords] = useState<VolunteeringRecord[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalHours, setTotalHours] = useState(0);
  const [approvedHours, setApprovedHours] = useState(0);
  const [pendingHours, setPendingHours] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fadeIn(fadeAnim, 300).start();
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [hoursData, orgsData, totalData] = await Promise.all([
        volunteerService.getVolunteerHours().catch(() => []),
        organizationService.getOrganizations().catch(() => []),
        volunteerService.getTotalHours().catch(() => 0),
      ]);
      
      setRecords(hoursData);
      setOrganizations(orgsData);
      setTotalHours(totalData);
      
      const pending = hoursData
        .filter(record => record.status === 'pending')
        .reduce((sum, record) => sum + record.hours, 0);
      setPendingHours(pending);
      
      // Calculate approved hours for PVSA (only approved hours count)
      const approved = hoursData
        .filter(record => record.status === 'approved')
        .reduce((sum, record) => sum + record.hours, 0);
      setApprovedHours(approved);
    } catch (error) {
      // Silently fail - network errors are expected when backend is not available
      // Only log in development mode
      if (__DEV__) {
        console.log('Volunteering service unavailable - backend may not be running');
      }
      // Set empty defaults
      setRecords([]);
      setOrganizations([]);
      setTotalHours(0);
      setPendingHours(0);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
  };

  const handleAddHours = (organizationId?: string) => {
    navigation.navigate('AddVolunteerHours' as any, { organizationId });
  };

  const handleAddOrganization = () => {
    navigation.navigate('AddOrganization' as any);
  };

  const handleOrganizationPress = (organization: Organization) => {
    navigation.navigate('OrganizationDetails' as any, { organizationId: organization.id });
  };

  const handleRecordPress = (record: VolunteeringRecord) => {
    navigation.navigate('VolunteerHourDetails' as any, { recordId: record.id });
  };

  // Calculate PVSA eligibility (only approved hours count)
  const pvsaEligibility = useMemo(() => {
    return calculatePVSAEligibility(approvedHours, user?.age);
  }, [approvedHours, user?.age]);

  // Prepare calendar marked dates
  const markedDates = useMemo(() => {
    const marked: any = {};
    records.forEach(record => {
      const dateStr = record.startTime.toISOString().split('T')[0];
      if (!marked[dateStr]) {
        marked[dateStr] = {
          marked: true,
          dotColor: colors.volunteering.primary,
          selected: dateStr === selectedDate,
          selectedColor: colors.volunteering.primary,
        };
      } else {
        // If multiple records on same date, show as selected when clicked
        if (dateStr === selectedDate) {
          marked[dateStr].selected = true;
          marked[dateStr].selectedColor = colors.volunteering.primary;
        }
      }
    });
    // Mark selected date
    if (selectedDate && !marked[selectedDate]) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.volunteering.primary,
      };
    }
    return marked;
  }, [records, selectedDate]);

  // Get events for selected date
  const getEventsForDate = (date: string) => {
    return records.filter(record => {
      const recordDate = record.startTime.toISOString().split('T')[0];
      return recordDate === date;
    });
  };

  const selectedDateEvents = useMemo(() => {
    return getEventsForDate(selectedDate);
  }, [selectedDate, records]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return colors.success;
      case 'pending': return colors.warning;
      case 'rejected': return colors.error;
      default: return colors.gray500;
    }
  };

  const renderRecord = ({ item }: { item: VolunteeringRecord }) => (
    <GradientCard 
      section="volunteering" 
      variant="elevated" 
      style={[styles.recordCard, { borderLeftColor: getStatusColor(item.status), borderLeftWidth: 4 }]}
    >
      <TouchableOpacity activeOpacity={0.7} onPress={() => handleRecordPress(item)}>
        <View style={styles.recordHeader}>
          <View style={styles.recordHeaderLeft}>
            <Ionicons name="heart" size={20} color={colors.volunteering.primary} style={styles.recordIcon} />
            <Text style={styles.organizationName} numberOfLines={1}>{item.organizationName}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.activityTitle}>{item.activity}</Text>
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        )}
        <View style={styles.recordFooter}>
          <View style={styles.hoursContainer}>
            <Ionicons name="time-outline" size={16} color={colors.volunteering.primary} />
            <Text style={styles.hoursText}>{item.hours} hours</Text>
          </View>
          <Text style={styles.dateText}>
            {item.startTime.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
      </TouchableOpacity>
    </GradientCard>
  );

  const renderOrganization = ({ item }: { item: Organization }) => (
    <GradientCard section="volunteering" variant="elevated" style={styles.organizationCard}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => handleOrganizationPress(item)}>
        <View style={styles.organizationHeader}>
          <View style={styles.organizationHeaderLeft}>
            <Ionicons name="business" size={24} color={colors.volunteering.primary} style={styles.orgIcon} />
            <Text style={styles.organizationName} numberOfLines={1}>{item.name}</Text>
          </View>
          {item.isVerified && (
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          )}
        </View>
        <Text style={styles.organizationDescription} numberOfLines={2}>{item.description}</Text>
        {item.categories && item.categories.length > 0 && (
          <View style={styles.categoriesContainer}>
            {item.categories.slice(0, 3).map((category, index) => (
              <View key={index} style={[styles.categoryTag, { backgroundColor: colors.volunteering.primary + '20' }]}>
                <Text style={[styles.categoryText, { color: colors.volunteering.primary }]}>{category}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.organizationFooter}>
          <TouchableOpacity 
            style={styles.addHoursButton}
            onPress={() => handleAddHours(item.id)}
          >
            <Ionicons name="add-circle" size={18} color={colors.volunteering.primary} />
            <Text style={styles.addHoursText}>Add Hours</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </GradientCard>
  );

  const renderEmptyState = (type: 'records' | 'organizations') => (
    <View style={styles.emptyState}>
      <Ionicons 
        name={type === 'records' ? 'time-outline' : 'business-outline'} 
        size={64} 
        color={colors.gray400} 
      />
      <Text style={styles.emptyStateTitle}>
        {type === 'records' ? 'No Volunteer Hours' : 'No Organizations'}
      </Text>
      <Text style={styles.emptyStateText}>
        {type === 'records' 
          ? 'Start logging your volunteer hours to track your impact!'
          : 'Add an organization to start tracking volunteer hours!'}
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={type === 'records' ? () => handleAddHours() : handleAddOrganization}
      >
        <Text style={styles.emptyStateButtonText}>
          {type === 'records' ? 'Add Volunteer Hours' : 'Add Organization'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#F8FAFC', '#FEF2F2', '#FEE2E2']}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle} numberOfLines={1}>Volunteering</Text>
        </View>
        
        {/* Stats - First Row */}
        <View style={styles.statsRow}>
          <GradientCard section="volunteering" variant="gradient" style={styles.statCard}>
            <Text style={styles.statNumber}>{approvedHours.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Approved Hours</Text>
          </GradientCard>
          <GradientCard section="volunteering" variant="elevated" style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.volunteering.primary }]}>
              {pendingHours.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.gray700 }]}>Total Pending Hours</Text>
          </GradientCard>
          <GradientCard section="volunteering" variant="elevated" style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.volunteering.primary }]}>
              {records.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.gray700 }]}>Total Records</Text>
          </GradientCard>
        </View>

        {/* PVSA Gauge Charts */}
        <View style={styles.pvsaContainer}>
          <GradientCard section="volunteering" variant="elevated" style={styles.pvsaCardContainer}>
            <View style={styles.pvsaGaugesRow}>
              <PVSAGauge
                level="bronze"
                currentHours={approvedHours}
                threshold={pvsaEligibility.bronzeThreshold}
                isAchieved={pvsaEligibility.currentLevel !== 'none' && (pvsaEligibility.currentLevel === 'bronze' || pvsaEligibility.currentLevel === 'silver' || pvsaEligibility.currentLevel === 'gold')}
                progress={approvedHours >= pvsaEligibility.bronzeThreshold ? 100 : (approvedHours / pvsaEligibility.bronzeThreshold) * 100}
              />
              <PVSAGauge
                level="silver"
                currentHours={approvedHours}
                threshold={pvsaEligibility.silverThreshold}
                isAchieved={pvsaEligibility.currentLevel === 'silver' || pvsaEligibility.currentLevel === 'gold'}
                progress={approvedHours >= pvsaEligibility.silverThreshold ? 100 : approvedHours >= pvsaEligibility.bronzeThreshold ? ((approvedHours - pvsaEligibility.bronzeThreshold) / (pvsaEligibility.silverThreshold - pvsaEligibility.bronzeThreshold)) * 100 : 0}
              />
              <PVSAGauge
                level="gold"
                currentHours={approvedHours}
                threshold={pvsaEligibility.goldThreshold}
                isAchieved={pvsaEligibility.currentLevel === 'gold'}
                progress={approvedHours >= pvsaEligibility.goldThreshold ? 100 : approvedHours >= pvsaEligibility.silverThreshold ? ((approvedHours - pvsaEligibility.silverThreshold) / (pvsaEligibility.goldThreshold - pvsaEligibility.silverThreshold)) * 100 : 0}
              />
            </View>
          </GradientCard>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'records' && styles.activeTab]}
            onPress={() => setActiveTab('records')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'records' && styles.activeTabText]}>
              📝 Records
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'organizations' && styles.activeTab]}
            onPress={() => setActiveTab('organizations')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'organizations' && styles.activeTabText]}>
              🏢 Organizations
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'calendar' && styles.activeTab]}
            onPress={() => setActiveTab('calendar')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
              📅 Calendar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.listContainer}>
          {activeTab === 'records' && (
            <FlatList
              data={records}
              keyExtractor={(item) => item.id}
              renderItem={renderRecord}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={records.length === 0 ? styles.emptyContainer : styles.listContent}
              refreshControl={
                <RefreshControl 
                  refreshing={isRefreshing} 
                  onRefresh={handleRefresh}
                  tintColor={colors.volunteering.primary}
                />
              }
              ListEmptyComponent={!isLoading ? renderEmptyState('records') : null}
            />
          )}

          {activeTab === 'organizations' && (
            <FlatList
              data={organizations}
              keyExtractor={(item) => item.id}
              renderItem={renderOrganization}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={organizations.length === 0 ? styles.emptyContainer : styles.listContent}
              refreshControl={
                <RefreshControl 
                  refreshing={isRefreshing} 
                  onRefresh={handleRefresh}
                  tintColor={colors.volunteering.primary}
                />
              }
              ListEmptyComponent={!isLoading ? renderEmptyState('organizations') : null}
            />
          )}

          {activeTab === 'calendar' && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl 
                  refreshing={isRefreshing} 
                  onRefresh={handleRefresh}
                  tintColor={colors.volunteering.primary}
                />
              }
            >
              <View style={styles.calendarContainer}>
                <GradientCard section="volunteering" variant="elevated" style={styles.calendarCard}>
                  <Calendar
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    markedDates={markedDates}
                    theme={{
                      selectedDayBackgroundColor: colors.volunteering.primary,
                      selectedDayTextColor: colors.white,
                      todayTextColor: colors.volunteering.primary,
                      arrowColor: colors.volunteering.primary,
                      textDayFontWeight: '600',
                      textMonthFontWeight: '700',
                      textDayFontSize: 14,
                      textMonthFontSize: 16,
                    }}
                    style={styles.calendar}
                  />
                </GradientCard>

                {selectedDateEvents.length > 0 && (
                  <View style={styles.selectedDateContainer}>
                    <Text style={styles.selectedDateTitle}>
                      {new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                    <FlatList
                      data={selectedDateEvents}
                      keyExtractor={(item) => item.id}
                      renderItem={renderRecord}
                      showsVerticalScrollIndicator={false}
                      scrollEnabled={false}
                    />
                  </View>
                )}

                {selectedDateEvents.length === 0 && !isLoading && (
                  <View style={styles.noEventsContainer}>
                    <Ionicons name="calendar-outline" size={48} color={colors.gray400} />
                    <Text style={styles.noEventsText}>No volunteer activities on this date</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </Animated.View>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        {activeTab === 'organizations' && (
          <TouchableOpacity style={styles.fab} onPress={handleAddOrganization} activeOpacity={0.8}>
            <LinearGradient
              colors={[colors.volunteering.primary, colors.volunteering.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fabGradient}
            >
              <Ionicons name="business" size={24} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.fab} onPress={() => handleAddHours()} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.volunteering.primary, colors.volunteering.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={28} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h3,
    fontWeight: '600',
    color: colors.gray900,
  },
  statsRow: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  statsScrollContainer: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingRight: spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    minWidth: 100,
  },
  pvsaContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  pvsaCardContainer: {
    padding: spacing.lg,
  },
  pvsaGaugesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.labelSmall,
    color: colors.white,
    textAlign: 'center',
  },
  pvsaCard: {
    minWidth: 140,
  },
  pvsaBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  pvsaProgress: {
    ...typography.labelSmall,
    color: colors.gray600,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontSize: 10,
  },
  calendarContainer: {
    padding: spacing.lg,
  },
  calendarCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  calendar: {
    borderRadius: borderRadius.lg,
  },
  selectedDateContainer: {
    marginTop: spacing.md,
  },
  selectedDateTitle: {
    ...typography.h4,
    color: colors.gray900,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  noEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  noEventsText: {
    ...typography.body,
    color: colors.gray600,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  activeTab: {
    backgroundColor: colors.volunteering.primary,
  },
  tabText: {
    ...typography.label,
    color: colors.gray600,
  },
  activeTabText: {
    color: colors.white,
    fontWeight: '700',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
  },
  recordCard: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  recordHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordIcon: {
    marginRight: spacing.sm,
  },
  organizationName: {
    ...typography.bodyLarge,
    color: colors.gray900,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  statusText: {
    ...typography.labelSmall,
    color: colors.white,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  activityTitle: {
    ...typography.body,
    color: colors.gray700,
    fontWeight: '600',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
    color: colors.gray600,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  hoursText: {
    ...typography.body,
    color: colors.volunteering.primary,
    fontWeight: '700',
  },
  dateText: {
    ...typography.labelSmall,
    color: colors.gray500,
  },
  organizationCard: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  organizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  organizationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orgIcon: {
    marginRight: spacing.sm,
  },
  organizationDescription: {
    ...typography.body,
    color: colors.gray600,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  categoryTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  categoryText: {
    ...typography.labelSmall,
    fontWeight: '600',
  },
  organizationFooter: {
    padding: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  addHoursButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.volunteering.primary + '10',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  addHoursText: {
    ...typography.label,
    color: colors.volunteering.primary,
    fontWeight: '600',
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
    marginBottom: spacing.lg,
  },
  emptyStateButton: {
    backgroundColor: colors.volunteering.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  emptyStateButtonText: {
    ...typography.button,
    color: colors.white,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    flexDirection: 'column',
    gap: spacing.md,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    ...shadows.xl,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
