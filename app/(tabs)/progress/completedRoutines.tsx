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

export default function CompletionHistory() {
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

   const fetchCompletedRoutines = async () => {
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


        } catch (err) {
            setError("Fetching data unsuccessful");
            console.error("Error fetching completed routines:", err);
        }
    };
    
    useEffect(() => {
        fetchCompletedRoutines();
    }, [isLoaded, user]);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchCompletedRoutines();
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


