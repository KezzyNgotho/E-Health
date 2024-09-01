import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import HomeScreen from "../screens/HomeScreen";
import PharmacyDashboard from "../screens/PharmacyDashboard";
import { BottomTabNavigator } from "./TabNavigator";
import { PharmacyBottomTabNavigator } from "../navigation/PharmacyBottomTabNavigator";
import CartScreen from '../screens/CartScreen'
import { Inventory } from "../screens/Inventory";

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeScreen"
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} /> 
      <Stack.Screen name="CartScreen" component={CartScreen} />
      

    </Stack.Navigator>
  );
};

const PharmacyStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="PharmacyDashboard"
    >
      <Stack.Screen name="PharmacyDashboard" component={PharmacyDashboard} />
      <Stack.Screen name="Inventory" component={Inventory} />
    </Stack.Navigator>
  );
};

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
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
      {/* Replace with the navigator you want to use */}
      <LoginStackNavigator />
    </NavigationContainer>
  );
};

export { MainStackNavigator, LoginStackNavigator, PharmacyStackNavigator };
