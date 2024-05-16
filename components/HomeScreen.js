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
    return (
      <View >
        <TextInput
          
          placeholder="Search for ingredients"
          value={query}
          onChangeText={this.handleInputChange}
        />
        <FlatList
          data={ingredients}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View >
              <Image
                source={{ uri: `https://spoonacular.com/cdn/ingredients_100x100/${item.image}` }}
                
              />
              <Text>{item.name}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}

class InputFields extends React.Component {
  handlePrenomChange = (text) => {
    this.props.onPrenomChange(text);
  }

  render() {
    return (
      <View >
        <TextInput
          placeholder="Prenom"
          onChangeText={this.handlePrenomChange}
        />
      </View>
    );
  }
}

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prenom: ''
    };
  }

  handlePrenomChange = (prenom) => {
    this.setState({ prenom });
  }

  render() {
    const { navigation } = this.props;
    console.log(this.state.prenom)
    if (this.state.prenom != '') {
      return (
        <View >   
        <InputFields
            onPrenomChange={this.handlePrenomChange}
          />
          <AllergySearch/>
          <Button
            title="Go to Search"
            onPress={() => navigation.navigate('Search', { user_info: this.state })}
          />
        </View>
      );
    } else {
      return (
        <View>
          <InputFields
            onPrenomChange={this.handlePrenomChange}
          />
          <AllergySearch />
        </View>
      );
    }
  }
}

export default HomeScreen;
