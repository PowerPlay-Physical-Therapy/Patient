
import { AppColors } from "@/constants/Colors";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function MessageLayout() {
    const params = useGlobalSearchParams();
    const therapistId = params.therapistId;
    // Extract the ID portion if it's a full user ID format
    const [therapistName, setTherapistName] = useState<any | null>(null);

    useEffect(() => {
        if (params) {
            try {
                if (params.therapistId) {
                    setTherapistName(params.therapistName);
                }
            } catch (e) {
                console.error('Invalid chat param', e);
            }
        }
    }, [params]);

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="[chat]" options={{ headerShown: true, headerStyle: {
                    backgroundColor: AppColors.OffWhite,
                }, headerBackTitle: "Messages", headerTitle: therapistName ?? 'Chat'}} />
            <Stack.Screen name="video" options={{
                headerStyle: {
                    backgroundColor: AppColors.OffWhite,
                },
                headerBackTitle: 'Chat',
                headerShown: true,
                title: "Video",

            }} />
            <Stack.Screen name="routineDetails" options={{ headerShown: true, headerBackTitle: 'Chat', title: 'Routine Detail' }} />
        </Stack>
    );
}