import { Animated } from 'react-native';

// Fade in animation
export const fadeIn = (value: Animated.Value, duration: number = 250) => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    useNativeDriver: true,
  });
};

// Fade out animation
export const fadeOut = (value: Animated.Value, duration: number = 250) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  });
};

// Slide in from bottom
export const slideInUp = (value: Animated.Value, duration: number = 300) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  });
};

// Slide in from right
export const slideInRight = (translateX: Animated.Value, duration: number = 300) => {
  return Animated.timing(translateX, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  });
};

// Scale animation
export const scaleIn = (value: Animated.Value, duration: number = 250) => {
  return Animated.spring(value, {
    toValue: 1,
    tension: 50,
    friction: 7,
    useNativeDriver: true,
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
        useNativeDriver: true,
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
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ])
  );
};
