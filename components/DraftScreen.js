import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class DraftScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            draft: '',
            message: ''
        }

    }

    handleDraftInput = (draft) => {
        this.setState({draft: draft})
    }

    saveDraft = async () => {
        await AsyncStorage.setItem('@draft', this.state.draft);
        this.setState({message: 'Draft Saved'});
    }

    render(){
        return(
            <View>
                <TextInput style={styles.input} placeholder="Draft" onChangeText={this.handleDraftInput} value={this.state.draft} />
                <Button title="Save Draft" onPress={() => this.saveDraft()} />
                <Text style={styles.success}> {this.state.message} </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
      height: 100,
      margin: 12,
      borderWidth: 1,
      padding: 10,
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