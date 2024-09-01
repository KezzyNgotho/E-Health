import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import firestore from '../firebase';
import auth from '../firebase'; // Import Firebase Auth

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          const cartItemsSnapshot = await firestore().collection('users').doc(user.uid).collection('cart').get();
          const items = cartItemsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCartItems(items);
        } catch (error) {
          console.error("Error fetching cart items: ", error);
        }
      }
    };

    fetchCartItems();
  }, []);

  const removeFromCart = async (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));

    // Remove from Firestore
    const user = auth().currentUser;
    if (user) {
      try {
        const cartItemRef = firestore().collection('users').doc(user.uid).collection('cart').doc(itemId);
        await cartItemRef.delete();
      } catch (error) {
        console.error("Error removing item from cart: ", error);
      }
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> My Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <Text style={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#007BFF',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#777',
  },
  removeButton: {
    backgroundColor: '#FF0000',
    padding: 8,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

export default CartScreen;
