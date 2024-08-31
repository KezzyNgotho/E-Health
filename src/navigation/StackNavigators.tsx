import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabNavigator } from "./TabNavigator";
import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import HomeScreen from "../screens/HomeScreen";

import {PharmacyBottomTabNavigator}  from "../navigation/PharmacyBottomTabNavigator";
import PharmacyDashboard from "../screens/PharmacyDashboard";


const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="HomeScreen"
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
};
const PharmacyStackNavigator = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="PharmacyDashboard"
      >
        <Stack.Screen name="PharmacyDashboard" component={PharmacyDashboard} />
       
      </Stack.Navigator>
    );
  };

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="pharmacy" component={PharmacyBottomTabNavigator} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      {/* Use your main navigator here */}
      <LoginStackNavigator />
    </NavigationContainer>
  );
};

export { MainStackNavigator, LoginStackNavigator, PharmacyStackNavigator };
