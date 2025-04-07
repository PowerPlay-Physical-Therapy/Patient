import { StyleSheet, View, Image, TextInput, TouchableOpacity, Platform, ImageSourcePropType, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ScreenHeader from '@/components/ScreenHeader';
import { ScrollView } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { useUser } from '@clerk/clerk-expo';

type Therapist = {
  id: string;
  name: string;
  imageUrl?: any;
};

export default function ManageTherapists() {
  const router = useRouter();
  const { user } = useUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [therapists, setTherapists] = useState<Therapist[]>([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const fetchTherapists = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/get_connections/${user?.id}/patient`);
      const data = await response.json();
      if (data.connections) {
        const formattedTherapists = data.connections.map((therapist: any) => ({
          id: therapist._id,
          name: therapist.firstName + ' ' + (therapist.lastName || ''),
          imageUrl: therapist.image || require('@/assets/images/profile.png'),
        }));
        setTherapists(formattedTherapists);
      }
    } catch (error) {
      console.error('Failed to fetch therapists:', error);
      Alert.alert('Error', 'Failed to fetch therapists');
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTherapists();
    }
  }, [user?.id]);

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/disconnect_patient_therapist/${user?.id}/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Therapist removed successfully');
        fetchTherapists(); // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to remove therapist');
      }
    } catch (error: any) {
      console.error('Failed to remove therapist:', error);
      Alert.alert('Error', error.message || 'Failed to remove therapist');
    }
  };

  const navigateToTab = (path: string) => {
    router.push(path as any);
  };

  const connectTherapist = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/therapist/get_therapist_by_email?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        throw new Error('Therapist not found');
      }
      const therapist = await res.json();

      const therapistId = therapist._id;
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/connect_patient_therapist/${user?.id}/${therapistId}`, {
        method: 'POST',
      });
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.message);
        toggleModal();
        fetchTherapists();
      } else {
        throw new Error(result.message || 'Failed to connect therapist');
      }
    } catch (error: any) {
      console.error('Failed to connect therapist:', error);
      Alert.alert('Error', error.message || 'Failed to connect therapist');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <LinearGradient style={styles.container} colors={[AppColors.OffWhite, AppColors.LightBlue]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="black" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Therapists</ThemedText>
          <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
            <ThemedText style={styles.addButtonText}>ADD</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#666"
          />
        </View>

        <ScrollView style={styles.therapistList}>
          {therapists.map((therapist) => (
            <View key={therapist.id} style={styles.therapistItem}>
              <View style={styles.therapistInfo}>
                <Image
                  source={therapist.imageUrl || require('@/assets/images/profile.png')}
                  style={styles.therapistImage}
                />
                <ThemedText style={styles.therapistName}>{therapist.name}</ThemedText>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(therapist.id)}
              >
                <ThemedText style={styles.removeButtonText}>Remove</ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <ThemedText style={styles.modalTitle}>Add By Email</ThemedText>
          <ThemedText style={styles.modalSubtitle}>Who is your therapist?</ThemedText>

          <LinearGradient colors={['#E0F7FA', '#F1F8E9']} style={styles.modalInputGradient}>
            <TextInput
              placeholder="Enter email:"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
              style={styles.modalInput}
            />
          </LinearGradient>

          <TouchableOpacity style={styles.modalButton} onPress={connectTherapist}>
            <LinearGradient colors={['#B39DDB', '#81D4FA']} style={styles.modalButtonGradient}>
              <ThemedText style={styles.modalButtonText}>Send Therapist Request</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    padding: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  therapistList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  therapistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 15,
    marginVertical: 5,
  },
  therapistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  therapistImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  therapistName: {
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: AppColors.OffWhite,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    alignItems: 'center',
    padding: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  modalInputGradient: {
    width: '100%',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  modalInput: {
    fontSize: 16,
    color: 'black',
  },
  modalButton: {
    width: '100%',
  },
  modalButtonGradient: {
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
