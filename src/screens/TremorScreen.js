import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gyroscope } from "expo-sensors";
import { useNavigation } from "@react-navigation/native";
const score = (recordings) => {
  let resultat = "Healthy";
  recordings.map((i) => {
    i.x = Math.abs(i.x);
    i.y = Math.abs(i.y);
    i.z = Math.abs(i.z);
  });
  recordings.map((i) => {
    i.x = i.x * 0.16;
    i.y = i.y * 0.16;
    i.z = i.z * 0.16;
  });
  sus = recordings.filter((i) => {
    i.x > 5 || i.y > 5 || i.z > 5;
  });
  if (sus.length > sus.length) {
    resultat = "Suspect";
  }
  return resultat;
};
const TremorScreen = ({ route, navigation }) => {
  navigation = useNavigation();
  const { PreTremor } = route.params;
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [finalData, setFinalData] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [result, setResult] = useState(true);
  const [isCompleted, setCompleted] = useState(false);

  const finished = () => {
    setTimeout(() => {
      setCompleted({ isCompleted: true });
      subscription ? _unsubscribe : _subscribe;
    }, 10000);
  };
  const _slow = () => {
    Gyroscope.setUpdateInterval(1000);
  };

  const _fast = () => {
    Gyroscope.setUpdateInterval(1000);
  };

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener((gyroscopeData) => {
        setData(gyroscopeData);
        setFinalData((finalData) => [...finalData, gyroscopeData]);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    let porte = score(finalData);
    setResult(porte);
    setSubscription(false);
    setCompleted({ isCompleted: true });
    // navigation.navigate("Drawing", { TremorScreen: ["Success"] });
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const { x, y, z } = data;
  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Gyroscope:</Text>
      <Text style={styles.text}>
        x: {round(x)} y: {round(y)} z: {round(z)}
      </Text> */}
      <View style={(styles.buttonContainer, styles.centerElement)}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 30,
            marginLeft: 20,
            color: "#1985A1",
            textAlign: "center",
            marginBottom: "5%",
          }}
        >
          DEXTERITY TEST
        </Text>
        {(!isCompleted && (
          <TouchableOpacity
            onPress={subscription ? _unsubscribe : _subscribe}
            style={styles.button1}
          >
            <Text style={{ color: "#f2f2f2", fontSize: 16 }}>
              {subscription ? "Finish" : "Finished"}
            </Text>
          </TouchableOpacity>
        )) ||
          (isCompleted && (
            <View>
              <TouchableOpacity
                style={[styles.button1, styles.centerElement]}
                onPress={() => {
                  navigation.navigate("Final", {
                    FinalTest: [PreTremor, result],
                  });
                }}
              >
                <Text style={{ color: "#f2f2f2", fontSize: 16 }}>
                  Next Test
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  marginTop: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Rest Tremor Test finished!
              </Text>
              <Text style={{ textAlign: "center", fontSize: 14 }}>
                Click to go to the next test.
              </Text>
            </View>
          ))}
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
  centerElement: { justifyContent: "center", alignItems: "center" },
  button1: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "#004777",
    padding: 20,
    marginHorizontal: 100,
    borderRadius: 60,
    height: "1%",
    marginBottom: "50%",
  },
});

export default TremorScreen;
