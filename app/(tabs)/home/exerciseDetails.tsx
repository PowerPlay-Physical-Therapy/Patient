import ScreenHeader from "@/components/ScreenHeader";
import { ThemedText } from "@/components/ThemedText";
import { AppColors } from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { Card } from "@rneui/base";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react"
import { ScrollView, View, Text, Platform, Dimensions, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Notification from "@/components/Notification";
import capitalizeWords from "@/utils/capitalizeWords";
// import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get("window")

export default function ExerciseDetails() {

    const { user } = useUser();

    const local = useLocalSearchParams();
    const parsedId = local.exerciseId;
    const exercise_id = parsedId;
    
    const [routine,setRoutine] = useState([]);
    
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/get_exercise/${exercise_id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setRoutine([data]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);


    return (
        <LinearGradient style={{ height: height, flex: 1, justifyContent: 'center', alignItems: 'center' }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
            {notification && (
                <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
            )}
            <View style={{ width: width, paddingBottom: 60}}>
                <ScrollView
                    horizontal={true}
                    decelerationRate={0}
                    snapToInterval={width * 0.9} //your element width
                    snapToAlignment={"center"}>
                    {routine.map((exercise) => (
                        <View key={exercise._id} style={{ maxHeight: height * 0.9 }}>
                            <Card containerStyle={{ width: width * 0.9, borderRadius: 15, shadowOffset: { height: 0.2, width: 0.2 }, shadowRadius: 3, shadowOpacity: 0.7, backgroundColor: AppColors.OffWhite }}>
                                <Card.Title style={{ fontSize: 20, fontFamily: 'Montserrat' }}>{capitalizeWords(exercise.title)}</Card.Title>
                                <Card.Divider />
                                <Card.Image source={{ uri: exercise.thumbnail_url }} style={{ borderRadius: 15 }} containerStyle={{ borderRadius: 15, shadowOffset: { height: 0.5, width: 0.5 }, shadowRadius: 3, shadowOpacity: 0.7 }} />
                                <View style={{ flexDirection: "row", justifyContent: 'space-between', paddingTop: 10}}>
                                    <View style={{}}>
                                        <ThemedText style={{ fontSize: 20 }}><ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>Reps : </ThemedText>{exercise.reps}</ThemedText>
                                        <ThemedText style={{ fontSize: 20 }}><ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>Hold : </ThemedText>{exercise.hold} sec</ThemedText>
                                    </View>
                                    <View style={{}}>
                                        <ThemedText style={{ fontSize: 20 }}><ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>Sets: </ThemedText>{exercise.sets}</ThemedText>
                                        <ThemedText style={{ fontSize: 20 }}><ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>Frequency : </ThemedText>{exercise.frequency} / week</ThemedText>
                                    </View>
                                </View>
                                <Text style={{ fontWeight: "bold", fontSize: 20 }}>Description : </Text>
                                <ScrollView style={{ maxHeight: height * 0.2 }}>
                                    <ThemedText style={{ fontSize: 18 }} >
                                        {exercise.description}
                                    </ThemedText>
                                </ScrollView>
                                <View style={{ flexDirection: "row", justifyContent: 'center', marginTop: 10}}>
                                {exercise.video_url && 
                                <View style={{ alignItems: "center", marginTop: 5, width: '50%' }}>
                                    <LinearGradient
                                        colors={[AppColors.Purple, AppColors.Blue]}
                                        style={styles.button}
                                    >
                                        <TouchableOpacity
                                            style={styles.buttonInner}
                                            onPress={() => { router.push(`/home/video?exerciseId=${exercise_id}`) }}
                                        >
                                            <ThemedText style={styles.buttonText}>Watch Video</ThemedText>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                </View>}
                                <View style={{ alignItems: "center", marginTop: 5, width: '50%'}}>
                                    <LinearGradient
                                        colors={[AppColors.Purple, AppColors.Blue]}
                                        style={styles.button}
                                    >
                                        <TouchableOpacity
                                            style={styles.buttonInner}
                                            onPress={() => { router.push(`/home/recording?exerciseId=${exercise_id}`) }}
                                        >
                                            <ThemedText style={styles.buttonText}>Start</ThemedText>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                </View>
                                </View>

                            </Card>
                        </View>
                    ))}
                </ScrollView>  
            </View>
            
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    buttonInner: {
        padding: 12,
        alignItems: 'center',
        borderRadius: 20,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
    },
    button: {
        borderRadius: 25,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});