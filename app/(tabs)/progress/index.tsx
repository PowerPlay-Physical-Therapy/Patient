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
            <Image source={require('@/assets/images/mountain.png')} style={{position: 'absolute', flex: 1, bottom: 40}}/>
            <View style={{bottom: 20, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={[styles.rotatedView, {top: 148, left: 34, height: 100, transform: [{rotate: '-30deg'}]}]}></View>
            <View style={[styles.rotatedView, {top: 130, left: 30, height: 80}]}></View>
                <View style={[styles.rotatedView, {top: 104, left: 38, height: 100, transform: [{rotate: '-45deg'}]}]}></View>
                <View style={[styles.rotatedView, {top: 70, left: 24}]}></View>
                <View style={[styles.rotatedView, {top: 36, left: 12, height: 100, transform: [{rotate: '-45deg'}]}]}></View>
                <View style={styles.rotatedView}></View>
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