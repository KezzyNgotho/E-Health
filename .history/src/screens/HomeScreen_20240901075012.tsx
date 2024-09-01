import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal, Portal, Provider, Button, Title } from 'react-native-paper';
import { firestore } from './firebase'; // Make sure to import your Firestore instance

const App = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(''); // Location the user selects
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  
  // Fetch pharmacies based on location
  const fetchPharmacies = async (location) => {
    const querySnapshot = await firestore.collection('userscollection').where('location', '==', location).get();
    const fetchedPharmacies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPharmacies(fetchedPharmacies);
  };

  // Fetch inventory for selected pharmacy
  const fetchInventory = async (pharmacyId) => {
    const querySnapshot = await firestore.collection('inventory').where('pharmacyId', '==', pharmacyId).get();
    const fetchedInventory = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setInventory(fetchedInventory);
  };

  // Handle when a location is selected
  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    fetchPharmacies(location); // Fetch pharmacies for the selected location
  };

  // Handle when a pharmacy is selected
  const handlePharmacyChange = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    fetchInventory(pharmacy.id); // Fetch inventory for the selected pharmacy
  };

  return (
    <Provider>
      <ScrollView style={styles.container}>
        {/* Location Modal */}
        <Portal>
          <Modal visible={isLocationModalVisible} onDismiss={() => setIsLocationModalVisible(false)} contentContainerStyle={styles.locationModal}>
            <View style={styles.modalContent}>
              <Title>Select Location</Title>
              {/* Assume you have a predefined list of locations */}
              <RNPickerSelect
                onValueChange={handleLocationChange}
                items={[
                  { label: 'City A', value: 'City A' },
                  { label: 'City B', value: 'City B' },
                  { label: 'City C', value: 'City C' },
                ]}
                style={pickerSelectStyles}
                value={selectedLocation}
              />
              <Button onPress={() => setIsLocationModalVisible(false)}>Close</Button>
            </View>
          </Modal>
        </Portal>

        {/* Pharmacy Selection */}
        <View>
          <Text style={styles.sectionTitle}>Select Pharmacy</Text>
          <FlatList
            data={pharmacies}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePharmacyChange(item)}>
                <Text style={styles.pharmacyItem}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>

        {/* Display Inventory */}
        <View>
          <Text style={styles.sectionTitle}>Inventory</Text>
          {inventory.length > 0 ? (
            <FlatList
              data={inventory}
              renderItem={({ item }) => (
                <View style={styles.productItem}>
                  <Text>{item.name}</Text>
                  <Text>Price: ${item.price}</Text>
                  <Text>Available: {item.available}</Text>
                </View>
              )}
              keyExtractor={item => item.id}
            />
          ) : (
            <Text>No inventory found for this pharmacy.</Text>
          )}
        </View>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  pharmacyItem: { padding: 10, backgroundColor: '#f8f8f8', marginVertical: 5 },
  productItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  locationModal: { backgroundColor: 'white', padding: 20 },
  modalContent: { padding: 20 },
});

export default App;
