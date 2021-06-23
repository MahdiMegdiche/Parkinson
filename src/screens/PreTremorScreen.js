import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Logo from "../Components/Logo"

const PreTremorScreen = ({ route, navigation }) => {
  navigation = useNavigation();
  const { Test } = route.params;
  // console.log("taw fel pretremor",Test)
  return (
    <View style={styles.ajustement}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#1985A1", "#1985A9", "#ffffff"]}
        style={styles.background}
      />
      <View style={{alignItems:"center"}}><Logo/></View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 30,
          marginLeft: 20,
          color: "#1985A1",
          textAlign: "center",
          marginTop:"50%",
          marginBottom:"10%",
        }}
      >
        REST TREMOR TEST
      </Text>
        <Text style={{ color: "#373636", fontSize: 16,marginHorizontal:"5%"}}>
Place your phone in your hand, and position your arm on your inner thigh.{"\n"} 
Keep your hand in a resting position in the air, only your arm should be supported by your thigh.        </Text>
        <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("Tremor",{PreTremor:Test});
        }}
      >
        <Text style={{ color: "#f2f2f2", textAlign: "center", fontSize: 16 }}>
          Start Test
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  textinput: {
    backgroundColor: "#1985A1",
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: "#1985A1",
    borderWidth: 1,
    paddingLeft: 5,
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  ajustement: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  button: {
    justifyContent:"center",
    alignItems:"center",
    marginTop:40,
    backgroundColor: "#004777",
    padding: 20,
    marginHorizontal:140,
    borderRadius: 60,
    height: "1%",
    marginBottom:"50%" 
  },
});
export default PreTremorScreen;
