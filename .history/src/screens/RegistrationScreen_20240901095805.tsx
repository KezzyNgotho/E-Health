import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../firebase'; // Adjust the path as necessary

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [userType, setUserType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(''); // Changed from address to location
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
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
  
        // Prepare user data
        const userData = {
          name,
          email,
          phone,
          location, // Changed from address to location
          dob,
          userType,
          ...(userType === 'patient' ? {
            allergies,
            chronicConditions,
            prescriptionHistory,
            insuranceDetails,
            emergencyContacts
          } : {
            pharmacyName,
            licenseNumber,
            pharmacyLocation
          })
        };
  
        // Store user data in Firestore
        await firestore.collection('users').doc(user.uid).set(userData);

        // Create pharmacy collection record if user type is 'pharmacy'
        if (userType === 'pharmacy') {
          await firestore.collection('pharmacies').doc(user.uid).set({
            pharmacyName,
            licenseNumber,
            pharmacyLocation
          });
        }
  
        console.log('User registered and data stored successfully');
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
            <Icon name="map-marker" size={24} style={styles.inputIcon} /> 
            <TextInput
              placeholder="Location" // Changed from address to location
              value={location} // Changed from address to location
              onChangeText={text => setLocation(text)} // Changed from address to location
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
                  placeholder="Pharmacy Location" // Changed from pharmacyLocation
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
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  userTypeButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  userTypeText: {
    color: '#FFF',
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
    color: '#007BFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegistrationScreen;
