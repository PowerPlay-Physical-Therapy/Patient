import ScreenHeader from "@/components/ScreenHeader";
import { ThemedText } from "@/components/ThemedText";
import { AppColors } from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { Card } from "@rneui/base";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react"
import { ScrollView, View, Text, Platform, Dimensions, TouchableOpacity, StyleSheet, Image, Touchable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Notification from "@/components/Notification";
import {Link} from "expo-router";
import capitalizeWords from "@/utils/capitalizeWords";
// import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get("window")

export default function RoutineDetails() {
    const { user } = useUser();
    let exercise_id = "";
    const local = useLocalSearchParams();
    const parse = () => {
        try {
            return JSON.parse(local.exerciseId);
        } catch (error) {
            return null;
        }
    };
    const parsedId = parse();
    if (parsedId) {
        exercise_id = parsedId.$oid;}
    else {
        exercise_id = local.exerciseId;
    }
    
    const [routine, setRoutine] = useState([]);
    
    const [notification, setNotification] = useState(null);

    const showNotification = () => {
        setNotification({ message: "Adding New Routine!!", type: "info" });

        // Auto-hide after 3 seconds
        setTimeout(() => setNotification(null), 3000);
    };


    // const routine = require('@/assets/Exercises.json');

    //TODO:Only for single exercise routine, need to change for multiple exercises
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
    console.log(routine);
    const handleAddRoutine = () => {
        showNotification();
        // Toast.show({ text1: "Hello", type: "success" })
        console.log(1)
        const writeData = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/patient/add_explore_routine/${user?.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: routine[0].title,
                        exercises: routine.map(exercise => ({ _id: exercise._id }))
                    })
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                console.log("Fetched data:", data);
                
                router.back();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        writeData();
    }

    return (
        <LinearGradient style={{ height: height, flex: 1, justifyContent: 'center', alignItems: 'center' }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
            {notification && (
                <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
            )}
            <View style={{ width: width, justifyContent: 'center', alignItems: 'center'}}>

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
                                <Card.Image source={exercise.thumbnail_url? { uri: exercise.thumbnail_url } : require(`@/assets/images/default-thumbnail.png`)} style={{ borderRadius: 15 }} containerStyle={{ borderRadius: 15, shadowOffset: { height: 0.5, width: 0.5 }, shadowRadius: 3, shadowOpacity: 0.7 }} />
                                <View style={{ flexDirection: "row", justifyContent: 'space-between', paddingTop: 12}}>
                                    <View style={{}}>
                                        <ThemedText style={{ fontSize: 20 }}><ThemedText style={{ fontWeight: "bold" , fontSize: 20}}>Reps : </ThemedText>{exercise.reps}</ThemedText>
                                        <ThemedText style={{ fontSize: 20 }}><ThemedText style={{ fontWeight: "bold" , fontSize: 20}}>Hold : </ThemedText>{exercise.hold} sec</ThemedText>
                                    </View>
                                    <View style={{}}>
                                        <ThemedText style={{ fontSize: 20 }}><ThemedText style={{ fontWeight: "bold" , fontSize: 20}}>Sets: </ThemedText>{exercise.sets}</ThemedText>
                                        <ThemedText style={{ fontSize: 20 }}><ThemedText style={{ fontWeight: "bold" , fontSize: 20}}>Frequency : </ThemedText>{exercise.frequency} / week</ThemedText>
                                    </View>
                                </View>
                                <ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>Description : </ThemedText>
                                <ScrollView style={{ maxHeight: height * 0.2 }}>
                                    <ThemedText style={{ fontSize: 18 }} >
                                        {exercise.description}
                                    </ThemedText>
                                </ScrollView>
                                <View style={{ alignItems: "center", marginTop: 5 }}>
                                    <LinearGradient
                                        colors={[AppColors.Purple, AppColors.Blue]}
                                        style={styles.button}
                                    >
                                        {exercise.video_url && 
                                        <Link style={styles.buttonInner} href={`/explore/video?exerciseId=${exercise_id}`}>
                                            <ThemedText style={styles.buttonText}>Watch Video</ThemedText>
                                        </Link>}
                                    </LinearGradient>
                                </View>

                            </Card>
                        </View>
                    ))}
                </ScrollView>  

                    <LinearGradient
                        colors={[AppColors.Purple, AppColors.Blue]}
                        style={[styles.button, { width: '30%', margin: 10, justifyContent: 'flex-end', alignItems: 'center' }]}
                    >
                        <TouchableOpacity
                            style={styles.buttonInner}
                            onPress={handleAddRoutine}
                        >
                            <ThemedText style={styles.buttonText}>Add</ThemedText>
                        </TouchableOpacity>
                    </LinearGradient>
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
        textAlign: 'center',
    },
    button: {
        borderRadius: 25,
        width: '40%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});