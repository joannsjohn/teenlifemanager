# Development Guidelines

## Code Style
- Use TypeScript for all new files
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Add comments for complex logic

## Component Structure
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ComponentProps {
  // Define props here
}

export default function ComponentName({ }: ComponentProps) {
  return (
    <View style={styles.container}>
      <Text>Component content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Styles here
  },
});
```

## State Management
- Use Zustand for global state
- Keep component state local when possible
- Use React Query for server state

## Navigation
- Use React Navigation v6+ patterns
- Implement proper TypeScript types for navigation
- Use stack and tab navigators as needed

## Styling
- Use StyleSheet.create() for all styles
- Follow consistent naming conventions
- Use theme colors from constants
- Implement responsive design

## File Naming
- Use PascalCase for components: `ComponentName.tsx`
- Use camelCase for utilities: `utilityFunction.ts`
- Use kebab-case for assets: `image-name.jpg`

