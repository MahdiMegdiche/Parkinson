import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Dexterity from './Components/Dexterity';
import Search from './Components/Search'
import Count from './Components/Count'

export default class App extends React.Component {
  render (){
  return (
    <Dexterity/>
  );
  }
}

