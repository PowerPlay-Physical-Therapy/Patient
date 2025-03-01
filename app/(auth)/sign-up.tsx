import * as React from 'react'
import { Text, TextInput, Button, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { ThemedText } from '@/components/ThemedText'

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
        <View>
            <>
                <ThemedText>Sign up</ThemedText>

                <TextInput
                    style={{ "color": "white" }}
                    autoCapitalize="none"
                    value={username}
                    placeholder="Username"
                    placeholderTextColor="#666666"
                    onChangeText={(username) => setUsername(username)}
                />
                <TextInput
                    style={{ "color": "white" }}
                    autoCapitalize="words"
                    value={firstName}
                    placeholder="First name"
                    placeholderTextColor="#666666"
                    onChangeText={(firstName) => setFirstName(firstName)}
                />
                <TextInput
                    style={{ "color": "white" }}
                    autoCapitalize="words"
                    value={lastName}
                    placeholder="Last name"
                    placeholderTextColor="#666666"
                    onChangeText={(lastName) => setLastName(lastName)}
                />
                <TextInput
                    style={{ "color": "white" }}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor="#666666"
                    onChangeText={(email) => setEmailAddress(email)}
                />
                <TextInput
                    style={{ "color": "white" }}
                    value={password}
                    placeholder="Enter password"
                    placeholderTextColor="#666666"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <Button title="Continue" onPress={onSignUpPress} />
                <View style={{ flexDirection: 'row', gap: 4, backgroundColor: 'white' }}>
                    <Text>Have an account?</Text>
                    <Link href="/sign-in">
                        <Text>Sign in</Text>
                    </Link>
                </View>
            </>
        </View>
    )
}