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
              <View style={styles.uploadContainer}>
                <Button title="Upload Documents" onPress={handleDocumentPicker} />
                {documents.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <Text>{doc.name}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#0f535c',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color:'black'
  },
  userTypeButton: {
    backgroundColor: '#0f535c',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  userTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color :'#fff'
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
    padding: 8,
    fontSize: 16,
    color: '#333333',
  },
  registerButton: {
    backgroundColor: '#0f535c',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadContainer: {
    marginVertical: 16,
  },
  documentItem: {
    backgroundColor: '#0f535c',
    padding: 8,
    marginVertical: 4,
    borderRadius: 4,
  },
});

export default RegistrationScreen;
