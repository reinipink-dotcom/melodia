import * as Linking from 'expo-linking';
import { Song } from '../data/modules';

export type StreamingPlatform = 'spotify' | 'apple-music' | 'youtube-music' | 'youtube';

export function getStreamingUrl(
  platform: StreamingPlatform | null,
  song: Pick<Song, 'title' | 'artist' | 'spotifyId'>
): string {
  const query = encodeURIComponent(`${song.title} ${song.artist}`);
  const resolved = platform ?? 'spotify';

  switch (resolved) {
    case 'spotify':
      return song.spotifyId
        ? `spotify:track:${song.spotifyId}`
        : `https://open.spotify.com/search/${query}`;
    case 'apple-music':
      return `https://music.apple.com/search?term=${query}`;
    case 'youtube-music':
      return `https://music.youtube.com/search?q=${query}`;
    case 'youtube':
      return `https://www.youtube.com/results?search_query=${query}`;
    default:
      return `https://open.spotify.com/search/${query}`;
  }
}

export async function openStreaming(
  platform: StreamingPlatform | null,
  song: Pick<Song, 'title' | 'artist' | 'spotifyId'>
): Promise<void> {
  const url = getStreamingUrl(platform, song);
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return;
    }
  } catch {
    // fall through to web fallback
  }
  const fallback = `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`;
  await Linking.openURL(fallback);
}

export function platformLabel(platform: StreamingPlatform | null): string {
  switch (platform) {
    case 'spotify': return 'Spotify';
    case 'apple-music': return 'Apple Music';
    case 'youtube-music': return 'YouTube Music';
    case 'youtube': return 'YouTube';
    default: return 'Spotify';
  }
}

export function platformIconName(platform: StreamingPlatform | null): 'logo-spotify' | 'musical-note' | 'logo-youtube' {
  switch (platform) {
    case 'spotify': return 'logo-spotify';
    case 'youtube':
    case 'youtube-music':
      return 'logo-youtube';
    default: return 'musical-note';
  }
}
