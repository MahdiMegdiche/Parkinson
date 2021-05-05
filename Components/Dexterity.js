import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import Count from '../Components/Count'
let array = []
class Dexterity extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  onPress = () => {
    this.setState({
      count: this.state.count + 1
    });
     
     array.push((new Date()).getTime())
  
     
  };

  render() {
    const { count } = this.state;
    return ( 
      <View style={styles.container}>
      
        <Count/>
       
        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
        <TouchableOpacity
          style={styles.button1}
          onPress={this.onPress}
        >
          
    
        </TouchableOpacity>
        
       </View>
       <View style={styles.countContainer}>
          <Text>Count: {count} {'\n'}
           fréquence:{count/30}{'\n'}
          </Text>

       
        </View>
 
      </View>
     
    );

  
  }
 
}

const styles = StyleSheet.create({
  container: {
    marginTop:20,
    justifyContent: "center",
    paddingHorizontal: 10,

    
  },
  button1: {
    alignItems: "center",
    backgroundColor: "#004777",
    padding: 40,
    flex:1,
    marginLeft:100,
    marginRight:100,
    borderRadius: 15

  },
  button2: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 40,
    flex:1,
    marginRight:40,
    marginLeft:10,
    borderRadius: 15

  },
 
  countContainer: {
    alignItems: "center",
    padding: 10

 
  }
});

export default Dexterity;