import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, Platform, FlatList, TouchableOpacity, Image, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/Colors';
import ScreenHeader from '@/components/ScreenHeader';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SearchBar} from '@rneui/themed';
import { faker } from '@faker-js/faker';
import { Badge } from '@rneui/base';


export default function MessagesScreen() {
    const router = useRouter();
    const {user} = useUser();
    const [connections, setConnections] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);

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

    useEffect(() => {
        const filtered = connections.filter((therapist: any) => {
            return therapist.firstname.toLowerCase().includes(search.toLowerCase()) || 
            therapist.lastname.toLowerCase().includes(search.toLowerCase()) ||
            therapist.username.toLowerCase().includes(search.toLowerCase())
        });
        setFilteredResults(filtered);
    }, [search, connections]);

    return (
        <LinearGradient style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? 50 : 20 }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
            <ScreenHeader title="Messages" logo={true} />
            <SearchBar round={true} containerStyle={{ backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0 }} inputContainerStyle={{ backgroundColor: AppColors.LightBlue }} placeholder='Search Therapists' onChangeText={setSearch} value={search} style={styles.search} />
            <View style={{paddingLeft: 20, paddingRight:20, flex : 1}}>
                
                <FlatList
                    data={filteredResults}
                    keyExtractor={(item) => item["_id"]}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.messageRow} onPress={() => {
                            const params = { patientId: user?.id, therapistId: item["therapist_id"], therapistName: item["firstname"]+" "+item["lastname"] };
                            router.push(`/message/${JSON.stringify(params)}`)
                        }}>
                            <View style={{ flexDirection: 'row',alignItems: 'center'}}>
                                <Image source={{ uri: faker.image.avatar() }} style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    marginRight: 12
                                }} />
                                <ThemedText >{item["firstname"]} {item["lastname"]}</ThemedText>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Badge value="3" status="error" />
                                <Image source={require('@/assets/images/chevron-right.png')} style={{ width: 20, height: 20 }} />
                            </View>
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
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    },
    search: {
        // Add your search bar styles here
    }
    
});