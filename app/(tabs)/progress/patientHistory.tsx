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
import { BarChart } from 'react-native-chart-kit';
import { set } from 'date-fns';

const {height, width }= Dimensions.get('window');
export default function CompletionHistory() {
    const { isSignedIn } = useAuth()
    const router = useRouter();
    const [patientName, setPatientName] = useState<string | null>(null);
    const [routines, setRoutines] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [exercises, setExercises] = useState<any[]>([]);
    const { user, isLoaded } = useUser();
    const [patientId, setPatientId] = useState<string | null>(user?.id ||null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isTabVisible, setIsTabVisible] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedTab, setSelectedTab] = useState<'routines' | 'exercises'>('routines');
    const [graphData, setGraphData] = useState<{ last_7_days: any[] }>({ last_7_days: [] });
    const [chartData, setChartData] = useState<any>(null);
    const [segments, setSegments] = useState(0);
    
    const fetchGraphData = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/get_graph_data/${patientId}`);
            var data = await response.json();
            setGraphData(data);
        } catch (error) {
            console.error('Error fetching graph data:', error);
        }

        const routinesData = data.last_7_days.map(item => item.routines_count);
        const exercisesData = data.last_7_days.map(item => item.exercises_count);
        const labels = data.last_7_days.map(item => item.date.slice(5));

        const currentData = selectedTab === 'routines' ? routinesData : exercisesData;
        const maxValue = Math.max(...currentData, 0);
        const segments = maxValue > 0 ? maxValue : 1;

        const chartData = {
        labels,
        datasets: [
            {
                data: currentData,
            }
        ],
    };
        setChartData(chartData);
        setSegments(segments);
    };

    
    

   const fetchCompletedRoutinesandExercises = async () => {
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
            // Fetch completed routines
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/patient/get_completed_routines/${patientId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            // Throw an error if the response is not successful
            if (!response.ok) {
                throw new Error(`Failed to fetch completed routines. Status: ${response.status}`);
            }

            // Parse the response as JSON
            const data = await response.json();
            console.log("Fetched data:", data);
            setRoutines(data);

            const response2 = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/patient/get_completed_exercises/${patientId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            // Throw an error if the response is not successful
            if (!response2.ok) {
                throw new Error(`Failed to fetch completed routines. Status: ${response2.status}`);
            }

            // Parse the response as JSON
            const data2 = await response2.json();
            console.log("Fetched exercises:", data2);
            setExercises(data2);

        } catch (err) {
            setError("Fetching data unsuccessful");
            console.error("Error fetching completed exercises:", err);
        }
    };
    
    useEffect(() => {
        fetchCompletedRoutinesandExercises();
    }, [isLoaded, user]);

    useEffect(() => {
        fetchGraphData();
    }, [graphData, selectedTab]);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchCompletedRoutinesandExercises();
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
        <LinearGradient style={{ flex: 1 }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.graphContainer}>
                        {chartData && (
                            <BarChart
                            data={chartData}
                            width={width - 32}
                            height={215}
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => AppColors.Blue,
                                fillShadowGradient: AppColors.Blue,
                                fillShadowGradientOpacity: 1,
                                style: {
                                    borderRadius: 25
                                },
                                barPercentage: 0.5,
                                propsForLabels: {
                                    fontSize: 10
                                }
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                            yAxisLabel=""
                            yAxisSuffix=""
                            showBarTops={true}
                            withInnerLines={false}
                            withVerticalLabels={true}
                            withHorizontalLabels={true}
                            segments={segments}
                        />
                        )}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity style={[styles.tab, selectedTab === 'routines' && styles.activeTab]} onPress={() => setSelectedTab('routines')}>
                            <Text style={selectedTab === 'routines' ? styles.activeTabText : styles.tabText}>Routines</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tab, selectedTab === 'exercises' && styles.activeTab]} onPress={() => setSelectedTab('exercises')}>
                            <Text style={selectedTab === 'exercises' ? styles.activeTabText : styles.tabText}>Exercises</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                {selectedTab === 'routines' ? (
                <View style={styles.cardsContainer}>
                    {routines.map((routine, index) => (
                        <View key={index} style={styles.card}>
                            <View style={styles.mainContent}>
                                <Text style={styles.name}>{routine.name}</Text>
                                <Text style={styles.name}>
                                    {routine.date}
                                </Text>
                            </View>
                            <View style={styles.buttons}>
                        
                            </View>
                        </View>
                    ))}
                </View>): 
                <View style={styles.cardsContainer}>
                {exercises.map((exercise, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.mainContent}>
                            <Text style={styles.name}>{exercise.category}</Text>
                            
                            <Text style={styles.name}>
                                {exercise.date}
                            </Text>
                        </View>
                        <View style={styles.buttons}>
                            <Text style={styles.name}>
                                {exercise.title}
                            </Text>
                        </View>
                    </View>
                ))}
            </View> }
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
    container: {
        marginBottom: 100
    },
    graphContainer: {
        padding: 16,
    },
    graphPlaceholder: {
        height: 200,
        backgroundColor: 'white',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    graphText: {
        fontSize: 16,
        color: '#666',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 16,
    },
    activeTab: {
        backgroundColor: 'white',
    },
    tabText: {
        color: '#666',
    },
    activeTabText: {
        color: AppColors.Blue,
        fontWeight: '600',
    },
    cardsContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    mainContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    status: {
        fontSize: 14,
        fontWeight: '500',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    onTrack: {
        backgroundColor: '#e6f4ea',
        color: '#1e8e3e',
    },
    offTrack: {
        backgroundColor: '#fce8e6',
        color: '#d93025',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    nudgeButton: {
        flex: 1,
        backgroundColor: AppColors.Blue,
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    viewButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
        paddingHorizontal: 8,
    },
    viewButtonText: {
        color: AppColors.Blue,
        fontSize: 14,
        fontWeight: '500',
    },
    chevronIcon: {
        width: 16,
        height: 16,
        tintColor: AppColors.Blue,
    },

    buttonInner: {
        padding: 5,
        alignItems: 'center',
        borderRadius: 20,
    },
    buttonText: {
        fontWeight: 'medium',
        color: 'white',
    },
    button: {
        borderRadius: 25,
        width: '50%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});


