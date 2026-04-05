# MELODIA - Project Context

## What is Melodia?
Melodia is a mobile language learning app that teaches Spanish through music. Think "if Spotify and Duolingo had a baby." Users progress through a structured 60-module curriculum (A1 beginner to B2 advanced) where each module is tied to a real song. The app teaches grammar and vocabulary concepts, sends users to listen to the assigned song on their preferred streaming platform, then quizzes them on the Spanish concepts (NOT on the lyrics). A reading comprehension track using artist bios and cultural context progressively shifts from English to fully Spanish.

## Who is building this?
Reine — a multipassionate creator who loves music, singing, and languages. First-time app developer building in public on TikTok (@reinibuildslive or similar). No prior coding experience but learning through Claude Code. The app is being built with guidance from this CLAUDE.md and the reference documents in this repo.

## Reference Documents in This Repo
- **melodia-curriculum.docx** — The complete 60-module curriculum from A1 to B2. Every module lists: CEFR level, core grammar/vocabulary concepts, estimated song count, quiz types, and reading comprehension focus. This is the backbone of what the app teaches.
- **melodia-design-system.docx** — The complete brand kit, design system, and 22-screen flow map. Includes: color palette, typography, button styles, quiz answer states, level badges, mascot usage guidelines, every screen described in detail, technical architecture notes, data model, and 12-phase build plan.
- **Mascot images** — Three poses of the coral music note mascot: neutral, tilted, bounce. Files: melodia_neutral_transparent.png, melodia_tilted_transparent.png, melodia_bounce_transparent.png. Note: backgrounds may need cleanup (remove dark gray).

## Tech Stack
- **Framework:** React Native with Expo
- **Navigation:** React Navigation (bottom tabs + stack navigator)
- **State Management:** React Context or Zustand
- **Backend:** Supabase (auth, database, push notifications)
- **Payments:** RevenueCat for Apple In-App Purchase (free under $2,500/month revenue)
- **Push Notifications:** Expo Notifications
- **Font:** Inter (via expo-google-fonts)
- **Analytics:** PostHog (for A/B testing onboarding, paywalls, and conversion tracking)

## Design System (Quick Reference)
### Colors
- Midnight (dark mode base): #1A1A2E
- Surface (cards/inputs): #252542
- Coral (primary accent): #FF6B4A
- Peach (hover/secondary): #FF8F73
- Blush (subtle accents): #FFB199
- Amber (streaks/achievements): #FFC857
- Teal (correct/success): #4ECDC4
- Lavender (B2/premium): #A078FF
- White (primary text dark mode): #FFFFFF
- Mist (secondary text): #8A8AA3
- Warm White (light mode base): #F8F6F3
- Light Border: #EEEAE5

### Typography
- Font: Inter
- H1: 24px, weight 500
- H2: 18px, weight 500
- Body: 15px, weight 300-400
- Captions: 12px, weight 400, color #8A8AA3

### Components
- Buttons: 24px border-radius (pill), coral primary, outline secondary, ghost tertiary
- Cards: 12px border-radius, 16px padding
- Progress bar: 4px height, coral fill on surface track
- Quiz answers: surface bg default, coral border selected, teal correct, coral incorrect

## Screen Flow (22 Screens)
### Onboarding (Screens 1-8)
1. Splash screen (logo + mascot animation)
2. Welcome ("Learn Spanish through the music you love")
3. Level selection (beginner / some basics / intermediate)
4. Genre selection (pop, reggaeton, R&B, regional Mexican — multi-select)
5. Listening platform (Spotify / Apple Music / YouTube Music / YouTube)
6. Daily goal (5/10/15/20+ min)
7. **Commitment screen** ("I'm going to learn Spanish through music, one song at a time" + "Lock in" button)
8. Create account (email / Apple ID / Google — placed AFTER onboarding for higher conversion)

### Core App (Screens 9-11)
9. Home dashboard (current module, streak, today's lesson CTA, stats)
10. Modules overview (60 modules by CEFR level, locked/unlocked states, paywall after module 8)
11. Module detail (title, level badge, concept summary, song info, "Start lesson")

### Lesson Flow (Screens 12-17) — THE CORE LOOP
12. Pre-listening context (concept explanation + 3-5 vocab words to listen for)
13. Listen screen (song card + "Listen on [platform]" deep link + timer + reminder words)
14. Quiz (3-5 questions — grammar/vocab, NOT lyrics — multiple choice, fill-in-blank, translation)
15. Quiz results (score, XP, mascot reaction)
16. Reading comprehension (artist/culture passage, English/Spanish ratio by level, tappable translations)
17. Lesson complete (celebration, XP summary, "Add to playlist", next module preview)

### Paywall & Retention (Screens 18-19)
18. Paywall (after module 8 — monthly/annual options, Apple IAP, restore purchase, free trial)
19. Spaced repetition review (push notification triggered, mini-quiz on past concepts, different song)

### Secondary (Screens 20-22)
20. Playlist view (songs by level, streaming platform links)
21. Profile & settings (stats, preferences, dark/light mode, Spotify connect, subscription, privacy policy, delete account)
22. Achievements (badges for milestones, shareable cards)

### Bottom Nav (persistent on core screens)
Home | Modules | Playlist | Profile

## Critical Legal & Copyright Rules
These rules are NON-NEGOTIABLE. Every feature must comply:

1. **NEVER display full song lyrics or large excerpts.** Lyrics are copyrighted. Individual Spanish words (soy, habla, etc.) are fine. Short 2-3 word phrases used as vocabulary examples are fine. Full lines or verses are NOT.
2. **Quizzes test SPANISH CONCEPTS, not song content.** Ask "What does 'soy' mean?" not "What did Shakira say in the chorus?"
3. **Reading comprehension must be 100% original content.** AI-generated or written by us. Never copy from external sources.
4. **No embedded music playback.** Spotify explicitly prohibits commercial streaming integrations and trivia/quiz games built on their platform. We only use Spotify API for playlist creation.
5. **Deep links only.** "Listen on Spotify/Apple Music/YouTube" buttons that open the song in the user's preferred app. No streaming inside Melodia.
6. **Apple In-App Purchase required** for all subscription revenue. Use RevenueCat to handle this.
7. **Must include:** Privacy policy (in-app + App Store listing), "Restore Purchase" button, account deletion option, accurate App Privacy labels in App Store Connect.
8. **Song metadata** (title, artist name) is publicly available and can be displayed freely.

## Build Phases
Follow this order. Complete each phase before moving to the next.

### Phase 1: Project Setup
- Initialize Expo project
- Set up file structure (screens, components, utils, assets, constants)
- Install dependencies (react-navigation, expo-font, zustand/context)
- Create design system constants file (colors, typography, spacing)
- Create reusable components (Button, Card, ProgressBar, LevelBadge, QuizOption)
- Set up navigation structure (bottom tabs + stack navigators)
- Add mascot images to assets

### Phase 2: Onboarding Flow
- Build screens 1-8
- Store onboarding choices locally (AsyncStorage)
- Implement the commitment screen with "Lock in" interaction
- Request notification permissions with pre-permission explanation screen

### Phase 3: Home & Modules
- Build home dashboard (screen 9) with mock data
- Build modules overview (screen 10) with first 8 modules
- Build module detail (screen 11)
- Implement locked/unlocked/completed states
- Add progress tracking logic

### Phase 4: Lesson Flow
- Build pre-listening context (screen 12) with Module 1 real content
- Build listen screen (screen 13) with deep link to streaming platform
- Implement timer system (countdown based on song duration)
- Build quiz screens (screen 14) with 3-5 real questions for Module 1
- Build quiz results (screen 15) with scoring and XP
- Build reading comprehension (screen 16) with tappable translations
- Build lesson complete (screen 17) with celebration

### Phase 5: Data & Backend
- Set up Supabase project (auth, database)
- Create tables: users, modules, songs, user_progress, achievements
- Seed first 8 modules with real content
- Implement user authentication (email, Apple ID, Google)
- Sync progress to database

### Phase 6: Paywall
- Set up RevenueCat account and connect to Apple
- Create subscription products (monthly + annual with free trial)
- Build paywall screen (screen 18)
- Implement purchase flow and restore purchases
- Gate modules 9-60 behind subscription

### Phase 7: Playlist & Spotify
- Implement Spotify OAuth flow
- Build playlist creation via Spotify API
- Build playlist view (screen 20)
- Add "Add to playlist" functionality on lesson complete

### Phase 8: Retention Features
- Implement push notifications (Expo Notifications)
- Build spaced repetition scheduling (1, 3, 7, 14, 30 day intervals)
- Build review quiz flow (screen 19)
- Implement streak tracking with daily reset logic

### Phase 9: Secondary Screens
- Build profile & settings (screen 21)
- Build achievements (screen 22)
- Implement light/dark mode toggle
- Add privacy policy page

### Phase 10: Analytics & A/B Testing
- Set up PostHog
- Track: onboarding completion, trial starts, lesson completions, quiz scores
- Set up A/B test framework for onboarding variants and paywall variants

### Phase 11: Polish & Testing
- Test on physical iPhone via Expo Go and TestFlight
- Fix all bugs, broken links, incomplete features
- Ensure all Apple requirements are met (privacy labels, restore purchase, delete account)
- Create App Store assets (screenshots, description, keywords)
- Write privacy policy and terms of use

### Phase 12: Submission & Launch
- Submit to Apple App Store via EAS
- Handle any rejections (most common: privacy label mismatches, missing features)
- Set up App Store Optimization (keywords via Astro tool)
- Launch TikTok content strategy
- Consider TikTok paid ads ($25-35/day budget)

## Key Lessons from Reference (Arthur's App Sprint Process)
These are proven strategies from a successful app launch that apply to Melodia:

### On Building
- Design in Figma (or describe to Claude) BEFORE coding — know button sizes, screens, colors, flows
- Use Expo for everything — `eas build` to create package, `eas submit` to send to Apple
- Store onboarding data locally first (AsyncStorage), add Supabase later
- Don't build a server/backend until you need it — keep the app self-contained initially
- Code only features based on actual user data/feedback after launch

### On Apple Submission
- Apple usually takes 24-48 hours to review (sometimes up to 5 days)
- Most apps get rejected on first submission for small things (privacy label mismatches are #1)
- Always uncheck "tracking" boxes unless you're actually tracking for advertising
- Add a comment explaining changes when resubmitting
- Need: privacy policy, terms of use, App Store screenshots for different iPhone sizes
- Create screenshots in Figma with clean backgrounds and explanation text

### On Monetization
- RevenueCat handles all payment infrastructure (free under $2,500/month)
- Apple takes 30% cut (15% with Small Business Program)
- Create monthly AND yearly options — yearly with free trial converts better
- Turn on "billing grace period" in App Store Connect (3 days) — this alone can recover ~10% of failed payments
- Apple holds revenue 30-45 days before payout — plan cash flow accordingly

### On Marketing
- Spend 90% of time optimizing onboarding — that's where 80%+ of conversions happen
- TikTok organic: test 3 formats (POV videos, product demos, transformation/results)
- TikTok ads: use "app install" objective, target specific countries, $25-35/day budget
- TikTok gives free ad credits to new advertisers ($100-200 worth)
- Use TikTok Events SDK for attribution tracking (know which ad drove which install)
- App Store Optimization: find keywords with popularity >20 and difficulty <50
- Reddit can drive initial traction — post authentically, don't spam
- Consider offering free lifetime access initially to get downloads and reviews
- Respond to every App Store review — you're showing future users you care

### On A/B Testing
- Use PostHog for onboarding A/B tests, RevenueCat experiments for paywall tests
- Small changes (removing 3 screens from onboarding) can dramatically change conversion
- Need 50+ conversions per variant for reliable results
- A/B test: onboarding flow, paywall design, app icon, pricing
- Track: onboarding completion rate, download-to-trial rate (target 14%+), trial-to-paid rate (target 31%+)

### Key Metrics to Target
- Download to trial: 14%+
- Trial to paid: 31%+
- Per download value: $1.64+
- Onboarding completion: 90%+
- Notification opt-in: 66%+ (add pre-permission screen to improve this)

## Spotify Developer Credentials
- Client ID: [ADD YOUR CLIENT ID HERE - DO NOT COMMIT TO GITHUB]
- Client Secret: [ADD YOUR CLIENT SECRET HERE - DO NOT COMMIT TO GITHUB]
- Redirect URI: http://127.0.0.1:3000/callback
- NOTE: Store these in a .env file. Add .env to .gitignore. Never commit credentials.

## Important Links
- Apple pre-submission inquiry: https://developer.apple.com/contact/app-store/
- Apple App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Spotify Developer Policy: https://developer.spotify.com/policy
- RevenueCat docs: https://www.revenuecat.com/docs
- Expo docs: https://docs.expo.dev
- PostHog docs: https://posthog.com/docs
- Supabase docs: https://supabase.com/docs
- Astro (ASO tool): https://astro.useastro.com
