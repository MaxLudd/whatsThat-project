import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './components/LoginScreen';
import SignUp from './components/SignUpScreen';
import MainAppNav from './components/MainAppNav';

const Stack = createNativeStackNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="SignUp" component={SignUp}/>
          <Stack.Screen name="Home" component={MainAppNav}/>
        </Stack.Navigator>
      </NavigationContainer>
    
    );
  }

}


export default App

