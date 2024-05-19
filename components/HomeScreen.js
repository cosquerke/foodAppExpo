import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import Intolerances_data from '../assets/intolerances.json';

class InputFields extends Component {
  handlePrenomChange = (text) => {
    this.props.onPrenomChange(text);
  };

  render() {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          onChangeText={this.handlePrenomChange}
          underlineColorAndroid="transparent"
        />
      </View>
    );
  }
}

class Intolerances extends Component {
  render() {
    const { intolerances, toggleIntolerance } = this.props;
    return (
      <ScrollView style={styles.intolerancesContainer}>
        {intolerances.map((intolerance, index) => (
          <TouchableOpacity key={index} onPress={() => toggleIntolerance(intolerance)}>
            <View style={styles.intoleranceItem}>
              <Checkbox
                style={styles.checkbox}
                value={this.props.selectedIntolerances.includes(intolerance)}
                onValueChange={() => toggleIntolerance(intolerance)}
              />
              <Text style={styles.intoleranceText}>{intolerance}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
}

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prenom: '',
      selectedIntolerances: [], // Liste des intolérances sélectionnées
    };
  }

  handlePrenomChange = (prenom) => {
    this.setState({ prenom });
  };

  toggleIntolerance = (intolerance) => {
    const { selectedIntolerances } = this.state;
    if (selectedIntolerances.includes(intolerance)) {
      this.setState({
        selectedIntolerances: selectedIntolerances.filter((item) => item !== intolerance),
      });
    } else {
      this.setState({
        selectedIntolerances: [...selectedIntolerances, intolerance],
      });
    }
  };

  render() {
    const { navigation } = this.props;
    const { prenom, selectedIntolerances } = this.state;
    const isButtonDisabled = prenom === '';

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenue</Text>
        <InputFields onPrenomChange={this.handlePrenomChange} />
        <Intolerances
          intolerances={Intolerances_data.items}
          toggleIntolerance={this.toggleIntolerance}
          selectedIntolerances={selectedIntolerances}
        />
        <Button
          title="Rechercher"
          onPress={() => navigation.navigate('Recherche', { user_info: this.state })}
          color="#007BFF"
          disabled={isButtonDisabled}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  intolerancesContainer: {
    width: '80%',
    maxHeight: 200, 
    marginBottom: 20,
  },
  intoleranceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  intoleranceText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HomeScreen;
