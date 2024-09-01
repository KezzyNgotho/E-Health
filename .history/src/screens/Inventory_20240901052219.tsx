import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure you have react-native-vector-icons installed

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const initialItems: InventoryItem[] = [
  { id: '1', name: 'Aspirin', quantity: 100, price: 10.0 },
  { id: '2', name: 'Ibuprofen', quantity: 50, price: 15.0 },
];

export function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [newItem, setNewItem] = useState<InventoryItem | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const handleAddItem = () => {
    if (itemName && itemQuantity && itemPrice) {
      const newId = (items.length + 1).toString();
      const newItem: InventoryItem = {
        id: newId,
        name: itemName,
        quantity: parseInt(itemQuantity),
        price: parseFloat(itemPrice),
      };
      setItems([...items, newItem]);
      setItemName('');
      setItemQuantity('');
      setItemPrice('');
    }
  };

  const handleUpdateItem = (id: string) => {
    if (newItem) {
      setItems(items.map(item => (item.id === id ? newItem : item)));
      setNewItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventory</Text>
      
      {/* Add New Item */}
      <View style={styles.form}>
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
        <Button title="Add Item" onPress={handleAddItem} />
      </View>
      
      {/* Inventory List */}
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
            <Text style={styles.itemDetails}>Price: ${item.price.toFixed(2)}</Text>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => setNewItem(item)}>
                <Icon name="edit" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                <Icon name="trash" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Update Item Section */}
      {newItem && (
        <View style={styles.updateForm}>
          <Text style={styles.updateHeader}>Update Item</Text>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={newItem.name}
            onChangeText={(text) => setNewItem({ ...newItem, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={newItem.quantity.toString()}
            keyboardType="numeric"
            onChangeText={(text) => setNewItem({ ...newItem, quantity: parseInt(text) })}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={newItem.price.toString()}
            keyboardType="numeric"
            onChangeText={(text) => setNewItem({ ...newItem, price: parseFloat(text) })}
          />
          <Button title="Update Item" onPress={() => handleUpdateItem(newItem.id)} />
        </View>
      )}
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
});
