import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


class MainAppNav extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: ''
    }
  }

  handleEmailInput = (email) => {
    //validation
    this.setState({email: email})
  }

  handlePasswordInput = (pass) => {
    //validation
    this.setState({password: pass})
  }


  render() {

    const navigation = this.props.navigation;

    return (
      <View>
        <TextInput style={styles.input} placeholder="email" onChangeText={this.handleEmailInput} value={this.state.email} />
        <TextInput style={styles.input} placeholder="password" secureTextEntry={true} onChangeText={this.handlePasswordInput} value={this.state.password} />
        <Button title="Login" />
        <Button title="Don't have an account" onPress={() => navigation.navigate('SignUp')}/>
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