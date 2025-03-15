import { AppColors } from "@/constants/Colors";
import { Card } from "@rneui/base";
import React from "react"
import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoutineDetails(){

    const routine = require('@/assets/Exercises.json');

    return(
        <SafeAreaView>
            <View style={{backgroundColor: AppColors.White}}>
                <ScrollView horizontal={true}>
                    {routine[0]["subcategory"][0]["exercises"].map((exercise)=>(
                        <Card>
                            <Card.Title>{exercise.name}</Card.Title>
                            <Card.Divider/>
                            <Card.Image source={exercise.thumbnail_url}/>
                            <View >
                                <Text>{exercise.reps}</Text>
                                <Text>{exercise.hold}</Text>
                                <Text>{exercise.sets}</Text>
                                <Text>{exercise.frequency}</Text>
                            </View>
                            <View>
                                <Text>
                                    {exercise.description}
                                </Text>
                            </View>
                        </Card>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
        
    );
}