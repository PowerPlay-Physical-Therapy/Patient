import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  TextInput,
  Button,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { AppColors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

export default function signIN() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        console.log("Signed in Successfully");

        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log("Signed in Error");
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", padding: 40 }}>
      <ThemedView style={{ flex: 1, justifyContent: "center" }}>
        <Image
          source={require("@/assets/images/app-logo.png")}
          style={{
            width: 140,
            height: 140,
            alignSelf: "center",
            marginBottom: 20,
          }}
        />
        <ThemedView style={{ alignSelf: "center" }}>
          <ThemedText style={{ color: "Black", alignSelf: "center", fontSize: 24 }}>
            Welcome!
          </ThemedText>
          <ThemedText style={{ color: "Black", fontSize: 24, marginTop: 10 }}>
            to{" "}
            <ThemedText style={{ color: AppColors.Blue, fontSize: 24}}>Powerplay</ThemedText>
          </ThemedText>
        </ThemedView>
        <LinearGradient
          colors={[AppColors.LightBlue, AppColors.White]}
          style={styles.input}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TextInput
            style={{ color: "black", marginLeft: 10 }}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            placeholderTextColor="#666666"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
        </LinearGradient>
        <LinearGradient
          colors={[AppColors.LightBlue, AppColors.White]}
          style={styles.input}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TextInput
            style={{ color: "black", marginLeft: 10 }}
            value={password}
            placeholder="Enter password"
            placeholderTextColor="#666666"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </LinearGradient>
          
          <ThemedView style={{alignItems: 'center', marginTop: 10}}>
        <LinearGradient
          colors={[AppColors.Purple, AppColors.LightBlue]}
          style={styles.buttonLogin}
        >
          <TouchableOpacity onPress={onSignInPress}>
            <ThemedText style={styles.buttonText}>Login</ThemedText>
          </TouchableOpacity>
        </LinearGradient>
        </ThemedView>
      </ThemedView>
      <View style={styles.bottomView}>
        <ThemedText>Forgot Password?
            <Link href="/password-change">
            </Link>
        </ThemedText>
        <ThemedText>
          Don't have an account?
          <Link href="/sign-up">
            <ThemedText style={{ color: AppColors.Blue }}>
              {" "}
              Create One!
            </ThemedText>
          </Link>
        </ThemedText>
        <ThemedText style={{ alignSelf: "center" }}>
          Review our
          <Link href="/sign-up"> {/* This should be a link to the privacy policy */}
            <ThemedText style={{ color: AppColors.Blue }}>
              {" "}
              Privacy Policy
            </ThemedText>
          </Link>
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonInner: {
    padding: 12,
    alignItems: "center",
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: "bold",
  },
  bottomView: {
    backgroundColor: "white",
    alignSelf: "center",
  },

  input: {
    borderRadius: 25,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 15,
  },
  buttonLogin: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    width: "30%",
  },
});
