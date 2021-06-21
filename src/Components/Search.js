import React from 'react' 
import {StyleSheet, View,Button,TextInput,Image,Text} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Logo from './Logo'
import * as Font from 'expo-font'
import Count from './Count'
class Search extends React.Component{
    render() {
        return (
         
            <View style={styles.ajustement}>
                <LinearGradient
                             // Background Linear Gradient
                             colors={['#1985A1', '#1985A9', '#ffffff']}
                                     style={styles.background}
                                         />
             <Logo style={{height:300, maxHeight:300,maxWidth:300,marginTop:20, marginLeft:50}}/>
             <Text style={ {fontWeight: 'bold', fontSize: 30,marginLeft:20,color:"#1985A1"}}>
                    
                PARKINSON'S DISEASE</Text>
              <TextInput style={[styles.textinput,{marginTop:30}]} 
               placeholder="email" placeholderTextColor = "#ffffff"/>
               <TextInput style={[styles.textinput,{marginTop:5}]}
               placeholder="mot de passe " placeholderTextColor = "#ffffff"/>
              <Button  color="#1985A1" title="se connecter" onPress={()=> {}}/>
              <Button  color="#1985A1" title="s'inscrire" onPress={()=> {}}/>
           
            </View>
             
        )
    }
}
const styles=StyleSheet.create({
    textinput:{
       
        backgroundColor:'#1985A1',
        marginLeft:5, 
        marginRight:5,
        height:50, 
        borderColor:'#1985A1',
        borderWidth:1, 
        paddingLeft:5 },

    background: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 400,
          },
    ajustement:{
           flex: 1,
           justifyContent: 'center',
           backgroundColor:'#ffffff'

        },
        
  
})
export default Search