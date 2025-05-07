
import { RefreshControl, Image, StyleSheet, Platform, TextInput, SafeAreaView, TouchableOpacity, Touchable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { SearchBar } from '@rneui/themed';
import { useNotification } from '@/context/NotificationContext';


const { height, width } = Dimensions.get("window");

export default function HomeScreen() {
    const { expoPushToken } = useNotification();
    const { isSignedIn } = useAuth()
    const router = useRouter();
    const [patientName, setPatientName] = useState<string | null>(null);
    const [routines, setRoutines] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { user, isLoaded } = useUser();
    const [patientId, setPatientId] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isTabVisible, setIsTabVisible] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [search, setSearch] = useState('');
    const [filteredRoutines, setFilteredRoutines] = useState<any[] | null>(null);
  
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
        setPatientId(patientId);
        setPatientName(user?.firstName || "Patient");
        const storedStreak = parseInt(
            (await AsyncStorage.getItem("streak")) || "0",
            10
        );

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
            setRoutines(data);

            const response2 = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/patient/update_patient/${user?.username}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: patientId,
                  username: user?.username,
                  firstname: user?.firstName,
                  lastname: user?.lastName,
                  email: user?.emailAddresses[0].emailAddress,
                  imageUrl: user?.imageUrl,
                  streak: storedStreak,
                  expoPushToken: expoPushToken
                }),
              }) 
        
              if (!response2.ok) {
                throw new Error('Failed to update user');
              }


        } catch (err) {
            setError("Fetching data unsuccessful");
            console.error("Error fetching assigned routines:", err);
        }
    };
    
    useEffect(() => {
        fetchAssignedRoutines();
    }, [isLoaded, user]);

    useEffect(() => {
        if (!routines) return;

        const query = search.toLowerCase();

        if (query.trim() === '') {
            setFilteredRoutines(null);
            return;
        }
    
        const filtered = routines?.filter(routine => {
            const routineNameMatch = routine.name?.toLowerCase().includes(query);
            const categoryMatch = routine.category?.toLowerCase().includes(query);
            const exerciseMatch = routine.exercises?.some((exercise: any) =>
                exercise.title?.toLowerCase().includes(query)
            );
    
            return routineNameMatch || categoryMatch || exerciseMatch;
        });
    
        setFilteredRoutines(filtered);
    }, [search, routines]);
    

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchAssignedRoutines();
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

    return (
        <LinearGradient style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? 50 : 0 }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
            <ScreenHeader title="Welcome" name={user?.username + '!'} logo={true} streak={true}/>
            <SearchBar round={true} containerStyle={{ backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0 }} inputContainerStyle={{ backgroundColor: AppColors.LightBlue }} placeholder='Search Routines/Categories' onChangeText={setSearch} value={search} />

            {/* Display each assigned routine */}
            {!routines && (
                <ScrollView style={{ flex: 1}}>  
                    <ThemedText style={{ alignSelf: 'center', color : 'black', paddingTop: 80}}>Loading Routines...</ThemedText>
                </ScrollView>
            )}
            {routines && routines.length === 0 && (
                <ScrollView style={{ flex: 1}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ThemedText style={{ alignSelf: 'center', color : 'black', paddingTop: 80}}>No Routines Assigned</ThemedText>
                </View>
                </ScrollView>)}
            {routines && routines.length > 0 && (
                
            <FlatList
                data={filteredRoutines ?? routines}
                keyExtractor={(item, index) => item._id["$oid"] || index.toString()}
                style={{ padding: 8, marginBottom: 80 }}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                renderItem={({ item: routine }) => (
                    
                    <View style={styles.routine}>
                        {}
                        <Text style={styles.routineTitle}>{capitalizeWords(routine.name)}</Text>

                        {/* Exercises within routine */}
                        <View style={styles.exerciseList}>
                            <FlatList
                                data={routine.exercises}
                                keyExtractor={(exercise, index) => exercise._id["$oid"] || index.toString()}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                renderItem={({ item: exercise }) => (
                                    
                                    <Link href={`/home/exerciseDetails?exerciseId=${exercise._id}`}>
                                        
                                        <View style={styles.exerciseItem}>

                                        <Image source={exercise.thumbnail_url? { uri: exercise.thumbnail_url } : require(`@/assets/images/default-thumbnail.png`)} style={styles.exerciseThumbnail} />
                                        <View style={styles.exerciseInfo}>
                                            <ThemedText style={styles.exerciseName}>{capitalizeWords(exercise.title)}</ThemedText>
                                            <ThemedText>
                                                <Text style={styles.exerciseDetails}>Reps: </Text> 
                                                {exercise.reps}
                                            </ThemedText>
                                            <ThemedText>
                                                <Text style={styles.exerciseDetails}>Sets: </Text>
                                                {exercise.sets}
                                            </ThemedText>
                                        </View>
                                        
                                        <Image source={require('@/assets/images/chevron-right.png')} style={{width: 20, height: 20}}/>
                                        
                                    </View>
                                    
                                    </Link>
                                    
                                )}
                            />
                        </View>
                    </View>
                    
                )}
            />
            )}
            
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
        marginVertical: 0,
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
        paddingVertical: 5,
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


