import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            originalEmail: '',
            originalFirst_name: '',
            originalLast_name: '',
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            errorMessage: '',
            photo: null,
            isLoading: true
        }

        this.getUser();

    }

    componentDidMount(){
        this.getProfileImage()
    }


    getProfileImage = async () => {
        fetch("http://localhost:3333/api/1.0.0/user" + await AsyncStorage.getItem('@user_id') + "/photo", {
            method: "get",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("@session_token")
            }
        })
        .then((res) => {
            if(res.status === 200){
                return res.blob()
            }else {
                this.setState({errorMessage: 'Error while loading picture'})
                throw 'Picture error'
            }
            
        })
        .then((resBlob) => {
            let data = URL.createObjectURL(resBlob);

            this.setState({
                photo: data,
                isLoading: false
            })
        })
        .catch((err) => {
            console.log("Error is caught")
            console.log(err)
        })
    }

    //Get user function retrieves the user's data to be compared to any changed data
    getUser = async () => {
        let userID;
        try{
            userID = await AsyncStorage.getItem('@user_id');
            console.log(userID);
        }
        catch (error){
            console.log(error);
        }
        return fetch("http://localhost:3333/api/1.0.0/user/" + userID, {
            headers: {
                'X-Authorization': await AsyncStorage.getItem("@session_token")
            }
        })
        .then(async(response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
                await AsyncStorage.removeItem("@session_token")
                await AsyncStorage.removeItem("@user_id")
                navigation.navigate("LoginScreen")
                throw 'Unauthorized';
            }else if(response.status === 404){
                this.setState({errorMessage: 'User data not found'})
                throw 'Not Found';
            }else if(response.status === 500){
                this.setState({errorMessage: 'Server Error'})
                throw 'Server Error';
            }
        })
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                originalEmail: JSON.stringify(responseJson.email),
                originalFirst_Name: JSON.stringify(responseJson.first_name),
                originalLast_Name: JSON.stringify(responseJson.last_name)
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }

    //Update user function checks if changes have been made to the data, if so makes a patch request with the new data
    updateUser = async () => {
        let toSend = {};
        let userID;
        try{
            userID = await AsyncStorage.getItem('@user_id'); //HERE
        }
        catch (error){
            console.log(error);
        }
        if (this.state.first_name != this.state.originalFirst_name){
            toSend['first_name'] = this.state.first_name;
        }
        if (this.state.last_name != this.state.originalLast_name){
            toSend['last_name'] = this.state.last_name;
        }
        if (this.state.email != this.state.originalEmail){
            toSend['email'] = this.state.email;
        }

        console.log(JSON.stringify(toSend));

        return fetch("http://localhost:3333/api/1.0.0/user/" + userID, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem("@session_token")
            },
            body: JSON.stringify(toSend)
        })
        .then((response) => {
            if(response.status === 200){
                return response
            }else if(response.status === 400){
                this.setState({errorMessage: 'Bad Request'})
                throw 'Bad Request';
            }else if(response.status === 401){
                this.setState({errorMessage: 'Unauthorised'})
                throw 'Unauthorised';
            }else if(response.status === 403){
                this.setState({errorMessage: 'Forbidden'})
                throw 'Forbidden';
            }else if(response.status === 404){
                this.setState({errorMessage: 'User data could not be found'})
                throw 'Not Found';
            }else if(response.status === 500){
                throw 'Server Error';
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    //Logout function removes session token and user id from async storage
    logoutUser = async() => {
        return fetch("http://localhost:3333/api/1.0.0/logout" , {
            method: 'POST',
            headers: {
                'X-Authorization': await AsyncStorage.getItem("@session_token")
            },
        })
        .then(async (response) => {
            if (response.status === 200){
                await AsyncStorage.removeItem("@session_token")
                await AsyncStorage.removeItem("@user_id")
                navigation.navigate('LoginScreen')
            }else if(response.status === 401){
                await AsyncStorage.removeItem("@session_token")
                await AsyncStorage.removeItem("@user_id")
                throw 'Unauthorized';
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }


    //Input handlers
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
            <View style={styles.container}>
                {this.state.photo ? (
                    <View style={{flex:1}}>
                        <Image
                            source={{
                                uri: this.state.photo
                            }}
                            style={{
                                width: 100,
                                height: 100
                            }}
                        />
                    </View>
                ) : (
                    <Text>Loading</Text>
                )}
                <Button title="Take Picture" onPress={() => this.props.navigation.navigate("TakePhoto")}/>
                <TextInput style={styles.input} placeholder="First Name" onChangeText={this.handleFirstNameInput} value={this.state.first_name} />
                <TextInput style={styles.input} placeholder="Last Name" onChangeText={this.handleLastNameInput} value={this.state.last_name} />
                <TextInput style={styles.input} placeholder="email" onChangeText={this.handleEmailInput} value={this.state.email} />
                <Button title="Change" onPress={() => this.updateUser()} />
                <Button title="View Blocked Users" onPress={() => this.props.navigation.navigate("ViewBlocked")}/>
                <Button title="LOG OUT" onPress={() => this.logoutUser()} />
                <Text style={styles.error}> {this.state.errorMessage} </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#c9eff0',
        //justifyContent: 'space-between',
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    error: {
        margin: 12,
        color: 'red'
    },
  });

export default ProfileScreen