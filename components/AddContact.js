import React, { Component } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

class AddContact extends Component {
  constructor(props){
    super(props);

    this.state = {
      searchText: '',
      searchResults: [],
      successMessage: '',
      errorMessage: '',
      fadeAnimation: React.createRef(new Animated.Value(1)).current
    }
  }

  handleSearch = async () => {
    let sessionToken;
    try {
      sessionToken = await AsyncStorage.getItem('@session_token');
    }
    catch(error){
      console.log(error);
    }

    const queryParams = new URLSearchParams({
      q: this.state.searchText,
      search_in: 'all',
      limit: '20',
      offset: '0'
    });

    
    return fetch(`http://localhost:3333/api/1.0.0/search?${queryParams}`, {
      headers: {
        'X-Authorization': sessionToken
      }
    })
    .then(async(response) => {
      if(response.status === 200){
        return response.json()
      }else {
        console.log('Failed to fetch search results');
        this.setState({
          errorMessage: 'Failed to fetch search results'
        })
      }
    })
    .then((responseJson) => {
      const formattedResults = responseJson.map((item) => ({
        id: item.user_id,
        first_name: item.given_name || '',
        last_name: item.family_name || '',
        email: item.email || ''
      }));
      this.setState({
        searchResults: formattedResults
      })
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        errorMessage: 'Unhandled error occured'
      })
    });

  }

  handleAddContact = async (userId) => {
    let sessionToken;
    try {
      sessionToken = await AsyncStorage.getItem('@session_token');
    }
    catch(error){
      console.log(error);
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionToken
      }
    })
    .then(async(response) => {
      if(response.status === 200){
        console.log('Contact added successfully');
        //this.fetchContactData();
        this.setState({
          successMessage: 'Contact added successfully'
        })
      }else if(response.status === 400){
        console.log('Bad Request / Cant add yourself as contact');
        this.setState({
          errorMessage: 'Bad Request / Cant add yourself as contact'
        })
      }else if(response.status === 401){
        console.log('Unauthorized');
        this.setState({
          errorMessage: 'Unauthorized'
        })
      }else if(response.status === 404){
        console.log('User not found');
        this.setState({
          errorMessage: 'User not found'
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

  handleSearchInput = (searchText) => {
    this.setState({searchText: searchText})
  }

  renderContactItem = ({ item }) => (
    <View style={styles.contactItem}>
      <TouchableOpacity style={styles.contactItem} onPress={() => this.handleAddContact(item.id)}>
        <Text style={styles.contactName}>{`${item.first_name} ${item.last_name}`}</Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => this.handleAddContact(item.id)}>
          <Icon name="user-plus" size={20} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchText}
            onChangeText={this.handleSearchInput}
            placeholder="Search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => {this.handleSearch()}}>
            <Icon name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {/* <TextInput
          style={styles.searchInput}
          value={this.state.searchText}
          onChangeText={this.handleSearchInput}
          placeholder="Search..."
        />
        <TouchableOpacity style={styles.searchButton} onPress={this.handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity> */}
        <FlatList
          data={this.state.searchResults}
          renderItem={this.renderContactItem}
          // renderItem={({ item }) => (
          //   <TouchableOpacity style={styles.contactItem} onPress={() => this.handleAddContact(item.id)}>
          //     <Text style={styles.contactName}>{`${item.first_name} ${item.last_name}`}</Text>
          //     <Text style={styles.contactEmail}>{item.email}</Text>
          //     <TouchableOpacity style={styles.addButton} onPress={() => this.handleAddContact(item.id)}>
          //       <Icon name="user-plus" size={20} color="white" />
          //     </TouchableOpacity>
          //   </TouchableOpacity>
          // )}
          contentContainerStyle={styles.contactsContainer}
          keyExtractor={(item) => item.id}

        />
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
    //padding: 16,
    backgroundColor: '#c9eff0',
    justifyContent: 'space-between',
  },
  contactsContainer: {
    padding: 16,
    paddingTop: 30,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    marginBottom: 16,
    backgroundColor: 'white'
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#c9eff0',
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 8,
    color: 'black',
  },
  searchButton: {
    backgroundColor: '#77DD77',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
    color: '#808080',
  },
  contactEmail: {
    fontSize: 14,
    color: '#808080',
  },
  addButton: {
    backgroundColor: '#5F9E8F',
    marginLeft: 8,
    position: 'absolute',
    top: 8,
    right: 8,
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
    borderRadius: 4,
  },
  errorMessage: {
    backgroundColor: 'red',
    padding: 8,
    marginTop: 16,
    borderRadius: 4,
  },
  messageText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddContact;