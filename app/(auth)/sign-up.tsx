import * as React from 'react'
import { Text, TextInput, Button, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { ThemedText } from '@/components/ThemedText'
import {ThemedView} from '@/components/ThemedView'
import {AppColors } from '@/constants/Colors'
import {LinearGradient} from 'expo-linear-gradient'

export default function signUP() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [username, setUsername] = React.useState<string>('');
    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');
    // const [code, setCode] = React.useState('')

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        // Start sign-up process using email and password provided
        try {
            const response = await signUp.create({
                username,
                firstName,
                lastName,
                emailAddress,
                password,
            })

            console.log(response)

            //TODO: Write a function to handle the response
            if(response.status === 'complete') {
                console.log("Signed up successfully")
                // router.push('/(tabs)/index')
            }

            // Send user an email with verification code
            // await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            // setPendingVerification(true)
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', padding: 40 }}>
            <>
            <ThemedView style={{ flex: 1, justifyContent: 'center' }}>
                <Image
                    source={require('@/assets/images/app-logo.png')}
                    style={{ width: 140, height: 140, alignSelf: 'center', marginBottom: 20 }}
                />
                <ThemedText style={{alignSelf: 'center', fontSize: 24}}>Create an Account!</ThemedText>

                <LinearGradient
                    colors={[AppColors.LightBlue, AppColors.White]}
                    style={styles.input}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                <TextInput
                    style={{ "color": "black", marginLeft: 10 }}
                    autoCapitalize="none"
                    value={username}
                    placeholder="Username"
                    placeholderTextColor="#666666"
                    onChangeText={(username) => setUsername(username)}
                />
                </LinearGradient>
                <LinearGradient
                    colors={[AppColors.LightBlue, AppColors.White]}
                    style={styles.input}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                <TextInput
                    style={{ "color": "black", marginLeft: 10 }}
                    autoCapitalize="words"
                    value={firstName}
                    placeholder="First name"
                    placeholderTextColor="#666666"
                    onChangeText={(firstName) => setFirstName(firstName)}
                />
                </LinearGradient>
                <LinearGradient
                    colors={[AppColors.LightBlue, AppColors.White]}
                    style={styles.input}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                <TextInput
                    style={{ "color": "black", marginLeft: 10 }}
                    autoCapitalize="words"
                    value={lastName}
                    placeholder="Last name"
                    placeholderTextColor="#666666"
                    onChangeText={(lastName) => setLastName(lastName)}
                />
                </LinearGradient>
                <LinearGradient
                    colors={[AppColors.LightBlue, AppColors.White]}
                    style={styles.input}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                <TextInput
                    style={{ "color": "black", marginLeft: 10 }}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor="#666666"
                    onChangeText={(email) => setEmailAddress(email)}
                />
                </LinearGradient>
                <LinearGradient
                    colors={[AppColors.LightBlue, AppColors.White]}
                    style={styles.input}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                <TextInput
                    style={{ "color": "black", marginLeft: 10 }}
                    value={password}
                    placeholder="Enter password"
                    placeholderTextColor="#666666"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                </LinearGradient>
                <LinearGradient
                    colors={[AppColors.Purple, AppColors.LightBlue]}
                    style={styles.button}
                >
                    <TouchableOpacity style={styles.buttonInner} onPress={onSignUpPress}>
                        <ThemedText style={styles.buttonText}>Create My Account</ThemedText>
                    </TouchableOpacity>
                </LinearGradient>
            </ThemedView>
                <View style={
                
                    styles.bottomView}>
                    <ThemedText>Already have an account? 
                        <Link href="/sign-in">
                            <ThemedText style={{color: AppColors.Blue}}> Sign in!</ThemedText>
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
    }
})