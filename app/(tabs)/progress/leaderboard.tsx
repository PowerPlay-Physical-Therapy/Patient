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
    const [patients, setPatients] = useState<Patient[]>([]);

    useEffect(() => {
        const fetchData = async () =>{
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/patient/get_all_patients`)

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log("Fetched data:", data);
            setPatients(data);
    }
    fetchData();
}, [])

    const sortedPatients = patients.sort((a: Patient, b: Patient) => b.streak - a.streak);

    return (
        <LinearGradient style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? 50 : 0 }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
            <FlatList 
            data={sortedPatients}
            keyExtractor={(index) => index.toString()}
            style={{ padding: 8, marginBottom: 80 }}
            renderItem={({ item: patient, index }) => (
            
                    <View key={patient._id} style={styles.patientCard}>
                        <View style= {{flexDirection: 'row', alignItems: 'center', width: '30%', justifyContent: 'space-between'}}>
                        <ThemedText style={{fontWeight: 'bold'}}>{index + 1}</ThemedText>
                        <Image source={{ uri: patient.imageUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                        <ThemedText style={styles.patientName}>
                            {patient.firstname} {patient.lastname}
                        </ThemedText>
                        </View>
                        <Streak usedbStreak={true} dbStreak={patient.streak}/>
                    </View>
                
            )}
            />
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    patientCard: {
        flexDirection: 'row',
        marginBottom: 10,
        padding: 10,
        backgroundColor: AppColors.OffWhite,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    patientName: {
        fontSize: 18,
        fontWeight: 'bold',
    },

})