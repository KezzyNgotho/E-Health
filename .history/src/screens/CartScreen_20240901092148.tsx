import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

const CartScreen = () => {
  const route = useRoute();
  const initialCart = route.params?.cart || []; // Default to an empty array if route.params.cart is undefined
  const [cart, setCart] = useState(initialCart);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const increaseQuantity = (id) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (id) => {
    setCart(cart.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cart.length > 0 ? (
        <FlatList
          data={cart}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={item.image} style={styles.cartItemImage} />
              <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={item => item.id}
          ListFooterComponent={() => (
            <View style={styles.footer}>
              <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
              <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  cartItemDetails: {
    marginLeft: 10,
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#555',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  quantityButton: {
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#FF6F61',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
  },
});

export default CartScreen;
