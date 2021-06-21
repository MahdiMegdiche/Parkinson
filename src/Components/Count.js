import * as React from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import Constants from 'expo-constants';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import array from '../screens/Dexterity';
import count from '../screens/Dexterity';
export default function Count() {
  //const [count, setCount] = React.useState(0)
 
  return (
    <View style={styles.container}>
     
     
    </View>
   
  );
  
}

const styles = StyleSheet.create({
  container: {
  
    marginBottom:250,
    marginTop:50,
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ffffff',
    padding: 8,
  

  }
});
