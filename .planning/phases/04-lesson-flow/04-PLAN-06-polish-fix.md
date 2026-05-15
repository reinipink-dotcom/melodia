---
phase: "04-lesson-flow"
plan: "04-06"
type: "fix"
wave: 1
depends_on: ["04-05"]
files_modified: []
autonomous: true
must_haves:
  truths:
    - Quiz score matches actual user performance
    - "Continue to Modules" navigates correctly from LessonCompleteScreen
    - Timer expiry shows an in-app prompt
    - Tapping "Listen on [Platform]" auto-starts the timer
    - Quiz answers animate (pop on correct, shake on wrong) with haptics
    - Reading passage highlights meaningful Spanish words tied to lesson concept
    - Module 1 quiz questions reference content present in Bésame Mucho
    - Direct song URLs used where possible (not just search queries)
    - Spanish TTS plays on concept cards and tappable reading words
  artifacts:
    - src/screens/Lesson/QuizScreen.tsx (score fix + animation)
    - src/screens/Lesson/QuizResultsScreen.tsx (score display fix)
    - src/screens/Lesson/LessonCompleteScreen.tsx (navigation fix)
    - src/screens/Lesson/ListenScreen.tsx (auto-start + timer expiry UX + permission fallback)
    - src/screens/Lesson/PreListenScreen.tsx (TTS speaker button)
    - src/screens/Lesson/ReadingScreen.tsx (TTS on tooltip)
    - src/data/modules.ts (content fixes for modules 1-3 + direct song URLs)
---

# Phase 4 Plan 06: Lesson Flow — Post-Testing Polish & Fixes

Fixes all issues found during Reine's first full playthrough of the lesson loop.
Organized into four waves by urgency. All waves are autonomous — no user input required mid-execution.

---

## Wave 1 — Bugs (breaks core flow)

### Task 1: Fix quiz score tracking (BUG-01)

**Problem:** QuizResultsScreen shows 5/5 "Perfecto" when the user actually scored 4/5.

**Files:** `src/screens/Lesson/QuizScreen.tsx`, `src/screens/Lesson/QuizResultsScreen.tsx`

**Steps:**
1. Open `QuizScreen.tsx`. Find where `correctCount` is incremented — it's likely incremented before or after the wrong index check, or the initial value is 1 instead of 0.
2. Audit the full answer-checking logic:
   - `correctCount` must start at `0`
   - Increment only when `selectedIndex === question.correctIndex`
   - The value passed to `QuizResults` via `navigation.navigate('QuizResults', { score: correctCount, total: questions.length, ... })` must be the final count after ALL questions are answered
3. Verify: answer 4/5 correctly in a test run mentally — trace the count variable through each question.
4. Fix the off-by-one or premature increment.

**Verification:** Run `npx tsc --noEmit`. Answer 4/5 questions correctly — QuizResultsScreen must show 4/5, not 5/5.

---

### Task 2: Fix "Continue to Modules" navigation + lesson state clearing (BUG-02)

**Problem:** Tapping "Continue to Modules" on LessonCompleteScreen does nothing. Additionally, after going home, tapping the Modules tab navigates back to LessonCompleteScreen instead of the module list — the active lesson state is not being cleared before navigation.

**Files:** `src/screens/Lesson/LessonCompleteScreen.tsx`, `src/store/lessonStore.ts`

**Steps:**
1. Open `LessonCompleteScreen.tsx`. Find the `rootNav.navigate('MainTabs', { screen: 'Modules' })` call.
2. Check the TypeScript type of `rootNav`. It needs to be typed as `StackNavigationProp<RootStackParamList>` — if it's typed as the local `ModulesStackParamList`, the `MainTabs` route is unknown and the call silently does nothing.
3. Fix: ensure `rootNav` is obtained via `useNavigation<StackNavigationProp<RootStackParamList>>()` imported from `../../navigation/RootNavigator`.
4. Order of operations on "Continue to Modules" press:
   ```typescript
   await lessonStore.completeLesson(); // clear active lesson FIRST
   rootNav.navigate('MainTabs', { screen: 'Modules' });
   ```
   The `completeLesson()` must run before navigation — if the store still has `activeLesson` set when Modules tab mounts, any lesson-resume logic will kick in and redirect back.
5. Same fix for the mount-time `completeLesson()` call — verify it awaits properly.

**Verification:** Complete a lesson → tap "Continue to Modules" → should land on Modules tab showing the module list. Tap Home tab → tap Modules tab again → stays on module list. `npx tsc --noEmit` passes.

---

## Wave 2 — UX Polish

### Task 3: Timer expiry in-app prompt (UX-01)

**Problem:** When the countdown reaches 0:00, nothing happens in-app. There is no prompt to take the user to the quiz.

**Files:** `src/screens/Lesson/ListenScreen.tsx`

**Steps:**
1. Find the `onTimerComplete()` callback (called when `Animated.timing` finishes and when `setInterval` hits 0).
2. When timer reaches 0:
   - Call `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`
   - Set a local state flag: `setTimerExpired(true)`
3. When `timerExpired` is true, replace the listen CTA area with:
   ```
   "Your song is done! 🎵"
   [Continue to Quiz]  ← primary coral button, full width
   [I need more time]  ← ghost button
   ```
4. "Continue to Quiz" → `navigation.navigate('Quiz', { moduleId })`
5. "I need more time" → reschedule notification for +2 minutes, open streaming platform again, reset timer display to 2:00 and restart countdown.
6. The existing notification fires independently via `expo-notifications` — this in-app state is the visual complement for users who stay in the app.

**Verification:** Set `durationSeconds` to 5 temporarily. Watch the timer hit 0:00 — the prompt must appear. Tap "Continue to Quiz" — navigates to QuizScreen.

---

### Task 4: Auto-start listening state when tapping "Listen on [Platform]" (UX-02)

**Problem:** User taps "Listen on YouTube", leaves the app, comes back — timer is not running, they still need to tap "I'm listening" manually.

**Files:** `src/screens/Lesson/ListenScreen.tsx`

**Steps:**
1. Find the handler for the "Listen on [Platform]" button press.
2. Currently it just calls `openStreaming(platform, song)`.
3. Update the handler to also:
   a. Request notification permission (if not already granted)
   b. Call `startTimer()` (or whatever the timer-start function is)
   c. Call `lessonStore.updatePhase('listening')`
   d. Schedule the timer notification via `scheduleTimerNotification(durationSeconds, song.title)`
   e. Store the notification ID: `lessonStore.setNotificationId(notificationId)`
   f. THEN open the streaming URL
4. Remove the separate "I'm listening" button (or demote it to a secondary "I'm already listening" ghost button for users who opened the app after listening outside Melodia).
5. The listening state should be `isListening: boolean` local state — when `true`, show the timer ring and "I'm done listening" CTA.

**Verification:** Tap "Listen on YouTube" — timer starts immediately, YouTube opens. Come back to app — timer is running.

---

### Task 5: Quiz answer animations — pop on correct, shake on wrong (UX-03)

**Problem:** Correct answer just turns teal with no animation. Wrong answer just turns coral with no animation. Both feel flat and un-gamified.

**Files:** `src/screens/Lesson/QuizScreen.tsx`, `src/components/QuizOption.tsx`

**Steps:**
1. Add animation support to `QuizOption.tsx`:
   - Add an optional `animationState: 'idle' | 'correct' | 'incorrect'` prop
   - For `correct`: use `Animated.spring` to scale from 1.0 → 1.06 → 1.0 (subtle pop)
     ```typescript
     Animated.spring(scaleAnim, {
       toValue: 1.06,
       friction: 3,
       tension: 200,
       useNativeDriver: true,
     }).start(() => {
       Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
     });
     ```
   - For `incorrect`: use a horizontal shake sequence — translate X: 0 → -8 → 8 → -6 → 6 → -4 → 4 → 0
     ```typescript
     Animated.sequence([
       Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
       Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
       Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
       Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
       Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
     ]).start();
     ```
   - Wrap the option `View` in `Animated.View` with `transform: [{ scale: scaleAnim }, { translateX: shakeAnim }]`

2. In `QuizScreen.tsx`, after `checkAnswer()`:
   - Trigger `Haptics.notificationAsync(NotificationFeedbackType.Success)` for correct
   - Trigger `Haptics.notificationAsync(NotificationFeedbackType.Error)` for incorrect
   - Show a toast: create a simple `<Animated.View>` that fades in + translates up, shows "Correcto ✓" (teal) or "Incorrecto ✗" (coral), then fades out after 1 second
     ```typescript
     // Toast appears at bottom of quiz card, above the progress bar
     // Use Animated.sequence: fade in over 150ms, hold 700ms, fade out 200ms
     ```

**Verification:** Answer correctly — option pops + "Correcto" toast fades in/out. Answer incorrectly — option shakes + "Incorrecto" toast fades in/out. `npx tsc --noEmit` passes.

---

### Task 6: Notification permission denial graceful fallback (UX-04)

**Problem:** If user denies notification permission, there's no feedback. Timer still works visually but user doesn't know why they won't get reminded.

**Files:** `src/screens/Lesson/ListenScreen.tsx`

**Steps:**
1. In the notification permission request flow (now triggered by tapping "Listen on [Platform]"), capture the result.
2. Add state: `const [notifDenied, setNotifDenied] = useState(false)`
3. If permission is `denied`:
   - `setNotifDenied(true)`
   - Do not show an error — just surface a subtle inline note
4. When `notifDenied` is true, render below the timer:
   ```
   <TouchableOpacity onPress={() => Linking.openURL('app-settings:')}>
     <Text style={styles.notifHint}>
       Enable notifications to be reminded when your song ends → Open Settings
     </Text>
   </TouchableOpacity>
   ```
   Style: small, Mist color (#8A8AA3), not alarming — informational only.
5. Timer still works normally without notifications — this is purely UX.

**Verification:** Simulate denied permission (comment out the permission grant). The hint text appears. Tapping "Open Settings" opens iOS Settings app.

---

## Wave 3 — Content Quality

### Task 7: Rewrite Module 1 quiz questions to connect to Bésame Mucho (CONTENT-01)

**Problem:** Module 1 quiz questions ask about letters (H, double L) that don't appear in "Bésame Mucho." Questions feel disconnected from the song.

**Files:** `src/data/modules.ts`

**Rule (apply to all modules):** Every quiz question must test a Spanish concept that is demonstrably present in the assigned song's title, common lyrical vocabulary, or artist name. The question doesn't quote lyrics — it uses the song as the hook to make the concept feel real.

**Steps:**
1. Find Module 1 in `MODULES` array. Inspect `quizQuestions[]`.
2. Look up "Bésame Mucho" — the title itself contains: B, é (accented vowel), s, m, u, c, h, o. Common words in the song: bésame, mucho, quiero, corazón, lejos. The title's accent mark (é) and the word "mucho" are great teaching hooks.
3. Rewrite all 5 quiz questions so each uses vocabulary or phonetic patterns that appear in the song title or commonly known vocabulary from it. Examples:
   - "The word 'bésame' starts with a B. How is the Spanish B pronounced?" → options about bilabial consonant sounds
   - "The accent mark on 'é' in bésame tells you to..." → stress / pronunciation options
   - "How many syllables are in 'bésame'?" → bé-sa-me = 3
   - "The word 'mucho' uses the letter U. How is the Spanish U pronounced?" → like "oo" in food
   - "Bésame Mucho was written in 1940. 'Mucho' means..." → very much / a lot
4. Each question must have 4 options, exactly one correct, with `correctIndex` set accurately.
5. Add an optional `explanation` field to each question for future use.

**Verification:** Read each question aloud — every one must feel like it could only exist because of the song "Bésame Mucho." `npx tsc --noEmit` passes.

---

### Task 8: Rewrite Module 1–3 reading passage tokens to connect to lesson concept (CONTENT-02)

**Problem:** Module 1 reading passage highlights single letters (H, B, V) as tappable Spanish "words." This is wrong — single letters are not educational, and the highlighting doesn't connect to the lesson concept.

**Files:** `src/data/modules.ts`

**Rule:** `isSpanish: true` tokens must be:
- Full Spanish words (never single letters)
- Words that exemplify the lesson's core concept (for Module 1: phonetic patterns, alphabet usage)
- Words that appear in the song, artist name, or are culturally connected to the reading passage
- Have a meaningful `english` translation and optional `phonetic` pronunciation guide

**Steps:**
1. Find Module 1 `readingPassage` token array.
2. Remove any token where `text` is a single letter or a standalone letter reference ("H", "B", "V").
3. Identify 4–6 Spanish words in the passage that exemplify Module 1's concept (Spanish Alphabet / phonetics). Good candidates:
   - `bésame` → "kiss me" (shows accent mark usage)
   - `mucho` → "a lot / very much" (shows U = "oo" sound)
   - `corazón` → "heart" (shows accent on ó, shows N with tilde doesn't apply here but ó does)
   - `llorar` → "to cry" (shows double-L = Y sound, a key alphabet lesson point)
   - `quiero` → "I want/love" (shows silent U in QU combination)
4. Rewrite affected passage sections so these words appear naturally in the text, marked as `isSpanish: true` with English translations.
5. Apply same audit to Modules 2 and 3 — verify their highlighted words are full Spanish words connected to the lesson concept, not random letters or generic vocabulary.

**Verification:** Read the passage — every highlighted (orange) word should make a first-time learner think "oh, THAT word demonstrates what the lesson was teaching me."

---

### Task 9: Add direct song URLs for Modules 1–3 (CONTENT-03)

**Problem:** YouTube deep link currently sends user to a search query. A direct video URL is more reliable and gives a better UX.

**Files:** `src/data/modules.ts`, `src/screens/Lesson/ListenScreen.tsx`

**Steps:**
1. Add `youtubeId?: string` to the `Song` type in `modules.ts`:
   ```typescript
   export type Song = {
     title: string;
     artist: string;
     durationSeconds: number;
     spotifyId?: string;
     youtubeId?: string;
   };
   ```
2. Research and populate for Modules 1–3:
   - Module 1 "Bésame Mucho": find a high-quality YouTube version (e.g., Andrea Bocelli & Céline Dion version or the classic Consuelo Velázquez recording). Use the video ID from the URL (11-character string after `v=`).
   - Module 2 and 3: same — find the canonical YouTube video for each song and add the `youtubeId`.
3. In `ListenScreen.tsx`, update the `getStreamingUrl` function for the `'youtube'` case:
   ```typescript
   case 'youtube':
     if (song.youtubeId) return `https://www.youtube.com/watch?v=${song.youtubeId}`;
     return `https://www.youtube.com/results?search_query=${query}`;
   ```
4. Same pattern for YouTube Music: if `youtubeId` exists, use `https://music.youtube.com/watch?v=${song.youtubeId}`.
5. For Spotify: `spotifyId` already in the type — populate it for Modules 1–3 if not already set.

**Verification:** Tap "Listen on YouTube" for Module 1 — opens the exact video, not a search. `npx tsc --noEmit` passes.

---

## Wave 4 — Audio (expo-speech TTS)

### Task 10: Install expo-speech and add concept audio to PreListenScreen (ARCH-01)

**Problem:** PreListenScreen explains concepts visually only. Users want to hear the Spanish pronunciation and concept explanation aloud before listening to the song.

**Files:** `package.json`, `src/screens/Lesson/PreListenScreen.tsx`, `src/utils/speech.ts` (new)

**Steps:**
1. Install: `npx expo install expo-speech`
2. Create `src/utils/speech.ts`:
   ```typescript
   import * as Speech from 'expo-speech';

   export function speakSpanish(text: string): void {
     Speech.stop(); // stop any currently playing speech
     Speech.speak(text, {
       language: 'es',
       pitch: 1.0,
       rate: 0.85, // slightly slower for learners
     });
   }

   export function stopSpeech(): void {
     Speech.stop();
   }
   ```
3. In `PreListenScreen.tsx`, for each grammar/vocabulary card that shows a concept:
   - Add a speaker icon button (use `Ionicons 'volume-high-outline'`) in the top-right corner of the card
   - On press: call `speakSpanish(card.spanishText)` where `spanishText` is the Spanish content of the card (vocabulary word, or the concept summary in Spanish)
   - For vocabulary items: speak the Spanish word (e.g., "bésame")
   - For grammar point cards: speak the example sentence or the Spanish summary text
4. Speaker icon style: 28×28 coral circle with white icon, positioned absolute top-right on each card. Matches the design language.
5. Clean up: call `Speech.stop()` in the `useEffect` cleanup when screen unmounts.

**Verification:** Tap the speaker on a vocabulary card — hear the word spoken in Spanish. Works on device (expo-speech requires real device or simulator with voice installed). `npx tsc --noEmit` passes.

---

### Task 11: Add audio pronunciation to ReadingScreen tappable word tooltip (ARCH-02)

**Problem:** Tapping a Spanish word in the reading passage shows the tooltip, but the user can only see the translation — they can't hear the word pronounced.

**Files:** `src/screens/Lesson/ReadingScreen.tsx`

**Steps:**
1. Import `speakSpanish` from `src/utils/speech.ts`.
2. In the existing tooltip Modal (shown when `activeToken` is set):
   - Add a speaker icon button below the phonetic line (or below the English translation if no phonetic)
   - On press: `speakSpanish(activeToken.text)`
3. Also: auto-speak when the tooltip opens — call `speakSpanish(activeToken.text)` immediately when `setActiveToken(token)` is called (so the word plays automatically on tap, no extra button needed). The button becomes a "replay" icon.
4. Icon: `Ionicons 'volume-high-outline'` in Mist color (#8A8AA3), small (20×20), centered below the translation.
5. Stop speech when tooltip is dismissed: `Speech.stop()` in the `onRequestClose` / tap-outside handler.

**Verification:** Tap a Spanish word in the reading passage — word plays aloud immediately. Tap the speaker icon — plays again. Dismiss tooltip — audio stops. `npx tsc --noEmit` passes.

---

## Execution Order

Run waves sequentially. Each wave's tasks can be executed in parallel within the wave if no file conflicts exist.

| Wave | Tasks | Files at Risk of Conflict |
|------|-------|--------------------------|
| 1 | Task 1, Task 2 | QuizScreen, QuizResultsScreen, LessonCompleteScreen |
| 2 | Task 3, Task 4, Task 5, Task 6 | ListenScreen, QuizScreen, QuizOption |
| 3 | Task 7, Task 8, Task 9 | modules.ts (all three tasks touch it — run sequentially) |
| 4 | Task 10, Task 11 | PreListenScreen, ReadingScreen (safe to parallelize) |

**Wave 3 note:** Tasks 7, 8, and 9 all modify `modules.ts`. Run them in sequence to avoid merge conflicts.

---

## Self-Check Criteria

- [ ] `npx tsc --noEmit` → 0 errors after all tasks
- [ ] Answer 4/5 quiz questions correctly → QuizResultsScreen shows 4/5
- [ ] "Continue to Modules" button navigates to Modules tab
- [ ] Timer hitting 0:00 shows in-app prompt with "Continue to Quiz" CTA
- [ ] Tapping "Listen on YouTube" immediately starts timer (no separate "I'm listening" tap)
- [ ] Correct quiz answer: option pops + "Correcto" toast appears and fades
- [ ] Wrong quiz answer: option shakes + "Incorrecto" toast appears and fades
- [ ] Module 1 quiz questions all reference "Bésame Mucho" content
- [ ] No single-letter tokens in any reading passage (`isSpanish: true`)
- [ ] YouTube opens the specific video for Module 1 (not a search page)
- [ ] Tapping speaker on PreListenScreen concept card speaks Spanish text
- [ ] Tapping Spanish word in ReadingScreen plays pronunciation automatically
