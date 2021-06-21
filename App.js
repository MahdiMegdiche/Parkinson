import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DexterityScreen from "./src/screens/DexterityScreen";
import TremorScreen from "./src/screens/TremorScreen";
import DrawingScreen from "./src/screens/DrawingScreen";
const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tremor" component={TremorScreen} />
        <Stack.Screen name="Dexterity" component={DexterityScreen} />
        <Stack.Screen name="Drawing" component={DrawingScreen} />
      </Stack.Navigator> 
    </NavigationContainer>
  );
}
export default App;
