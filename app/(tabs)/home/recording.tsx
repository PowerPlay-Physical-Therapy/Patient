import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  View,
  Image,
  Touchable,
  Dimensions,
  Animated
} from "react-native";
import { Redirect, useRouter, useLocalSearchParams, Link } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { AppColors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import {ResizeMode, Video} from "expo-av";
import * as VideoThumbnails from "expo-video-thumbnails";
import capitalizeWords from "@/utils/capitalizeWords";
import { set } from "date-fns";

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


export default function Recording() {
  const local = useLocalSearchParams();
  const parsedId = local.exerciseId;
  const exercise_id = parsedId;
  const [summary, setSummary] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const router = useRouter();
  const [recording, setRecording] = useState(false); // State to track if recording is in progress
  const [uri, setUri] = useState<string>(""); // State to store the recorded video URI
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
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
  }); // State to store exercise data
  const ref = useRef<CameraView>(null); // Create a ref for the CameraView to access methods like recordAsync
  const videoRef = useRef<Video>(null); // Create a ref for the Video component to access methods like playAsync
  const slideAnim = useRef(new Animated.Value(-300)).current; // Animation value for sliding in the exercise summary

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

  const generateThumbnail = async () => {
    try {
      const url = await VideoThumbnails.getThumbnailAsync(
        uri,
        {
          time: 15000,
        }
      );
      console.log("Thumbnail URL:", url);
      setThumbnail(url.uri);
    } catch (e) {
      console.warn(e);
    }
  };

  const recordVideo = async () => {
    if (recording) {
      setRecording(false);
      const video = ref.current?.stopRecording();
      setUri(video.uri);
      return;
    }
    setRecording(true);
    try {
      let options= {
        maxDuration: 60, // Set the maximum duration to 60 seconds
      }
      const video = await ref.current?.recordAsync(options);
      setUri(video.uri);
      console.log("Video URI:", video.uri);
      
    } catch (error) {
      console.error("Error recording video:", error);
    }
  };

  const toggleSummary = () => {
    if (summary) {
      // Slide up (hide)
      Animated.timing(slideAnim, {
        toValue: -300, // Move off-screen
        duration: 200,
        useNativeDriver: true,
      }).start(() => setSummary(false));
    } else {
      setSummary(true);
      // Slide down (show)
      Animated.timing(slideAnim, {
        toValue: 0, // Move to visible position
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }

  useEffect(() => {
    if (uri) {
      generateThumbnail();
    }
  }, [uri])

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera!
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }
  const startOver = () => {
    setUri("");
    setRecording(false);
  }

  const mute = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(true);
    }
  }

  if (uri) {
    return (
    <View style={styles.container}>
      <Video 
        source={{ uri: uri }}
        ref={videoRef}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={true}
        shouldPlay={true}
        useNativeControls={false}
        
      />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={toggleSummary}>
            {!summary && (
              <Image
                source={require("@/assets/images/chevron-down.png")}
                style={styles.more}
              />
            )}
          </TouchableOpacity>
          {summary && (
            <Animated.View style={[styles.exerciseSummary, { transform: [{ translateY: slideAnim }] }]}>
              <View style={{width: '100%', justifyContent: 'space-between'}}>
                <ThemedText style={styles.text}>{capitalizeWords(exercise.title)}</ThemedText>
                <ThemedText style={styles.text}>
                  Reps: {exercise.reps}
                </ThemedText>
                <ThemedText style={styles.text}>
                  Sets: {exercise.sets}
                </ThemedText>
                <ThemedText style={styles.text}>
                  Hold: {exercise.hold} seconds
                </ThemedText>
                {exercise.video_url && 
                <Link href={`/(tabs)/home/video?exerciseId=${exercise._id}`}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "100%",
                    }}
                  >
                    <ThemedText
                      style={{
                        fontSize: 16,
                        color: "white",
                        textAlign: "right",
                      }}
                    >
                      Watch video tutorial here!{" "}
                    </ThemedText>
                    <Image
                      style={{ tintColor: "white" }}
                      source={require("@/assets/images/chevron-right.png")}
                    />
                  </View>
                </Link>}
              </View>
              <TouchableOpacity
                onPress={toggleSummary}
                style={{ marginTop: 10 }}
              >
                <Image source={require("@/assets/images/chevron-up.png")} />
              </TouchableOpacity>
            </Animated.View>
          )}
          <View style={{flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%"}}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
              marginBottom: 28,
            }}
          >
            <Link
              dismissTo
              href={`/(tabs)/home/exerciseDetails?exerciseId=${exercise_id}`}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Image
                source={require("@/assets/images/chevron-left.png")}
                style={styles.back}
              />
            </Link>
            {!uri &&
            <Pressable onPress={recordVideo}>
              {recording ? (
                <Image source={require("@/assets/images/stop-record.png")} />
              ) : (
                <Image source={require("@/assets/images/record.png")} />
              )}
            </Pressable>}
            <TouchableOpacity onPress={() => router.push("/(tabs)/message")}>
              <Image
                source={require("@/assets/images/chat-bubbles.png")}
                style={styles.messages}
              />
            </TouchableOpacity>
          </View>

          {uri &&
          <View style={{ flexDirection: "row", justifyContent: "space-around", width: screenWidth }}>
            <TouchableOpacity onPress={()=> startOver()} style={{backgroundColor: "white", width: screenWidth * 0.4, padding: 12, borderRadius: 8, alignItems: 'center'}}>
              <ThemedText style={{fontWeight: 'bold'}}>Start Over</ThemedText>
            </TouchableOpacity>
            <LinearGradient
              colors={[AppColors.Purple, AppColors.Blue]}
              style={styles.button}
            >
              <Link onPress={() => mute()} href={`/home/share?videoUri=${uri}&exerciseId=${exercise_id}&thumbnailUri=${thumbnail}`} style={styles.buttonInner}>
                <ThemedText style={styles.buttonText}>Next</ThemedText>
              </Link>
            </LinearGradient>
          </View>}
          </View>
        </View>
      
    </View>);
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={ref}
        mode="video"
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={toggleSummary}>
            {!summary && (
              <Image
                source={require("@/assets/images/chevron-down.png")}
                style={styles.more}
              />
            )}
          </TouchableOpacity>
          {summary && (
            <Animated.View style={[styles.exerciseSummary, { transform: [{ translateY: slideAnim }] }]}>
              <View style={{width: '100%', justifyContent: 'space-between'}}>
                <ThemedText style={styles.text}>{capitalizeWords(exercise.title)}</ThemedText>
                <ThemedText style={styles.text}>
                  Reps: {exercise.reps}
                </ThemedText>
                <ThemedText style={styles.text}>
                  Sets: {exercise.sets}
                </ThemedText>
                <ThemedText style={styles.text}>
                  Hold: {exercise.hold} seconds
                </ThemedText>
                {exercise.video_url &&
                <Link href={`/(tabs)/home/video?exerciseId=${exercise._id}`}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "100%",
                    }}
                  >
                    <ThemedText
                      style={{
                        fontSize: 16,
                        color: "white",
                        textAlign: "right",
                      }}
                    >
                      Watch video tutorial here!{" "}
                    </ThemedText>
                    <Image
                      style={{ tintColor: "white" }}
                      source={require("@/assets/images/chevron-right.png")}
                    />
                  </View>
                </Link>}
              </View>
              <TouchableOpacity
                onPress={toggleSummary}
                style={{ marginTop: 10 }}
              >
                <Image source={require("@/assets/images/chevron-up.png")} />
              </TouchableOpacity>
            </Animated.View>
          )}
          <View style={{flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%"}}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
              marginBottom: 28,
            }}
          >
            <Link
              dismissTo
              href={`/(tabs)/home/exerciseDetails?exerciseId=${exercise_id}`}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Image
                source={require("@/assets/images/chevron-left.png")}
                style={styles.back}
              />
            </Link>
            {!uri &&
            <Pressable onPress={recordVideo}>
              {recording ? (
                <Image source={require("@/assets/images/stop-record.png")} />
              ) : (
                <Image source={require("@/assets/images/record.png")} />
              )}
            </Pressable>}
            <TouchableOpacity onPress={() => router.push("/(tabs)/message")}>
              <Image
                source={require("@/assets/images/chat-bubbles.png")}
                style={styles.messages}
              />
            </TouchableOpacity>
          </View>

          {uri &&
          <View style={{ flexDirection: "row", justifyContent: "space-around", width: screenWidth }}>
            <TouchableOpacity onPress={()=> startOver()} style={{backgroundColor: "white", width: screenWidth * 0.4, padding: 12, borderRadius: 8, alignItems: 'center'}}>
              <ThemedText style={{fontWeight: 'bold'}}>Start Over</ThemedText>
            </TouchableOpacity>
            <LinearGradient
              colors={[AppColors.Purple, AppColors.Blue]}
              style={styles.button}
            >
              <Link href={`/home/share?videoUri=${uri}&exerciseId=${exercise_id}`} style={styles.buttonInner}>
                <ThemedText style={styles.buttonText}>Next</ThemedText>
              </Link>
            </LinearGradient>
          </View>}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  more: {
    flex: 1,
    maxWidth: 45,
    maxHeight: 25,
    marginTop: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "transparent",
    margin: 64,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    lineHeight: 24,
    padding: 4,
  },
  back: {
    flex: 1,
    maxWidth: 25,
    maxHeight: 45,
  },
  messages: {
    // This is for the chat bubbles icon
    width: 40,
    height: 40,
    tintColor: "white",

    // You can add more styles if needed
  },
  exerciseSummary: {
    backgroundColor: "#3764BECC",
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    bottom: 300,
    paddingTop: 160,
    width: screenWidth,
  },
  buttonInner: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'center',
},
buttonText: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
},
button: {
    borderRadius: 8,
    width: screenWidth * 0.4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
},
video: {
  width: screenWidth,
  height: screenHeight,
  position: "absolute",
  flex: 1,
  top: 0,
  left: 0,
  zIndex: -1, // Ensure the video is behind other components
  backgroundColor: "black",
},

});
