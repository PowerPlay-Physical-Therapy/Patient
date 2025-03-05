import { useSignIn } from '@clerk/clerk-expo'
import { useEffect, useState } from 'react';
import { Link, useRouter } from "expo-router";
import * as React from 'react';
import { Text, TextInput, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPassword() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('');
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [error, setError] = useState('');

    // useEffect(() => {
    //     if (!isLoaded) return;
    // }, [isLoaded]);

    const onRecoverPasswordPress = async () => {
        if (!isLoaded || !signIn) return;

        try {
            const passwordRecovery = await signIn.create({
                identifier: emailAddress.trim(),
                strategy: "reset_password_email_code",
            });
            setSuccessfulCreation(true);
            setStatus('Password reset link sent');
            setError('');
            console.log("Reset link sent successfully");
        } catch (err: any) {
            setStatus('Error sending reset link');
            setError(err.errors?.[0]?.longMessage || 'An error occurred, Please try again');
            console.log("Reset link unsuccessful");
            console.error(JSON.stringify(err, null, 2));
        }
    };

    const onResetPasswordPress = async () => {
        if (!isLoaded || !signIn) return;

        try {
            const reset = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code,
                password,
            });

            if (reset.status == 'complete' && reset.createdSessionId) {
                setActive({ session: reset.createdSessionId });
                setError('');
                router.push('/')
            } else {
                setStatus('Unable to reset password');
            }

        } catch (err: any) {
            setStatus('Error resetting password');
            setError(err.errors?.[0]?.longMessage || 'An error occurred. Please try again');
            console.log("Reset link unsuccessful");
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

                {!successfulCreation ? (
                    <>
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
                            <TouchableOpacity onPress={onRecoverPasswordPress}>
                                <LinearGradient
                                    colors={[AppColors.Purple, AppColors.LightBlue]}
                                    style={styles.buttonRecoverPassword}
                                >
                                    <ThemedText style={styles.buttonText}>Recover password</ThemedText>
                                </LinearGradient> 
                            </TouchableOpacity>
                        </View>
                    </>
                ):(
                    <>
                        <LinearGradient
                            colors={[AppColors.LightBlue, AppColors.White]}
                            style={styles.input}
                            start={{ x:0, y: 0}}
                            end={{ x: 1, y: 0}}
                        >
                            <TextInput
                                style={{ "color": 'black', marginLeft: 10 }}
                                autoCapitalize='none'
                                secureTextEntry
                                value={password}
                                placeholder="New Password"
                                placeholderTextColor="#666666"
                                onChangeText={setPassword}
                            />
                        </LinearGradient>

                        <TouchableOpacity onPress={onResetPasswordPress} style={styles.buttonRecoverPassword}>
                            <LinearGradient
                                colors={[AppColors.LightBlue, AppColors.White]}
                                style={styles.input}
                                start={{ x:0, y: 0}}
                                end={{ x: 1, y: 0}}
                                >
                                <TextInput
                                    style={{ "color": 'black', marginLeft: 10 }}
                                    autoCapitalize='none'
                                    value={code}
                                    placeholder="Reset Password Code"
                                    placeholderTextColor="#666666"
                                    onChangeText={setCode}
                                />
                            </LinearGradient>
                            <ThemedText style={styles.buttonText}>Reset password</ThemedText>
                        </TouchableOpacity>
                    </>
                )}

                {error && <Text style={{ "color": 'red', textAlign: 'center', marginTop: 10 }}>{error}</Text>}

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
    );
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