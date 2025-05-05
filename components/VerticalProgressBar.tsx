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
  const [checkpoints, setCheckpoints] = useState({
    25: false,
    50: false,
    75: false,
    100: false,
  });
  const animationRefs = {
    25: useRef(null),
    50: useRef(null),
    75: useRef(null),
    100: useRef(null),
  };
  

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: clampedProgress,
      duration: 1000,
      useNativeDriver: false, // `false` because height animation affects layout
    }).start(() => {
      if (clampedProgress === 1) {
        setShowFireworks(true);
      animationRef.current?.play();
    }
    });
  }, [clampedProgress]);

  useEffect(() => {
    const listener = animatedHeight.addListener(({ value }) => {
      const percentage = value * 100;

      if (percentage >= 25 && !checkpoints[25]) {
        setCheckpoints((prev) => ({ ...prev, 25: true }));
        animationRefs[25].current?.play();
        console.log('Reached 25% checkpoint!');
      }
      if (percentage >= 50 && !checkpoints[50]) {
        setCheckpoints((prev) => ({ ...prev, 50: true }));
        animationRefs[50].current?.play();
        console.log('Reached 50% checkpoint!');
      }
      if (percentage >= 75 && !checkpoints[75]) {
        setCheckpoints((prev) => ({ ...prev, 75: true }));
        animationRefs[75].current?.play();
        console.log('Reached 75% checkpoint!');
      }
      if (percentage >= 100 && !checkpoints[100]) {
        setCheckpoints((prev) => ({ ...prev, 100: true }));
        animationRefs[100].current?.play();
        console.log('Reached 100% checkpoint!');
      }
    });
    return () => {
      animatedHeight.removeListener(listener);
    };
  }, [animatedHeight, checkpoints]);

  // Interpolated height in percentage for styling
  const heightInterpolate = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
      <View style={[styles.markerLine, { bottom: '21.5%' }]} />
        <View style={[styles.markerLine, { bottom: '46.5%' }]} />
        <View style={[styles.markerLine, { bottom: '71.5%' }]} />
        <View style={[styles.markerLine, { bottom: '96.5%' }]} />
        {/* Filler bar */}
        <Animated.View style={[styles.filler, { height: heightInterpolate }]}>
          {/* Image at the top of the filler */}
          <Image 
            source={{uri : imageUrl}} // Replace with your image path
            style={styles.marker}
          />
        </Animated.View>
      </View>
      {Object.keys(animationRefs).map((key) => (
        <LottieView
          key={key}
          ref={animationRefs[key]}
          source={require('@/assets/fireworks.json')}
          autoPlay={false}
          loop={false}
          style={[styles.fireworks, { bottom: `${key}%` }]}
        />
      ))}
      
    </View>
  );
};

const styles = StyleSheet.create({
  markerLine: {
    position: 'absolute',
    borderRadius: 15,
    width: 30,
    height: 30,
    backgroundColor: AppColors.LightBlue,
    left: -9, // Adjust to align with the bar
  },
  checkpointText: {
    fontSize: 16,
    color: AppColors.Blue,
    marginTop: 10,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
  },
  barContainer: {
    width: 12,
    height: 540,
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
