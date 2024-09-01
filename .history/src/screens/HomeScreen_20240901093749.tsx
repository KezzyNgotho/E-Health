import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../'; // Adjust the path

const App = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const querySnapshot = await db.collection('pharmacies').get();
        const fetchedPharmacies = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPharmacies(fetchedPharmacies);
      } catch (error) {
        console.error('Error fetching pharmacies:', error);
      }
    };

    fetchPharmacies();
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      if (selectedPharmacy) {
        try {
          const inventoryQuery = db.collection('pharmacies').doc(selectedPharmacy.id).collection('inventory').get();
          const querySnapshot = await inventoryQuery;
          const fetchedInventory = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setInventory(fetchedInventory);
        } catch (error) {
          console.error('Error fetching inventory:', error);
        }
      }
    };

    fetchInventory();
  }, [selectedPharmacy]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pharmacies</Text>
      <FlatList
        data={pharmacies}
        renderItem={({ item }) => (
          <Text
            style={styles.pharmacy}
            onPress={() => setSelectedPharmacy(item)}
          >
            {item.name}
          </Text>
        )}
        keyExtractor={item => item.id}
      />

      {selectedPharmacy && (
        <View style={styles.inventoryContainer}>
          <Text style={styles.title}>Inventory for {selectedPharmacy.name}</Text>
          <FlatList
            data={inventory}
            renderItem={({ item }) => (
              <View style={styles.inventoryItem}>
                <Text>{item.name}</Text>
                <Text>${item.price.toFixed(2)}</Text>
                <Text>Available: {item.available}</Text>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pharmacy: {
    fontSize: 16,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inventoryContainer: {
    marginTop: 16,
  },
  inventoryItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default App;
