import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';

class ProfileScreen extends Component{
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

    render() {
        return(
            <View>
                <TextInput style={styles.input} placeholder="First Name" onChangeText={this.handleFirstNameInput} value={this.state.first_name} />
                <TextInput style={styles.input} placeholder="Last Name" onChangeText={this.handleLastNameInput} value={this.state.last_name} />
                <TextInput style={styles.input} placeholder="email" onChangeText={this.handleEmailInput} value={this.state.email} />
                <TextInput style={styles.input} placeholder="password" secureTextEntry={true} onChangeText={this.handlePasswordInput} value={this.state.password} />
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

export default ProfileScreen