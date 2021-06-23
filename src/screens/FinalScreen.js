import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CountDown from "react-native-countdown-component";
import { useNavigation } from "@react-navigation/native";
import Logo from "../Components/Logo";

const FinalScreen = ({ route, navigation }) => {
  navigation = useNavigation();
  const { FinalTest } = route.params;
  const dexterityResult = FinalTest[0][0];
  const tremorResult = FinalTest[1];
  const dexterityTest = dexterityResult == "Healthy" ? true : false;
  const tremorTest = tremorResult == "Healthy" ? true : false;
  let finalTest = dexterityTest && tremorTest ? true : false;
  const finalResultTest1 =
    dexterityResult == "Healthy" && dexterityResult == "Healthy"
      ? "not suffering from upper muscle rigidity."
      : "suffering from upper muscle rigidity.";
  const finalResultTest2 =
    dexterityResult == "Healthy" && dexterityResult == "Healthy"
      ? "not suffering from upper limb tremor."
      : "suffering from upper limb tremor.";
  const finalResult =
    dexterityResult == "Healthy" && dexterityResult == "Healthy"
      ? "Your test results show that you are healthy."
      : "You are likely experiencing some Parkinson’s Disease symptoms. We advise that you pay a visit to your Primary Care Doctor.";
  const colorx = finalTest ? "green" : "red";
  console.log(
    "You passed the first and second test successfully \nYour results are:\n For the Dexterity test you seem",
    dexterityResult,
    "\nFor the Tremor test you seem",
    tremorResult
  );
  return (
    <View style={styles.ajustement}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#1985A1", "#1985A9", "#ffffff"]}
        style={styles.background}
      />
      <View style={{ alignItems: "center", marginBottom: "60%" }}>
        <Logo />
      </View>
      <Text
        style={{
          color: "#373636",
          textAlign: "center",
          fontSize: 18,
          marginTop: "5%",
          fontWeight: "bold",
          marginBottom: "15%",
          marginHorizontal: 2,
        }}
      >
        You have conducted the Dexterity and Rest Tremor Test successfully.
      </Text>
      <Text style={{ marginHorizontal: "3%" }}>
        Your Dexterity Test results show that you are likely {finalResultTest1}
        {"\n"}
        Your Rest Tremor Test results show that you are likely {finalResultTest2}
      </Text>
      <Text style={{ textAlign: "center", color: colorx, fontWeight: "bold" }}>
        Final Result:{"\n"}
      </Text>
      <Text style={{ color: colorx, marginHorizontal: "3%" }}>
        {finalResult}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centerElement: { justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10,
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
  button1: {
    alignItems: "center",
    backgroundColor: "#004777",
    padding: 40,
    flex: 1,
    marginLeft: 100,
    marginRight: 100,
    borderRadius: 15,
    height: "90%",
  },
  button2: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#004777",
    paddingHorizontal: 40,
    marginLeft: 100,
    marginRight: 100,
    borderRadius: 15,
    height: "50%",
  },
});

export default FinalScreen;
