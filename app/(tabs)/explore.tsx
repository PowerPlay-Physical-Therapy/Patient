import { StyleSheet, Image, Platform, ScrollView, View, Dimensions, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { AppColors } from '@/constants/Colors';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '@/components/ScreenHeader';
import { useEffect, useState } from 'react';
import { Link, router, Stack } from 'expo-router';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';
import { setStatusBarTranslucent } from 'expo-status-bar';
import { SearchBar } from '@rneui/themed';
import {BlurView} from 'expo-blur';
import { useRouter } from "expo-router";


const { height, width } = Dimensions.get("window")

export default function ExploreScreen() {
  const router = useRouter();

  const [exercises, setExercises] = useState([]);
  // const [exploreAll, setExploreAll] = useState([]) 

  const exploreAll = require('@/assets/Exercises.json');
  // useEffect(() => {
  //   fetch('@/assets/Exercises.json')
  //     .then(data => setExploreAll(data));
  const [search, setSearch] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/exercises/get_exercises`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setExercises(result);
        setFilteredResults(exercises);
      } catch (error : any) {
        console.error(error.message);
      }
    
  }; 
  fetchData();
}, []);

  return (
    <LinearGradient style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? 50 : 0 }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
      <ScreenHeader title="Explore" logo={true}/>
      <SearchBar round={true} containerStyle={{ backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0 }} inputContainerStyle={{ backgroundColor: AppColors.LightBlue }} placeholder='Search Routines/Categories' onChangeText={() => {}} value={search} style={styles.search} />
      <ScrollView style={{ marginBottom: 60 }}>
        {exploreAll.map((category) => (
          <View key={category.title} style={{ padding: 16 }}>
            <ThemedText>{category.title}</ThemedText>
            {category["subcategory"].map((subcategory) => (
              <View style={{ margin: 5, padding: 5, backgroundColor: AppColors.OffWhite, borderRadius: 15 }} key={subcategory.subtitle}>
                <ThemedText style={{ paddingLeft: 5 }}>{subcategory.subtitle}</ThemedText>
                <ScrollView horizontal={true}>
                  {subcategory["exercises"].map((exercise) => (
                    <TouchableOpacity key={exercise.name} onPress={() => {
                      // console.log("clicked");
                      router.push("../(explore)/routineDetails")
                    }}>
                      <View style={{ alignItems: "center", justifyContent: "flex-end", margin: 5, borderRadius: 15, zIndex: 0, shadowOffset: { height: 0.2, width: 0.2 }, shadowRadius: 3, shadowOpacity: 0.5 }}>
                        <Image source={{ uri: exercise.thumbnail_url }} style={{width: width * 0.5, height: height * 0.2, borderRadius: 15, zIndex: 2 }} />
                          <Text style={{ position: "absolute", zIndex: 3, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 5, padding: 2.5, margin: 4 }} >{exercise.name}</Text>
                        
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ))}
          </View>
        ))}
        {filteredResults.length == 0 && <ThemedText style={{ flex: 1, alignSelf: 'center', padding: 40 }}>No results found</ThemedText>}
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
  search: {
    // Add your search bar styles here
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subcategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingLeft: 5,
  },
  exerciseName: {
    padding: 2.5,
    paddingBottom: 4,
    fontSize: 14,
    lineHeight: 12,
    fontWeight: 'bold',
    borderRadius: 15,
  },
  blurContainer: {
    position: "absolute",
    zIndex: 3,
    borderRadius: 15,
    padding: 2.5,
    paddingBottom: 4,
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
  },
});