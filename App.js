import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './components/LoginScreen';
import SignUp from './components/SignUpScreen';
import MainAppNav from './components/MainAppNav';
import DraftScreen from './components/DraftScreen';
import ProfileScreen from './components/ProfileScreen'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Home() {
  return(
    <Tab.Navigator>
        <Tab.Screen name = "Home" component={MainAppNav} options={{ headerShown: false }}/>
        <Tab.Screen name ="Drafts" component={DraftScreen} options={{ headerShown: false }} />
        <Tab.Screen name = "Profile" component={ProfileScreen} options={{ headerShown: false}} />
    </Tab.Navigator>
  );
}

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="SignUp" component={SignUp}/>
          <Stack.Screen name="Home" component={Home}/>
        </Stack.Navigator>
      </NavigationContainer>
    
    );
  }

}


export default App

