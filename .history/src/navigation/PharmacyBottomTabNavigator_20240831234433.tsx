import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'; // Use react-native-elements' Icon
import ProfileScreen from '../screens/ProfileScreen';
import { PharmacyStackNavigator } from './StackNavigators';
import WalleteScreen from '../screens/WalleteScreen';

const Tab = createBottomTabNavigator();

const PharmacyBottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          // Return the corresponding icon component based on the route name
          return (
            <Icon
              name={
                route.name === 'HomeScreen' ? 'home' :
                route.name === 'Wallete' ? 'wallet' :
                route.name === 'Profile' ? 'account' :
                'home' // Default icon if none matches
              }
              type='material-community' // Specify the icon type for MaterialCommunityIcons
              size={size}
              color={color}
            />
          );
        },
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBarStyle,
      })}
      initialRouteName="HomeScreen"
    >
      <Tab.Screen name="HomeScreen" component={PharmacyStackNavigator} />
      <Tab.Screen name="Wallete" component={WalleteScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    color: 'black'
  },
  tabBarStyle: {
    backgroundColor: '#F5E8E4',
    height: 60, // Adjust height if needed
  },
});

export { PharmacyBottomTabNavigator };
