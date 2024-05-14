import React, { Component } from 'react';
import { View, Text, Button, Alert, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

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

    loadUserInfoFromProps(){
        this.setState({ firstname: this.props.user_info.firstname });
        this.setState({ lastname: this.props.user_info.lastname });
        this.setState({ allergy: this.props.user_info.allergy });
    }

    render() {
        if(this.state.firstname == ''){
            this.loadUserInfoFromProps()
        }
        
        return (
            <View>
                <Text>Prénom: {this.state.firstname}</Text>
                <Text>Nom: {this.state.lastname}</Text>
                <Text>Allergie: {this.state.allergy}</Text>
            </View>
        );
    }
}


class SearchScreen extends Component {
    render() {
        const { navigation, route } = this.props;
        const userInfo = route.params?.user_info || {};
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <UserInfo user_info={userInfo}/>
                <Button
                    title="Go to Home"
                    onPress={() => navigation.navigate('Home')}
                />
            </View>
        );
    }
}

export default SearchScreen;
