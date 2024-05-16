import React, { Component } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import Intolerances_data from '../assets/intolerances.json';

class InputFields extends Component {
  handlePrenomChange = (text) => {
    this.props.onPrenomChange(text);
  };

  render() {
    return (
      <View>
        <TextInput placeholder="Prenom" onChangeText={this.handlePrenomChange} />
      </View>
    );
  }
}

class Intolerances extends Component {
  render() {
    const { intolerances, toggleIntolerance } = this.props;
    return (
      <ScrollView style={styles.scrollView}>
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
    console.log(this.state)
    return (
      <View>
        <InputFields onPrenomChange={this.handlePrenomChange} />
        {prenom !== '' ? (
          <View>
            <Intolerances
              intolerances={Intolerances_data.items}
              toggleIntolerance={this.toggleIntolerance}
              selectedIntolerances={selectedIntolerances}
            />
            <Button title="Go to Search" onPress={() => navigation.navigate('Search', { user_info: this.state })} />
          </View>
        ) : (
          <Intolerances
            intolerances={Intolerances_data.items}
            toggleIntolerance={this.toggleIntolerance}
            selectedIntolerances={selectedIntolerances}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  intoleranceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  intoleranceText: {
    fontSize: 16,
    marginLeft: 10,
  },
  scrollView: {
    maxHeight: 200, // Set maximum height for scrolling
  },
});

export default HomeScreen;
