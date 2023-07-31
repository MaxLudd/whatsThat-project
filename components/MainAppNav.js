import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Button, TextInput, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';


class MainAppNav extends Component {
  constructor(props){
    super(props);

    this.state = {
      contactData: [],
      searchText: '',
      successMessage: '',
      errorMessage: '',
      //fadeAnimation?
      fadeAnimation: React.createRef(new Animated.Value(1)).current
    }
  }

  componentDidMount(){
    this.fetchContactData();
    const unsubscribe = this.props.navigation.addListener('focus', () => {
          this.fetchContactData();
        });
      
        return unsubscribe;
  }

  fetchContactData = async () => {
    let sessionToken;
    try {
      sessionToken = await AsyncStorage.getItem('@session_token');
    }
    catch (error){
      console.log(error);
    }
    return fetch("http://localhost:3333/api/1.0.0/contacts", {
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionToken
      }
    })
    .then(async(response) => {
      if(response.status === 200){
        return response.json()
      }else if(response.status === 401){
        console.log('Failed to fetch contact data: Unauthorized');
        this.setState({
          errorMessage: 'Failed to fetch contact data: Unauthorized'
        })
      }else if(response.status === 500){
        console.log('Failed to fetch contact data: Server Error')
        this.setState({
          errorMessage: 'Failed to fetch contact data: Server Error'
        })
      }
    })
    .then((responseJson) => {
      const formattedResults = responseJson.map((item) => ({
        user_id: item.user_id,
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email
      }));
      this.setState({
        contactData: formattedResults
      })
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        errorMessage: 'Unhandled error occured'
      })
    });
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
      search_in: 'contacts',
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
      }else if(response.status === 400){
        console.log('Failed to fetch search results: Bad Request');
        this.setState({
          errorMessage: 'Failed to fetch search results: Bad Request'
        })
      }else if(response.status === 401){
        console.log('Failed to fetch search results: Unauthorised');
        this.setState({
          errorMessage: 'Failed to fetch search results: Unauthorised'
        })
      }else if(response.status === 500){
        console.log('Failed to fetch search results: Server Error');
        this.setState({
          errorMessage: 'Failed to fetch search results: Server Error'
        })
      }
    })
    .then((responseJson) => {
      const formattedResults = responseJson.map((item) => ({
        user_id: item.user_id,
        first_name: item.given_name,
        last_name: item.family_name,
        email: item.email
      }));
      this.setState({
        contactData: formattedResults
      })
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        errorMessage: 'Unhandled error occured'
      })
    });
  }

  handleRemoveContact = async (userId) => {
    let sessionToken;
    try {
      sessionToken = await AsyncStorage.getItem('@session_token');
      console.log('UserID', userId);
    }
    catch(error){
      console.log(error);
    }
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionToken
      }
    })
    .then(async(response) => {
      if(response.status === 200){
        console.log('Contact removed successfully');
        this.fetchContactData();
        this.setState({
          successMessage: 'Contact removed successfully'
        })
      }else if(response.status === 400){
        console.log('Bad Request / Cant remove yourself as contact');
        this.setState({
          errorMessage: 'Bad Request / Cant remove yourself as contact'
        })
      }else if(response.status === 401){
        console.log('Failed to remove contact: Unauthorized');
        this.setState({
          errorMessage: 'Failed to remove contact: Unauthorized'
        })
      }else if(response.status === 404){
        console.log('User not found');
        this.setState({
          errorMessage: 'User not found'
        })
      }else if(response.status === 500){
        console.log('Failed to remove contact: Server Error');
        this.setState({
          errorMessage: 'Failed to remove contact: Server Error'
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

  handleBlockContact = async (userId) => {
    let sessionToken;
    try {
      sessionToken = await AsyncStorage.getItem('@session_token');
    }
    catch(error){
      console.log(error);
    }
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionToken
      }
    })
    .then(async(response) => {
      if(response.status === 200){
        console.log('Contact blocked successfully');
        this.fetchContactData();
        this.setState({
          successMessage: 'Contact blocked successfully'
        })
      }else if(response.status === 400){
        console.log('Bad Request / Cant block yourself');
        this.setState({
          errorMessage: 'Bad Request / Cant block yourself'
        })
      }else if(response.status === 401){
        console.log('Failed to block contact: Unauthorized');
        this.setState({
          errorMessage: 'Failed to block contact: Unauthorized'
        })
      }else if(response.status === 404){
        console.log('User not found');
        this.setState({
          errorMessage: 'User not found'
        })
      }else if(response.status === 500){
        console.log('Failed to block contact: Server error');
        this.setState({
          errorMessage: 'Failed to block contact: Server error'
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


  renderContactItem = ({ item }) => (
    <View style={styles.contactItem}>
      <TouchableOpacity style={styles.removeButton} onPress={() => {this.handleRemoveContact(item.user_id)}}>
        <Icon name="trash" size={20} color="white" />
      </TouchableOpacity>
      <Text style={styles.contactName} key={item.user_id}>
        {`${item.first_name} ${item.last_name}`}
      </Text>
      <Text style={styles.contactEmail}>
        {item.email}
      </Text>
      <TouchableOpacity style={styles.blockButton} onPress={() => {this.handleBlockContact(item.user_id)}}>
        <Icon name="ban" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  handleSearchInput = (searchText) => {
    this.setState({searchText: searchText})
  }

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
          {this.state.contactData.length > 0 && (
            <TouchableOpacity style={styles.addButton} onPress={() => {this.props.navigation.navigate("AddContact")}}>
              <Icon name="user-plus" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
        {this.state.contactData.length > 0 ? (
          <FlatList
            data={this.state.contactData}
            renderItem={this.renderContactItem}
            contentContainerStyle={styles.contactsContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          
          <View style={styles.noContactsContainer}>
             <Text style={styles.noContactsText}>No contacts found</Text>
             <Button title="Add a contact" onPress={() => this.props.navigation.navigate("AddContact")} />
          </View>
        )}
        {this.state.successMessage ? (
          <Animated.View style={[styles.successMessage, { opacity: this.state.fadeAnimation}]}>
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
    //color: '#777',
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
    backgroundColor: '#AEC6CF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#AEC6CF',
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


export default MainAppNav;