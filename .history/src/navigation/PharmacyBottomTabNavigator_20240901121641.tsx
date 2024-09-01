import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Image } from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';
import { PharmacyStackNavigator } from './StackNavigators';
import WalleteScreen from '../screens/WalleteScreen';

// Import icon images
import homeIcon from '../assets/';
import walletIcon from '../assets/wallet.png';
import profileIcon from '../assets/account.png';

const Tab = createBottomTabNavigator();

const PharmacyBottomTabNavigator = () => {
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
              iconSource = homeIcon;
          }

          return (
            <Image
              source={iconSource}
              style={[styles.icon, { tintColor: color, width: size, height: size }]}
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
  icon: {
    resizeMode: 'contain',
  },
});

export { PharmacyBottomTabNavigator };
