import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Modal, Image, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  image: string | null;
}

const initialItems: InventoryItem[] = [
  { id: '1', name: 'Aspirin', quantity: 100, price: 10.0, category: 'Pain Relief', image: null },
  { id: '2', name: 'Ibuprofen', quantity: 50, price: 15.0, category: 'Pain Relief', image: null },
];

export function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(initialItems);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddItem = () => {
    if (itemName && itemQuantity && itemPrice && itemCategory) {
      const newId = (items.length + 1).toString();
      const newItem: InventoryItem = {
        id: newId,
        name: itemName,
        quantity: parseInt(itemQuantity),
        price: parseFloat(itemPrice),
        category: itemCategory,
        image: itemImage,
      };
      setItems([...items, newItem]);
      setFilteredItems([...items, newItem]); // Update filtered items
      resetForm();
    }
  };

  const handleUpdateItem = (id: string) => {
    if (editingItem) {
      const updatedItems = items.map(item => (item.id === id ? editingItem : item));
      setItems(updatedItems);
      setFilteredItems(updatedItems); // Update filtered items
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    setFilteredItems(updatedItems); // Update filtered items
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorCode);
        } else {
          setItemImage(response.assets ? response.assets[0].uri : null);
        }
      }
    );
  };

  const resetForm = () => {
    setItemName('');
    setItemQuantity('');
    setItemPrice('');
    setItemCategory('');
    setItemImage(null);
    setModalVisible(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredItems(items);
    } else {
      const lowercasedQuery = query.toLowerCase();
      setFilteredItems(items.filter(item =>
        item.name.toLowerCase().includes(lowercasedQuery) ||
        item.category.toLowerCase().includes(lowercasedQuery)
      ));
    }
  };

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemDetails}>Price: ${item.price.toFixed(2)}</Text>
        <Text style={styles.itemDetails}>Category: {item.category}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity onPress={() => setEditingItem(item)} style={styles.actionButton}>
          <Icon name="edit" size={20} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.actionButton}>
          <Icon name="trash" size={20} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventory</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Button to Open Modal */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add New Item</Text>
      </TouchableOpacity>

      {/* Inventory List */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />

      {/* Modal for Adding/Updating Item */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={resetForm}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add New Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={itemName}
              onChangeText={setItemName}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={itemQuantity}
              keyboardType="numeric"
              onChangeText={setItemQuantity}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={itemPrice}
              keyboardType="numeric"
              onChangeText={setItemPrice}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={itemCategory}
              onChangeText={setItemCategory}
            />
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.imagePickerText}>Pick an Image</Text>
            </TouchableOpacity>
            {itemImage && <Image source={{ uri: itemImage }} style={styles.selectedImage} />}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddItem}>
                <Text style={styles.buttonText}>Save Item</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  item: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  itemInfo: {
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  itemActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 2,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  imagePicker: {
    backgroundColor: '#e9ecef',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#007bff',
    fontSize: 16,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
