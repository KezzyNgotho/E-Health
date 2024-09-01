import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();
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
      setFilteredItems([...items, newItem]);
      resetForm();
    }
  };

  const handleUpdateItem = (id: string) => {
    if (editingItem) {
      const updatedItems = items.map(item => (item.id === id ? editingItem : item));
      setItems(updatedItems);
      setFilteredItems(updatedItems);
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    setFilteredItems(updatedItems);
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
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.header}>Inventory</Text>
      </View>

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
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    margin: 10,
    elevation: 1,
    flexDirection: 'row',
    padding: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    fontSize: 14,
    color: '#555',
  },
  itemActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 5,
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
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#fff',
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Inventory;
