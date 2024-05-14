import React, { Component } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';

class Inputs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            allergy: '',
            submitted: false
        };
        this.handleFirstname = this.handleFirstname.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleAllergy = this.handleAllergy.bind(this);
    }

    handleFirstname(firstname_input) {
        this.setState({ firstname: firstname_input });
    }

    handleLastName(lastname_input) {
        this.setState({ lastname: lastname_input });
    }

    handleAllergy(allergy_input) {
        this.setState({ allergy: allergy_input });
    }

    handleSubmit = () => {
        if (this.state.firstname === '' || this.state.lastname === '') {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        } else {
            this.setState({ submitted: true }); 
        }
        this.props.onSubmitted(this.state);
    }

    render() {
        if (this.state.submitted) {
            return (
                <View>
                    <Text>Prénom: {this.state.firstname}</Text>
                    <Text>Nom: {this.state.lastname}</Text>
                    <Text>Allergie: {this.state.allergy}</Text>
                </View>
            );
        }

        return (
            <View>
                <Text>Prénom:</Text>
                <TextInput
                    onChangeText={this.handleFirstname} />

                <Text>Nom:</Text>
                <TextInput
                    onChangeText={this.handleLastName} />

                <Text>Allergie:</Text>
                <TextInput
                    onChangeText={this.handleAllergy} />

                <Button title="Submit" onPress={this.handleSubmit} />

            </View>
        );
    }
}

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            is_ready: false
        };
        this.handleInputsSubmitted = this.handleInputsSubmitted.bind(this);
    }

    handleInputsSubmitted = (submitted_data) => {
        this.setState({ data: submitted_data });
        if (this.state.firstname != '' && this.state.lastname != '') {
            this.setState({ is_ready: true });
        }
      }

    render() {
        const { navigation } = this.props;
        if(this.state.is_ready){
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Inputs onSubmitted={this.handleInputsSubmitted} />
                    <Button
                        title="Go to Search"
                        onPress={() => navigation.navigate('Search', {user_info: this.state.data})}
                    />
                </View>
            )
        }else{
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Inputs onSubmitted={this.handleInputsSubmitted} />
                </View>
            )
        }
        
    }
}

export default HomeScreen;
