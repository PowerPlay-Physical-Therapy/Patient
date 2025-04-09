
import { AppColors } from "@/constants/Colors";
import { Stack } from "expo-router";


export default function ExploreLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown:false}}></Stack.Screen>
            <Stack.Screen name="routineDetails" options={{ 
                headerShown: true, headerBackTitle:'Explore', title:'Routine Detail',
                headerStyle: {
                    backgroundColor: AppColors.OffWhite,
                },
                }}/>
            <Stack.Screen name="video" options={{
                        headerShown: false,
                        title: "Video",
                      }}/>
        </Stack>
    );
}