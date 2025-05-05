import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, differenceInCalendarDays } from "date-fns";

export default function Streak({dbStreak, usedbStreak}: {dbStreak?: number, usedbStreak: boolean}) {
  const [streak, setStreak] = useState<number>(0);

  const initializeStreak = async () => {
    const today = new Date();
    const lastOpened = await AsyncStorage.getItem("lastOpened");
    const storedStreak = parseInt(
      (await AsyncStorage.getItem("streak")) || "0",
      10
    );

    const startDay = new Date(
      (await AsyncStorage.getItem("startDay")) || today
    );

    let newStreak = storedStreak;
    let newStartDay = startDay;

    if (lastOpened) {
      const lastDate = new Date(lastOpened);
      const dayDifference = differenceInCalendarDays(today, lastDate);
      if (dayDifference === 1) {
        newStreak++;
      } else if (dayDifference > 1) {
        newStreak = 1;
        newStartDay = today;
      } } else {
        newStreak = 1;
      }

      await AsyncStorage.multiSet([
        ["lastOpened", today.toISOString()],
        ["streak", newStreak.toString()],
        ["startDay", newStartDay.toISOString()],
      ]);

      setStreak(newStreak);
    
  };

  useEffect(() => {
    initializeStreak();
  }, []);

  return (
    <LinearGradient style={styles.container}colors={[AppColors.Purple, AppColors.Blue]}>
        <Image style={{width: 24, height: 24}}source={require('@/assets/images/streak.png')}/>
      <ThemedText style={{color: 'white', marginRight: 4}}>{usedbStreak? dbStreak : streak}</ThemedText>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 48,
    maxWidth: 52,
    height: 30,
    borderRadius: 8,
    marginBottom: 8,
    marginLeft: 8
  },
});
