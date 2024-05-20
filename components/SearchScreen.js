import React, { Component } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import _ from 'lodash';
import cuisinesDatas from '../assets/cuisines.json';

const baseURL = 'https://api.spoonacular.com';
const apiKeyQueryString = "&apiKey=e3f5990321d04b1bab62b7ebb32aec9b";

const dao = {
    findIngredientsStartingWith: async (query, intolerances) => {
        if (query !== "") {
            let url = `${baseURL}/food/ingredients/autocomplete?query=${query}${apiKeyQueryString}&number=5`;
            if (intolerances.length > 0) {  
                url += `&intolerances=${intolerances.join(',')}`; 
            }
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const datas = await response.json();
                return datas;
            } catch (error) {
                console.error('Error fetching ingredients:', error);
                return [];
            }
        } else {
            return [];
        }
    }
};

class ListeIngredient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredients: [], 
        };
        this.onChangeInputDebounced = _.debounce(this.onChangeInput, 300).bind(this);
    }

    async componentDidMount() {
        const { intolerances } = this.props;
        this.fetchIngredients("a", intolerances);
    }

    fetchIngredients = async (query, intolerances) => {
        try {
            const ingredients = await dao.findIngredientsStartingWith(query, intolerances);
            this.setState({ ingredients });
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    onChangeInput = (query) => {
        const { intolerances } = this.props;
        this.fetchIngredients(query, intolerances); 
    };

    removeSelectedItem = (item) => {
        const { selectedItems, onSelectedItemsChange } = this.props;
        const updatedSelectedItems = selectedItems.filter(selectedItem => selectedItem !== item);
        onSelectedItemsChange(updatedSelectedItems);
    };

    renderSelectedItems = () => {
        const { selectedItems } = this.props;
        return (
            <View style={styles.selectedItemsContainer}>
                {selectedItems.map(item => (
                    <TouchableOpacity key={item} onPress={() => this.removeSelectedItem(item)}>
                        <View style={styles.selectedItem}>
                            <Text style={styles.selectedItemText}>{item}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    render() {
        const { ingredients } = this.state; 
        const { selectedItems, onSelectedItemsChange } = this.props;

        const ingredientItems = Array.isArray(ingredients) ? ingredients.map(ingredient => ({
            id: ingredient.id,
            name: ingredient.name
        })) : [];

        return (
            <View style={styles.listeIngredientContainer}>
                {this.renderSelectedItems()}
                <View style={styles.multiSelectContainer}>
                    <MultiSelect
                        hideTags
                        items={ingredientItems}
                        uniqueKey="name"
                        ref={(component) => { this.multiSelect = component }}
                        onSelectedItemsChange={onSelectedItemsChange}
                        selectedItems={selectedItems}
                        selectText="Choisissez des ingrédients..."
                        searchInputPlaceholderText="Rechercher des ingrédients..."
                        onChangeInput={this.onChangeInputDebounced}
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#CCC"
                        itemTextColor="#000"
                        displayKey="name"
                        hideSubmitButton={true}
                        searchInputStyle={{ color: '#000' }}
                        styleDropdownMenuSubsection={styles.multiSelectDropdown}
                    />
                </View>
            </View>
        );
    }
}

class SearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            selectedCuisine: ""
        };
    }

    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    };

    onCuisineChange = (selectedCuisine) => {
        this.setState({ selectedCuisine });
    };

    render() {
        const { navigation, route } = this.props;
        const { selectedItems , selectedCuisine } = this.state;
        const userInfo = route.params?.user_info || {};
        const intolerances = userInfo.selectedIntolerances;
        const isButtonDisabled = selectedItems.length === 0;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Choix des ingrédients</Text>
                <ListeIngredient
                    selectedItems={selectedItems}
                    onSelectedItemsChange={this.onSelectedItemsChange}
                    intolerances={intolerances}
                />
                <Picker
                    selectedValue={selectedCuisine}
                    style={styles.cuisinePicker}
                    onValueChange={this.onCuisineChange}>
                    <Picker.Item label="Choisissez un type de cuisine..." value={null} />
                    {cuisinesDatas.items.map((cuisine, index) => (
                        <Picker.Item key={index} label={cuisine} value={cuisine} />
                    ))}
                </Picker>
                <Button
                    title="Rechercher des recettes"
                    onPress={() => navigation.navigate('Recettes', { ingredients: selectedItems, intolerances: intolerances, cuisine: selectedCuisine })}
                    disabled={isButtonDisabled}
                    color={isButtonDisabled ? '#ccc' : '#007BFF'}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    listeIngredientContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    selectedItemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 10,
    },
    selectedItem: {
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        padding: 8,
        margin: 4,
    },
    selectedItemText: {
        color: '#000',
    },
    multiSelectContainer: {
        width: '100%',
        marginBottom: 20,
    },
    multiSelectDropdown: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    cuisinePicker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
});

export default SearchScreen;