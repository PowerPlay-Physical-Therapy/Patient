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

                <View style={{ alignItems: 'center', marginTop: 2 }}>
                    <LinearGradient
                        colors={[AppColors.Purple, AppColors.LightBlue]}
                        style={styles.buttonRecoverPassword}
                    >
                        <TouchableOpacity onPress={onRecoverPasswordPress}>
                            <ThemedText style={styles.buttonText}>Recover password</ThemedText>
                        </TouchableOpacity>
                    </LinearGradient> 
                </View>


                </ThemedView>
                    <View style={styles.bottomView}>
                        <ThemedText>
                            <Link href="/sign-in">
                                <ThemedText style={{ color: AppColors.Blue }}>
                                    Back to Login
                                </ThemedText>
                            </Link>
                        </ThemedText>
                    </View>
            </>
        </ThemedView>
    )
}

        const styles = StyleSheet.create({
            buttonText: {
                fontWeight: 'bold',
            },

            buttonRecoverPassword: {
                padding: 10,
                marginTop: 10,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 25,
                width: "60%",
            },

            bottomView: {
                backgroundColor: 'white',
                alignSelf: 'center',
                marginTop: 20,
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