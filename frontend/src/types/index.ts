// Core Types for Teen Life Manager App

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  grade: string;
  profileImage?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    schedule: boolean;
    volunteering: boolean;
    social: boolean;
    mentalHealth: boolean;
  };
  privacy: {
    shareSchedule: boolean;
    shareVolunteering: boolean;
    shareMood: boolean;
  };
}

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  category: EventCategory;
  priority: 'low' | 'medium' | 'high';
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  location?: string;
  attendees?: string[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number;
  daysOfWeek?: number[];
  endDate?: Date;
}

export interface VolunteeringRecord {
  id: string;
  organizationId: string;
  organizationName: string;
  activity: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  hours: number;
  status: 'pending' | 'approved' | 'rejected';
  supervisorName?: string;
  supervisorEmail?: string;
  verificationCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  website?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  categories: string[];
  isVerified: boolean;
  logo?: string;
  createdAt: Date;
}

export interface SocialConnection {
  id: string;
  userId: string;
  friendId: string;
  friendName: string;
  friendProfileImage?: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
}

export interface SocialActivity {
  id: string;
  userId: string;
  type: 'study_group' | 'social_event' | 'volunteer_together' | 'mood_share';
  title: string;
  description?: string;
  participants: string[];
  scheduledTime?: Date;
  location?: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  stress: number; // 1-10 scale
  notes?: string;
  tags: string[];
  activities: string[];
  createdAt: Date;
}

export interface MentalHealthResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'exercise' | 'meditation' | 'helpline';
  content: string;
  url?: string;
  duration?: number; // in minutes
  category: string;
  isEmergency: boolean;
  isFree: boolean;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'schedule' | 'volunteering' | 'social' | 'mental_health';
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  requirements: AchievementRequirement[];
}

export interface AchievementRequirement {
  type: 'hours_volunteered' | 'events_completed' | 'mood_entries' | 'social_connections';
  target: number;
  current: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'schedule' | 'volunteering' | 'social' | 'mental_health' | 'achievement';
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Schedule: undefined;
  Volunteering: undefined;
  Social: undefined;
  MentalHealth: undefined;
  Profile: undefined;
};

// Store Types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

export interface ScheduleState {
  events: ScheduleEvent[];
  categories: EventCategory[];
  selectedDate: Date;
  isLoading: boolean;
}

export interface VolunteeringState {
  records: VolunteeringRecord[];
  organizations: Organization[];
  totalHours: number;
  isLoading: boolean;
}

export interface SocialState {
  connections: SocialConnection[];
  activities: SocialActivity[];
  friendRequests: SocialConnection[];
  isLoading: boolean;
}

export interface MentalHealthState {
  moodEntries: MoodEntry[];
  resources: MentalHealthResource[];
  achievements: Achievement[];
  currentMood?: MoodEntry;
  isLoading: boolean;
}
