import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle, Platform } from 'react-native';

interface AnimatedContainerProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
  animationType?: 'fade' | 'slide' | 'scale';
}

export default function AnimatedContainer({
  children,
  delay = 0,
  duration = 250,
  animationType = 'fade',
  style,
}: AnimatedContainerProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];
    const canUseNativeDriver = Platform.OS !== 'web';

    if (animationType === 'fade' || animationType === 'scale') {
      animations.push(
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: canUseNativeDriver,
        })
      );
    }

    if (animationType === 'slide') {
      animations.push(
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          delay,
          useNativeDriver: canUseNativeDriver,
        })
      );
      animations.push(
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: canUseNativeDriver,
        })
      );
    }

    if (animationType === 'scale') {
      animations.push(
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          delay,
          useNativeDriver: canUseNativeDriver,
        })
      );
    }

    Animated.parallel(animations).start();
  }, [delay, duration, animationType]);

  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'fade':
        return { opacity: fadeAnim };
      case 'slide':
        return {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        };
      case 'scale':
        return {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        };
      default:
        return { opacity: fadeAnim };
    }
  };

  return (
    <Animated.View style={[styles.container, getAnimatedStyle(), style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

