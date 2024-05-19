import React, { Component } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const baseURL = 'https://api.spoonacular.com';
const apiKeyQueryString = "&apiKey=e3f5990321d04b1bab62b7ebb32aec9b"

const dao = {
    findRecipesWithIngredients: async (ingredients, intolerances, cuisine) => {
        let url = `${baseURL}/recipes/complexSearch?includeIngredients=${ingredients}${apiKeyQueryString}&number=15`;
        if (intolerances !== "") {  
            url += `&intolerances=${intolerances}`; 
        }
        if(cuisine !== "") {
            url += `&cuisine=${cuisine}`; 
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const datas = await response.json();
            return datas.results;
        } catch (error) {
            console.error('Error fetching recipes:', error);
            return [];
        }
    }
};

class Recipe extends Component {
    render() {
        const { recipe, onRecipePress } = this.props;
        return (
            <TouchableOpacity style={styles.recipeContainer} onPress={() => onRecipePress(recipe)}>
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                <View style={styles.recipeInfo}>
                    <Text style={styles.recipeName}>{recipe.title}</Text>
                    <Text style={styles.clickHint}>Cliquez pour plus de details</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

class RecipesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: []
        };
    }

    async componentDidMount() {
        const { ingredients, intolerances, cuisine } = this.props;
        try {
            const recipes = await dao.findRecipesWithIngredients(ingredients.join(','), intolerances.join(','), cuisine);
            this.setState({ recipes });
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }

    handleRecipePress = (recipe) => {
        this.props.navigation.navigate('Details', { id_recipe: recipe.id })
    };

    render() {
        const { recipes } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.pageTitle}>Liste des Recettes</Text>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {recipes.map(recipe => (
                        <Recipe key={recipe.id} recipe={recipe} onRecipePress={this.handleRecipePress} />
                    ))}
                </ScrollView>
            </View>
        );
    }
}

class RecipesScreen extends Component {
    render() {
        const { route, navigation } = this.props;
        const ingredients = route.params?.ingredients || [];
        const intolerances = route.params?.intolerances || [];
        const cuisine = route.params?.cuisine || null;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <RecipesList ingredients={ingredients} intolerances={intolerances} cuisine={cuisine} navigation={navigation} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    recipeContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
    },
    recipeImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 20,
    },
    recipeInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    recipeName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    likeCount: {
        fontSize: 16,
        color: '#888',
    },
    clickHint: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 4,
    },
    scrollContainer: {
        paddingVertical: 16,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 16,
    },
});

export default RecipesScreen;