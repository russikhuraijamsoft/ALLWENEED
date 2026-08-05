# Build and Run Instructions — Desktop (Electron) and Mobile (Capacitor/Android)

This repository has been prepared to build a desktop app (Electron) and an Android app (Capacitor) from the existing Vite React web app.

Prerequisites (local dev machine):
- Node.js >=18 and npm
- Android Studio + Android SDK (for Android builds)
- Java JDK (for Android)
- For Electron packaging: optional -- for building installers, electron-builder will handle most, but on macOS you may need Xcode for signing.

Install dependencies
1. Install node packages:
   npm install

Desktop (Electron) — development
1. Start Vite dev server and Electron together:
   npm run electron:dev

This runs Vite on http://localhost:3000 and launches Electron pointed at the dev server.

Desktop (Electron) — production build
1. Build the web app:
   npm run build
2. Build the Electron application (creates installers / binaries):
   npm run electron:build

The packaged apps will be created by electron-builder in the `dist_electron` (default) or as configured by electron-builder.

Mobile (Android) — Capacitor
1. Build the web app:
   npm run build
2. Copy web assets to Capacitor:
   npx cap sync
3. Open the Android project in Android Studio:
   npx cap open android
4. From Android Studio, build and run on a device or emulator. For release builds, create signed APK/AAB as usual.

Notes:
- Capacitor requires Android Studio; the commands above only prepare the Capacitor project. The final APK/AAB must be built in Android Studio.
- Replace `com.yourdomain.allweneed` in capacitor.config.json with your actual app id.
- Replace product names and appId in package.json electron-builder config if you want branded installers.

If you want, I can produce a standalone Windows EXE/macOS DMG/Linux AppImage here in CI or locally and upload the artifacts — tell me which platform(s) you want packaged and I will run the build and provide the binaries.
