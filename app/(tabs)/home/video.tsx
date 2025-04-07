import { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Button, Touchable } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useLocalSearchParams, Link } from "expo-router";
import {WebView} from 'react-native-webview';
import { TouchableOpacity, Image, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";


const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

interface Exercise {
  _id: string;
  category: string;
  description: string;
  frequency: number;
  hold: number;
  reps: number;
  sets: number;
  subcategory: string;
  thumbnail_url: string;
  title: string;
  video_url: string;
}

export default function Video() {
  const exercise_id = useLocalSearchParams().exerciseId;
  const [exercise, setExercise] = useState<Exercise>({
    _id: "",
    category: "",
    description: "",
    frequency: 1,
    hold: 1,
    reps: 1,
    sets: 1,
    subcategory: "",
    thumbnail_url: "",
    title: "",
    video_url: "",
  });
  const [summary, setSummary] = useState<boolean>(false);
  // Fallback URL if exercise.video_url is not available

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/get_exercise/${exercise_id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setExercise(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  
  // video source url is not supported, consider another solution
  return (
    <View style={styles.contentContainer}>
      <TouchableOpacity onPress={() => setSummary(!summary)}>
                  {!summary && (
                    <Image
                      source={require("@/assets/images/chevron-down.png")}
                      style={{marginTop: 64}}
                    />
                  )}
                </TouchableOpacity>
      {summary && (          
      <View style={styles.exerciseSummary}>
        <View style={{width: '56%', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center"}}>
        <Link
          dismissTo
          href={`/(tabs)/home/exerciseDetails?exerciseId=${exercise_id}`}
        >
          <Image source={require("@/assets/images/chevron-back.png")} />
        </Link>
        <TouchableOpacity
          onPress={() => setSummary(false)}
          >
          <Image
            source={require("@/assets/images/chevron-up.png")}
            
          />
        </TouchableOpacity>
        </View>
        <View>
          <ThemedText style={styles.text}>{exercise.title}</ThemedText>
        </View>
        
          <ThemedText style={styles.desc}>{exercise.description}</ThemedText>
        {/*<View style={{width: '100%',flexDirection: "row", justifyContent: "space-between", paddingTop: 20}}>
          <TouchableOpacity>
            <Image
              source={require("@/assets/images/cc.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("@/assets/images/Cog.png")}
            />
          </TouchableOpacity>
            
        </View>*/}
      </View>)}
      <WebView
      source={{uri: exercise.video_url}} style={styles.video}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "black",
  },
  video: {
    position: 'relative',
    backgroundColor: "black",
    width: screenWidth,
    height: screenHeight / 3,
    zIndex: 1,

  },
  controlsContainer: {
    padding: 10,
    zIndex: 1,
  },
  exerciseSummary: {
    backgroundColor: "#3764BECC",
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 50,
    zIndex: 2,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    lineHeight: 24,
    paddingTop: 12
  },
  desc: {
    fontSize: 16,
    color: "white",
    lineHeight: 24,
    paddingTop: 12
  },
  
});
