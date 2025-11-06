# Android SDK Setup for Expo (macOS)

## Quick Setup Steps

### Option 1: Full Android Studio Setup (Recommended)

1. **Download Android Studio**
   - Visit: https://developer.android.com/studio
   - Download the macOS version
   - Install by dragging to Applications folder

2. **Install Android SDK through Android Studio**
   - Open Android Studio
   - Go to `Tools` > `SDK Manager` (or `Android Studio` > `Settings` > `Appearance & Behavior` > `System Settings` > `Android SDK`)
   
3. **Install Required SDK Components**
   - **SDK Platforms Tab:**
     - Check `Android 14.0 (Tiramisu)` API 34 (or latest)
     - Check `Android 13.0 (Tiramisu)` API 33
   
   - **SDK Tools Tab:**
     - ✅ Android SDK Build-Tools
     - ✅ Android Emulator
     - ✅ Android SDK Platform-Tools
     - ✅ Android SDK Command-line Tools
     - ✅ Intel x86 Emulator Accelerator (HAXM installer) - if using Intel Mac
     - ✅ Google Play services

4. **Set Environment Variables**
   Add to your `~/.zshrc` (or `~/.bash_profile` if using bash):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   ```
   
   Then reload:
   ```bash
   source ~/.zshrc
   ```

5. **Create Android Virtual Device (AVD)**
   - In Android Studio: `Tools` > `AVD Manager`
   - Click `Create Virtual Device`
   - Choose a device (e.g., Pixel 6)
   - Select system image (API 34 recommended)
   - Click `Finish`

### Option 2: Command Line Only (Faster, Expo-focused)

If you just want to test with Expo Go app on a physical device, you can skip Android Studio and just install the SDK:

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Android SDK via Homebrew
brew install --cask android-studio
```

Then follow steps 3-4 above to configure the SDK.

### Option 3: Use Expo Go (Easiest - No Setup Required!)

You can test on Android without installing Android SDK:

1. **Install Expo Go on your Android phone:**
   - Download from Google Play Store: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Run your app:**
   ```bash
   cd frontend
   npm start
   ```
   
3. **Scan QR code** with Expo Go app on your phone

## Verify Installation

After setup, verify everything works:

```bash
# Check Android SDK
adb version

# Check if emulator is available
emulator -list-avds

# Check environment variables
echo $ANDROID_HOME
```

## Running Your Expo App

### On Physical Device (Expo Go)
```bash
cd frontend
npm start
# Scan QR code with Expo Go app
```

### On Android Emulator
```bash
# Start emulator first
emulator -avd <AVD_NAME>

# Then in another terminal
cd frontend
npm start
# Press 'a' to open on Android emulator
```

### Build Development Client (If needed)
```bash
cd frontend
npx expo run:android
```

## Troubleshooting

### ANDROID_HOME not found
```bash
# Find where SDK is installed (usually in one of these)
ls ~/Library/Android/sdk
ls ~/Android/Sdk
ls /Users/$USER/Library/Android/sdk

# Set it in your shell config
export ANDROID_HOME=$HOME/Library/Android/sdk
```

### "adb: command not found"
Make sure `platform-tools` is in your PATH:
```bash
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Expo can't find Android SDK
```bash
# Check if Expo can find it
npx expo-doctor

# If not found, set explicitly:
export ANDROID_HOME=$HOME/Library/Android/sdk
```

## Quick Test

Once set up, test with:
```bash
cd frontend
npm run android
```

This will:
1. Start Metro bundler
2. Build the app (if needed)
3. Launch on Android emulator or connected device

