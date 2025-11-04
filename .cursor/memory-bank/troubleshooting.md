# Common Issues & Solutions

## Expo Web Issues
### Problem: "Cannot use 'import.meta' outside a module"
**Solution**: Removed persist middleware from Zustand store
**Code Change**: Simplified store creation without persist wrapper

### Problem: "Unexpected character" errors with JPG files
**Solution**: 
1. Removed large JPG files from assets
2. Used external image hosting (Imgur)
3. Resized images for better compatibility

### Problem: Images not loading in web browser
**Solution**: Used publicly accessible URLs instead of local assets
**Alternative**: Test on mobile with Expo Go for local assets

## Development Server Issues
### Problem: Port conflicts (8081, 8082)
**Solution**: 
```bash
lsof -ti:8081 | xargs kill -9
lsof -ti:8082 | xargs kill -9
```

### Problem: Cache issues
**Solution**: Use `--clear` flag
```bash
npx expo start --web --clear
```

## TypeScript Issues
### Problem: Module resolution errors
**Solution**: Updated `tsconfig.json` with proper module resolution
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## Navigation Issues
### Problem: Import errors for navigation components
**Solution**: Simplified App.tsx to avoid complex navigation initially
**Approach**: Build up complexity gradually

## Image Optimization
### Problem: Large image files
**Solution**: 
- Use `sips` on macOS to resize images
- Host images externally for web compatibility
- Use appropriate image formats (JPG for photos, PNG for graphics)

