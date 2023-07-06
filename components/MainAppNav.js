//import React, { Component } from 'react';
//import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';



//class MainAppNav extends Component {
  //constructor(props){
    //super(props);

  //}

  //render() {

    //const navigation = this.props.navigation;

    //return (
      //<View>
        //<Text>Welcome to WhatsThat</Text>
        
      //</View>
    
    //);
  //}

//}

//const styles = StyleSheet.create({
  //input: {
    //height: 40,
    //margin: 12,
    //borderWidth: 1,
    //padding: 10,
  //},
//});

//export default MainAppNav

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Button, TextInput, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';

const Contacts = ({ navigation }) => {
  const [contactData, setContactData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const route = useRoute();
  const { userId } = route.params;
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fadeAnimation = useRef(new Animated.Value(1)).current;

  const fadeOutMessages = useCallback(() => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: false,
    }).start(() => {
      setSuccessMessage('');
      setErrorMessage('');
      fadeAnimation.setValue(1);
    });
  }, [fadeAnimation]);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const response = await fetch('http://localhost:3333/api/1.0.0/contacts', {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': sessionToken,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        const formattedResults = data.map((item) => ({
          user_id: item.user_id,
          first_name: item.first_name,
          last_name: item.last_name,
          email: item.email,
        }));
        setContactData(formattedResults);
      } else {
        console.log('Failed to fetch contact data');
        setErrorMessage('Failed to fetch contact data.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setErrorMessage('An Unhandled Error occured please try again later');
    }
    fadeOutMessages();
  };

  const handleSearch = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');

      const queryParams = new URLSearchParams({
        q: searchText,
        search_in: 'contacts',
        limit: '20',
        offset: '0',
      });

      const url = `http://localhost:3333/api/1.0.0/search?${queryParams}`;

      const response = await fetch(url, {
        headers: {
          'X-Authorization': sessionToken,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        const formattedResults = data.map((item) => ({
          user_id: item.user_id,
          first_name: item.given_name,
          last_name: item.family_name,
          email: item.email,
        }));
        setContactData(formattedResults);
      } else {
        console.log('Failed to fetch search results');
        setErrorMessage('Failed to fetch search results.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setErrorMessage('An Unhandled Error occured please try again later');
    }
  };

  const handleRemoveContact = async (userId) => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      console.log('UserID', userId);
      const url = `http://localhost:3333/api/1.0.0/user/${userId}/contact`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': sessionToken,
        },
      });

      if (response.status === 200) {
        console.log('Contact removed successfully');
        fetchContactData();
        setSuccessMessage('Contact removed successfully.');
      } else if (response.status === 400) {
        console.log("You can't remove yourself as a contact");
        setErrorMessage('You cannot add yourself as a contact.');
      } else if (response.status === 401) {
        console.log('Unauthorized');
        setErrorMessage('Unauthorized.');
      } else if (response.status === 404) {
        console.log('User not found');
        setErrorMessage('User not found.');
      } else {
        setErrorMessage('An Server occured please try again later');
        console.log('Server error');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setErrorMessage('An Unhandled Error occured please try again later');
    }
  };

  const handleBlockContact = async (userId) => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');

      const url = `http://localhost:3333/api/1.0.0/user/${userId}/block`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': sessionToken,
        },
      });

      if (response.status === 200) {
        console.log('Contact blocked successfully');       
        fetchContactData();
        setSuccessMessage('Contact blocked successfully.');
      } else if (response.status === 400) {
        console.log("You can't block yourself");
        setErrorMessage('You cannot block yourself.');
      } else if (response.status === 401) {
        console.log('Unauthorized');
        setErrorMessage('Unauthorized.');
      } else if (response.status === 404) {
        console.log('User not found');
        setErrorMessage('User not found.');
      } else {
        console.log('Server error');
        setErrorMessage('A Server error occured. Please try again later.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setErrorMessage('An Unhandled Error occured. Please try again later');
    }
    
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchContactData();
      fadeOutMessages();
    });

    return unsubscribe;
  }, [navigation]);

  if (!contactData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading contact data...</Text>
      </View>
    );
  }
  const renderContactItem = ({ item }) => (
    <View style={styles.contactItem}>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveContact(item.user_id)}>
        <Icon name="trash" size={20} color="white" />
      </TouchableOpacity>
      <Text style={styles.contactName} key={item.user_id}>
        {`${item.first_name} ${item.last_name}`}
      </Text>
      <Text style={styles.contactEmail}>{item.email}</Text>
      <TouchableOpacity style={styles.blockButton} onPress={() => handleBlockContact(item.user_id)}>
        <Icon name="ban" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
  const navigateToAddContact = () => {
    navigation.navigate('Search');
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search..."
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search" size={20} color="white" />
        </TouchableOpacity>
        {contactData.length > 0 && (
          <TouchableOpacity style={styles.addButton} onPress={navigateToAddContact}>
            <Icon name="user-plus" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
      {contactData.length > 0 ? (
        <FlatList
          data={contactData}
          renderItem={renderContactItem}
          contentContainerStyle={styles.contactsContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noContactsContainer}>
          <Text style={styles.noContactsText}>No contacts found.</Text>
          <Button title="Add a Contact" onPress={navigateToAddContact} />
        </View>
      )}
      {successMessage ? (
        <Animated.View style={[styles.successMessage, { opacity: fadeAnimation }]}>
          <Text style={styles.messageText}>{successMessage}</Text>
        </Animated.View>
      ) : null}
      {errorMessage ? (
        <Animated.View style={[styles.errorMessage, { opacity: fadeAnimation }]}>
          <Text style={styles.messageText}>{errorMessage}</Text>
        </Animated.View>
      ) : null}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => navigation.navigate('Profile', { userId: userId })}>
          <Icon name="user" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => navigation.navigate('Chats' , { userId: userId })}>
          <Icon name="inbox" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => navigation.navigate('Contacts', { userId: userId })}>
          <Icon name="users" size={24} color="white" />
        </TouchableOpacity>
      </View>      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#014D4E',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    backgroundColor: 'white'
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#7FFFD4',
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 8,
    backgroundColor: '#5F9E8F',
    color: 'white',
  },
  searchButton: {
    backgroundColor: '#7FFFD4',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactsContainer: {
    padding: 16,
    paddingTop: 76,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 8,
  },
  contactItem: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    color: '#777',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
  },
  contactEmail: {
    fontSize: 14,
    color: '#777',
  },
  noContactsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContactsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: "white",
  },
  addButton: {
    backgroundColor: '#5F9E8F',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#7FFFD4',
    borderTopWidth: 1,
    backgroundColor: '#5F9E8F',
    borderTopColor: '#ccc',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    overflow: 'hidden',
  },
  bottomBarButton: {
    flex: 1,
    backgroundColor: '#5F9E8F',
    alignItems: 'center',
    paddingVertical: 12,
    borderColor: '#7FFFD4',
  },
  bottomBarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#5F9E8F',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockButton: {
    position: 'absolute',
    top: 8,
    right: 42,
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
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


export default Contacts;