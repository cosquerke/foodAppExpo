import React, { Component } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import MultiSelect from 'react-native-multiple-select';
import _ from 'lodash';


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
        const url = `${baseURL}/recipes/findByIngredients?ingredients=${ingredients}${apiKeyQueryString}`;
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

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            allergy: '',
        };
        this.loadUserInfoFromProps = this.loadUserInfoFromProps.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user_info !== this.props.user_info) {
            this.loadUserInfoFromProps(this.props.user_info);
        }
    }

    loadUserInfoFromProps(userInfo) {
        this.setState({
            firstname: userInfo.firstname,
            lastname: userInfo.lastname,
            allergy: userInfo.allergy,
        });
    }

    render() {
        return (
            <View>
                <Text>Prénom: {this.state.firstname}</Text>
                <Text>Nom: {this.state.lastname}</Text>
                <Text>Allergie: {this.state.allergy}</Text>
            </View>
        );
    }
}

class ListeIngredient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredients: [],
        };

        this.onChangeInputDebounced = _.debounce(this.onChangeInput, 300).bind(this);
    }

    async componentDidMount() {
        this.fetchIngredients("a");
    }

    fetchIngredients = async (query) => {
        try {
            const ingredients = await dao.findIngredientsStartingWith(query);
            this.setState({ ingredients });
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    onChangeInput = (query) => {
        this.fetchIngredients(query);
    };

    renderSelectedItems = () => {
        const { selectedItems } = this.props;
        return (
            <View style={styles.selectedItemsContainer}>
                {selectedItems.map(item => (
                    <View key={item} style={styles.selectedItem}>
                        <Text style={styles.selectedItemText}>{item}</Text>
                    </View>
                ))}
            </View>
        );
    };

    render() {
        const { ingredients } = this.state;
        const { selectedItems, onSelectedItemsChange } = this.props;

        // Ensure ingredients is an array before mapping
        const ingredientItems = Array.isArray(ingredients) ? ingredients.map(ingredient => ({
            id: ingredient.id,
            name: ingredient.name
        })) : [];

        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, padding: 16 }}>
                    <MultiSelect
                        hideTags
                        items={ingredientItems}
                        uniqueKey="name"
                        ref={(component) => { this.multiSelect = component }}
                        onSelectedItemsChange={onSelectedItemsChange}
                        selectedItems={selectedItems}
                        selectText="Pick Items"
                        searchInputPlaceholderText="Search Items..."
                        onChangeInput={this.onChangeInputDebounced}
                        altFontFamily="ProximaNova-Light"
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#CCC"
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{ color: '#CCC' }}
                        submitButtonColor="#CCC"
                        submitButtonText="Search recipes"
                        hideSubmitButton={true}
                    />
                    {this.renderSelectedItems()}
                </View>
            </ScrollView>
        );
    }
}

class SearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: []
        };
    }

    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    };

    render() {
        const { navigation, route } = this.props;
        const { selectedItems } = this.state;
        const userInfo = route.params?.user_info || {};

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <UserInfo user_info={userInfo} />
                <ListeIngredient 
                    selectedItems={selectedItems}
                    onSelectedItemsChange={this.onSelectedItemsChange}
                />
                <Button
                    title="Search recipes"
                    onPress={() => navigation.navigate('Recipes', { ingredients: selectedItems })}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    selectedItemsContainer: {
        marginTop: 16,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    selectedItem: {
        backgroundColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        margin: 4
    },
    selectedItemText: {
        color: '#000'
    }
});

export default SearchScreen;