import { StyleSheet, Image, Platform, ScrollView, View, Dimensions } from 'react-native';
import { AppColors } from '@/constants/Colors';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '@/components/ScreenHeader';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';
import { setStatusBarTranslucent } from 'expo-status-bar';

const {height, width} = Dimensions.get("window")

export default function ExploreScreen() {
  // const [exploreAll, setExploreAll] = useState([]) 
  
  const exploreAll = require('@/assets/Exercises.json');
  // useEffect(() => {
  //   fetch('@/assets/Exercises.json')
  //     .then(data => setExploreAll(data));
  // }, []);

  return (
      <LinearGradient style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? 50 : 0}} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
        <ScreenHeader title="Explore" />

        <ScrollView>
              {exploreAll.map((category) => (
                <View style={{ padding: 16 }}>
                  <ThemedText>{category.title}</ThemedText>
                  {category["subcategory"].map((subcategory) => (
                    <View style={{ margin: 5, padding:5, backgroundColor : AppColors.OffWhite , borderRadius: 15}}>
                      <ThemedText style={{paddingLeft:5}}>{subcategory.subtitle}</ThemedText>
                      <ScrollView horizontal={true}>
                        {subcategory["exercises"].map((exercise) => (
                          <View style={{ backgroundColor: AppColors.Green, alignItems: "center", justifyContent: "flex-end", margin: 5, borderRadius: 15, zIndex: 0, shadowOffset: { height: 2, width: 2 }, shadowRadius: 16, shadowOpacity: 0.5 }}>
                            <Image source={{ uri: exercise.thumbnail_url }} style={{ width: width * 0.5, height: height * 0.2, borderRadius: 15, zIndex: 2 }}/>
                            <ThemedText style={{ position: "absolute" , zIndex:3 , backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 5, padding:2}} >{exercise.name}</ThemedText>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  ))}
                </View>
              ))}
        </ScrollView>

      </LinearGradient>
  )
}

const styles = StyleSheet.create({
  title: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  container: {
    padding: 16,
  },
});