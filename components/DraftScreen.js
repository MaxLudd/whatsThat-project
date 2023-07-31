import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class DraftScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            draft: '',
            message: ''
        }

    }

    //Input handler
    handleDraftInput = (draft) => {
        this.setState({draft: draft})
    }

    //Save draft function strores draft in async memory
    saveDraft = async () => {
        await AsyncStorage.setItem('@draft', this.state.draft);
        this.setState({message: 'Draft Saved'});
    }

    render(){
        return(
            <View style={styles.container}>
                <TextInput style={styles.input} placeholder="Draft" onChangeText={this.handleDraftInput} value={this.state.draft} />
                <TouchableOpacity style={styles.button} onPress={() => this.saveDraft()}>
                    <Text style={styles.buttonText}>Save Draft</Text>
                </TouchableOpacity>
                <Text style={styles.success}> {this.state.message} </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        //borderColor: 'gray',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#c9eff0',
        //justifyContent: 'space-between',
    },
    button: {
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

    buttonText: {
        color: 'black',
        fontWeight: 'bold'
      },
    error: {
      margin: 12,
      color: 'red'
    },
    success: {
        margin: 12,
        color: 'green'
    }
  });

export default DraftScreen