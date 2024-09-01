import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import useFirebase from './../hooks/useFirebase'; // Adjust path as necessary

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const { registerUser, loading, error } = useFirebase();
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
  const [documents, setDocuments] = useState([]);

  const handleDocumentPicker = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      setDocuments(results);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Canceled from single doc picker');
      } else {
        throw err;
      }
    }
  };

  const handleRegister = async () => {
    if (password === confirmPassword) {
      const userData = {
        name,
        email,
        phone,
        address,
        dob,
        userType,
        // Do not store password directly; hash it first
        // password, // Consider hashing the password before storing it
      };

      if (userType === 'patient') {
        Object.assign(userData, {
          allergies,
          chronicConditions,
          prescriptionHistory,
          insuranceDetails,
          emergencyContacts,
        });
      }

      if (userType === 'pharmacy') {
        Object.assign(userData, {
          pharmacyName,
          licenseNumber,
          pharmacyLocation,
          documents: documents.map(doc => ({ uri: doc.uri, name: doc.name })),
        });
      }

      try {
        await registerUser(userData);
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
                <Icon name="contacts-outline" size={24} style={styles.inputIcon} />
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
                <Icon name="store" size={24} style={styles.inputIcon} />
                <TextInput
                  placeholder="Pharmacy Name"
                  value={pharmacyName}
                  onChangeText={text => setPharmacyName(text)}
                  style={styles.input}
                  placeholderTextColor="black"
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="badge-account-horizontal" size={24} style={styles.inputIcon} />
                <TextInput
                  placeholder="License Number"
                  value={licenseNumber}
                  onChangeText={text => setLicenseNumber(text)}
                  style={styles.input}
                  placeholderTextColor="black"
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="map-marker-outline" size={24} style={styles.inputIcon} />
                <TextInput
                  placeholder="Pharmacy Location"
                  value={pharmacyLocation}
                  onChangeText={text => setPharmacyLocation(text)}
                  style={styles.input}
                  placeholderTextColor="black"
                />
              </View>
              <TouchableOpacity onPress={handleDocumentPicker} style={styles.button}>
                <Text style={styles.buttonText}>Upload Documents</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={handleRegister} style={styles.button} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
          </TouchableOpacity>

          {error && <Text style={styles.error}>{error.message}</Text>}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 16,
  },
  userTypeButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  userTypeText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RegistrationScreen;
