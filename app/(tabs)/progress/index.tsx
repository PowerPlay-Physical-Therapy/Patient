import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, Platform, Image, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/Colors';
import ScreenHeader from '@/components/ScreenHeader';
import { Link } from 'expo-router';

export default function ProgressScreen() {
    return (
        <LinearGradient style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? 50 : 0 }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
            <View style={styles.header}>
                <Link href={`/progress/leaderboard`}>
                    <Image source={require('@/assets/images/Leaderboard.png')}></Image>
                </Link>
                <ThemedText style={{ fontSize: 20 }} type='subtitle'>Progress</ThemedText>
                <Image source={require('@/assets/images/Tracking.png')}></Image>
            </View>
            <Image source={require('@/assets/images/mountain.png')} style={{flex: 1}}>
                
            </Image>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
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
    },
});