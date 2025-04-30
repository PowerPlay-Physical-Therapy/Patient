import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import {AppColors} from '@/constants/Colors';

type TabButtonProps = {
  href: string;
  imageSource: any; // Image source (e.g., require('@/assets/icon.png'))
};

const TabButton: React.FC<TabButtonProps> = ({ href, imageSource }) => {
  const router = useRouter();
  const segments = useSegments();

  const filteredSegments = segments.filter(segment => segment !== '(tabs)'); // Remove empty segments
  
  // Check if the current tab is in focus
  const isFocused = filteredSegments.join('/') === href.replace(/^\//, '');

  return (
    <TouchableOpacity onPress={() => router.push(href)} style={styles.button}>
      <Image
        source={imageSource}
        style={[styles.image, { tintColor: isFocused ? AppColors.Blue : 'black' }]} // Change color based on focus
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default TabButton;