# TogetherPay (UI/UX prototype)

TogetherPay is a **secure approval layer for bank joint accounts**. In real life it would not hold money, store bank passwords, or move money on its own. The bank stays in charge and TogetherPay can only add stricter safety conditions.

> **This is a prototype.** It shows how the app looks and flows. The bank, people, accounts, balances and transactions are all **fictional sample data**. No real bank is connected and no real money, BVN, NIN, face or fingerprint is used.

## What the demo shows

Welcome, Sign up / Log in, OTP, identity check (BVN or NIN + face), choose bank, bank consent, select joint account, bank signing rule (read only), safety conditions, invite and verify signatories, bank activation, dashboard, request cash, approval tracking, biometric / PIN check, face verification, safety delay, one-time cash code, history and audit trail, alerts, profile, and freeze / unfreeze.

**High-value withdrawals (from ₦1,000,000 by default, for example ₦1.5M, ₦2M, ₦5M and above)** need: all 3 signatories to approve, biometric or PIN confirmation, face verification, and a safety delay before the one-time cash code appears.

## Try it (sample story)

1. Open the app. Tap **Get started**, then **Use sample details** and go through the steps.
   (Shortcut: **Skip setup** on the welcome screen loads a ready sample account.)
2. On the dashboard tap **Request cash**, pick **₦2M**, continue, and confirm with the fingerprint / PIN and the face check.
3. On the tracking screen tap **Prototype: open Chinedu's phone** and approve. Do the same for Tunde.
4. When all three have approved, the safety delay starts. Use **Prototype: skip the delay** to see the one-time cash code.
5. Try **Reject**, **Stop this withdrawal**, and **Freeze** to see the red emergency states.

Sample PIN: `1234`. Sample OTP: `482913`.

## Get the APK (no installs on your computer)

1. Create a free account on github.com, then click **New repository**. Name it `togetherpay-prototype` and choose **Private**.
2. Click **uploading an existing file** and drag in **all the files in this folder** (they are all at the top level):
   `index.html`, `styles.css`, `data.js`, `state.js`, `screens.js`, `app.js`, `package.json`, `capacitor.config.json`, `make_icons.py`, `README.md`, `.gitignore`. Click **Commit changes**.
3. Add the build instructions file. Click **Add file → Create new file**, type exactly `.github/workflows/build-apk.yml` as the name (typing the slashes makes the folders), paste the contents of the `build-apk.yml` file, and click **Commit changes**.
   (If you use GitHub Desktop or Git, you can simply push the whole folder, including `.github`.)
4. Open the **Actions** tab. The build starts by itself. If it does not, click **Build TogetherPay APK → Run workflow**. It takes about 5 to 8 minutes.
5. When you see a green tick, click the run, scroll to the bottom to **Artifacts**, and download **TogetherPay-Prototype-APK**. Unzip it to get `app-debug.apk`.

### Install on an Android phone

Send `app-debug.apk` to the phone (WhatsApp, Telegram, Google Drive or a cable). Open it, allow "Install unknown apps" if asked, tap **Install**, then **Open**.

## Build with Android Studio instead (optional)

1. Install Node.js 22 or newer, Java 21 and Android Studio.
2. In this folder run:
   ```
   npm install
   mkdir www
   cp index.html styles.css data.js state.js screens.js app.js www/
   npx cap add android
   npx cap sync android
   ```
   (On Windows, copy the six files into a folder named `www` by hand.)
3. Open the `android` folder in Android Studio and choose **Build > Build APK(s)**.

## Project structure

| File | What it does |
|---|---|
| `index.html` | App shell. Loads the files below. |
| `styles.css` | Navy / royal blue look. Green = success, amber = pending, red = emergency. |
| `data.js` | All mock data: sample people, simulated banks and accounts, sample history. |
| `state.js` | App state and the rules (bank rule first, stricter-only conditions, approval, delay, freeze). |
| `screens.js` | Every screen and bottom sheet. |
| `app.js` | Navigation, buttons, simulated fingerprint / PIN / face checks, timers, Android back button. |
| `capacitor.config.json`, `package.json` | Wrap the app as an Android project. |
| `make_icons.py` | Creates the app icon during the build. |
| `.github/workflows/build-apk.yml` | Builds the downloadable APK on GitHub. |

## Limits of this prototype

- Not a banking app. No real bank connection, credentials, money, identity or biometric data.
- The face and fingerprint checks are animations. No camera or sensor is used.
- Android only. This is a debug APK for demonstrations, not a Play Store release.
- If the build fails, open the failed run in the Actions tab and read the last lines of the red step.
