import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import firestore from '../firebase';
import auth from '../firebase'; // Import Firebase Auth

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          const cartSnapshot = await firestore().collection('users').doc(user.uid).collection('cart').get();
          const items = cartSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCartItems(items);
          calculateTotalPrice(items);
        } catch (error) {
          console.error("Error fetching cart items: ", error);
        }
      } else {
        console.log("User not logged in");
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const removeItem = async (itemId) => {
    const user = auth().currentUser;
    if (user) {
      try {
        await firestore().collection('users').doc(user.uid).collection('cart').doc(itemId).delete();
        setCartItems(cartItems.filter(item => item.id !== itemId));
        calculateTotalPrice(cartItems.filter(item => item.id !== itemId));
      } catch (error) {
        console.error("Error removing item from cart: ", error);
      }
    } else {
      console.log("User not logged in");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text>{item.name}</Text>
            <Text>${item.price.toFixed(2)}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
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
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default CartScreen;
