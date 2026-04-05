import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants';

export function PlaylistScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={Typography.h1}>Playlist</Text>
        <Text style={[Typography.body, styles.sub]}>Your learning playlist lives here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  sub: {
    color: Colors.mist,
    marginTop: Spacing.sm,
  },
});
