import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: '',
      errorMessage: ''
    }
  }

  //Input handlers
  handleEmailInput = (email) => {
    //validation
    this.setState({email: email})
  }

  handlePasswordInput = (pass) => {
    //validation
    this.setState({password: pass})
  }

  //Login function sends post request with user inputs, stores session token and user id in async memory
  login = async () => {
    //validation
    let toSend = {};
    toSend['email'] = this.state.email;
    toSend['password'] = this.state.password;
    return fetch("http://localhost:3333/api/1.0.0/login", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend)
    })
    .then((response) => {
        if(response.status === 200){
            return response.json()
        }else if(response.status === 400){
            this.setState({errorMessage: 'Your email and password are incorrect'});
            throw 'Invalid email or password';
        }else{
            this.setState({errorMessage: 'Something went wrong'});
            throw 'Something went wrong';
        }
    })
    .then(async (responseJson) => {
        console.log(responseJson);
        console.log(responseJson.token);
        await AsyncStorage.setItem('@session_token', responseJson.token);
        await AsyncStorage.setItem('@user_id', responseJson.id);
        this.props.navigation.navigate("Home");
    })
    .catch((error) => {
        console.log(error);
    })
  }


  render() {

    const navigation = this.props.navigation;

    return (
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="email" onChangeText={this.handleEmailInput} value={this.state.email} />
        <TextInput style={styles.input} placeholder="password" secureTextEntry={true} onChangeText={this.handlePasswordInput} value={this.state.password} />
        <TouchableOpacity style={styles.loginButton} onPress={() => this.login()}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Don't have an account</Text>
        </TouchableOpacity>
        <Text style={styles.error}> {this.state.errorMessage}</Text>
      </View>
    
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    //borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  error: {
    margin: 12,
    color: 'red'
  },
  loginButton: {
    margin: 12,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    color: 'black',
    backgroundColor: '#77DD77',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 0
  },
  signupButton: {
    margin: 12,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    backgroundColor: '#AEC6CF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold'
  }
});

export default LoginScreen