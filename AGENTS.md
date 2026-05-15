# MELODIA - Project Context

## What is Melodia?
Melodia is a mobile language learning app that teaches Spanish through music. Think "if Spotify and Duolingo had a baby." Users progress through a structured 60-module curriculum (A1 beginner to B2 advanced) where each module is tied to a real song. The app teaches grammar and vocabulary concepts, sends users to listen to the assigned song on their preferred streaming platform, then quizzes them on the Spanish concepts (NOT on the lyrics). A reading comprehension track using artist bios and cultural context progressively shifts from English to fully Spanish.

## Who is building this?
Reine — a multipassionate creator who loves music, singing, and languages. First-time app developer building in public on TikTok (@reinibuildslive or similar). No prior coding experience but learning through Codex. The app is being built with guidance from this AGENTS.md and the reference documents in this repo.

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
- Design in Figma (or describe to Codex) BEFORE coding — know button sizes, screens, colors, flows
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

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Melodia**

Melodia is a mobile Spanish learning app that teaches through real music. Users work through a structured 60-module curriculum (A1–B2) where each module is tied to a real song — they learn grammar and vocabulary concepts, deep-link to the song on their streaming platform, take a quiz on Spanish concepts (never lyrics), and read original cultural context passages about the artist. Think "Spotify meets Duolingo."

Built with React Native + Expo by Reine, a first-time developer building in public on TikTok.

**Core Value:** The 6-screen lesson loop: a complete, satisfying learning cycle tied to a real song that users actually want to listen to.

### Constraints

- **Copyright:** Never display song lyrics or large excerpts. Quiz questions must test Spanish concepts, not song content. Reading passages must be 100% original.
- **Legal:** No embedded music playback. Deep links only ("Listen on Spotify").
- **Platform:** Apple In-App Purchase required for all subscription revenue — RevenueCat in Phase 6.
- **Privacy:** Must include privacy policy, restore purchase button, and account deletion option for App Store.
- **Stack:** React Native + Expo only. No ejecting. EAS for builds and submission.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Runtime & Language
| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript | ~5.9.2 |
| Framework | React Native | 0.81.5 |
| Platform | Expo SDK | ~54.0.33 |
| Runtime | Node.js | 22 (via nvm) |
| Architecture | New Architecture | Enabled (`newArchEnabled: true` in app.json) |
## Navigation
- `@react-navigation/native` ^7.2.2 — NavigationContainer, useNavigation, RouteProp
- `@react-navigation/stack` ^7.8.9 — Stack navigators (Onboarding, Modules)
- `@react-navigation/bottom-tabs` ^7.15.9 — Main tab bar
- `react-native-screens` ~4.16.0 — Native screen optimization
- `react-native-gesture-handler` ~2.28.0 — Required peer for navigation
## State Management
- `zustand` ^5.0.12 — Two stores, both persisted via AsyncStorage:
- `@react-native-async-storage/async-storage` 2.2.0 — persistence layer
## UI & Animations
- `@expo/vector-icons` ^15.1.1 — Ionicons exclusively (no emoji icons)
- `expo-linear-gradient` ~15.0.8 — Hero cards, gradients
- `expo-haptics` ~15.0.8 — Impact and notification feedback throughout
- `react-native-safe-area-context` ~5.6.0 — SafeAreaView on all screens
- `react-native-reanimated` ~4.1.1 — **Installed but not yet used** (reserved for Phase 4+)
- React Native `Animated` API — Used for all current animations (MascotIcon bounce/pulse, CommitmentScreen hold progress, ripple rings)
## Fonts
- `@expo-google-fonts/plus-jakarta-sans` — PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold
- `@expo-google-fonts/be-vietnam-pro` — BeVietnamPro_400Regular, BeVietnamPro_500Medium, BeVietnamPro_600SemiBold
- `@expo-google-fonts/inter` ^0.4.2 — **Installed but fonts not loaded in App.tsx** (legacy from Phase 1, Button.tsx still references Inter)
- `expo-font` ~14.0.11 — Font loading infrastructure
## Utilities
- `expo-linking` ~8.0.12 — Deep linking to Spotify/Apple Music/YouTube (planned for Phase 4)
- `expo-splash-screen` ~31.0.13 — Splash screen management
- `expo-status-bar` ~3.0.9 — Status bar control
## Build & Config
- `app.json` — Expo config, slug: `melodia-app`, portrait orientation, iOS + Android + Web
- `tsconfig.json` — Strict TypeScript
- `index.ts` — Entry point via `registerRootComponent(App)`
- `package.json` main: `index.ts`
## Planned (Not Yet Installed)
| Package | Purpose | Phase |
|---------|---------|-------|
| `expo-notifications` | Timer + push notifications | Phase 4 |
| `expo-av` | Lesson complete sound effect | Phase 4 |
| `react-native-confetti-cannon` | Lesson complete celebration | Phase 4 |
| Supabase client | Auth + database | Phase 5 |
| RevenueCat | In-app subscriptions | Phase 6 |
| Spotify Web API client | Playlist creation | Phase 7 |
| PostHog | Analytics + A/B testing | Phase 10 |
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## TypeScript
- **Strict mode** on
- All props explicitly typed with interfaces (not `type` aliases for component props)
- Navigation types use `StackNavigationProp<ParamList, RouteName>` and `RouteProp<ParamList, RouteName>`
- `as const` for icon name types: `{ icon: 'flash' as const }`
- No `any` — types are explicit throughout
- Zustand stores are typed with interface declarations before `create<State>()`
## Component Style
- Named exports for all screens (not default)
- `MascotIcon` is the one exception (default export)
- Onboarding screens use default exports
## Design System Usage
- `midnight` (#111125) — screen background
- `surfaceContainer` (#1E1E32) — cards, inputs
- `surfaceHigh` (#28283D) — elevated elements
- `surfaceHighest` (#333348) — chips, tags
## Animation Patterns
## Haptics Pattern
## State Access
## Navigation
## Styles
- All styles via `StyleSheet.create()` at bottom of file — never inline objects
- Style prop spreading: `[styles.base, condition && styles.variant]`
- Hex alpha shorthand: `Colors.coral + '22'` (not rgba) for semi-transparent backgrounds
- `gap` used in flex containers instead of margin for spacing between siblings
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern
## Navigation Tree
```
```
## State Architecture
### `onboardingStore.ts`
- Tracks user's choices during onboarding flow
- Key: `@melodia_onboarding`
- Fields: `level`, `genres[]`, `platform`, `dailyGoal`, `isComplete`
- `isComplete = true` after CreateAccount screen → triggers route to MainTabs
### `progressStore.ts`
- Tracks learning progress in main app
- Key: `@melodia_progress`
- Fields: `currentModuleId` (default: 2), `completedModuleIds` (default: [1]), `totalXP` (default: 100), `streak` (default: 3), `lastActivityDate`
- `completeModule(id, xp)` → updates all fields + persists
## Data Layer
### `src/data/modules.ts` (1953 lines)
- `CEFRLevel` — `'A1' | 'A1-A2' | 'A2' | 'A2-B1' | 'B1' | 'B1-B2' | 'B2'`
- `DisplayLevel` — `'A1' | 'A2' | 'B1' | 'B2'` (what tabs show)
- `GenreTrack` — `'pop' | 'reggaeton' | 'rnb' | 'regional-mexican'`
- `Module` — id, title, level, song, genreSongs, vocabulary, grammarPoints, quizTypes, readingTopic, readingRatio, xpReward
- `getDisplayLevel(level)` — maps transition levels to display tab
- `getSongForGenre(module, genre)` — genre-aware song selection with fallback
## Component Architecture
### Design System Constants (`src/constants/`)
- `colors.ts` — Single source of truth for all colors (tonal hierarchy pattern)
- `typography.ts` — Pre-typed TextStyle objects (display, h1, h2, label, body, bodyMedium, caption)
- `spacing.ts` — Spacing + Radius token sets
- `index.ts` — Re-exports all three
### Reusable Components (`src/components/`)
- `Button` — primary/outline/ghost variants, disabled/loading states
- `Card` — base card wrapper
- `ProgressBar` — coral fill on surface track
- `LevelBadge` — A1/A2/B1/B2 with level-appropriate color
- `QuizOption` — default/selected/correct/incorrect states
- `MascotIcon` — animated coral circle with music note (bounce + 3 pulse rings)
### Screen Pattern
- `SafeAreaView` from `react-native-safe-area-context` with `edges={['top']}`
- `StatusBar barStyle="light-content"`
- Styles via `StyleSheet.create()` at bottom of file
- Direct color/typography references (no theme context)
## Lesson Flow (Phase 4 — Not Yet Built)
## Font Loading
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

| Skill | Description | Path |
|-------|-------------|------|
| design-inspiration | \| Loads visual design references before creating or modifying any UI. Reads all images in the references/ folder and uses them to guide design decisions — colors, layout, typography, spacing, component style, and overall feel. Triggered automatically whenever a screen, component, or stylesheet is being designed or modified. Use when someone says "design", "build a screen", "create a component", "style this", "make it look like", or when any .tsx/.jsx/.ts file containing UI code is being created or edited. | `.agents/skills/design-inspiration/SKILL.md` |
| plaid-build | \| Product Led AI Development — Build mode. Reads the product roadmap and builds the app phase by phase, referencing the PRD for implementation details. After each phase, reviews code for issues, then commits to git. Continues until all phases are complete. Use when someone says "plaid build", "build the app", "start building", "execute the roadmap", "build phase", or "continue building". For product planning, see plaid-plan. For go-to-market, see plaid-launch. | `.agents/skills/plaid-build/SKILL.md` |
| plaid-launch | \| Product Led AI Development — Launch mode. Generates a go-to-market plan (gtm.md) based on existing vision.json and product-vision.md. Requires that plaid-plan has been run first. Use when someone says "plaid launch", "go-to-market", "launch plan", "GTM strategy", "help me launch", "marketing plan", or "launch playbook". For product planning, see plaid-plan. For building, see plaid-build. | `.agents/skills/plaid-launch/SKILL.md` |
| plaid-plan | \| Product Led AI Development — Planning mode. Guides founders through a structured vision intake conversation, then generates three documents: product-vision.md (strategy, brand, audience), prd.md (technical spec, design system, requirements), and product-roadmap.md (phased build plan with checkboxes). Use when someone says "plaid plan", "plan a product", "help me build something", "define my vision", "generate a PRD", "plan my app", "spec out my idea", "what should I build", "product strategy", or "PLAID". For go-to-market planning, see plaid-launch. For building from the roadmap, see plaid-build. | `.agents/skills/plaid-plan/SKILL.md` |
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-Codex-profile` -- do not edit manually.
<!-- GSD:profile-end -->
