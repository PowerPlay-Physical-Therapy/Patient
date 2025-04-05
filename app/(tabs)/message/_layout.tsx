
import { Stack, useLocalSearchParams } from "expo-router";

export default function MessageLayout() {
    const { chat } = useLocalSearchParams<{ chat: string }>();
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="[chat]" options={{ headerShown: true, headerBackTitle: "messages", headerTitle: chat}} />
        </Stack>
    );
}