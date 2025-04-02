import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExerciseDetails from './exerciseDetails';
import HomeScreen from '.';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Exercise Details" component={ExerciseDetails} />
    </Tab.Navigator>
  );
}