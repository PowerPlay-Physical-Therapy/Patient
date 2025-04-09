import { StyleSheet, View, Image, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import ScreenHeader from '@/components/ScreenHeader';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { useUser } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ManageTherapists() {
  const router = useRouter();
  const { user } = useUser();
  const [therapists, setTherapists] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const fetchTherapists = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/get_connections/${user?.id}/patient`);
      const data = await response.json();
      if (data.connections) {
        const sorted = data.connections.sort((a: any, b: any) => a.status.localeCompare(b.status));
        const formatted = sorted.map((therapist: any) => ({
          id: therapist._id,
          name: therapist.firstname + ' ' + (therapist.lastname || ''),
          imageUrl: therapist.imageUrl ? { uri: therapist.imageUrl } : require('@/assets/images/profile.png'),
          status: therapist.status || 'accepted',
        }));
        setTherapists(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch therapists:', error);
      Alert.alert('Error', 'Failed to fetch therapists');
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/disconnect_patient_therapist/${user?.id}/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Therapist removed successfully');
        fetchTherapists();
      } else {
        throw new Error(result.message || 'Failed to remove therapist');
      }
    } catch (error: any) {
      console.error('Failed to remove therapist:', error);
      Alert.alert('Error', error.message || 'Failed to remove therapist');
    }
  };

  const connectTherapist = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/therapist/get_therapist_by_email/?email=${email}`);
      if (!res.ok) throw new Error('Therapist not found');
      const therapist = await res.json();
      const response = await fetch(`${BACKEND_URL}/connect_patient_therapist/${user?.id}/${therapist._id}`, {
        method: 'POST',
        headers: {
          'X-User-Role': 'patient',
        },
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

  useEffect(() => {
    if (user?.id) fetchTherapists();
  }, [user?.id]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 50 : 0 }}
        colors={[AppColors.OffWhite, AppColors.LightBlue]}
      >
        <ScreenHeader
          title="Manage Your Therapists"
          leftButton={
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Image
                source={require('@/assets/images/chevron-left.png')}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          }
          rightButton={
            <TouchableOpacity onPress={toggleModal}>
              <Image
                source={require('@/assets/images/user-add-icon.png')}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          }
        />

        <ScrollView style={{ flex: 1 }}>
          {therapists.map((therapist) => (
            <View key={therapist.id} style={styles.therapistItem}>
              <View style={styles.therapistInfo}>
                <Image source={therapist.imageUrl} style={styles.therapistImage} />
                <View>
                  <ThemedText style={styles.therapistName}>{therapist.name}</ThemedText>
                  {therapist.status === 'pending' && (
                    <ThemedText style={{ fontSize: 12, color: 'orange' }}>Pending Approval</ThemedText>
                  )}
                </View>
              </View>
              <LinearGradient
                colors={["#E91313", "#EB9BD0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.removeButtonGradient}
              >
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(therapist.id)}>
                  <ThemedText style={styles.removeButtonText}>Remove</ThemedText>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          ))}
        </ScrollView>

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
              <LinearGradient
                colors={['#B39DDB', '#81D4FA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.modalButtonGradient}
              >
                <ThemedText style={styles.modalButtonText}>Send Therapist Request</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Modal>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  therapistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: AppColors.OffWhite,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
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
    color: 'black'
  },
  removeButtonGradient: {
    borderRadius: 25,
    paddingHorizontal: 1,
    paddingVertical: 1,
  },
  removeButton: {
    borderRadius: 25,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
