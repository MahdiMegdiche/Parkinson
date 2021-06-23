import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
//import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import CountDown from "react-native-countdown-component";
import { useNavigation } from "@react-navigation/native";
let recordingPts = [];
let x = [];
const displayArray = (anyArray) => {
  arrayLog = "";
  for (let i = 0; i < anyArray.length; i++) {
    arrayLog += i;
  }
};
const calculVariance = (recordingPts) => {
  var len = 0;
  var sum = 0;
  for (var i = 0; i < recordingPts.length; i++) {
    if (recordingPts[i] == "") {
    } else if (isNaN(recordingPts[i])) {
      alert(recordingPts[i] + " is not number, Variance Calculation failed!");
      return 0;
    } else {
      len = len + 1;
      sum = sum + parseFloat(recordingPts[i]);
    }
  }
  var v = 0;
  if (len > 1) {
    var mean = sum / len;
    for (var i = 0; i < recordingPts.length; i++) {
      if (recordingPts[i] == "") {
      } else {
        v = v + (recordingPts[i] - mean) * (recordingPts[i] - mean);
      }
    }
    return v / len;
  } else {
    return 0;
  }
};
const pointsValidity = (recordingPts) => {
  let longueur = 0;
  let nbInterval = 0;
  let aux = 0;
  let monotonyIntervals = [];
  let pentepositive = 0;
  for (let i = 0; i < recordingPts.length; i++) {
    if (recordingPts[i] < recordingPts[i + 1]) {
      pentepositive += 1;
    }
  }
  if (pentepositive <= 16) {
    x = [...x, "suspected"];
  }
  if (pentepositive > 16) {
    x = [...x, "Healthy"];
  }
  return;
};
const score = (recordingPts) => {
  variance = calculVariance(recordingPts);
  console.log("Variance is ", variance);
  if (variance < 1.5) {
    x = [...x, "Healthy"];
    // navigation.navigate('Tremor', { DexterityTest: [x,recordingPts] })
  } else {
    validity = pointsValidity(recordingPts);
  }
  // console.log("Dexterity score", x);
  return x;
};
const update = (countsPerSecond) => {
  recordingPts.push(countsPerSecond);
};
const DexterityScreen = () => {
  const navigation = useNavigation();
  const [isCompleted, setCompleted] = useState(false);
  const [count, setCount] = useState(0);
  const [isButtonDisabled, setDisabled] = useState(false);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState("");
  return (
    <View style={[styles.container, styles.centerElement]}>
      <View style={{ paddingBottom: 32 }}>
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
        <Text
          style={{
            color: "#373636",
            textAlign: "center",
            fontSize: 16,
            marginBottom: "40%",
            marginHorizontal: 2,
          }}
        >
          Tap on the button alternating between your index and middle finger
          with a steady rhythm
        </Text>
        <CountDown
          digitStyle={{ backgroundColor: "#004677" }}
          digitTxtStyle={{ color: "#f2f2f2" }}
          size={40}
          until={30}
          running={started}
          timeToShow={["S"]}
          onChange={() => {
            update(count);
            setCount(0);
          }}
          onFinish={() => {
            setCompleted({ isCompleted: true });
            // console.log("The recorded points are:", recordingPts);
            let a = score(recordingPts);
            setResult(a);
            return [false, 0];
          }}
        ></CountDown>
      </View>
      <View
        style={{
          alignContent: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          height: "20%",
        }}
      >
        {(!isCompleted && (
          <TouchableOpacity
            style={[styles.button1, styles.centerElement]}
            onPress={() => {
              setCount(count + 1);

              if (count == 1) {
                setStarted({ Started: true });
                setTimeout(() => {
                  setCompleted({ isCompleted: true });
                }, 30000);
              }
            }}
          >
            <Text style={{ color: "#f2f2f2", fontSize: 16 }}>Tap here</Text>
          </TouchableOpacity>
        )) ||
          (isCompleted && (
            <View>
              <TouchableOpacity
                style={[styles.button1, , styles.centerElement]}
                onPress={() => {
                  // console.log("ahi résultat",result)
                  navigation.navigate("PreTremor", {
                    Test: [result, recordingPts],
                  });
                }}
              >
                <Text style={{ color: "#f2f2f2", fontSize: 16 }}>
                  Next Test
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  color: "#373636",
                  marginTop: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Dexterity Test finished!
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
    borderRadius: 30,
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

export default DexterityScreen;
