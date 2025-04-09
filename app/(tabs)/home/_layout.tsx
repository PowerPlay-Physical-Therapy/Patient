import { Stack } from "expo-router";
import { AppColors } from "@/constants/Colors";


export default function HomeLayout(){

    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown:false}}/>
            <Stack.Screen name="exerciseDetails" options={{headerStyle: {
              backgroundColor: AppColors.OffWhite,
            },
            headerBackTitle: 'Back',
            headerShown: true,
            title: "Exercise Information",
          }}/>
          <Stack.Screen name="video" options={{headerStyle: {
              backgroundColor: AppColors.OffWhite,
            },
            headerBackTitle: 'Back',
            headerShown: false,
            title: "Video",
            
          }}/>
          <Stack.Screen name="recording" options={{headerShown: false,
          
            }}
            />
            <Stack.Screen name="share" options={{headerShown: false}}/>
        </Stack>
    );
}