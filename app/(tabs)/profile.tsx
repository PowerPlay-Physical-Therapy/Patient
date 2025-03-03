import { StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in'); // Redirect to sign-in page after logout
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <ThemedView style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 50 : 0 }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>

      {/* Add Logout Button */}
      <ThemedView style={styles.buttonContainer}>
        <LinearGradient
          colors={[AppColors.Purple, AppColors.LightBlue]}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
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
});
