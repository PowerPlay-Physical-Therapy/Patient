import React from 'react';
import { View, StyleSheet, Text, Image, Animated } from 'react-native';
import { AppColors } from '@/constants/Colors';
import { useEffect, useRef, useState } from 'react';
import LottieView from 'lottie-react-native';

const VerticalProgressBar = ({ progress, imageUrl } : {progress: number, imageUrl: string}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const heightPercent = clampedProgress * 100;
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const [showFireworks, setShowFireworks] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: clampedProgress,
      duration: 1000,
      useNativeDriver: false, // `false` because height animation affects layout
    }).start(() => {
        setShowFireworks(true);
      animationRef.current?.play();
    });
  }, [clampedProgress]);

  // Interpolated height in percentage for styling
  const heightInterpolate = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {/* Filler bar */}
        <Animated.View style={[styles.filler, { height: heightInterpolate }]}>
          {/* Image at the top of the filler */}
          <Image 
            source={{uri : imageUrl}} // Replace with your image path
            style={styles.marker}
          />
        </Animated.View>
      </View>
      {showFireworks && (
        <LottieView
          ref={animationRef}
          source={require('@/assets/fireworks.json')}
          autoPlay={false}
          loop={false}
          style={styles.fireworks}
        />
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  barContainer: {
    width: 12,
    height: 600,
    backgroundColor: AppColors.OffWhite,
    borderRadius: 10,
    justifyContent: 'flex-end',
    position: 'relative',
    marginTop: 20,
  },
  filler: {
    backgroundColor: AppColors.Blue,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
  },
  marker: {
    borderRadius: 18,
    width: 36,
    height: 36,
    marginTop: -12, // So it overlaps at the top nicely
    zIndex: 1,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
  },
  fireworks: {
    position: 'absolute',
    top: -100,
    width: 200,
    height: 200,
    zIndex: 2,
  },
});

export default VerticalProgressBar;
