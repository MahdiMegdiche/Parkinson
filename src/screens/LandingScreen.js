import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Background from "../Components/Background";
import { useNavigation } from "@react-navigation/native";
import LogoB from "../Components/Logo";
const LandingScreen = () => {
  navigation = useNavigation();
  return (
    <View style={styles.ajustement}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#1985A1", "#1985A9", "#ffffff"]}
        style={styles.background}
      />
      <LogoB style={{alignSelf:"center"}}/>
      <Background
        style={{
          height: 300,
          maxHeight: 300,
          maxWidth: 300,
          marginTop: 20,
          marginLeft: 50,
        }}
      />
      <View style={{ alignItems: "center" }}></View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 20,
          marginLeft: 20,
          color: "#1985A1",
          textAlign: "center",
        }}
      >
        Parkinson Better
      </Text>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("Pretests");
          }}
        >
          
          <Text style={{ color: "#f2f2f2", textAlign: "center", fontSize: 16 }}>
            Start
          </Text>
        </TouchableOpacity>
      </View>
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
    height: 400,
  },
  ajustement: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "#004777",
    padding: 20,
    marginHorizontal: 140,
    borderRadius: 60,
    height: "1%",
    marginBottom: "50%",
  },
});
export default LandingScreen;
