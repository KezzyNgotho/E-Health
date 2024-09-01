import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from './../firebase'; // Adjust path as needed

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  image: string | null;
}

export function Inventory() {
  const navigation = useNavigation();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const snapshot = await firestore.collection('inventory').where('uid', '==', user.uid).get();
          const itemsData: InventoryItem[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
          setItems(itemsData);
          setFilteredItems(itemsData);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (itemName && itemQuantity && itemPrice && itemCategory) {
      const user = auth.currentUser;
      if (user) {
        const newItem: InventoryItem = {
          id: '',
          name: itemName,
          quantity: parseInt(itemQuantity),
          price: parseFloat(itemPrice),
          category: itemCategory,
          image: itemImage,
        };

        try {
          const docRef = await firestore.collection('inventory').add({ ...newItem, uid: user.uid });
          setItems([...items, { ...newItem, id: docRef.id }]);
          setFilteredItems([...items, { ...newItem, id: docRef.id }]);
          resetForm();
        } catch (error) {
          console.error('Error adding item:', error);
        }
      }
    }
  };

  const handleUpdateItem = async (id: string) => {
    if (editingItem) {
      try {
        await firestore.collection('inventory').doc(id).update(editingItem);
        const updatedItems = items.map(item => (item.id === id ? editingItem : item));
        setItems(updatedItems);
        setFilteredItems(updatedItems);
        setEditingItem(null);
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await firestore.collection('inventory').doc(id).delete();
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      setFilteredItems(updatedItems);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
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
            <Button
              title={editingItem ? "Update Item" : "Add Item"}
              onPress={editingItem ? () => handleUpdateItem(editingItem.id) : handleAddItem}
            />
            <Button
              title="Cancel"
              color="red"
              onPress={resetForm}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    flex: 1,
    margin: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 150,
  },
  itemInfo: {
    padding: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  actionButton: {
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
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
    marginBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
});
