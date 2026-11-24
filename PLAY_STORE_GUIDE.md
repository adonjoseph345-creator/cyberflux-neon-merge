# 🚀 Publishing *CyberFlux: Neon Merge* to Google Play Store

This guide walks you through packaging **CyberFlux: Neon Merge** into a signed Android App Bundle (`.aab`) and publishing it on the **Google Play Console**.

---

## 1. Prerequisites
1. **Node.js** (Installed: `v24+`)
2. **Android Studio** (installs the Android SDK & Gradle build tools)
3. **Google Play Console Developer Account** ([play.google.com/console](https://play.google.com/console))

---

## 2. Generate the Android Project with Capacitor

Open a terminal in `e:\demo_project` and run:

```powershell
# 1. Install Capacitor Android dependencies
npm install

# 2. Initialize the native Android project folder
npm run android:init

# 3. Sync the game bundle (./www) into the Android project
npm run android:sync
```

> **Note:** `capacitor.config.json` is already configured with:
> - **App ID (`package_name`):** `com.cyberflux.neonmerge`
> - **App Name:** `CyberFlux: Neon Merge`
> - **Release Type:** `AAB` (Android App Bundle required by Google Play)

---

## 3. Generate Your Upload Keystore (Signing Key)

Google Play requires all `.aab` bundles to be digitally signed. Run this once to generate your release keystore:

```powershell
keytool -genkey -v -keystore cyberflux-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias cyberflux
```

Keep `cyberflux-release-key.jks` and its password backed up safely!

---

## 4. Build the Signed `.aab` in Android Studio

1. Open the Android project in Android Studio:
   ```powershell
   npm run android:open
   ```
2. In Android Studio, go to **Build → Generate Signed Bundle / APK...**
3. Select **Android App Bundle** and click **Next**.
4. Choose your `cyberflux-release-key.jks` file, enter your credentials, and select **release**.
5. Android Studio will output the Play Store bundle at:
   `android/app/release/app-release.aab`

---

## 5. Upload to Google Play Console

1. Log in to [Google Play Console](https://play.google.com/console) and click **Create app**.
2. Fill in the store listing details:
   - **App Name:** CyberFlux: Neon Merge
   - **Category:** Game → Puzzle / Strategy
   - **Short Description:** Merge neon nodes, trigger explosive chain reactions, and deploy cyber power-ups!
   - **Full Description:**
     > Enter the cyber-grid in **CyberFlux: Neon Merge**! Tap connected neon data nodes to collapse and upgrade them from humble 2-BIT nodes all the way to the 1024 SINGULARITY. Chain rapid combos for massive score multipliers, harvest Flux Energy, and deploy tactical modules like EMP Blast, Overclock, Quantum Sync, and Firewall Purge to wipe out corrupted Malware tiles. Features both Endless Overdrive and a seeded 35-move Daily Tactical Blitz!
3. Upload `app-release.aab` under **Testing → Internal testing** (or **Production**) and roll out your release!

