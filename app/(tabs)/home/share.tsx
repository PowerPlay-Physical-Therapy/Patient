import {
  View,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useEvent } from 'expo';
import Video from 'react-native-video';


const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const RadioButton = ({ selected, onPress, label }: { selected: boolean; onPress: () => void; label: string }) => {
    return (
      <TouchableOpacity style={styles.radioButtonContainer} onPress={onPress}>
        <View style={[styles.radioButton, selected && styles.radioButtonSelected]} />
        <ThemedText style={styles.radioLabel}>{label}</ThemedText>
      </TouchableOpacity>
    );
  };

export default function Share() {
    const local = useLocalSearchParams();
    const uri = String(local.videoUri);
    const {user, isLoaded} = useUser();
    const userId = String(user?.id);
    const [therapists, setTherapists] = useState<any[]>([]);
    const [selectedTherapists, setSelectedTherapists] = useState<any[]>([]);


  useEffect(() => {
    const fetchTherapists = async () => {
        try {
            const response = await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/patient/get_patient/?patient_id=${userId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
            );
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            const data = await response.json();
            setTherapists(data.connections);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    fetchTherapists();
  }, []);

  const triggerTherapist = (therapist : any) => {
    if (selectedTherapists.includes(therapist._id)) {
        setSelectedTherapists(selectedTherapists.filter((id) => id !== therapist._id));
    } else {
        setSelectedTherapists([...selectedTherapists, therapist._id]);
    }
    
  }
  
  return (
    <LinearGradient
      style={{ flex: 1, paddingTop: Platform.OS == "ios" ? 100 : 0,  }}
      colors={[AppColors.OffWhite, AppColors.LightBlue]}
    >
        
      <View style={styles.container}>
        <ThemedText style={{ color: "gray" }}>Add Description</ThemedText>
        <View style={{height:screenHeight * 0.12, width: screenWidth* 0.2, borderWidth: 1, borderRadius: 4}}>
            <ThemedText>Video Preview</ThemedText>
        </View>
      </View>
      <ScrollView style={{maxHeight: screenHeight * 0.54}}>
        {therapists.map((therapist) => (
            <View style={{flexDirection: 'row', padding: 40, justifyContent: "space-between", alignContent: 'center' }} key={therapist._id}>
                <ThemedText>{therapist.username}</ThemedText>
                <RadioButton
                key={therapist._id}
                label={""}
                selected={selectedTherapists.includes(therapist._id)}
                onPress={() => triggerTherapist(therapist)}/>
            </View>
        ))}
      </ScrollView>

      <Link href={`/home`} style={{width: "100%", marginBottom: 12}}>
        <ThemedText style={{textAlign: 'center', width: '100%', color: AppColors.Blue}}>I don't want to send this video</ThemedText>
      </Link>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: screenWidth,
          
        }}
      >
        <Link dismissTo href={`/home/recording?exerciseId=${local.exerciseId}`} style={{
            backgroundColor: "white",
            width: screenWidth * 0.4,
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
          }}>
          <ThemedText style={{ fontWeight: "bold", textAlign:"center" }}>Back</ThemedText>
        </Link>
        <LinearGradient
          colors={[AppColors.Purple, AppColors.Blue]}
          style={styles.button}
        >
          <Link href={"/home"} style={styles.buttonInner}>
            {" "}
            {/*change reoute*/}
            <ThemedText style={styles.buttonText}>Next</ThemedText>
          </Link>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonInner: {
    padding: 12,
    alignItems: "center",
    borderRadius: 4,
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  button: {
    borderRadius: 8,
    width: screenWidth * 0.4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: AppColors.Blue,
  },
  radioLabel: {
    fontSize: 16,
  },
});
