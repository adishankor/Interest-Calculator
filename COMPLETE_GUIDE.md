# DepositIQ — Complete Build & Publish Guide
## Zero to Play Store in 10 Steps

---

## WHAT YOU NEED (One-Time Setup)

| Tool | Cost | Link |
|------|------|------|
| Node.js | Free | https://nodejs.org (download LTS version) |
| Expo CLI | Free | Installed via Node.js |
| EAS CLI | Free | Installed via Node.js |
| Expo Account | Free | https://expo.dev/signup |
| Google Play Console | $25 one-time | https://play.google.com/console |
| Google AdMob Account | Free | https://admob.google.com |
| A website (for privacy policy) | Free | https://sites.google.com |

---

## STEP 1 — Install Node.js

1. Go to https://nodejs.org
2. Download the **LTS version** (e.g. 20.x)
3. Install it (click Next, Next, Finish)
4. Open **Command Prompt** (Windows) or **Terminal** (Mac)
5. Type: `node --version` → should show a version number ✅

---

## STEP 2 — Install Expo & EAS Tools

Open Command Prompt / Terminal and run these commands one by one:

```bash
npm install -g @expo/eas-cli
npm install -g expo-cli
```

Then create a free Expo account at: https://expo.dev/signup

Login from terminal:
```bash
eas login
```
Enter your Expo email and password.

---

## STEP 3 — Set Up the Project

1. Copy the entire **DepositIQ** folder to your computer (e.g. Desktop)
2. Open Command Prompt and navigate to it:
   ```bash
   cd Desktop/DepositIQ
   ```
3. Install all the required packages:
   ```bash
   npm install
   ```
   *(This will take 2-5 minutes)*

---

## STEP 4 — Test the App on Your Phone

1. Install **Expo Go** app on your Android phone from Play Store
2. In Command Prompt, run:
   ```bash
   npx expo start
   ```
3. Scan the QR code shown in the terminal with your phone (using Expo Go)
4. The app will open on your phone live! ✅

---

## STEP 5 — Set Up AdMob (for ads & revenue)

### A. Create AdMob Account
1. Go to https://admob.google.com
2. Sign in with a Google account
3. Click "Add App" → Select Android → Enter app name "DepositIQ"
4. AdMob gives you an **App ID** like: `ca-app-pub-XXXXXXXX~XXXXXXXXXX`

### B. Create Ad Units
1. In AdMob → Your App → Ad Units → Add Ad Unit
2. Choose **Banner** → Name it "DepositIQ Banner"
3. You get an **Ad Unit ID** like: `ca-app-pub-XXXXXXXX/XXXXXXXXXX`

### C. Update the Code
Open `app.json` and replace:
```
ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
```
with your real App ID (appears twice in app.json).

Open `src/components/AdBanner.js` and find:
```javascript
const REAL_BANNER_ID = Platform.select({
  android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
```
Replace with your real Banner Ad Unit ID.

Then in AdBanner.js, change `TEST_BANNER_ID` to `REAL_BANNER_ID` in the BannerAd component.

---

## STEP 6 — Set Up EAS Build (for APK/AAB)

In the DepositIQ folder, run:
```bash
eas build:configure
```

This connects your project to Expo's cloud build service.

Then open `app.json` and update:
```json
"package": "com.yourname.depositiq"
```
Change `yourname` to your actual name (e.g. `com.johnsmith.depositiq`).
**Important:** This must be unique — no other app on Play Store can have the same package name.

---

## STEP 7 — Build the APK (Test Version)

To build a test APK to install directly on your phone:
```bash
eas build --platform android --profile preview
```

- This uploads your code to Expo's servers
- Takes about 5-15 minutes to build
- You'll get a download link for the `.apk` file
- Install it on your Android phone to test!

---

## STEP 8 — Build the AAB (For Play Store)

When you're happy with the app, build the production version:
```bash
eas build --platform android --profile production
```

This creates an `.aab` (Android App Bundle) file — this is what Google Play requires.

---

## STEP 9 — Host Your Privacy Policy (REQUIRED by Google)

You MUST have a public URL for your Privacy Policy before submitting.

**Free option using Google Sites:**
1. Go to https://sites.google.com
2. Create a new site → Name it "DepositIQ Privacy"
3. Add a new page called "Privacy Policy"
4. Copy-paste the content from `PRIVACY_POLICY.md`
5. Publish the site
6. Your URL will be something like: `https://sites.google.com/view/depositiq-privacy`

Update this URL in:
- `src/screens/AboutScreen.js` → `PRIVACY_POLICY_URL`
- Google Play Console when submitting

---

## STEP 10 — Submit to Google Play Store

### A. Create Play Console Account
1. Go to https://play.google.com/console
2. Sign in with Google → Pay $25 one-time fee
3. Accept Developer Agreement

### B. Create New App
1. Click **"Create app"**
2. App name: `DepositIQ – Smart Finance Calculator`
3. Default language: English
4. App type: App
5. Free or paid: Free

### C. Fill in Store Listing
Using content from `PLAY_STORE_LISTING.md`:
- Short description (80 chars)
- Full description (4000 chars)
- Screenshots (at least 2 phone screenshots)
- App icon (512×512 PNG)
- Feature graphic (1024×500 PNG)

### D. Complete Required Sections
Go through each section in Play Console:
- **App content** → Fill out content rating questionnaire
- **Privacy policy** → Paste your hosted URL
- **App access** → All functionality accessible
- **Ads** → Yes, contains ads
- **Target audience** → 13 and above

### E. Upload the AAB
1. Go to **Production** → **Create new release**
2. Upload your `.aab` file from Step 8
3. Add release notes: "Initial release of DepositIQ"
4. Review and **Submit for Review**

### F. Wait for Approval
- First-time apps: 3-7 days review
- You'll get an email when approved
- After approval → LIVE ON PLAY STORE! 🎉

---

## MONETIZATION TIPS

Once your app is live and gets downloads:

1. **AdMob Payments**: Google pays monthly once you reach $100 threshold. Earnings vary but typical finance apps earn $1-5 per 1000 ad impressions (CPM).

2. **Increase Revenue**:
   - Add interstitial ads (full-screen) when switching calculators
   - Add rewarded ads for a "Pro" feature (remove ads)
   - Update app regularly to maintain Play Store ranking

3. **Growth Strategies**:
   - Share on Facebook finance groups
   - Post on Reddit (r/personalfinance, r/bangladesh)
   - Ask users for 5-star reviews inside the app
   - Optimize keywords in Play Store listing

---

## IF YOU GET STUCK

| Problem | Solution |
|---------|---------|
| `npm install` fails | Make sure Node.js is installed properly |
| EAS build fails | Check error message, usually a package issue |
| App not showing on phone | Restart Expo Go app and scan again |
| Play Store rejects app | Read rejection email carefully, fix the issue, resubmit |
| AdMob not showing real ads | New AdMob accounts take 24-48hrs to activate |

---

## SUPPORT

For help with this app code, you can describe your issue to Claude (AI) and ask for specific fixes.

---

*DepositIQ — Plan Smarter. Grow Faster. 💎*
