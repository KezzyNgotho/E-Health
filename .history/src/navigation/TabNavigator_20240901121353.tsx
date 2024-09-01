import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image } from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';
import { MainStackNavigator } from './StackNavigators';
import WalleteScreen from '../screens/WalleteScreen';

// Import your image assets
import homeIcon from '../assets/icons8-home-50.png';
import walletIcon from '../assets/';
import profileIcon from '../assets/profile.png';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconSource;

          switch (route.name) {
            case 'HomeScreen':
              iconSource = homeIcon;
              break;
            case 'Wallete':
              iconSource = walletIcon;
              break;
            case 'Profile':
              iconSource = profileIcon;
              break;
            default:
              iconSource = homeIcon; // Default icon if none matches
          }

          return (
            <Image
              source={iconSource}
              style={[styles.icon, { tintColor: color }]}
            />
          );
        },
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBarStyle,
      })}
      initialRouteName="HomeScreen"
    >
      <Tab.Screen name="HomeScreen" component={MainStackNavigator} />
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
  icon: {
    width: 24, // Adjust size if needed
    height: 24, // Adjust size if needed
  },
});

export { BottomTabNavigator };
