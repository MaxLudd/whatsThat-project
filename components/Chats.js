import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Chats extends Component {
  constructor(props){
    super(props);

    this.state = {
      chats: [],
      showStartChat: true,
      chatName: ''
    }
  }

  componentDidMount(){
    this.fetchChats();
  }

  fetchChats = async () => {
    let sessionToken;
    try {
      sessionToken = await AsyncStorage.getItem('@session_token');
    }
    catch (error){
      console.log(error);
    }
    return fetch("http://localhost:3333/api/1.0.0/chat", {
      headers: {
        'X-Authorization': sessionToken
      }
    })
    .then(async(response) => {
      if(response.status === 200){
        return response.json()
      }else {
        console.log('Failed to fetch chat data');
      }
    })
    .then((responseJson) => {
      const formattedResults = responseJson.map((item) => ({
        chat_id: item.chat_id,
        name: item.name,
        creator_first_name: item.creator.first_name,
        creator_last_name: item.creator.last_name,
        last_message: item.last_message.message
        
        //user_id: item.user_id,
        //first_name: item.first_name,
        //last_name: item.last_name,
        //email: item.email
      }));
      
      this.setState({
        chats: formattedResults
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <Text style={styles.chatItemText}>{item.name}</Text>
      <Text style={styles.chatItemCreator}>Created by: {item.creator_first_name} {item.creator_last_name}</Text>
      <Text style={styles.chatItemLastMessage}>Last Message: {item.last_message}</Text>
    </TouchableOpacity>
  )

  handleChatNameUpdate = () => {
    this.fetchChats();
  }

  handleCloseStartChat = () => {
    this.setState({
      showStartChat: false
    })
  }

  handleStartChat = async () => {
    let sessionToken;
    try {
      sessionToken = await AsyncStorage.getItem('@session_token');
    }
    catch (error){
      console.log(error);
    }

    return fetch("http://localhost:3333/api/1.0.0/chat", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionToken
      },
      body: JSON.stringify({
        name: this.state.chatName
      })
    })
    .then(async(response) => {
      if(response.status === 201){
        return response.json;
      }else {
        console.log('Failed to create chat');
      }
    })
    .then(async(responseJson) => {
      const { chat_id } = responseJson;
      console.log('Chat created successfully');
      await AsyncStorage.setItem('chat_id', chat_id);
      console.log('Chat Id stored: ', chat_id);
      //this.handleCloseStartChat();
      this.fetchChats();
    })
    .catch((error) => {
      console.log('Unhandled error');
      console.log(error);
    })

  }

  handleChatNameInput = (chatName) => {
    this.setState({
      chatName: chatName
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.startChatContainer}>
          <View style={styles.startChatHeader}>
            <Text style={styles.startChatTitle}>Start a Chat</Text>
            {/* <TouchableOpacity onPress={this.handleCloseStartChat}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity> */}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Chat Name"
            onChangeText={this.handleChatNameInput}
          />
          <TouchableOpacity style={styles.createChatButton} onPress={this.handleStartChat}>
            <Text style={styles.createChatButtonText}>Start Chat</Text>
          </TouchableOpacity>
        </View>
        {/* {this.state.showStartChat  &&(
          <View style={styles.startChatContainer}>
            <View style={styles.startChatHeader}>
              <Text style={styles.startChatTitle}>Start a Chat</Text>
              <TouchableOpacity onPress={this.handleCloseStartChat}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Chat Name"
              onChangeText={this.handleChatNameInput}
            />
            <TouchableOpacity style={styles.createChatButton} onPress={this.handleStartChat}>
              <Text style={styles.createChatButtonText}>Start Chat</Text>
            </TouchableOpacity>
          </View>
        )} */}
        
          {this.state.chats.length > 0 ? (
            <FlatList
              data={this.state.chats}
              renderItem={this.renderChatItem}
              keyExtractor={(item) => item.chat_id}
              contentContainerStyle={styles.chatContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.startChatContainer}>
              <Text style={styles.startChatTitle}>Start a Chat</Text>
            </View>
          )}
          {!this.state.showStartChat && (
            <TouchableOpacity style={styles.startChatButton} onPress={() => this.setState({showStartChat: true})}>
              <Feather name="message-square" size={24} color="white" />
            </TouchableOpacity>
          )}
        
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c9eff0',
    justifyContent: 'space-between',
  },
  chatContainer: {
    padding: 16,
    paddingTop: 30,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 8,
  },
  startChatContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8, 
    margin: 8, 
  },
  startChatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    color: 'white',
  },
  startChatTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  // closeButton: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  // },
  // startChatButton: {
  //   position: 'absolute',
  //   top: 16,
  //   right: 16,
  //   padding: 8,
  //   borderRadius: 50,
  //   color: 'white',
  //   backgroundColor: '#77DD77',
  // },
  chatItem: {
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  chatItemText: {
    fontSize: 16,
  },
  chatItemCreator: {
    fontSize: 14,
    color: '#808080',
  },
  chatItemLastMessage: {
    fontSize: 14,
    color: '#808080',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    marginBottom: 8,
    paddingLeft: 8,
    color: 'white',
    //backgroundColor: '#77DD77',
    borderColor: '#c9eff0',
  },
  createChatButton: {
    backgroundColor: '#77DD77',
    padding: 10,
    borderRadius: 4,
    marginTop: 16,
  },
  createChatButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Chats;