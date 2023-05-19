import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

class SignUpScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: '',
      first_name: '',
      last_name: ''
    }
  }

  handleFirstNameInput = (first_name) => {
    //validation
    this.setState({first_name: first_name})
  }

  handleLastNameInput = (last_name) => {
    //validation
    this.setState({last_name: last_name})
  }

  handleEmailInput = (email) => {
    //validation
    this.setState({email: email})
  }

  handlePasswordInput = (pass) => {
    //validation
    this.setState({password: pass})
  }

  signup = () => {
    //validation here

    return fetch("http://localhost:3333/api/1.0.0/user", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
    })
    .then((response) => {
        if(response.status === 201){
            return response.json()
        }else if (response.status === 400){
            throw 'Failed Validation';
        }else{
            throw 'Something went wrong'
        }
    })
    .then((responseJson) => {
        console.log("User created with ID: ", responseJson);
        this.props.navigation.navigate("Login");
    })
    .catch((error) => {
        console.log(error);
    })
  }


  render() {

    const navigation = this.props.navigation;

    return (
      <View>
        <TextInput style={styles.input} placeholder="First Name" onChangeText={this.handleFirstNameInput} value={this.state.first_name} />
        <TextInput style={styles.input} placeholder="Last Name" onChangeText={this.handleLastNameInput} value={this.state.last_name} />
        <TextInput style={styles.input} placeholder="email" onChangeText={this.handleEmailInput} value={this.state.email} />
        <TextInput style={styles.input} placeholder="password" secureTextEntry={true} onChangeText={this.handlePasswordInput} value={this.state.password} />
        <Button title="Register" onPress={() => this.signup()}/>
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

export default SignUpScreen