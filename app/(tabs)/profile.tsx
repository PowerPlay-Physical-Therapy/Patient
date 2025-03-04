import { StyleSheet, Image, Platform, TouchableOpacity, Pressable } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/Colors';
import { ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import  ScreenHeader  from '@/components/ScreenHeader';
import { Alert } from 'react-native';


export default function TabTwoScreen() {
  const {isSignedIn, user, isLoaded} = useUser();
  console.log(user?.imageUrl);
  const { signOut } = useAuth();
  const router = useRouter();
  const params = new URLSearchParams();

  params.set('height', '200')
  params.set('width', '200')
  params.set('quality', '100')
  params.set('fit', 'crop')

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in'); // Redirect to sign-in page after logout
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const onChangeProfilePicture = () => {
    // Handle profile picture change logic here
    Alert.alert('Change profile picture clicked');

  }

  return (
    <LinearGradient style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? 50 : 0}} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
      <ScreenHeader title="Your Profile & Settings"/>
      {/* Add Logout Button */}
      <ThemedView style={styles.buttonContainer}>
        <ThemedView style={styles.headerImage}>
          
          <Image
            source={{uri: 'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydGFaS0ZWZjBtQkZ4bXA5NnpxaTZlc01EdngiLCJyaWQiOiJ1c2VyXzJ0ak54NG02YmhZTGdzZ2c3ZkZuQkRENHVPdSIsImluaXRpYWxzIjoiU0oifQ'}} // Replace with user image once database is established
            resizeMode="contain"
          />
        </ThemedView>
        <Pressable onPress={onChangeProfilePicture}>
          <Image
            source={require('@/assets/images/Magicpen.png')} 
            style={styles.pen}
            resizeMode="contain"
            />
        </Pressable>
        <LinearGradient
          colors={[AppColors.Purple, AppColors.Blue]}
          style={styles.button}
        >
          <TouchableOpacity 
            style={styles.buttonInner}
            onPress={handleSignOut}
          >
            <ThemedText style={styles.buttonText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </LinearGradient>
        </ThemedView>
      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    borderRadius: 60,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonContainer: {
    alignItems: 'center',
    margin: 20,
    padding: 20,
    backgroundColor: AppColors.LightBlue,
    borderRadius: 20,
  },
  button: {
    borderRadius: 25,
    width: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonInner: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  pen: {
    position: 'relative',
    top: -100,
    right: -40,
  }
});
