import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from './../firebase'; // Adjust path as needed

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username and password cannot be empty.');
      return;
    }

    if (!selectedRole) {
      Alert.alert('Error', 'Please select a role before logging in.');
      return;
    }

    try {
      // Sign in the user
      const userCredential = await auth.signInWithEmailAndPassword(username, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await firestore.collection('users').doc(user.uid).get();
      const userData = userDoc.data();

      // Store user session details in local storage
      await localStorage.setItem('userSession', JSON.stringify(userData));

      // Navigate to the appropriate screen based on the role
      switch (selectedRole) {
        case 'patient':
          navigation.navigate('Main', { user: userData });
          break;
        case 'pharmacy':
          navigation.navigate('Pharmacy', { user: userData });
          break;
        default:
          console.log('Invalid role selected.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Failed to log in. Please check your credentials and try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>E-Health</Text>
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
