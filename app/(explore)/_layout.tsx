import { Stack } from "expo-router";
import {AppColors} from '@/constants/Colors';


export default function ExploreLayout() {
    return (
        <Stack screenOptions={{
            headerShown: true,
            headerBackButtonDisplayMode:'default',
            headerBackTitle: 'Explore',
        }}>
            <Stack.Screen name="routineDetails" options={{headerStyle: {
                          backgroundColor: AppColors.OffWhite,
                        },
                        headerBackTitle: 'Back',
                        headerShown: true,
                        headerTitle: "Routine Details"}}  />
        </Stack>
    );
}