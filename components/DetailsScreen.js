import React, { Component } from 'react';
import { View, Text, Button, Alert, ScrollView, Image } from 'react-native';

const baseURL = 'https://api.spoonacular.com/recipes/';
const apiKeyQueryString = "&apiKey=4538c45f84234eb0bb890d57be2d6398"
//const apiKeyQueryString = "&apiKey=5538cdbd824f4e70baababf038847459"

const dao = {
  getInformationAboutRecipe: async (recipe_id) => {
    const url = `${baseURL}${recipe_id}/information?includeNutrition=false${apiKeyQueryString}`;
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

  getInstructionAboutRecipe: async (recipe_id) => {
    console.log(recipe_id);
    const url = `${baseURL}${recipe_id}/analyzedInstructions${apiKeyQueryString}`;
    console.log('Calling URL:', url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching instructions:', error);
      return [];
    }
  },
}

class Instruction extends Component {
  render() {
    const { instruction } = this.props;
    return (
      <View>
        <Text>{instruction.number}</Text>
        <Text>{instruction.step}</Text>
      </View>
    );
  }
}

class ListInstructions extends Component {
  render() {
    const { liste_instructions } = this.props;
    return (
      <View>
          <ScrollView>
          {liste_instructions.map((step, index) => (
            <Instruction key={index} instruction={step} />
          ))}
          </ScrollView>
      </View>
    );
  }
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
            instructions: [],
            ingredients_loaded: false,
            instructions_loaded: false
        }
        this.loadInfos = this.loadInfos.bind(this);
        this.loadInstructions = this.loadInstructions.bind(this);
    }

    async loadInfos(id_recipe) {
        let infos_api = await dao.getInformationAboutRecipe(id_recipe);
        this.setState({ infos: infos_api });
        if(this.state.infos != []){
            this.setState({ ingredients_loaded: true });
        }
    }

    async loadInstructions(id_recipe) {
      console.log(id_recipe);
      let infos_api = await dao.getInstructionAboutRecipe(id_recipe);
      this.setState({ instructions: infos_api });
      if(this.state.instructions != []){
          this.setState({ instructions_loaded: true });
      }
      console.log(this.state.instructions);
  }

    render(){
        if(this.state.ingredients_loaded == true && this.state.instructions_loaded == true){
            return(
            <View>
                <Text>{this.state.infos.title}</Text>
                <ListIngredients liste_ingredient={this.state.infos.extendedIngredients}/>
                <ListInstructions liste_instructions={this.state.instructions[0].steps}/>
            </View>
            )
            
        }else{
            this.loadInfos(this.props.id_recipe);
            this.loadInstructions(this.props.id_recipe);
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