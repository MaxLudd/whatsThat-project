import React, { useEffect, useState , useCallback, useRef, Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Animated} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

class ViewBlocked extends Component {
  constructor(props){
    super(props);

    this.state = {
      blockedContacts: [],
      successMessage: '',
      errorMessage: '',
      fadeAnimation: React.createRef(new Animated.Value(1)).current
    }
  }

  componentDidMount(){
    this.fetchBlockedContacts();
  }

  fetchBlockedContacts = async () => {
    let sessionToken;
    try {
      sessionToken = await AsyncStorage.getItem('@session_token');
    }
    catch(error){
      console.log(error);
    }

    return fetch("http://localhost:3333/api/1.0.0/blocked", {
      headers: {
        'X-Authorization': sessionToken
      }
    })
    .then(async(response) => {
      if(response.status === 200){
        return response.json()
      }else {
        console.log('Failed to fetch blocked contact data');
        this.setState({
          errorMessage: 'Failed to fetch blocked contact data'
        })
      }
    })
    .then((responseJson) => {
      this.setState({
        blockedContacts: responseJson
      })
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        errorMessage: 'Unhandled error occured'
      })
    });

  }

  handleUnblockContact = async (userId) => {
    let sessionToken;
    try {
      sessionToken = await AsyncStorage.getItem('@session_token');
    }
    catch(error){
      console.log(error);
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
      method: 'delete',
      headers: {
        'X-Authorization': sessionToken
      }
    })
    .then(async(response) => {
      if(response.status === 200){
        console.log('Contact unblocked successfully');
        this.fetchBlockedContacts();
        this.setState({
          successMessage: 'Contact unblocked successfully'
        })
      }else {
        console.log('Failed to unblock contact');
        this.setState({
          errorMessage: 'Failed to unblock contact'
        })
      }
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        errorMessage: 'Unhandled error occurred'
      })
    });

  }

  renderBlockedContactItem = ({ item }) => (
    <View style={styles.contactItem}>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => this.handleUnblockContact(item.user_id)}
      >
        <Text style={styles.buttonText}>Unblock</Text>
      </TouchableOpacity>
      <Text style={styles.contactName}>{`${item.first_name} ${item.last_name}`}</Text>
      <Text style={styles.contactEmail}>{item.email}</Text>
    </View>
  )

  render() {
    return (
      <View style={styles.container}>
        {this.state.blockedContacts.length > 0 ? (
          <FlatList
            data={this.state.blockedContacts}
            renderItem={this.renderBlockedContactItem}
            contentContainerStyle={styles.contactsContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noBlockedContactsContainer}>
            <Text style={styles.noBlockedContactsText}>No blocked contacts.</Text>
          </View>
        )}
        {this.state.successMessage ? (
          <Animated.View style={[styles.successMessage, { opacity: this.state.fadeAnimation }]}>
            <Text style={styles.messageText}>{this.state.successMessage}</Text>
          </Animated.View>
        ) : null}
        {this.state.errorMessage ? (
          <Animated.View style={[styles.errorMessage, { opacity: this.state.fadeAnimation }]}>
            <Text style={styles.messageText}>{this.state.errorMessage}</Text>
          </Animated.View>
        ) : null}
      </View>

    )
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c9eff0',
  },
  contactsContainer: {
    padding: 16,
    paddingTop: 30,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 8,
  },
  contactItem: {
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactEmail: {
    fontSize: 14,
    color: '#808080',
  },
  unblockButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#5F9E8F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noBlockedContactsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBlockedContactsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'Black',
  },
  successMessage: {
    backgroundColor: '#5F9E8F',
    padding: 8,
    marginTop: 16,
    borderRadius: 10,
  },
  errorMessage: {
    backgroundColor: 'red',
    padding: 8,
    marginTop: 16,
    borderRadius: 10,
  },
  messageText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ViewBlocked;