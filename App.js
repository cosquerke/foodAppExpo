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
        <Stack.Navigator initialRouteName="Search">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Recipes" component={RecipesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
