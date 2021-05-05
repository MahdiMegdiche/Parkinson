import * as React from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import Constants from 'expo-constants';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import array from './Dexterity';
export default function Count() {
  const [count, setCount] = React.useState(0)
  if(remainingTime===0){
    console.log(array)
    }
  return (
    <View style={styles.container}>
      <CountdownCircleTimer
        size={100}
        isPlaying
        duration={30}
        colors="#004777"
        onComplete={() => {
          console.log('ON_COMPLETE BEFORE RETURN')
          return [false, 0]
        }}
      >
        {({ remainingTime, animatedColor }) => ( 
           
            
          <Animated.Text
            style={{ ...styles.remainingTime, color: animatedColor }}>
            {remainingTime}
           
          </Animated.Text>
        )}
      </CountdownCircleTimer>
     
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
  

  },
  remainingTime: {
    fontSize: 20,

  
  },
});
