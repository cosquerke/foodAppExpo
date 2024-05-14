import React, { Component } from 'react';
import { View, Text, Button, Alert, ScrollView, Image } from 'react-native';

const baseURL = 'https://api.spoonacular.com/recipes/';
//const apiKeyQueryString = "&apiKey=4538c45f84234eb0bb890d57be2d6398"
const apiKeyQueryString = "&apiKey=5538cdbd824f4e70baababf038847459"

// https://api.spoonacular.com/recipes/716429/information?includeNutrition=false&apiKey=4538c45f84234eb0bb890d57be2d6398
const dao = {
  getInformationAboutRecipe: async (recipe_id) => {
    console.log(recipe_id);
    const url = `${baseURL}${recipe_id}/information?includeNutrition=false${apiKeyQueryString}`;
    console.log('Calling URL:', url);

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

class Ingredient extends Component {
    render() {
      const { ingredient } = this.props;
      return (
        <View>
          <Text>{ingredient.name}</Text>
          <Text>{ingredient.original}</Text>
          <Image
            source={{ uri: `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}` }}
            style={{ width: 100, height: 100 }}
          />
        </View>
      );
    }
  }
  
  class ListIngredients extends Component {
    render() {
      const { liste_ingredient } = this.props;
      return (
        <View>
            <ScrollView>
            {liste_ingredient.map((ingredient, index) => (
            <Ingredient key={index} ingredient={ingredient} />
          ))}
            </ScrollView>
        </View>
      );
    }
  }

class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infos: [],
            loaded: false,
        }
        this.loadInfos = this.loadInfos.bind(this);
    }

    async loadInfos(id_recipe) {
        console.log(id_recipe);
        let infos_api = await dao.getInformationAboutRecipe(id_recipe);
        this.setState({ infos: infos_api });
        if(this.state.infos != []){
            this.setState({ loaded: true });
        }
        console.log(this.state.infos);
    }

    render(){
        if(this.state.loaded){
            return(
            <View>
                <Text>{this.state.infos.title}</Text>
                <ListIngredients liste_ingredient={this.state.infos.extendedIngredients}/>
            </View>
            )
            
        }else{
            this.loadInfos(this.props.id_recipe);
            return(
                <View>
                    <Text>Api NOK</Text>
                </View>
                )
        }
    }
}

class DetailsScreen extends Component {
    render() {
        const { navigation, route } = this.props;
        const userInfo = route.params?.user_info || {};
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Details id_recipe={"716429"}/>
            </View>
        );
    }
}

export default DetailsScreen;