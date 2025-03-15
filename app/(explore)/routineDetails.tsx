import ScreenHeader from "@/components/ScreenHeader";
import { ThemedText } from "@/components/ThemedText";
import { AppColors } from "@/constants/Colors";
import { Card } from "@rneui/base";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React, { useState } from "react"
import { ScrollView, View, Text, Platform, Dimensions, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window")

export default function RoutineDetails() {

    // const [routine,setRoutine] = useState(null);

    const routine = require('@/assets/Exercises.json');
    const handleAddRoutine = () => {
        //TO-DO: Complete the function
        console.log(1)
    }

    return (
        <SafeAreaView>
            <LinearGradient style={{ height: height }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
                <View style={{ alignItems: "center", width: width }}>
                    <ScreenHeader title="Routine Information" />
                    <ScrollView
                        horizontal={true}
                        decelerationRate={0}
                        snapToInterval={width * 0.925} //your element width
                        snapToAlignment={"center"}>
                        {routine[0]["subcategory"][0]["exercises"].map((exercise) => (
                            <View key={exercise.name} style={{}}>
                                <Card containerStyle={{ width: width * 0.9, borderRadius: 15, shadowOffset: { height: 0.2, width: 0.2 }, shadowRadius: 3, shadowOpacity: 0.7 }}>
                                    <Card.Title style={{ fontSize: 20 }}>{exercise.name}</Card.Title>
                                    <Card.Divider />
                                    <Card.Image source={{ uri: exercise.thumbnail_url }} style={{ resizeMode: 'center', borderRadius: 15 }} containerStyle={{ borderRadius: 15, shadowOffset: { height: 0.5, width: 0.5 }, shadowRadius: 3, shadowOpacity: 0.7 }} />
                                    <View style={{ flexDirection: "row", justifyContent: 'space-between', }}>
                                        <View style={{}}>
                                            <Text style={{ fontSize: 20 }}><Text style={{ fontWeight: "bold" }}>Reps : </Text>{exercise.reps}</Text>
                                            <Text style={{ fontSize: 20 }}><Text style={{ fontWeight: "bold" }}>Hold : </Text>{exercise.hold} sec</Text>
                                        </View>
                                        <View style={{}}>
                                            <Text style={{ fontSize: 20 }}><Text style={{ fontWeight: "bold" }}>Sets: </Text>{exercise.sets}</Text>
                                            <Text style={{ fontSize: 20 }}><Text style={{ fontWeight: "bold" }}>Frequency : </Text>{exercise.frequency} / week</Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>Description : </Text>
                                    <ScrollView>
                                        <Text style={{ fontSize: 18 }} >
                                            {exercise.description}
                                        </Text>
                                    </ScrollView>
                                    <View style={{ alignItems: "center", marginTop: 5 }}>
                                        <LinearGradient
                                            colors={[AppColors.Purple, AppColors.Blue]}
                                            style={styles.button}
                                        >
                                            <TouchableOpacity
                                                style={styles.buttonInner}
                                                onPress={() => { console.log("VideoPlay") }}
                                            >
                                                <ThemedText style={styles.buttonText}>Watch Video</ThemedText>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                    </View>

                                </Card>
                            </View>
                        ))}
                    </ScrollView>
                    <LinearGradient
                        colors={[AppColors.Purple, AppColors.Blue]}
                        style={[styles.button, { margin: 10 }]}
                    >
                        <TouchableOpacity
                            style={styles.buttonInner}
                            onPress={handleAddRoutine}
                        >
                            <ThemedText style={styles.buttonText}>Add</ThemedText>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </LinearGradient>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    buttonInner: {
        padding: 12,
        alignItems: 'center',
        borderRadius: 20,
    },
    buttonText: {
        fontWeight: 'bold',
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