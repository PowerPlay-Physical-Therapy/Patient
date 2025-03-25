import { useState, useRef , useEffect} from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useLocalSearchParams } from 'expo-router';
import { useEvent } from 'expo';

let videoSource = ""

export default function App() {
  const video = useRef(null);
  const exercise_id = useLocalSearchParams().exerciseId;
  const [status, setStatus] = useState({});
  const [exercise, setExercise] = useState({});
   // Fallback URL if exercise.video_url is not available

  useEffect(() => {
          const fetchData = async () => {
              try {
                  const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/get_exercise/${exercise_id}`, {
                      method: 'GET',
                      headers: { 'Content-Type': 'application/json' }
                  });
                  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                  const data = await response.json();
                  setExercise(data);
                  
                  
              } catch (error) {
                  console.error("Error fetching data:", error);
              }
          };
          fetchData();
          videoSource = exercise.video_url;
      }, []);
    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
        player.play();
      });
    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
    // video source url is not supported, consider another solution
      return (
        <View style={styles.contentContainer}>
          <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
          <View style={styles.controlsContainer}>
            <Button
              title={isPlaying ? 'Pause' : 'Play'}
              onPress={() => {
                if (isPlaying) {
                  player.pause();
                } else {
                  player.play();
                }
              }}
            />
          </View>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      contentContainer: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,
      },
      video: {
        width: 350,
        height: 275,
      },
      controlsContainer: {
        padding: 10,
      },
    });