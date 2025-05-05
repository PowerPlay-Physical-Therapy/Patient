import { RefreshControl, Image, StyleSheet, Platform, TextInput, SafeAreaView, TouchableOpacity, Touchable } from 'react-native';
import { useState } from 'react';
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
import { Text, View, FlatList, Dimensions, ScrollView } from 'react-native';
import capitalizeWords from '@/utils/capitalizeWords';

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

export default function CompletionHistory() {
    const { isSignedIn } = useAuth()
    const router = useRouter();
    const [patientName, setPatientName] = useState<string | null>(null);
    const [exercises, setExercises] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { user, isLoaded } = useUser();
    const [patientId, setPatientId] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isTabVisible, setIsTabVisible] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [assignedExercises, setAssignedExercises] = useState<any[] | null>(null);
    const [completedMap, setCompletedMap] = useState<Map<string, any>>(new Map());


    
    const fetchExerciseHistory = async () => {
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
            console.log(process.env.EXPO_PUBLIC_BACKEND_URL);
            // Fetch completed exercises
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}patient/get_patient_history/${user.id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            // Throw an error if the response is not successful
            if (!response.ok) {
                throw new Error(`Failed to fetch completed exercises. Status: ${response.status}`);
            }

            // Parse the response as JSON
            const data = await response.json();
            console.log("Fetched data:", data);
            const map = new Map<string, any>();
            data?.exercises?.forEach((exercise: any) => {
                const id = exercise._id?.["$oid"] || exercise._id;
                if (id) {
                    map.set(id, exercise);
                }
            });
            setCompletedMap(map);

        } catch (err) {
            setError("Fetching data unsuccessful");
            console.error("Error fetching assigned routines:", err);
            setCompletedMap(new Map());
        }
    };

    const fetchAssignedExercises = async () => {
        if (!user || !isLoaded) return;
        const patientId = user?.id;
    
        try {
            const response2 = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/patient/get_assigned_routines/${patientId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response2.ok) {
                throw new Error(`Failed to fetch assigned routines. Status: ${response2.status}`);
            }
    
            const data = await response2.json();
            // Flatten all exercises from all routines
            const allExercises = data.flatMap((routine: any) => routine.exercises.map((exercise: Exercise) => ({
                _id: (typeof exercise._id === 'object' && '$oid' in exercise._id) ? exercise._id["$oid"] : exercise._id,
                title: exercise.title,
                category: exercise.category,
            })));
            setAssignedExercises(allExercises);
        } catch (err) {
            console.error("Error fetching assigned exercises", err);
            setAssignedExercises([]);
        }
    };
    
    const formatDate = (iso: string) => {
        const date = new Date(iso);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    useEffect(() => {
        fetchExerciseHistory();
        fetchAssignedExercises();
    }, [isLoaded, user]);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchExerciseHistory();
        await fetchAssignedExercises();
        setIsRefreshing(false);
    }


    // Display the error message
    if (error) {
        return (
            <View style={{ padding: 20 }}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const renderItem = ({ item: exercise }: { item: Exercise }) => {
        const isCompleted = completedMap.has(exercise._id);
        const completedInfo = completedMap.get(exercise._id);
    
        return (
            <View style={styles.exerciseItemWrapper}>
                <View style={styles.exerciseItem}>
                    <Image
                        source={isCompleted
                            ? require('@/assets/images/complete.png')
                            : require('@/assets/images/incomplete.png')
                        }
                        style={{ width: 24, height: 24, marginRight: 10 }}
                    />
                    <View style={styles.exerciseInfo}>
                        <ThemedText style={styles.exerciseName}>{capitalizeWords(exercise.title)}</ThemedText>
                        {isCompleted && completedInfo?.date && (
                            <ThemedText style={styles.exerciseDate}>
                                {formatDate(completedInfo.date)}
                            </ThemedText>
                        )}
                    </View>
                </View>
            </View>
        );
    };
    
    // const renderItem = ({ item: exercise }: { item: Exercise }) => {
    //     const isCompleted = completedMap.has(exercise._id);
    
    //     return (
    //         <View style={styles.exerciseItem}>
    //             <Image
    //                 source={isCompleted
    //                     ? require('@/assets/images/complete.png')
    //                     : require('@/assets/images/incomplete.png')
    //                 }
    //                 style={{ width: 24, height: 24, marginRight: 10 }}
    //             />
    //             <View style={styles.exerciseInfo}>
    //                 <ThemedText style={styles.exerciseName}>{capitalizeWords(exercise.title)}</ThemedText>
    //                 <ThemedText>
    //                     <Text style={styles.exerciseDate}> </Text>
    //                     {completedMap.get(exercise._id)?.date
    //                         ? formatDate(completedMap.get(exercise._id)?.date)
    //                         : null}
    //                 </ThemedText>
    //             </View>
    //         </View>
    //     );
    // };
    
    
    // return (
    //     <LinearGradient style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? 50 : 0 }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
        
    //         <ScrollView>
    //             {/* Display each completed exercise */}
    //             {!assignedExercises && (
    //                 <ScrollView style={{ flex: 1}}>  
    //                     <ThemedText style={{ alignSelf: 'center', color : 'black', paddingTop: 80}}>Loading Routines...</ThemedText>
    //                 </ScrollView>
    //             )}
    //             {assignedExercises && assignedExercises.length === 0 && (
    //                 <ScrollView style={{ flex: 1}}>
    //                     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //                     <ThemedText style={{ alignSelf: 'center', color : 'black', paddingTop: 80}}>No Routines Assigned</ThemedText>
    //                 </View>
    //                 </ScrollView>
    //             )}
    //             {assignedExercises && assignedExercises.length > 0 && (
                                    
    //                 <View style={styles.exerciseList}>
    //                     <FlatList
    //                         data={assignedExercises}
    //                         keyExtractor={(exercise, index) => exercise._id || index.toString()}
    //                         style={{ padding: 8, marginBottom: 80 }}
    //                         refreshing={isRefreshing}
    //                         onRefresh={onRefresh}     
    //                         renderItem={ renderItem } 
    //                     />
    //                 </View>                        
    //             )}

    //         </ScrollView>
        
            
    //     </LinearGradient>
        
    // );
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

    routine: {
        marginVertical: 0,
        padding: 15,
        borderRadius: 10,
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

    exerciseName: {
        fontSize: 16,
        marginBottom: 5,
    },

    exerciseDate: {
        fontSize: 14,
        color: "black",
    },

    exerciseItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
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
    exerciseItemWrapper: {
        marginVertical: 8, // space between items
        paddingHorizontal: 10,
    },
    

    
});

