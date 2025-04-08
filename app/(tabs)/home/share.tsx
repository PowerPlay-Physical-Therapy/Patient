import {
  View,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  TextInput
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useEvent } from "expo";
import * as FileSystem from "expo-file-system";
import { router, useRouter } from "expo-router";
import aws from 'aws-sdk'

const region = "us-east-2"
const bucketName = "powerplaypatientvids"
const accessKeyId = process.env.EXPO_PUBLIC_AWS_KEY
const secretAccessKey = process.env.EXPO_PUBLIC_AWS_SECRET_KEY

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
})

async function generateUploadURL() {
  const imageName = `${Date.now()}.mov`;

  const params = ({
    Bucket: bucketName,
    Key: imageName,
    Expires: 60
  })
  
  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  return {uploadURL}
}

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const RadioButton = ({
  selected,
  onPress,
  label,
}: {
  selected: boolean;
  onPress: () => void;
  label: string;
}) => {
  return (
    <TouchableOpacity style={styles.radioButtonContainer} onPress={onPress}>
      <View
        style={[styles.radioButton, selected && styles.radioButtonSelected]}
      />
      <ThemedText style={styles.radioLabel}>{label}</ThemedText>
    </TouchableOpacity>
  );
};

export default function Share() {
  const local = useLocalSearchParams();
  const uri = local.videoUri.toString();
  const thumbnail = local.thumbnailUri.toString();
  const { user, isLoaded } = useUser();
  const userId = String(user?.id);
  const [therapists, setTherapists] = useState<any[]>([]);
  const [selectedTherapists, setSelectedTherapists] = useState<any[]>([]);
  const router = useRouter();
  const [text, onChangeText] = useState("");

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
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setTherapists(data.connections);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTherapists();
  }, []);

  const triggerTherapist = (therapist: any) => {
    if (selectedTherapists.includes(therapist._id)) {
      setSelectedTherapists(
        selectedTherapists.filter((id) => id !== therapist._id)
      );
    } else {
      setSelectedTherapists([...selectedTherapists, therapist._id]);
    }
  };

  const handleUpload = async () => {

    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (!fileInfo.exists) {
      throw new Error("File does not exist at the specified URI");
    }

    const video = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("pressed")
    const binaryData = Uint8Array.from(atob(video), (char) =>
      char.charCodeAt(0)
    );
    
    const url = await generateUploadURL();
    console.log("uploadUrl", url.uploadURL)
    
    
    const response = await fetch(url.uploadURL, {
      method: "PUT",
      headers: {
        "Content-Type": "video/quicktime",
      },
      body: binaryData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload video to S3");
    }

    console.log("✅ Video uploaded!");
    router.push('/home')
  };

  return (
    <LinearGradient
      style={{ flex: 1, paddingTop: Platform.OS == "ios" ? 100 : 0 }}
      colors={[AppColors.OffWhite, AppColors.LightBlue]}
    >
      <View style={styles.container}>
        <TextInput returnKeyType="done" editable multiline numberOfLines={4} maxLength={120} style={{ color: "gray", width: screenWidth * 0.6, height: screenHeight * 0.12}} onChangeText={onChangeText} value={text} placeholder="Add Description"/>
        <View
          style={{
            height: screenHeight * 0.12,
            width: screenWidth * 0.2,
            borderWidth: 1,
            borderRadius: 4,
          }}
        >
          <View style={{position: "absolute", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", zIndex: 1 }}>
          <ThemedText style={{fontSize: 10, color: 'white', }}>Video Preview</ThemedText>
          </View><Image source={{ uri: thumbnail }} style={{borderRadius: 4, width: "100%", height: "100%", zIndex: -1 }} />
        </View>
      </View>
      <ScrollView style={{ maxHeight: screenHeight * 0.54 }}>
        {therapists.map((therapist) => (
          <View
            style={{
              flexDirection: "row",
              padding: 40,
              justifyContent: "space-between",
              alignContent: "center",
            }}
            key={therapist._id}
          >
            <ThemedText>{therapist.username}</ThemedText>
            <RadioButton
              key={therapist._id}
              label={""}
              selected={selectedTherapists.includes(therapist._id)}
              onPress={() => triggerTherapist(therapist)}
            />
          </View>
        ))}
      </ScrollView>

      <Link href={`/home`} style={{ width: "100%", marginBottom: 12 }}>
        <ThemedText
          style={{ textAlign: "center", width: "100%", color: AppColors.Blue }}
        >
          I don't want to send this video
        </ThemedText>
      </Link>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: screenWidth,
        }}
      >
        <Link
          dismissTo
          href={`/home/recording?exerciseId=${local.exerciseId}`}
          style={{
            backgroundColor: "white",
            width: screenWidth * 0.4,
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <ThemedText style={{ fontWeight: "bold", textAlign: "center" }}>
            Back
          </ThemedText>
        </Link>
        <LinearGradient
          colors={[AppColors.Purple, AppColors.Blue]}
          style={styles.button}
        >
          <TouchableOpacity
            onPress={() => {
              handleUpload();
            }}
          >
            {/*change reoute*/}
            <ThemedText style={styles.buttonText}>Next</ThemedText>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingLeft: 40,
    
    borderBottomColor: "white",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
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
