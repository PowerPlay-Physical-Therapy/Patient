import { ThemedText } from "@/components/ThemedText";
import { AppColors } from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { Icon } from "@rneui/base";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { Image, FlatList, Platform, View, Dimensions, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView } from "react-native";
import { io } from "socket.io-client";

const { height, width } = Dimensions.get("window")

export default function ChatMessagesScreen() {
    const { user } = useUser();
    const { chat } = useLocalSearchParams<{ chat: string }>();
    // const socket = io(`${EXPO_PUBLIC_BACKEND_URL}/common/chat` );
    const { patientId, therapistId} = JSON.parse(chat);
    const [chatHistory, setChatHistory] = useState([])
    const [message, setMessage] = useState("");
    const [notification, setNotification] = useState(null);
    const [routine,setRoutine] = useState([]);
    const [routineThumbnail, setRoutineThumbnail] = useState< string| null>()

    useEffect(() =>  {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/messages/${patientId}/${therapistId}`, {
                    method: 'GET'
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                // console.log("Chat History:",data);
                setChatHistory(data);
            } catch (error) {
                console.error("Error Fetching Connections", error);
            }
        };
        fetchChatHistory();
    },[])

    const showNotification = () => {
        setNotification({ message: "Adding New Routine!!", type: "info" });

        // Auto-hide after 3 seconds
        setTimeout(() => setNotification(null), 3000);
    };

    function getRoutineData(routineID: any){

    }

    function handleAddRoutine(routineID: string){
        showNotification();
        // Toast.show({ text1: "Hello", type: "success" })
        console.log("Check Check ", routineID)
        const writeData = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/patient/update_assigned_routines/${user?.id}/${routineID}`, {
                    method: 'PUT'
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                console.log("Fetched data:", data);
                // router.back();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        writeData();
    }

    return (
        <LinearGradient style= {{ flex: 1}} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
            <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                <FlatList
                    // contentContainerStyle = {{ height: "95%"}}
                    data = {chatHistory}
                    keyExtractor={(item) => item["_id"]}
                    renderItem={({item}) =>(
                        item["sender_id"] === patientId ? (
                                <View style={{ justifyContent: "flex-end", alignItems:"flex-end"}}>
                                    {   
                                        item["type"] === "text" ? ( 
                                            <ThemedText style={styles.senderMessage}>
                                                {item["message"]}
                                            </ThemedText>
                                                ) : (
                                                item["type"] === "feedback" ? (
                                                    <View style={styles.senderMessage}>
                                                        <Image 
                                                            style = {{width : 100, height : 100, borderRadius: 15}}
                                                            source={{
                                                                uri: item["message"],
                                                            }} 
                                                        />
                                                    </View>
                                                ) : (
                                                    item["type"] === "routine" ? (
                                                        <View style={{ flexDirection: "row-reverse"}}>
                                                            <View style={styles.senderMessage}>
                                                                <Image
                                                                style={{ width: 100, height: 100, borderRadius: 15 }}
                                                                    source={{
                                                                        uri: item?.message.thumbnail
                                                                    }}
                                                                />
                                                            </View>
                                                            <View style={{ justifyContent: "center", flex: 1, alignItems: 'flex-end' }}>
                                                                <LinearGradient
                                                                    colors={[AppColors.Purple, AppColors.Blue]}
                                                                    style={[styles.button, { margin: 10, justifyContent: 'center', alignItems: 'center' }]}
                                                                >
                                                                    <TouchableOpacity
                                                                        style={styles.buttonInner}
                                                                        onPress={() => {
                                                                            handleAddRoutine(item?.message)
                                                                        }}
                                                                    >
                                                                        <ThemedText style={styles.buttonText}>Add</ThemedText>
                                                                    </TouchableOpacity>
                                                                </LinearGradient>
                                                            </View>

                                                        </View>
                                                        
                                                    ) : (
                                                        <ThemedText style = {styles.senderMessage}>
                                                            {item["message"]}
                                                        </ThemedText>
                                                    )
                                                )
                                            )
                                    }
                                </View>
                                
                            ): (
                                // FOR MESSAGES FROM RECIEVER
                                <View style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                                    {
                                        item["type"] === "text" ? (
                                            <ThemedText style={styles.recieverMessage}>
                                                {item["message"]}
                                            </ThemedText>) : (
                                            item["type"] === "feedback" ? (
                                                <View style={styles.recieverMessage}>
                                                    <Image
                                                        style={{ width: 100, height: 100, borderRadius: 15 }}
                                                        source={{
                                                            uri: item["message"],
                                                        }}
                                                    />
                                                </View>
                                            ) : (
                                                item["type"] === "routine" ? (
                                                        <View style={{ flexDirection: "row"}}>
                                                        {/* {item["message"] = {}} */}
                                                            <View style = {styles.recieverMessage}>
                                                                <Image
                                                                    style={{ width: 100, height: 100, borderRadius: 15 }}
                                                                    source={{
                                                                        uri: item?.message.thumbnail
                                                                    }}
                                                                />
                                                            </View>
                                                            <View style={{ justifyContent: "center", flex: 1 }}>
                                                                <LinearGradient
                                                                    colors={[AppColors.Purple, AppColors.Blue]}
                                                                            style={[styles.button, { margin: 10, justifyContent: 'center', alignItems: 'center' }]}
                                                                >
                                                                    <TouchableOpacity
                                                                        style={styles.buttonInner}
                                                                        onPress={() => {
                                                                            handleAddRoutine(item?.message)
                                                                        }}
                                                                    >
                                                                        <ThemedText style={styles.buttonText}>Add</ThemedText>
                                                                    </TouchableOpacity>
                                                                </LinearGradient>
                                                            </View>
                                                    </View>
                                                ) : (
                                                    <ThemedText style={styles.recieverMessage}>
                                                        {item["message"]}
                                                    </ThemedText>
                                                )
                                            )
                                        )
                                    }
                                </View>
                            )
                    )}
                />
                <View style={{
                    flexDirection: "row",
                    zIndex: 10,
                    elevation: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10
                }}>
                    <TextInput
                        style={{
                            width: "85%",
                            height: 40,
                            borderWidth: 1,
                            borderRadius: 20,
                            padding: 15,
                            backgroundColor: AppColors.BlueGray
                        }}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Message..."
                    />
                    <TouchableOpacity onPress={() => console.log("Message was", message)}>
                        <Image source={require("@/assets/images/send.svg")} style={{ tintColor: AppColors.Blue }} />
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    senderMessage: {
        padding: 10,
        borderRadius: 20,
        marginVertical: 3,
        paddingHorizontal: 15,
        borderBottomRightRadius: 5, 
        justifyContent: "flex-end", 
        alignItems: 'flex-end', 
        backgroundColor: AppColors.BlueGray
    },
    recieverMessage:{
        padding: 10,
        borderRadius: 20,
        marginVertical: 3,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 5,
        justifyContent: "flex-start", 
        alignItems: 'flex-start', 
        backgroundColor: AppColors.Blue
    },

    buttonInner: {
        padding: 3,
        alignItems: 'center',
        borderRadius: 20,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
    },
    button: {
        borderRadius: 25,
        width: Platform.OS == 'ios' ? "30%" : "100%",
        height:"30%",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});