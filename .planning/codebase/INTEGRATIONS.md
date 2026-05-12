# INTEGRATIONS.md — External Services & APIs
Last mapped: 2026-05-12

## Currently Active

### AsyncStorage
- **What:** Local device storage for persisting state across app restarts
- **Used by:** `onboardingStore.ts` (`@melodia_onboarding`), `progressStore.ts` (`@melodia_progress`)
- **Pattern:** JSON.stringify/parse, stored at keyed paths

## Planned Integrations

### Streaming Deep Links (Phase 4)
- **Spotify:** `spotify://track/{id}` or `https://open.spotify.com/track/{id}`
- **Apple Music:** `music://` or `https://music.apple.com/`
- **YouTube Music:** `youtubemusic://` or `https://music.youtube.com/`
- **YouTube:** `youtube://` or `https://youtube.com/`
- **Implementation:** `expo-linking` → `Linking.openURL(url)`
- **Status:** `expo-linking` installed, deep link URLs not yet added to module data

### Supabase (Phase 5)
- **Auth:** Email, Apple ID, Google OAuth
- **Database tables:** users, modules, songs, user_progress, achievements
- **Status:** Not configured, no credentials

### RevenueCat (Phase 6)
- **Purpose:** iOS In-App Purchase subscriptions (monthly + annual)
- **Products to create:** Monthly subscription, Annual subscription with free trial
- **Status:** Not configured, no credentials

### Spotify Web API (Phase 7)
- **Purpose:** Playlist creation (NOT streaming — prohibited by Spotify policy)
- **Auth:** OAuth flow
- **Credentials:** Client ID / Secret documented in CLAUDE.md (not yet stored in .env)
- **Status:** Not implemented

### Expo Notifications (Phase 4/8)
- **Phase 4 use:** Timer completion notification ("Your song just finished — ready for the quiz?")
- **Phase 8 use:** Spaced repetition review reminders (1, 3, 7, 14, 30 day intervals)
- **Status:** Not installed

### PostHog (Phase 10)
- **Purpose:** Analytics, A/B testing (onboarding variants, paywall variants)
- **Key events to track:** onboarding completion, trial starts, lesson completions, quiz scores
- **Status:** Not configured

## Copyright & Legal Constraints

These are non-negotiable constraints affecting how integrations must work:
- **No lyrics display** — individual Spanish words OK, full lines/verses NOT
- **No embedded music playback** — deep links only, no Spotify streaming SDK
- **Reading content** — must be 100% original (no copying from web)
- **Apple IAP required** — all subscription revenue must flow through RevenueCat → Apple
