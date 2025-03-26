import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, Platform, Image, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/Colors';
import ScreenHeader from '@/components/ScreenHeader';

export default function ProgressScreen() {
    return (
        <LinearGradient style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? 50 : 0 }} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
            <View style={styles.header}>
                <Image source={require('@/assets/images/Leaderboard.png')}></Image>
                <ThemedText style={{ fontSize: 20 }}>Progress</ThemedText>
                <Image source={require('@/assets/images/Tracking.png')}></Image>
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