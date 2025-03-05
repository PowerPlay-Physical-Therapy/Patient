import { useSignIn } from '@clerk/clerk-expo'
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import * as React from 'react';
import { Text, TextInput, Button, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPassword() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState('');
    const [status, setStatus] = React.useState('');

    const onRecoverPasswordPress = async () => {
        if (!isLoaded) return;

        try {
            const passwordRecovery = await signIn.create({
                identifier: emailAddress,
            });
            setStatus('Password reset link sent');
        } catch (err) {
            setStatus('Error sending reset link');
            console.error(JSON.stringify(err, null, 2));
        }
    };

    return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', padding: 40 }}>
            <>
            <ThemedView style= {{ flex: 1, justifyContent: 'center' }}>
                    <Image
                        source={require('@/assets/images/app-logo.png')}
                        style={{ width: 140, height: 140, alignSelf: 'center', marginBottom: 20 }}
                    />
                <ThemedText style={{alignSelf: 'center', fontSize: 20}}>Forgot your password?</ThemedText>

                <LinearGradient
                    colors={[AppColors.LightBlue, AppColors.White]}
                    style={styles.input}
                    start={{ x:0, y: 0}}
                    end={{ x: 1, y: 0}}
                >
                
                    <TextInput
                        style={{ "color": 'black', marginLeft: 10 }}
                        autoCapitalize='none'
                        value={emailAddress}
                        placeholder="Email"
                        placeholderTextColor="#666666"
                        onChangeText={setEmailAddress}
                    />
                </LinearGradient>

                <LinearGradient
                    colors={[AppColors.LightBlue, AppColors.White]}
                    style={styles.input}
                    start={{ x:0, y:0}}
                    end={{ x: 1, y: 0}}
                >
                    <TouchableOpacity style={styles.buttonInner} onPress={onRecoverPasswordPress}>
                        <ThemedText style={styles.buttonText}>Recover password</ThemedText>
                    </TouchableOpacity>
                </LinearGradient>

                </ThemedView>
                    <View style={styles.bottomView}>
                        <ThemedText>Back to Login
                            <Link href="/sign-in">
                            </Link>
                        </ThemedText>
                    </View>
            </>
        </ThemedView>
    )
}

        const styles = StyleSheet.create({
            button: {
                borderRadius: 25,
                marginTop: 10,
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
            },

            bottomView: {
                backgroundColor: 'white',
                alignSelf: 'center',
            },

            input: {
                borderRadius: 25,
                marginTop: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                padding: 15,
            },

});