import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker'; // Add this dependency

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
  const [pharmacyLocation, setPharmacyLocation] = useState(''); // Added location field
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

  const handleRegister = () => {
    if (password === confirmPassword) {
      // Implement registration logic here
      console.log('User Type:', userType);
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Phone:', phone);
      console.log('Address:', address);
      console.log('DOB:', dob);
      console.log('Password:', password);
      if (userType === 'patient') {
        console.log('Allergies:', allergies);
        console.log('Chronic Conditions:', chronicConditions);
        console.log('Prescription History:', prescriptionHistory);
        console.log('Insurance Details:', insuranceDetails);
        console.log('Emergency Contacts:', emergencyContacts);
      }
      if (userType === 'pharmacy') {
        console.log('Pharmacy Name:', pharmacyName);
        console.log('License Number:', licenseNumber);
        console.log('Pharmacy Location:', pharmacyLocation); // Added location log
        console.log('Documents:', documents);
      }

      navigation.navigate('Login');
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
                <Icon name="identifier" size={24} style={styles.inputIcon} />
                <TextInput
                  placeholder="License Number"
                  value={licenseNumber}
                  onChangeText={text => setLicenseNumber(text)}
                  style={styles.input}
                  placeholderTextColor="black"
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="map-marker-outline" size={24} style={styles.inputIcon} /> {/* Map marker icon for location */}
                <TextInput
                  placeholder="Pharmacy Location"
                  value={pharmacyLocation}
                  onChangeText={text => setPharmacyLocation(text)}
                  style={styles.input}
                  placeholderTextColor="black"
                />
              </View>
              <Button title="Upload Documents" onPress={handleDocumentPicker} />
              {documents.length > 0 && (
                <View style={styles.documentsContainer}>
                  {documents.map((doc, index) => (
                    <Text key={index} style={styles.documentText}>{doc.name}</Text>
                  ))}
                </View>
              )}
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
    backgroundColor: '#fff',
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
  },
  userTypeButton: {
    backgroundColor: '#ddd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  userTypeText: {
    fontSize: 18,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputIcon: {
    marginRight: 10,
    color: '#333',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  documentsContainer: {
    marginTop: 15,
  },
  documentText: {
    fontSize: 16,
    color: '#333',
  },
});

export default RegistrationScreen;
