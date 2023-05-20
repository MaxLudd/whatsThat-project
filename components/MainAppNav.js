import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';



class MainAppNav extends Component {
  constructor(props){
    super(props);

  }

  render() {

    const navigation = this.props.navigation;

    return (
      <View>
        <Text>Welcome to WhatsThat</Text>
        
      </View>
    
    );
  }

}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default MainAppNav