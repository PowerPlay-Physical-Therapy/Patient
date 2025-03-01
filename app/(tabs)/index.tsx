import { Image, StyleSheet, Platform, TextInput, SafeAreaView } from 'react-native';
import { useState } from 'react';

// import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export default function HomeScreen() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return <Redirect href={'/sign-up'} />
  }
  return (
    <SafeAreaView>
        <ThemedText>You can start Working Out</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});