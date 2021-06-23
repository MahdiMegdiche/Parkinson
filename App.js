import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DexterityScreen from "./src/screens/DexterityScreen";
import TremorScreen from "./src/screens/TremorScreen";
import FinalScreen from "./src/screens/FinalScreen";
import LandingScreen from "./src/screens/LandingScreen";
import PretestsScreen from "./src/screens/PretestsScreen";
import PreDexterityScreen from "./src/screens/PreDexterityScreen";
import PreTremorScreen from "./src/screens/PreTremorScreen";
const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Pretests" component={PretestsScreen} />
        <Stack.Screen name="PreDexterity" component={PreDexterityScreen} />
        <Stack.Screen name="Dexterity" component={DexterityScreen} />
        <Stack.Screen name="PreTremor" component={PreTremorScreen} />
        <Stack.Screen name="Tremor" component={TremorScreen} />
        <Stack.Screen name="Final" component={FinalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
