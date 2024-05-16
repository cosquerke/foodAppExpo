import React, { Component } from 'react';
import { View, Text, Button, Alert, ScrollView, Image, StyleSheet } from 'react-native';

const baseURL = 'https://api.spoonacular.com/recipes/';
//const api_key = "apiKey=4538c45f84234eb0bb890d57be2d6398"
//const api_key = "&apiKey=5538cdbd824f4e70baababf038847459"
const api_key = "&apiKey=4bfb490dcd154b098a7177a9f8b80299"

const dao = {
  getInformationAboutRecipe: async (recipe_id) => {
    const url = `${baseURL}${recipe_id}/information?includeNutrition=false${api_key}`;
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
    const url = `${baseURL}${recipe_id}/analyzedInstructions?${api_key}`;
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

    if (!instruction.steps || instruction.steps.length === 0) {
      return null; // Ne rien rendre si "steps" n'existe pas ou est vide
    }

    return (
      <View style={styles.container}>
        <Text style={styles.instructionStepTitle}>{instruction.name}</Text>
        {instruction.steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <Text style={styles.instructionStep}>Étape {step.number}</Text>
            <Text style={styles.instructionText}>{step.step}</Text>
            {step.steps && step.steps.length > 0 && (
              <View style={styles.subStepsContainer}>
                {step.steps.map((subStep, subIndex) => (
                  <View key={subIndex} style={styles.subStepContainer}>
                    <Text style={styles.instructionSubStep}>Sous-étape {subStep.number}</Text>
                    <Text style={styles.instructionSubText}>{subStep.step}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  }
}



class ListInstructions extends Component {
  render() {
    const { liste_instructions } = this.props;
    return (
      <View>
        {liste_instructions.map((step, index) => (
          <Instruction key={index} instruction={step} />
        ))}
      </View>
    );
  }
}

class Ingredient extends Component {
  render() {
    const { ingredient } = this.props;
    return (
      <View style={styles.ingredientContainer}>
        <Image
          source={{ uri: `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}` }}
          style={styles.ingredientImage}
        />
        <View style={styles.ingredientTextContainer}>
          <Text style={styles.ingredientName}>{ingredient.name}</Text>
          <Text style={styles.ingredientOriginal}>{ingredient.original}</Text>
        </View>
      </View>
    );
  }
}

class ListIngredients extends Component {
  render() {
    const { liste_ingredient } = this.props;
    return (
      <View style={styles.ingredientsGrid}>
        {liste_ingredient.map((ingredient, index) => (
          <Ingredient key={index} ingredient={ingredient} />
        ))}
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
      let infos_api = await dao.getInstructionAboutRecipe(id_recipe);
      this.setState({ instructions: infos_api });
      if(this.state.instructions != []){
          this.setState({ instructions_loaded: true });
      }
  }

    render(){
        if(this.state.ingredients_loaded == true && this.state.instructions_loaded == true){
            return(
              <ScrollView style={styles.container}>
              <Text style={styles.title}>{this.state.infos.title}</Text>
              <ListIngredients liste_ingredient={this.state.infos.extendedIngredients} />
              <ListInstructions liste_instructions={this.state.instructions} />
            </ScrollView>
            )
            
        }else{
          if(!this.state.ingredients_loaded){
            this.loadInfos(this.props.id_recipe);
          }
          if(!this.state.instructions_loaded){
            this.loadInstructions(this.props.id_recipe);
          }
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
        const id_recipe_from_props = route.params?.id_recipe || {};
        return (
            <View style={{ flex: 1 }}>
                <Details id_recipe={id_recipe_from_props}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ingredientContainer: {
    width: '48%',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    alignItems: 'center',
  },
  ingredientImage: {
    width: 100,
    height: 100,
  },
  ingredientTextContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ingredientOriginal: {
    fontSize: 14,
    textAlign: 'center',
  },
  instructionBlock: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
  },
  stepContainer: {
    marginBottom: 10,
  },
  instructionStep: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instructionStepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 16,
  },
  subStepsContainer: {
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#ccc',
  },
  subStepContainer: {
    marginTop: 10,
  },
  instructionSubStep: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instructionSubText: {
    fontSize: 14,
  },
});



export default DetailsScreen;