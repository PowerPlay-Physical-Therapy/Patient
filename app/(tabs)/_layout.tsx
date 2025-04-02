
  import { usePathname } from 'expo-router';
  import { Tabs } from 'expo-router';
  import React from 'react';
  import { Platform, View } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { AppColors, Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
  export default function TabLayout(){
    const colorScheme = useColorScheme();
    const pathname = usePathname(); // Get the current route
    const pathsToHide = ['/home/recording', '/home/video']
  // Hide the TabList for specific routes
    const hideTabs = pathsToHide.includes(pathname);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: () => (
                    <View style={{
                        flex: 1, backgroundColor: AppColors.LightBlue, borderTopColor: '#ddd', borderTopWidth: 0.5
                    }} />
                ),
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                        display: hideTabs? 'none' : 'flex',
                    },
                    default: {
                        display: hideTabs? 'none' : 'flex',
                    },
                }),
            }}>
            <Tabs.Screen
                name="progress"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="flag.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name='globe.americas.fill' color={color} />,
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="message"
                options={{
                    title: "",
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name='message.fill' color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.circle.fill" color={color} />,
                }}
            />
        </Tabs>
    );
};
