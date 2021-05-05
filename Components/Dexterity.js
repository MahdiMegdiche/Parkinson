import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import Count from "../Components/Count";

let array = [];
function variance(array) {
  var len = 0;
  var sum = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i] == "") {
    } else if (!isNum(array[i])) {
      alert(array[i] + " is not number, Variance Calculation failed!");
      return 0;
    } else {
      len = len + 1;
      sum = sum + parseFloat(array[i]);
    }
  }
  var v = 0;
  if (len > 1) {
    var mean = sum / len;
    for (var i = 0; i < array.length; i++) {
      if (array[i] == "") {
      } else {
        v = v + (array[i] - mean) * (array[i] - mean);
      }
    }
    return v / len;
  } else {
    return 0;
  }
}
function update(countsPerSecond) {
  array.push(countsPerSecond);
  countsPerSecond = 0;
}
class Dexterity extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  onPress = () => {
    this.setState({
      count: this.state.count + 1,
    });
  
  };

  render() {
    const { count } = this.state;
    return (
      <View style={styles.container}>
        <CountdownCircleTimer
          size={100}
          isPlaying={count >= 1}
          duration={30}
          colors="#004777"
          onComplete={() => {
            console.log(array);
            return [false, 0];
          }}
        >
          {({ remainingTime, animatedColor }) => (
            
            <Animated.Text
              style={{ ...styles.remainingTime, color: animatedColor }}
            > 
              {remainingTime}
              
            </Animated.Text>
          )}
        </CountdownCircleTimer>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <TouchableOpacity
            style={styles.button1}
            onPress={this.onPress}
          ></TouchableOpacity>
        </View>
        <View style={styles.countContainer}>
          <Text>
            Count: {count} {"\n"}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    justifyContent: "center",
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
  },
  button2: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 40,
    flex: 1,
    marginRight: 40,
    marginLeft: 10,
    borderRadius: 15,
  },

  countContainer: {
    alignItems: "center",
    padding: 10,
  },
  remainingTime: {
    fontSize: 20,
  },
});

export default Dexterity;
