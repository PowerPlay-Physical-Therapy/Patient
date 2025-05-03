import { LinearGradient } from "expo-linear-gradient";
import { AppColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { Platform, View, StyleSheet, Image, FlatList } from "react-native";
import { useEffect, useState } from "react";
import Streak from "@/components/streak";

type Patient = {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    custom_routines: string[];
    custom_exercises: string[];
    imageUrl: string;
    streak: number;
}

export default function LeaderboardScreen() {
    const [patients, setPatients] = useState<Patient[] | null>(null);
    const [topThreePatients, setTopThreePatients] = useState<Patient[] | null>(null);
    const [restOfPatients, setRestOfPatients] = useState<Patient[]| null>(null);

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/patient/get_all_patients`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            console.log("Fetched data:", data);

            // Sort patients by streak
            const sortedPatients = data.sort((a: Patient, b: Patient) => b.streak - a.streak);

            // Update states directly
            setPatients(sortedPatients);
            setTopThreePatients(sortedPatients.slice(0, 3));
            setRestOfPatients(sortedPatients.slice(3));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    
    return (
        <LinearGradient style={{ flex: 1 }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
            {topThreePatients && topThreePatients.length > 0 && (
            <View>
            <View style={styles.topContainer}>
            <View style={styles.patientCard}>
                        <View style= {{flexDirection: 'row', alignItems: 'center', width: '30%', justifyContent: 'space-between'}}>
                        <Image source={require(`@/assets/images/1.png`)} style={{ width: 50, height: 50, borderRadius: 25 }} />
                        <Image source={{ uri: topThreePatients[0].imageUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                        <ThemedText style={styles.patientName}>
                            {topThreePatients[0].firstname} {topThreePatients[0].lastname}
                        </ThemedText>
                        </View>
                        <Streak usedbStreak={true} dbStreak={topThreePatients[0].streak}/>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.patientCard}>
                        <View style= {{flexDirection: 'row', alignItems: 'center', width: '30%', justifyContent: 'space-between'}}>
                        <Image source={require(`@/assets/images/2.png`)} style={{ width: 50, height: 50, borderRadius: 25 }} />
                        <Image source={{ uri: topThreePatients[1].imageUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                        <ThemedText style={styles.patientName}>
                            {topThreePatients[1].firstname} {topThreePatients[1].lastname}
                        </ThemedText>
                        </View>
                        <Streak usedbStreak={true} dbStreak={topThreePatients[1].streak}/>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.patientCard}>
                        <View style= {{flexDirection: 'row', alignItems: 'center', width: '30%', justifyContent: 'space-between'}}>
                        <Image source={require(`@/assets/images/3.png`)} style={{ width: 50, height: 50, borderRadius: 25 }} />
                        <Image source={{ uri: topThreePatients[2].imageUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                        <ThemedText style={styles.patientName}>
                            {topThreePatients[2].firstname} {topThreePatients[2].lastname}
                        </ThemedText>
                        </View>
                        <Streak usedbStreak={true} dbStreak={topThreePatients[2].streak}/>
                    </View>
                    
            </View>
            <FlatList 
            data={restOfPatients}
            keyExtractor={(item, index) => item._id}
            style={{ padding: 8, minHeight: '100%', paddingBottom: 80 }}
            renderItem={({ item: patient, index }) => (
            
                    <View key={patient._id} style={styles.patientCard2}>
                        <View style= {{flexDirection: 'row', alignItems: 'center', width: '30%', justifyContent: 'space-between'}}>
                        <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>
                            {index + 4}.
                        </ThemedText>
                        <Image source={{ uri: patient.imageUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                        <ThemedText style={styles.patientName}>
                            {patient.firstname} {patient.lastname}
                        </ThemedText>
                        </View>
                        <Streak usedbStreak={true} dbStreak={patient.streak}/>
                    </View>
                
            )}
            />
            </View>)}
            
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    topContainer: {
        alignItems: "center",
        flexDirection: 'column',
        justifyContent: "space-between",
        margin: 20,
        marginTop: 10,
        marginBottom: 10,
        padding: 8,
        backgroundColor: AppColors.OffWhite,
        borderRadius: 20,
    },
    patientCard: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    patientCard2: {
        flexDirection: 'row',
        paddingHorizontal:20,
        paddingVertical: 12,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    patientName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    line: {
        height: 1,
  backgroundColor: 'lightgrey',
  marginVertical: 10,
  width: '90%',
  alignSelf: 'center',
    }

})