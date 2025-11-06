import { Animated, Platform } from 'react-native';

// Native driver is only supported on iOS and Android, not on web
const canUseNativeDriver = Platform.OS !== 'web';

// Fade in animation
export const fadeIn = (value: Animated.Value, duration: number = 250) => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    useNativeDriver: canUseNativeDriver,
  });
};

// Fade out animation
export const fadeOut = (value: Animated.Value, duration: number = 250) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    useNativeDriver: canUseNativeDriver,
  });
};

// Slide in from bottom
export const slideInUp = (value: Animated.Value, duration: number = 300) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    useNativeDriver: canUseNativeDriver,
  });
};

// Slide in from right
export const slideInRight = (translateX: Animated.Value, duration: number = 300) => {
  return Animated.timing(translateX, {
    toValue: 0,
    duration,
    useNativeDriver: canUseNativeDriver,
  });
};

// Scale animation
export const scaleIn = (value: Animated.Value, duration: number = 250) => {
  return Animated.spring(value, {
    toValue: 1,
    tension: 50,
    friction: 7,
    useNativeDriver: canUseNativeDriver,
  });
};

// Stagger animation for lists
export const staggerAnimation = (
  values: Animated.Value[],
  delay: number = 50,
  duration: number = 250
) => {
  return Animated.parallel(
    values.map((value, index) =>
      Animated.timing(value, {
        toValue: 1,
        duration,
        delay: index * delay,
        useNativeDriver: canUseNativeDriver,
      })
    )
  );
};

// Spring animation configuration
export const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

// Pulse animation
export const pulse = (value: Animated.Value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: canUseNativeDriver,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 500,
        useNativeDriver: canUseNativeDriver,
      }),
    ])
  );
};
