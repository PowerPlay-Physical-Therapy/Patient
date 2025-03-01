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
      <ThemedView style={styles.title}>
          <ThemedText>Home</ThemedText>
      </ThemedView>
  )
}

const styles = StyleSheet.create({
  title: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
  } });
