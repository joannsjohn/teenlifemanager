// Vibrant Teen Theme System
// Instagram/TikTok-inspired design with section-specific colors

export const colors = {
  // Base colors
  white: '#FFFFFF',
  black: '#000000',
  background: '#F8FAFC',
  backgroundDark: '#1A1A1A',
  
  // Neutral grays
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Section-specific primary colors
  schedule: {
    primary: '#0066FF',
    primaryLight: '#00CCFF',
    primaryDark: '#0052CC',
    accent: '#00E5FF',
  },
  volunteering: {
    primary: '#FF6B6B',
    primaryLight: '#FF8E8E',
    primaryDark: '#FF5252',
    accent: '#FFB3BA',
  },
  social: {
    primary: '#B026FF',
    primaryLight: '#FF6B9D',
    primaryDark: '#9D1DE8',
    accent: '#FF8CC8',
  },
  mentalHealth: {
    primary: '#00D4AA',
    primaryLight: '#00FFCC',
    primaryDark: '#00B894',
    accent: '#4DFFD9',
  },
  profile: {
    primary: '#6366F1',
    primaryLight: '#8B5CF6',
    primaryDark: '#4F46E5',
    accent: '#A78BFA',
  },
  
  // Status colors
  success: '#10B981',
  successLight: '#34D399',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  error: '#EF4444',
  errorLight: '#F87171',
  info: '#3B82F6',
  infoLight: '#60A5FA',
};

// Gradient definitions for each section
export const gradients = {
  schedule: ['#0066FF', '#00CCFF'],
  volunteering: ['#FF6B6B', '#FF8E8E'],
  social: ['#B026FF', '#FF6B9D'],
  mentalHealth: ['#00D4AA', '#00FFCC'],
  profile: ['#6366F1', '#8B5CF6'],
  
  // Special gradients
  auth: ['#6366F1', '#8B5CF6', '#EC4899'],
  success: ['#10B981', '#34D399'],
  warning: ['#F59E0B', '#FBBF24'],
  error: ['#EF4444', '#F87171'],
};

// Typography system - bold and large for teen appeal
export const typography = {
  // Headings
  h1: {
    fontSize: 40,
    fontWeight: '800' as const,
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  // Body text
  bodyLarge: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  // Labels
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  // Button text
  button: {
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
};

// Spacing system (8px grid)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// Border radius system
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999,
};

// Shadow system for depth (iOS and Android)
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Animation timing constants
export const animations = {
  fast: 150,
  normal: 250,
  slow: 350,
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
};

// Helper function to get section colors
export const getSectionColors = (section: 'schedule' | 'volunteering' | 'social' | 'mentalHealth' | 'profile') => {
  return colors[section];
};

// Helper function to get section gradient
export const getSectionGradient = (section: 'schedule' | 'volunteering' | 'social' | 'mentalHealth' | 'profile') => {
  return gradients[section];
};
