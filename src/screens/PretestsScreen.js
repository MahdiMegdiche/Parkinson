import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Background from "../Components/Background";
import Logo from "../Components/Logo";
import { useNavigation } from "@react-navigation/native";
const PretestsScreen = ({ route, navigation }) => {
  navigation = useNavigation();
  return (
    <View style={styles.ajustement}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#1985A1", "#1985A9", "#ffffff"]}
        style={styles.background}
      />
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Logo />
      </View>
      <Text
        style={{
          color: "#373636",
          textAlign: "center",
          fontSize: 18,
          marginTop: "50%",
          fontWeight: "bold",
          marginBottom: 10,
          marginHorizontal: 2,
        }}
      >
        Welcome to APPERKINSON, your personal Parkinson’s Disease detector and
        tracker.
      </Text>
      <Text style={{ color: "#373636", fontSize: 16, marginHorizontal: "8%" }}>
        Our app helps detect PD’s symptoms with three consecutive tests:
        Dexterity Test, Rest Tremor Test, and Handwriting Analysis.{"\n"}
        By clicking Next, the app will take you to the Dexterity Test. {"\n"}
        Once you conduct the 1st test, click on Next again to go to the 2nd.
        {"\n"}
      </Text>
      <Text
        style={{
          color: "#373636",
          fontSize: 14,
          fontWeight: "bold",
          marginHorizontal: "8%",
        }}
      >
        Please note that this app does not replace a doctor’s visit. If the test
        results indicate that you suffer from PD’s symptoms, make sure to see
        your Primary Care Doctor and share these results with them.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("PreDexterity");
        }}
      >
        <Text style={{ color: "#f2f2f2", textAlign: "center", fontSize: 16 }}>
          Next
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "#004777",
    padding: 20,
    marginHorizontal: 140,
    borderRadius: 60,
    height: "1%",
  },
});
export default PretestsScreen;
