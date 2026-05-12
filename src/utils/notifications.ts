import * as Notifications from 'expo-notifications';

export async function ensureNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

export async function scheduleTimerNotification(
  durationSeconds: number,
  songTitle: string,
  moduleId: number
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time's up!",
      body: `You've been listening to "${songTitle}". Ready to quiz?`,
      sound: true,
      data: { screen: 'Listen', moduleId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, durationSeconds),
      repeats: false,
    },
  });
  return id;
}

export async function cancelTimerNotification(id: string | null): Promise<void> {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // notification may have already fired — ignore
  }
}
