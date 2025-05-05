import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, Platform, Image, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/Colors';
import ScreenHeader from '@/components/ScreenHeader';
import { Link } from 'expo-router';
import * as Progress from 'react-native-progress';
import { useState, useEffect } from 'react';
import VerticalProgressBar from '@/components/VerticalProgressBar';
import { useUser } from '@clerk/clerk-expo';

export default function ProgressScreen() {
    const [progress, setProgress] = useState(0);
    const {user} = useUser();
    const userId = user?.id; // Get the user ID from the Clerk user object
    const userImage = user?.imageUrl || ""; // Get the user's profile image URL from the Clerk user object

    const fetchProgress = async () => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/patient/get_progress/${userId}`);
        const data = await response.json();
        setProgress(data.progress / 100); // Assuming the API returns progress as a percentage
    }

    useEffect(() => {
        fetchProgress();
      }, []);

    return (
        <LinearGradient style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? 50 : 0 }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
            <View style={styles.header}>
                <Link href={`/progress/leaderboard`}>
                    <Image source={require('@/assets/images/Leaderboard.png')}></Image>
                </Link>
                <ThemedText style={{ fontSize: 20 }} type='subtitle'>Progress</ThemedText>
                <Image source={require('@/assets/images/Tracking.png')}></Image>
            </View>
            <Image source={require('@/assets/images/mountain.png')} style={{position: 'absolute', flex: 1, bottom: 0}}/>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <ThemedText style={{ fontSize: 20, paddingTop: 20, textAlign: 'center' }} type='subtitle'>You have completed {progress * 100}% of your weekly progress!</ThemedText>
            </View>
            <View style={{bottom: 20, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                
                <VerticalProgressBar progress={progress} imageUrl={userImage}/>
            </View>

            
                    
                
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    rotatedView: {
        width: 2,
        height: 140,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '45deg' }], // Rotate the view by 45 degrees
      },
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    header: {
        height: 70,
        paddingTop: 30,
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: AppColors.OffWhite,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        zIndex: 1,
    },
});