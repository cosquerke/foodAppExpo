import React, { Component } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, FlatList, Image } from 'react-native';

const baseURL = 'https://api.spoonacular.com/food/ingredients/autocomplete?query=';
//const apiKeyQueryString = "&apiKey=4538c45f84234eb0bb890d57be2d6398"
//const apiKeyQueryString = "&apiKey=5538cdbd824f4e70baababf038847459"
const apiKeyQueryString = "&apiKey=4bfb490dcd154b098a7177a9f8b80299"

const dao = {
    findAllergyByName: async (ingredient_name) => {
      const url = `${baseURL}${ingredient_name}&number=5${apiKeyQueryString}`;
      console.log(url)
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        return [];
      }
    },
  }

  class AllergySearch extends Component {
    constructor(props) {
      super(props);
      this.state = {
        query: '',
        ingredients: [],
      };
    }
  
    handleInputChange = async (text) => {
      this.setState({ query: text });
      if (text.length > 0) {
        const results = await dao.findAllergyByName(text);
        this.setState({ ingredients: results });
      } else {
        this.setState({ ingredients: [] });
      }
    };
    render() {
        const { query, ingredients } = this.state;
        console.log(this.state)
        return (
            <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Search for ingredients"
              value={query}
              onChangeText={this.handleInputChange}
            />
            <FlatList
              data={ingredients}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Image
                    source={{ uri: `https://spoonacular.com/cdn/ingredients_100x100/${item.image}` }}
                    style={styles.image}
                  />
                  <Text style={styles.itemText}>{item.name}</Text>
                </View>
              )}
            />
          </View>
        );
      }
    }

class Inputs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            allergy: '',
            submitted: false
        };
        this.handleFirstname = this.handleFirstname.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleAllergy = this.handleAllergy.bind(this);
    }

    handleFirstname(firstname_input) {
        this.setState({ firstname: firstname_input });
    }

    handleLastName(lastname_input) {
        this.setState({ lastname: lastname_input });
    }

    handleAllergy(allergy_input) {
        this.setState({ allergy: allergy_input });
    }

    handleSubmit = () => {
        if (this.state.firstname === '' || this.state.lastname === '') {
            Alert.alert('Erreur', 'Veuillez remplir les champs nom et prénom');
        } else {
            this.setState({ submitted: true }); 
        }
        this.props.onSubmitted(this.state);
    }

    render() {
        if (this.state.submitted) {
            return (
                <View>
                    <Text>Prénom: {this.state.firstname}</Text>
                    <Text>Nom: {this.state.lastname}</Text>
                    <Text>Allergie: {this.state.allergy}</Text>
                </View>
            );
        }

        return (
            <View>
                <Text>Prénom:</Text>
                <TextInput
                    onChangeText={this.handleFirstname} />

                <Text>Nom:</Text>
                <TextInput
                    onChangeText={this.handleLastName} />

                <Text>Allergie:</Text>
                <TextInput
                    onChangeText={this.handleAllergy} />

                <Button title="Submit" onPress={this.handleSubmit} />

            </View>
        );
    }
}

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            is_ready: false
        };
        this.handleInputsSubmitted = this.handleInputsSubmitted.bind(this);
    }

    handleInputsSubmitted = (submitted_data) => {
        this.setState({ data: submitted_data });
        if (this.state.firstname != '' && this.state.lastname != '') {
            this.setState({ is_ready: true });
        }
      }

    render() {
        const { navigation } = this.props;
        if(this.state.is_ready){
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Inputs onSubmitted={this.handleInputsSubmitted} />
                    <Button
                        title="Go to Search"
                        onPress={() => navigation.navigate('Search', {user_info: this.state.data})}
                    />
                </View>
            )
        }else{
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Inputs onSubmitted={this.handleInputsSubmitted} />
                    <AllergySearch/>
                </View>
            )
        }
        
    }
}

const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    itemText: {
      fontSize: 18,
      marginLeft: 10,
    },
    image: {
      width: 50,
      height: 50,
    },
  });

export default HomeScreen;
