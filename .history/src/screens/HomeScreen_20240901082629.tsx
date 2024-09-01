import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, ScrollView, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Modal, Portal, Provider, Button, Title } from 'react-native-paper';
import { firestore } from './firebaseConfig'; // Adjust the import path if necessary

const App = () => {
  const [cart, setCart] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [inputLocation, setInputLocation] = useState('');
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch user's current location
    const fetchCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ latitude, longitude });
          fetchPharmacies(latitude, longitude);
        },
        (error) => {
          Alert.alert("Location Error", "Unable to fetch location.");
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    fetchCurrentLocation();
  }, []);

  const fetchPharmacies = async (latitude, longitude) => {
    setIsLoading(true);
    try {
      // Replace with your logic to fetch pharmacies based on location
      const snapshot = await firestore.collection('pharmacies')
        .where('location', '==', `${latitude},${longitude}`).get();
      const fetchedPharmacies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPharmacies(fetchedPharmacies);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch pharmacies.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (location) => {
    setInputLocation(location);
  };

  const handleLocationSubmit = async () => {
    // Assuming location is in the format 'latitude,longitude'
    const [latitude, longitude] = inputLocation.split(',').map(Number);
    if (latitude && longitude) {
      setSelectedLocation({ latitude, longitude });
      await fetchPharmacies(latitude, longitude);
      setIsLocationModalVisible(false);
    } else {
      Alert.alert("Invalid Location", "Please enter a valid location.");
    }
  };

  return (
    <Provider>
      <ScrollView style={styles.container}>
        {/* Other components and content */}

        <TouchableOpacity style={styles.iconButton} onPress={() => setIsLocationModalVisible(true)}>
          <Image source={require('./../assets/icons8-location-50.png')} style={styles.icon} />
        </TouchableOpacity>

        <Portal>
          <Modal visible={isLocationModalVisible} onDismiss={() => setIsLocationModalVisible(false)} contentContainerStyle={styles.locationModal}>
            <View style={styles.modalContent}>
              <Title style={styles.modalTitle}>Enter Your Location</Title>
              <TextInput
                style={styles.input}
                placeholder="Enter location (latitude,longitude)"
                value={inputLocation}
                onChangeText={handleLocationChange}
              />
              <Button mode="contained" onPress={handleLocationSubmit} style={styles.modalButton}>
                Submit
              </Button>
              <Button mode="outlined" onPress={() => setIsLocationModalVisible(false)} style={styles.modalButton}>
                Close
              </Button>
            </View>
          </Modal>
        </Portal>

        <View style={styles.pharmacySection}>
          <Text style={styles.sectionTitle}>Nearby Pharmacies</Text>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <FlatList
              data={pharmacies}
              renderItem={({ item }) => (
                <View style={styles.pharmacyItem}>
                  <Text style={styles.pharmacyName}>{item.name}</Text>
                  <Text style={styles.pharmacyAddress}>{item.address}</Text>
                </View>
              )}
              keyExtractor={item => item.id}
            />
          )}
        </View>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  // Define your styles here
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  locationModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    width: '100%',
    marginBottom: 20,
  },
  modalButton: {
    marginVertical: 10,
  },
  pharmacySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pharmacyItem: {
    marginBottom: 15,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pharmacyAddress: {
    fontSize: 14,
    color: '#666',
  },
});

export default App;
