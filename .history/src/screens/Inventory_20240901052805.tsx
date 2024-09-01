import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure you have react-native-vector-icons installed
import { launchImageLibrary } from 'react-native-image-picker'; // Import the function from react-native-image-picker

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
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

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
      resetForm();
    }
  };

  const handleUpdateItem = (id: string) => {
    if (editingItem) {
      setItems(items.map(item => (item.id === id ? editingItem : item)));
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventory</Text>
      
      {/* Button to Open Modal */}
      <Button title="Add New Item" onPress={() => setModalVisible(true)} />

      {/* Inventory List */}
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
            <Text style={styles.itemDetails}>Price: ${item.price.toFixed(2)}</Text>
            <Text style={styles.itemDetails}>Category: {item.category}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.itemImage} />}
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => setEditingItem(item)}>
                <Icon name="edit" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                <Icon name="trash" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
            <Button title="Save Item" onPress={handleAddItem} />
            <Button title="Cancel" onPress={resetForm} color="red" />
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
  form: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 4,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDetails: {
    fontSize: 16,
    color: '#555',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  updateForm: {
    marginTop: 20,
  },
  updateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    marginBottom: 15,
  },
  imagePicker: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  imagePickerText: {
    color: '#000',
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 5,
  },
});
