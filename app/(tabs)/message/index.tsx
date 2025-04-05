import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, Platform, FlatList, TouchableOpacity, Image, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/Colors';
import ScreenHeader from '@/components/ScreenHeader';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SearchBar } from 'react-native-screens';

export default function MessagesScreen() {
    const router = useRouter();
    const {user} = useUser();
    const [connections, setConnections] = useState([]);

    useEffect(() => {
        const patientId = user?.id;
        console.log("Patient ID: ", patientId); 
        const fetchConnections = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/patient/get_connections/${patientId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setConnections(data);
            } catch (error) {
                console.error("Error Fetching Connections",error);
            }
        };
        fetchConnections();
    },[])

    return (
        <LinearGradient style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? 50 : 20 }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
            <ScreenHeader title="Messages" logo={true} />
            {/* <SearchBar round={true} containerStyle={{ backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0 }} inputContainerStyle={{ backgroundColor: AppColors.LightBlue }} placeholder='Search Therapists' onChangeText={setSearch} value={search} style={styles.search} /> */}
            <View style={{ padding: 20, flex : 1}}>
                
                <FlatList
                    data={connections}
                    keyExtractor={(item) => item["_id"]}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.messageRow} onPress={() => {
                            const username = `${item["firstname"]}${item["lastname"]}`;
                            router.push(`/message/${username}`)
                        }}>
                            {/* <Image source={item.image} style={styles.avatar} /> */}
                            <Text >{item["firstname"]} {item["lastname"]}</Text>
                            <Image source={require('@/assets/images/chevron-right.png')} style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    )}
                />
            </View>
            
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    }
    
});