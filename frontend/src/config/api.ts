// API Configuration
// For React Native/Expo: Use your machine's IP address when running on a device
// Find your IP with: ifconfig (macOS/Linux) or ipconfig (Windows)
// Common local IP: 192.168.x.x or 10.0.2.2 for Android emulator
const getLocalIP = () => {
  // You can set this manually or use environment variable
  // For iOS Simulator: use localhost
  // For Android Emulator: use 10.0.2.2
  // For physical device: use your machine's local IP (e.g., 192.168.86.34)
  
  // Try to get from environment variable first
  const envIP = process.env.EXPO_PUBLIC_API_URL || process.env.API_URL;
  if (envIP) return envIP;
  
  // Default: Use localhost for simulator, IP for device
  // Change this to your machine's IP when testing on a physical device
  // You can find it with: ifconfig | grep "inet " | grep -v 127.0.0.1
  return __DEV__ ? 'http://192.168.86.34:3000/api' : 'https://your-production-api.com/api';
};

const API_BASE_URL = getLocalIP();

export const API_URL = API_BASE_URL;

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Get auth token from auth store
export const getAuthToken = async (): Promise<string | null> => {
  // Import dynamically to avoid circular dependencies
  const { useAuthStore } = await import('../store/authStore');
  const token = useAuthStore.getState().token;
  return token || null;
};

export default API_CONFIG;

