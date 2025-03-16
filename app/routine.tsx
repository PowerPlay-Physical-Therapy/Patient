import { useEffect, useState } from 'react';
import { Link, useRouter } from "expo-router";
import * as React from 'react';
import { Text, Button, View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
// import { FlatList } from 'react-native-gesture-handler';

const API_BASE_URL = "http://127.0.0.1:8000";
const GET_PATIENT_URL = `${API_BASE_URL}/Patients/get_patient_by_id_patient_get_patient__get`;
const GET_PATIENT_ROUTINES_URL = (id: string) => `${API_BASE_URL}/Common/get_patient_routine_by_id_get_patient_routine__get/${id}`;
const GET_EXERCISES_URL = (routineId: string) => `${API_BASE_URL}/Common/get_exercise_by_id_get_exercise__exercise_id__get/${routineId}`;

export default function PatientInfo() {
    const router = useRouter();
    const [patientData, setPatientData] = useState<string | null>(null);
    const [patientName, setPatientName] = useState<string | null>(null);
    const [routines, setRoutines] = useState<any[]>([]);
    const [exercises, setExercises] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchPatientData = async() => {
        try {
          const patientResponse = await fetch(GET_PATIENT_URL);
          if (!patientResponse.ok) {
            throw new Error("Failed to fetch patient");
          }
          const patient = await patientResponse.json();

          setPatientName(patient.name || "Patient");

          const routinesResponse = await fetch(GET_PATIENT_ROUTINES_URL(patient._id));
          if (!routinesResponse.ok) {
            throw new Error("Failed to fetch routines");
          }
          const routinesData = await routinesResponse.json();

          const exercisesInRoutine = await Promise.all(
            routinesData.map(async (routine: any) => {
              const exercisesResponse = await fetch(GET_EXERCISES_URL(routine._id));
              const exercisesData = await exercisesResponse.json();
              return { ...routine, exercises: exercisesData };
            })
          );
          setRoutines(exercisesInRoutine);
          // if (patient) {
          //     setPatientData(patient);
          // } else {
          //     throw new Error("Patient was not found");
          // }

          // if (patientRoutines) {
          //     setRoutines(patientRoutines);
          // }
        } catch (err) {
          setError("Fetching data unsuccessful");
          console.error("Error fetching data", err);
        }
      };
      fetchPatientData();
}, []);

if (error) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
}

return (
    <ThemedView style={{ flex: 1, padding: 20, backgroundColor: "#ffffff" }}>
        <View style={{ marginBottom: 20 }}>
            <ThemedText style={styles.text}>
              Welcome, {patientName}!
            </ThemedText>
        </View>

        <FlatList
          data={routines}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => (
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
            
              <FlatList
                data={item.exercises}
                keyExtractor={(exercise) => exercise._id}
                renderItem={({ item: exercise }) => (
                  <View style={styles.routineList}>

                    <Image source={{ uri: exercise.thumbnail_url }} style={{ width: 50, height: 50, borderRadius: 5 }} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{exercise.name}</Text>
                      <Text>Reps: {exercise.reps}</Text>
                      <Text>Sets: {exercise.sets}</Text>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
        />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  buttonInner: {
    padding: 12,
    alignItems: "center",
    borderRadius: 20,
  },

  buttonText: {
    fontWeight: "bold",
  },

  text: {
  fontSize: 24, 
  fontWeight: "bold",
  },

  routineList: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
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

