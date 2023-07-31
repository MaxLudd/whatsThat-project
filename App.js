import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './components/LoginScreen';
import SignUp from './components/SignUpScreen';
import MainAppNav from './components/MainAppNav';
import DraftScreen from './components/DraftScreen';
import ProfileScreen from './components/ProfileScreen';
import AddContact from './components/AddContact';
import ViewBlocked from './components/ViewBlocked';
import TakePhoto from './components/TakePhoto';
import Chats from './components/Chats';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Profile() {
  return(
    <Stack.Navigator>
      <Stack.Screen name = "Profile" component={ProfileScreen}/>
      <Stack.Screen name = "TakePhoto" component={TakePhoto}/>
      <Stack.Screen name = "ViewBlocked" component={ViewBlocked}/>
    </Stack.Navigator>
  )
}

 function Contacts() {
   return(
     <Stack.Navigator>
       <Stack.Screen name = "Contacts" component={MainAppNav}/>
       <Stack.Screen name = "AddContact" component={AddContact}/>
     </Stack.Navigator>
   )
 }


function Home() {
  return(
    <Tab.Navigator>
        <Tab.Screen name = "Contacts" component={Contacts} options={{ headerShown: false }}/>
        <Tab.Screen name = "Chats" component={Chats} options={{ headerShown: false }}/>
        <Tab.Screen name ="Drafts" component={DraftScreen} options={{ headerShown: false }} />
        <Tab.Screen name = "Profile" component={Profile} options={{ headerShown: false}} />
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
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    
    );
  }

}


export default App

