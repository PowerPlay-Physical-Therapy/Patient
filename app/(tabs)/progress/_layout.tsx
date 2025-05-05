
import { Stack } from "expo-router";
import { AppColors } from "@/constants/Colors";

export default function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="leaderboard" options={{headerStyle: {
                          backgroundColor: AppColors.OffWhite,
                        },
                        headerBackTitle: 'Back',
                        headerShown: true,
                        title: "Leaderboard",
                      }} />
        </Stack>
    );
}