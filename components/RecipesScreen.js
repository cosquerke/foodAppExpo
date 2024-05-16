import React, { Component } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const baseURL = 'https://api.spoonacular.com';
const apiKeyQueryString = "&apiKey=e3f5990321d04b1bab62b7ebb32aec9b"

const dao = {
    findIngredientsStartingWith: async (query) => {
        if (query !== "") {
            const url = `${baseURL}/food/ingredients/search?query=${query}${apiKeyQueryString}&number=5`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const datas = await response.json();
                return datas.results;
            } catch (error) {
                console.error('Error fetching ingredients:', error);
                return [];
            }
        } else {
            return [];
        }
    },

    findRecipesWithIngredients: async (ingredients) => {
        const url = `${baseURL}/recipes/findByIngredients?ingredients=${ingredients}${apiKeyQueryString}&number=10`;
        console.log(url)
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const datas = await response.json();
            return datas;
        } catch (error) {
            console.error('Error fetching recipes:', error);
            return [];
        }
    }
};

class RecipesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: [],
        };
    }

    async componentDidMount() {
        const { ingredients } = this.props;
        console.log(ingredients)
        try {
            const recipes = await dao.findRecipesWithIngredients(ingredients.join(','));
            this.setState({ recipes });
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }

    render() {
        const { recipes } = this.props;
        console.log(recipes)
        return (
            <ScrollView contentContainerStyle={styles.container}>
                {recipes.map(recipe => (
                    <View key={recipe.id} style={styles.recipeContainer}>
                        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                        <View style={styles.recipeInfo}>
                            <Text style={styles.recipeName}>{recipe.title}</Text>
                            <Text style={styles.likeCount}>{recipe.likes} Likes</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        );
    }
}

class RecipesScreen extends Component {
    render() {
        const { route } = this.props;
        const ingredients = route.params?.ingredients || [];
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <RecipesList ingredients={ingredients} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    recipeContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
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
});

export default RecipesScreen;