import { Image, StyleSheet, Platform, TextInput, SafeAreaView } from 'react-native';
import { useState } from 'react';

// import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/Colors';
import  ScreenHeader  from '@/components/ScreenHeader';

export default function HomeScreen() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  

  if (!isSignedIn) {
    return <Redirect href={'/sign-up'} />
  }
  return (
    <LinearGradient style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? 50 : 0}} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
      <ScreenHeader title="Welcome!" name={user?.username} logo= {true} />
  </LinearGradient>
  )
}

const styles = StyleSheet.create({
  title: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
  } });