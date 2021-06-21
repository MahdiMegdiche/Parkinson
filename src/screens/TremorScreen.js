import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gyroscope } from "expo-sensors";
import CountDown from "react-native-countdown-component";
import { useNavigation } from "@react-navigation/native";
const score = (finalData) => {
  for (let i = 0; i < recordingPts.length; i++) {
  }
};
const TremorScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [finalData, setFinalData] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [isCompleted, setCompleted] = useState(false);
  const _slow = () => {
    Gyroscope.setUpdateInterval(500);
  };

  const _fast = () => {
    Gyroscope.setUpdateInterval(500);
  };

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener((gyroscopeData) => {
        setData(gyroscopeData);
        setFinalData((finalData) => [...finalData, gyroscopeData]);
        console.log(finalData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
    navigation.navigate("Drawing", { TremorScreen: ["Success"] });
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const { x, y, z } = data;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Gyroscope:</Text>
      <Text style={styles.text}>
        x: {round(x)} y: {round(y)} z: {round(z)}
      </Text>
      <View style={(styles.buttonContainer, styles.centerElement)}>
        <TouchableOpacity
          onPress={()=>{subscription ? _unsubscribe : _subscribe;
          
          }}
          style={styles.button}
        >
          <Text style={{ color: "#f2f2f2", fontSize: 16 }}>
            {subscription ? "Start" : "Finished"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function round(n) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  text: {
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#004777",
    padding: 40,
    flex: 1,
    marginLeft: 100,
    marginRight: 100,
    borderRadius: 15,
    height: "90%",
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
});

export default TremorScreen;
