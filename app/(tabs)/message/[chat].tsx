import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";

export default function ChatMessagesScreen() {
    const { chat } = useLocalSearchParams<{ chat: string }>();
    return (
            <ThemedText>HEllo Message from {chat}</ThemedText>
    );
}