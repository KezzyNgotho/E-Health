import React from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { LoginStackNavigator } from './src/navigation/StackNavigators';

// Define your theme
const theme = {
  colors: {
    primary: '#561C24', // Primary color for the app
    secondary: '#F8C9D4', // Secondary color for accents or highlights
    background: '#FFFFFF', // Background color for app screens
    text: '#333333', // Primary text color
    button: '#561C24', // Button color
    buttonText: '#FFFFFF', // Button text color
  },
  fonts: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
  },
};

// Create a styled container for the app
const AppContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Tab = createMaterialBottomTabNavigator();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <AppContainer>
          {/* Define your navigation here */}
          <LoginStackNavigator />
        </AppContainer>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
