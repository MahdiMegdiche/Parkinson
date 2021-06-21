import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
//import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import CountDown from "react-native-countdown-component";
import { useNavigation } from "@react-navigation/native";

const DrawingScreen = () => {

  return (
<View>
    <Text>
        Ahla
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
  countContainer: {
    alignItems: "center",
    padding: 10,
  },
  remainingTime: {
    fontSize: 20,
  },
  image: {
    flex: 1,
    width: "100%",
    zIndex: 0,
  },
});

export default DrawingScreen;
