import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import SearchScreen from './components/SearchScreen';
import DetailsScreen from './components/DetailsScreen';
import RecipesScreen from './components/RecipesScreen';

const Stack = createStackNavigator();

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Accueil">
          <Stack.Screen name="Accueil" component={HomeScreen} />
          <Stack.Screen name="Recherche" component={SearchScreen} />
          <Stack.Screen name="Recettes" component={RecipesScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
