import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Log the username, password, and role to ensure they are correct
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Selected Role:', selectedRole);

    // Check if a role is selected
    if (selectedRole) {
      // Navigate to the respective dashboard based on the selected role
      switch (selectedRole) {
        case 'patient':
          navigation.navigate('Main');
          break;
        case 'pharmacy':
          navigation.navigate('pharmacy');
          break;
        default:
          console.log('Invalid role selected.');
      }
    } else {
      console.log('Please select a role before logging in.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>SmartFund</Text>
      <View style={styles.content}>
        <Text style={styles.header}>Welcome Back!</Text>
        <Text style={styles.subHeader}>Login to continue</Text>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, selectedRole === 'patient' && styles.selectedRole]}
            onPress={() => setSelectedRole('patient')}
          >
            <Text style={styles.roleText}>Patient</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, selectedRole === 'pharmacy' && styles.selectedRole]}
            onPress={() => setSelectedRole('pharmacy')}
          >
            <Text style={styles.roleText}>Pharmacy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="account-outline" size={24} style={styles.inputIcon} />
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={text => setUsername(text)}
            style={styles.input}
            placeholderTextColor="black"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock-outline" size={24} style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="black"
          />
        </View>
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Forgot Password?")} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')} style={styles.signupText}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  appName: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#0f535c',
    fontFamily: 'cursive',
    marginBottom: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  subHeader: {
    fontSize: 16,
    color: '#0f535c',
    marginBottom: 20,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    backgroundColor: '#DDDDDD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  selectedRole: {
    backgroundColor: '#0f535c',
  },
  roleText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 0.9,
    borderBottomColor: '#0f535c',
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
    color: 'black',
  },
  input: {
    flex: 1,
    height: 40,
    color: 'black',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#0f535c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: 'black',
  },
  signupText: {
    marginTop: 10,
    color: '#0f535c',
  },
});

export default LoginScreen;
