# ROADMAP.md — Melodia

## Overview

**12 phases** | **Phases 1–3 complete** | **Phase 4 active**

| # | Phase | Goal | Status |
|---|-------|------|--------|
| 1 | Project Setup | Foundation, design system, components, navigation | ✓ Complete |
| 2 | Onboarding Flow | 9-screen onboarding with local persistence | ✓ Complete |
| 3 | Home & Modules | Dashboard, 60-module list, module detail | ✓ Complete |
| 4 | Lesson Flow | The core 6-screen learning loop | 🔵 Active |
| 5 | Backend | Supabase auth + database + progress sync | ⬜ Planned |
| 6 | Paywall | RevenueCat + Apple IAP + subscription gate | ⬜ Planned |
| 7 | Playlist & Spotify | Spotify OAuth + playlist creation | ⬜ Planned |
| 8 | Retention | Push notifications + streak logic + spaced repetition | ⬜ Planned |
| 9 | Secondary Screens | Profile, achievements, light/dark mode | ⬜ Planned |
| 10 | Analytics | PostHog + A/B testing framework | ⬜ Planned |
| 11 | Polish & Testing | Physical device testing, App Store prep | ⬜ Planned |
| 12 | Submission & Launch | EAS submit, App Store, TikTok launch | ⬜ Planned |

---

### Phase 1: Project Setup ✓
**Goal:** Working Expo project with full design system, navigation skeleton, and reusable components.
**Status:** Complete
**Delivered:** Expo + TypeScript + React Navigation, design tokens, Button/Card/ProgressBar/LevelBadge/QuizOption/MascotIcon, tab + stack navigators, font loading.

---

### Phase 2: Onboarding Flow ✓
**Goal:** Complete onboarding experience that captures user preferences and gates entry to the main app.
**Status:** Complete
**Delivered:** 9 screens (Splash → Welcome → Level → Genre → Platform → Goal → Science → Commitment → CreateAccount), Zustand onboardingStore, AsyncStorage persistence, hold-to-lock-in CommitmentScreen.

---

### Phase 3: Home & Modules ✓
**Goal:** Core app navigation working with realistic content and progression states.
**Status:** Complete
**Delivered:** Home dashboard, ModulesScreen with CEFR tabs + lock states, ModuleDetailScreen, progressStore, 60-module static curriculum data.

---

### Phase 4: Lesson Flow
**Goal:** Complete, playable lesson loop for Modules 1–3 — the core product experience.
**Mode:** mvp
**Success Criteria**:
1. User can start a lesson from Module 1's detail screen and complete all 6 screens end-to-end
2. Deep link successfully opens the assigned song in Spotify (or user's chosen platform)
3. Countdown timer starts and can be dismissed manually
4. Quiz presents 5 questions, grades them, and shows correct/incorrect states
5. Reading passage renders with tappable Spanish words that show English translations
6. Completing a lesson updates the progress store: XP increases, next module unlocks
7. Modules 2 and 3 have real content and play through without errors

**Requirements:** PRE-01–03, LISTEN-01–05, QUIZ-01–06, RESULTS-01–04, READ-01–04, COMPLETE-01–05, NAV-01–03, CONTENT-01–05

---

### Phase 5: Backend
**Goal:** User accounts, authenticated progress sync, and data persistence in Supabase.
**Success Criteria**:
1. User can create an account with email/password or Apple ID
2. Progress (completed modules, XP, streak) syncs to Supabase on lesson complete
3. User can log out and log back in with progress restored
4. First 8 modules are seeded in the Supabase database

**Requirements:** AUTH-01 (create account), AUTH-02 (login), AUTH-03 (logout), SYNC-01 (progress sync), DATA-01 (seed modules 1–8)

---

### Phase 6: Paywall
**Goal:** Revenue-generating subscription gate for modules 9–60.
**Success Criteria**:
1. Module 9 is locked with paywall prompt for non-subscribers
2. User can complete a subscription purchase via Apple IAP
3. "Restore Purchase" button works correctly
4. Subscription status persists across app restarts

**Requirements:** PAY-01 (paywall screen), PAY-02 (purchase flow), PAY-03 (restore purchase), PAY-04 (gate modules 9–60)

---

### Phase 7: Playlist & Spotify
**Goal:** Users can build a learning playlist of all their module songs in Spotify.
**Success Criteria**:
1. User can connect Spotify account via OAuth
2. Completing a lesson adds the song to user's Melodia playlist in Spotify
3. Playlist screen shows all songs organized by CEFR level with streaming links

**Requirements:** SPOT-01 (OAuth), SPOT-02 (add to playlist), SPOT-03 (playlist view)

---

### Phase 8: Retention
**Goal:** Push notifications and spaced repetition keep users coming back.
**Success Criteria**:
1. Push notification permission is requested with pre-permission explanation screen
2. Daily reminder notification fires at user's chosen time
3. Spaced repetition review is triggered at 1/3/7/14/30 day intervals after lesson
4. Streak increments daily and resets correctly on missed day
5. Streak freeze mechanic available (premium)

**Requirements:** NOTIF-01 (permission), NOTIF-02 (daily reminder), SR-01 (spaced repetition schedule), STREAK-01 (daily tracking)

---

### Phase 9: Secondary Screens
**Goal:** Profile, achievements, and settings complete the app surface.
**Success Criteria**:
1. Profile screen shows accurate stats (XP, streak, modules completed, subscription status)
2. Achievements screen displays earned badges with shareable card generation
3. Light/dark mode toggle works and persists
4. Account deletion flow works and clears all local + Supabase data

**Requirements:** PROFILE-01 (stats), ACHIEVE-01 (badges), THEME-01 (dark/light), ACCOUNT-01 (deletion)

---

### Phase 10: Analytics
**Goal:** Data-driven optimization with PostHog and A/B testing.
**Success Criteria**:
1. Onboarding completion rate visible in PostHog dashboard
2. Download-to-trial conversion tracked
3. At least one A/B test running (onboarding variant or paywall layout)

**Requirements:** ANALYTICS-01 (PostHog setup), ANALYTICS-02 (key events), AB-01 (first experiment)

---

### Phase 11: Polish & Testing
**Goal:** App ready for App Store submission — no bugs, all Apple requirements met.
**Success Criteria**:
1. Full lesson loop tested on physical iPhone via TestFlight
2. All 22 screens render without visual glitches
3. Privacy policy accessible in-app and in App Store listing
4. App Store screenshots created for all required device sizes
5. All Apple privacy labels correctly filled out

**Requirements:** TEST-01–05 (device testing, screenshots, privacy labels, App Store metadata)

---

### Phase 12: Submission & Launch
**Goal:** App live on the App Store with launch marketing in motion.
**Success Criteria**:
1. App approved on App Store (no rejections outstanding)
2. First TikTok launch video published
3. App Store Optimization: keywords with popularity >20, difficulty <50

**Requirements:** SUBMIT-01 (EAS submit), LAUNCH-01 (TikTok), ASO-01 (keyword research)
