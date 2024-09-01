import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase'; // Adjust the path to your firebase config

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const userId = 'userId'; // Replace with actual user ID
    const fetchCartItems = async () => {
      try {
        const cartRef = firestore.collection('carts').doc(userId);
        const doc = await cartRef.get();
        if (doc.exists) {
          setCartItems(doc.data().items || []);
        }
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      }
    };

    fetchCartItems();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemPrice}>Price: ${item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  itemDetails: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#555555',
  },
  itemPrice: {
    fontSize: 14,
    color: '#FF5722',
  },
});

export default CartScreen;
