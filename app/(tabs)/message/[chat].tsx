import { ThemedText } from "@/components/ThemedText";
import { AppColors } from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
    Image,
    Platform,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";

export default function ChatMessagesScreen() {
    const { user } = useUser();
    const { patientId, therapistId } = useLocalSearchParams();
    const [chatHistory, setChatHistory] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessage, setNewMessage] = useState(false);
    const [focused, setFocused] = useState(false);  

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch(
                    `${process.env.EXPO_PUBLIC_BACKEND_URL}/messages/${patientId}/${therapistId}`
                );
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setChatHistory(data);
                setNewMessage(false)
            } catch (error) {
                console.error("Error Fetching Connections", error);
            }
        };
        fetchChatHistory();
    }, [newMessage,]);

    const onMessageSend = (message: string) => {
        const sendingMessage = message;
        setMessage("");
        const sendMessage = async (sendingMessage) => {
            try {
                const response = await fetch(
                    `${process.env.EXPO_PUBLIC_BACKEND_URL}/message/${patientId}/${therapistId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: sendingMessage,
                            type: "text",
                        }),
                    }
                );

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                console.log("Fetched data:", data.message, "message ID", data.message_id);
                setNewMessage(true);
            } catch (error) {
                console.error("Error Fetching Connections", error);
            }
        };
        sendMessage(sendingMessage);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
            <LinearGradient style={{ flex: 1 }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 140 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {chatHistory.map((item) => {
                            const isSender = item["sender_id"] === patientId;
                            const isRoutine = item["type"] === "routine";
                            const isFeedback = item["type"] === "feedback";

                            return (
                                <View
                                    key={item["_id"]}
                                    style={[
                                        styles.bubble,
                                        isSender ? styles.bubbleSender : styles.bubbleReceiver,
                                    ]}
                                >
                                    {isRoutine ? (
                                        // <View style = {{flex: isSender? 'row' : 'reverse-row'}}>
                                            <TouchableOpacity onPress={() => {
                                                router.push(`/(tabs)/message/routineDetails?routineId=${JSON.stringify(item?.message.routine_id)}`)
                                            }}>
                                                <Image
                                                    style={styles.image}
                                                    source={{ uri: item?.message?.thumbnail }}
                                                />
                                                <View style={{ flexDirection: 'row', paddingTop: 2 }}>
                                                    <ThemedText style={{ color: 'white' }}> More Info </ThemedText>
                                                    <Image style={{
                                                        width: 20,
                                                        height: 20,
                                                        tintColor: 'white'
                                                    }}
                                                        source={require("@/assets/images/info.png")} />
                                                </View>

                                            </TouchableOpacity>
                                        // </View>
                                        
                                    ) : isFeedback ? (
                                            <TouchableOpacity onPress={()=>{
                                                router.push(`/(tabs)/message/video?videoLink=${item?.message.video_url}`)
                                            }} >
                                                <Image
                                                    style={styles.image}
                                                    source={{ uri: item?.message?.thumbnail }}
                                                />
                                            </TouchableOpacity>
                                        
                                    ) : (
                                        <ThemedText style={styles.bubbleText}>{item["message"]}</ThemedText>
                                    )}
                                </View>
                            );
                        })}
                    </ScrollView>

                    <View style={[styles.inputContainer,( focused? { position: "absolute", bottom: 36, width: "100%" } : { position: "absolute", bottom: 80, width: "100%" }) ]}>
                        <TextInput
                            style={styles.input}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Message..."
                            placeholderTextColor="#888"
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                        />
                        <TouchableOpacity onPress={() => onMessageSend(message)}>
                            <Image
                                source={require("@/assets/images/send.png")}
                                style={styles.sendIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    bubble: {
        maxWidth: "80%",
        padding: 10,
        borderRadius: 20,
        marginBottom: 12,
    },
    bubbleSender: {
        alignSelf: "flex-end",
        backgroundColor: AppColors.BlueGray,
        borderBottomRightRadius: 5,
    },
    bubbleReceiver: {
        alignSelf: "flex-start",
        backgroundColor: AppColors.Blue,
        borderBottomLeftRadius: 5,
    },
    bubbleText: {
        color: "white",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 15,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: AppColors.LightBlue,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        backgroundColor: AppColors.BlueGray,
        color: "black",
    },
    sendIcon: {
        width: 35,
        height: 35,
        tintColor: AppColors.Blue,
        marginLeft: 10,
    },
});
