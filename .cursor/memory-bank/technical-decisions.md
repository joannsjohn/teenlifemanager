# Technical Decisions & Solutions

## Image Handling Solutions
### Problem: Local assets not working with Expo web
**Solution**: Used Imgur for hosting personal images
- **Images**: Jayden & Lilly photos
- **URLs**: 
  - https://imgur.com/omncmrP.jpg
  - https://imgur.com/TD1uKFa.jpg
  - https://imgur.com/Bqwvfvd.jpg

### Problem: Large JPG files causing bundling errors
**Solution**: Resized images using macOS `sips` command
- **Command**: `sips -Z 800 filename.JPG --out filename_small.jpg`
- **Result**: Smaller file sizes that work with Expo

## State Management Decisions
### Chosen: Zustand over Redux
**Reason**: Simpler API, less boilerplate, better TypeScript support
**Implementation**: 
- `useAuthStore` for user authentication
- Simple, clean state management
- Persistence with middleware

## Navigation Architecture
### Chosen: React Navigation v6+
**Structure**:
- Stack Navigator for main app flow
- Tab Navigator for main features
- Proper TypeScript integration

## Development Workflow
### Expo Development Server
- **Web**: `npx expo start --web`
- **Mobile**: `npx expo start` (for Expo Go)
- **Cache Clearing**: `npx expo start --clear`

## Error Handling Patterns
- Try-catch blocks for async operations
- Proper error boundaries
- User-friendly error messages
- Fallback UI components

