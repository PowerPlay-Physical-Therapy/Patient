import { Image, StyleSheet, Platform, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
// import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/Colors';
import ScreenHeader from '@/components/ScreenHeader';
import { useEffect } from 'react';
import { Link, useRouter } from "expo-router";
import * as React from 'react';
import { Text, View, FlatList } from 'react-native';
import Tabs from './tabs';


export default function HomeScreen() {
    const { isSignedIn } = useAuth()
    const router = useRouter();
    const [patientName, setPatientName] = useState<string | null>(null);
    const [routines, setRoutines] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { user, isLoaded } = useUser();
    const [patientId, setPatientId] = useState<string | null>(null);

    const [isTabVisible, setIsTabVisible] = useState(true);
    const [activeTab, setActiveTab] = useState(0);



    useEffect(() => {
        const fetchAssignedRoutines = async () => {
            if (!isSignedIn) {
                return <Redirect href={'/sign-up'} />
            }

            // Make sure user or user data is loaded
            if (!user || !isLoaded) {
                return;
            }

            // Display user id
            const patientId = user?.id;
            console.log("userid:", user?.id);
            setPatientId(patientId);
            setPatientName(user?.firstName || "Patient");

            // Error message if no patientId is available
            if (!patientId) {
                setError('Patient ID is not defined');
                return;
            }

            try {
                // Fetch assigned routines
                const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/patient/get_assigned_routines/${patientId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                // Throw an error if the response is not successful
                if (!response.ok) {
                    throw new Error(`Failed to fetch assigned routines. Status: ${response.status}`);
                }

                // Parse the response as JSON
                const data = await response.json();
                console.log("Fetched data:", data);
                setRoutines(data);

            } catch (err) {
                setError("Fetching data unsuccessful");
                console.error("Error fetching assigned routines:", err);
            }
        };
        fetchAssignedRoutines();
    }, [isLoaded, user]);


    // Display the error message
    if (error) {
        return (
            <View style={{ padding: 20 }}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <LinearGradient style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? 50 : 0 }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
            <ScreenHeader title="Welcome!" name={user?.username} logo={true} />

            {/* Display each assigned routine */}
            <FlatList
                data={routines}
                keyExtractor={(item) => item._id["$oid"]}
                style={{ padding: 20, marginBottom: 80 }}
                renderItem={({ item: routine }) => (
                    
                    <View style={styles.routine}>
                        <Text style={styles.routineTitle}>{routine.name}</Text>

                        {/* Exercises within routine */}
                        <View style={styles.exerciseList}>
                            <FlatList
                                data={routine.exercises}
                                keyExtractor={(exercise) => exercise._id["$oid"]}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                renderItem={({ item: exercise }) => (
                                    <View style={styles.exerciseItem}>

                                        <Image source={{ uri: exercise.thumbnail_url }} style={styles.exerciseThumbnail} />
                                        <View style={styles.exerciseInfo}>
                                            <ThemedText style={styles.exerciseName}>{exercise.title}</ThemedText>
                                            <ThemedText>
                                                <Text style={styles.exerciseDetails}>Reps: </Text> 
                                                {exercise.reps}
                                            </ThemedText>
                                            <ThemedText>
                                                <Text style={styles.exerciseDetails}>Sets: </Text>
                                                {exercise.sets}
                                            </ThemedText>
                                        </View>
                                        
                                        <TouchableOpacity onPress={() => {
                                                        // console.log("clicked");

                                                        router.push(`./home/exerciseDetails?exerciseId=${exercise._id}`);

                                                    }}><Image source={require('@/assets/images/chevron-right.png')} style={{width: 20, height: 20}}/>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                    
                )}
            />
            
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },

    text: {
        fontSize: 24,
        fontWeight: "bold",
    },

    welcomeText: {
        flex: 1,
        padding: 20,
        backgroundColor: "#ffffff",
    },

    routine: {
        marginVertical: 10,
        padding: 15,
        borderRadius: 10,
    },

    routineTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },

    routineList: {
        flexDirection: "row",
        alignItems: "center",
    },

    exerciseInfo: {
        flex: 1,
    },

    exerciseList: {
        marginTop: 10,
        backgroundColor: AppColors.OffWhite,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },

    exerciseThumbnail: {
        width: 82,
        height: 76,
        borderRadius: 5,
        marginRight: 10,
    },

    exerciseName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,

    },

    exerciseDetails: {
        fontSize: 14,
        fontWeight: "bold",
        color: "black",
    },

    exerciseItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },

    separator: {
        height: 1,
        backgroundColor: "#9BB4D6",
        marginVertical: 5,
        width: "100%",
    },

    bottomView: {
        backgroundColor: "white",
        alignSelf: "center",
    },

    errorText: {
        color: 'red',
        fontSize: 12,
        marginLeft: 15,
        marginTop: 5,
    },
});


