import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase'; // Adjust the path as necessary

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [userType, setUserType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [prescriptionHistory, setPrescriptionHistory] = useState('');
  const [insuranceDetails, setInsuranceDetails] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [pharmacyLocation, setPharmacyLocation] = useState('');

  const handleRegister = async () => {
    if (password === confirmPassword) {
      try {
        // Register the user with email and password
        await auth.createUserWithEmailAndPassword(email, password);

        // Add additional user data to Firestore or Realtime Database if necessary
        // You can use `firebase.firestore()` for Firestore operations

        console.log('User registered successfully');
        navigation.navigate('Login');
      } catch (error) {
        console.error('Error registering user:', error);
      }
    } else {
      console.log('Passwords do not match');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {userType === '' && (
        <>
          <Text style={styles.label}>Select User Type</Text>
          <TouchableOpacity onPress={() => setUserType('patient')} style={styles.userTypeButton}>
            <Text style={styles.userTypeText}>Patient</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setUserType('pharmacy')} style={styles.userTypeButton}>
            <Text style={styles.userTypeText}>Pharmacy</Text>
          </TouchableOpacity>
        </>
      )}

      {userType !== '' && (
        <>
          <View style={styles.inputContainer}>
            <Icon name="account-outline" size={24} style={styles.inputIcon} />
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={text => setName(text)}
              style={styles.input}
              placeholderTextColor="black"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="email-outline" size={24} style={styles.inputIcon} />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
              keyboardType="email-address"
              placeholderTextColor="black"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="phone-outline" size={24} style={styles.inputIcon} />
            <TextInput
              placeholder="Phone"
              value={phone}
              onChangeText={text => setPhone(text)}
              style={styles.input}
              keyboardType="phone-pad"
              placeholderTextColor="black"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="home-outline" size={24} style={styles.inputIcon} />
            <TextInput
              placeholder="Address"
              value={address}
              onChangeText={text => setAddress(text)}
              style={styles.input}
              placeholderTextColor="black"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="calendar-outline" size={24} style={styles.inputIcon} />
            <TextInput
              placeholder="Date of Birth (YYYY-MM-DD)"
              value={dob}
              onChangeText={text => setDob(text)}
              style={styles.input}
              keyboardType="numeric"
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
          <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={24} style={styles.inputIcon} />
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="black"
            />
          </View>

          {userType === 'patient' && (
            <>
              <View style={styles.inputContainer}>
                <Icon name="pill" size={24} style={styles.inputIcon} />
                <TextInput
                  placeholder="Allergies"
                  value={allergies}
                  onChangeText={text => setAllergies(text)}
                  style={styles.input}
                  placeholderTextColor="black"
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="alert-outline" size={24} style={styles.inputIcon} />
                <TextInput
                  placeholder="Chronic Conditions"
                  value={chronicConditions}
                  onChangeText={text => setChronicConditions(text)}
                  style={styles.input}
                  placeholderTextColor="black"
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="history" size={24} style={styles.inputIcon} />
                <TextInput
                  placeholder="Prescription History"
                  value={prescriptionHistory}
                  onChangeText={text => setPrescriptionHistory(text)}
                  style={styles.input}
                  placeholderTextColor="black"
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="shield-outline" size={24} style={styles.inputIcon} />
                <TextInput
                  placeholder="Insurance Provider Details"
                  value={insuranceDetails}
                  onChangeText={text => setInsuranceDetails(text)}
                  style={styles.input}
                  placeholderTextColor="black"
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="contacts" size={24} style={styles.inputIcon} />
                <TextInput
                  placeholder="Emergency Contacts"
                  value={emergencyContacts}
                  onChangeText={text => setEmergencyContacts(text)}
                  style={styles.input}
                  placeholderTextColor="black"
                />
              </View>
            </>
          )}

          {userType === 'pharmacy' && (
            <>
              <View style={styles.inputContainer}>
                <Icon name="pharmacy" size={24} style={styles.inputIcon} />
                <TextInput
                  placeholder="Pharmacy Name"
                  value={pharmacyName}
                  onChangeText={text => setPharmacyName(text)}
                  style={styles.input}
                  placeholderTextColor="black"
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="badge" size={24} style={styles.inputIcon} />
                <TextInput
                  placeholder="License Number"
                  value={licenseNumber}
                  onChangeText={text => setLicenseNumber(text)}
                  style={styles.input}
                  placeholderTextColor="black"
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="map-marker" size={24} style={styles.inputIcon} />
                <TextInput
                  placeholder="Pharmacy Location"
                  value={pharmacyLocation}
                  onChangeText={text => setPharmacyLocation(text)}
                  style={styles.input}
                  placeholderTextColor="black"
                />
              </View>
            </>
          )}

          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
  },
  userTypeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  userTypeText: {
    color: '#ffffff',
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: 'black',
  },
  inputIcon: {
    marginRight: 10,
    color: '#007bff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default RegistrationScreen;
