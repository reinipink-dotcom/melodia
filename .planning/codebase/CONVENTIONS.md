# CONVENTIONS.md — Code Style & Patterns
Last mapped: 2026-05-12

## TypeScript

- **Strict mode** on
- All props explicitly typed with interfaces (not `type` aliases for component props)
- Navigation types use `StackNavigationProp<ParamList, RouteName>` and `RouteProp<ParamList, RouteName>`
- `as const` for icon name types: `{ icon: 'flash' as const }`
- No `any` — types are explicit throughout
- Zustand stores are typed with interface declarations before `create<State>()`

## Component Style

All screens follow this pattern:
```tsx
export function ScreenName({ navigation, route }: Props) {
  // hooks at top
  // helper logic
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />
      {/* content */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.midnight },
  // ... rest of styles
});
```

- Named exports for all screens (not default)
- `MascotIcon` is the one exception (default export)
- Onboarding screens use default exports

## Design System Usage

**Colors — always via `Colors.*`:**
```tsx
backgroundColor: Colors.midnight
color: Colors.coral
```

**Typography — spread or direct:**
```tsx
// Spread (adds all preset properties)
style={[Typography.body, { fontSize: 14 }]}

// Or inline with fontFamily
fontFamily: 'PlusJakartaSans_700Bold'
fontFamily: 'BeVietnamPro_400Regular'
```

**No border rule:** Card boundaries created via tonal background shifts only:
- `midnight` (#111125) — screen background
- `surfaceContainer` (#1E1E32) — cards, inputs
- `surfaceHigh` (#28283D) — elevated elements
- `surfaceHighest` (#333348) — chips, tags

**Coral glow shadows on CTAs:**
```tsx
shadowColor: Colors.coral,
shadowOffset: { width: 0, height: 10 },
shadowOpacity: 0.3,
shadowRadius: 20,
elevation: 6,
```

**Level colors:**
```tsx
function levelColor(level: string): string {
  switch (level) {
    case 'A1': return Colors.teal;
    case 'A2': return Colors.coral;
    case 'B1': return Colors.amber;
    case 'B2': return Colors.lavender;
    default: return Colors.coral;
  }
}
```
This helper is duplicated in HomeScreen, ModulesScreen, ModuleDetailScreen — not yet extracted to a utility.

## Animation Patterns

**React Native `Animated` API** (not Reanimated):
```tsx
const value = useRef(new Animated.Value(0)).current;

// Timing
Animated.timing(value, { toValue: 1, duration: 500, useNativeDriver: true }).start();

// Loop
Animated.loop(Animated.sequence([...])).start();

// Interpolation for color/width (useNativeDriver: false)
const width = value.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
```

**Rule:** Use `useNativeDriver: true` wherever possible (transforms, opacity). Must be `false` for width/height/color changes.

## Haptics Pattern

```tsx
import * as Haptics from 'expo-haptics';

// On selection
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// On heavy interaction
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// On success
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

## State Access

```tsx
// In components — selective destructuring
const { completedModuleIds, currentModuleId } = useProgressStore();
const { isComplete, loadOnboardingState } = useOnboardingStore();
```

## Navigation

```tsx
// Typed navigation hook
const navigation = useNavigation<StackNavigationProp<ParamList, 'ScreenName'>>();

// Navigate
navigation.navigate('ScreenName', { param: value });
navigation.goBack();
```

## Styles

- All styles via `StyleSheet.create()` at bottom of file — never inline objects
- Style prop spreading: `[styles.base, condition && styles.variant]`
- Hex alpha shorthand: `Colors.coral + '22'` (not rgba) for semi-transparent backgrounds
- `gap` used in flex containers instead of margin for spacing between siblings
