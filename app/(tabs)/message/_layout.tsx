
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function MessageLayout() {
    const { chat } = useLocalSearchParams<{ chat: string }>();
    // const socket = io(`${EXPO_PUBLIC_BACKEND_URL}/common/chat` );
    const [therapistName, setTherapistName] = useState<string | null>(null);

    useEffect(() => {
        if (chat) {
            try {
                const parsed = JSON.parse(chat);
                if (parsed.therapistId) {
                    setTherapistName(parsed.therapistName);
                }
            } catch (e) {
                console.error('Invalid chat param', e);
            }
        }
    }, [chat]);
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="[chat]" options={{ headerShown: true, headerBackTitle: "messages", headerTitle: therapistName ?? 'Chat'}} />
        </Stack>
    );
}