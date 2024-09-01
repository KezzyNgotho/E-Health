import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, ScrollView, Button } from 'react-native';
import { Modal, Portal, Provider } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service'; // Import Geolocation

const App = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [itemToView, setItemToView] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Example data for categories and products
  const categories = [
    { id: '1', name: 'Category 1', image: require('../') },
    { id: '2', name: 'Category 2', image: require('./path/to/category2.jpg') },
  ];
  
  const products = [
    { id: '1', name: 'Product 1', price: 10.00, available: 20, image: require('./path/to/product1.jpg') },
    { id: '2', name: 'Product 2', price: 20.00, available: 15, image: require('./path/to/product2.jpg') },
  ];

  useEffect(() => {
    // Request location permission and fetch location when the component mounts
    Geolocation.requestAuthorization('whenInUse'); // For iOS only
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  const handleLocationModal = () => {
    setIsLocationModalVisible(!isLocationModalVisible);
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
    setItemToView(null);
  };

  const removeFromCart = (item) => {
    setCart(cart.filter(cartItem => cartItem.id !== item.id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Provider>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.location} onPress={handleLocationModal}>
              {location ? `Lat: ${location.latitude}, Lon: ${location.longitude}` : 'Get Location'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => setIsCartVisible(true)} style={styles.iconButton}>
              <Image source={require('./path/to/cart-icon.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.iconButton}>
              <Image source={require('./path/to/search-icon.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search for products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Image source={require('./path/to/banner.jpg')} style={styles.banner}>
          <Text style={styles.bannerText}>Welcome to the Pharmacy!</Text>
        </Image>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            horizontal
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.categoryItem}>
                <Image source={item.image} style={styles.categoryImage} />
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productItem}
                onPress={() => setItemToView(item)}
              >
                <Image source={item.image} style={styles.productImage} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                <Text style={styles.productAvailable}>Available: {item.available}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>

        {/* Location Modal */}
        <Portal>
          <Modal visible={isLocationModalVisible} onDismiss={handleLocationModal} contentContainerStyle={styles.locationModal}>
            <Text style={styles.modalTitle}>Your Location</Text>
            {location ? (
              <Text>
                Latitude: {location.latitude}, Longitude: {location.longitude}
              </Text>
            ) : (
              <Text>Fetching location...</Text>
            )}
            <Button mode="contained" onPress={handleLocationModal} style={styles.modalCloseButton}>
              Close
            </Button>
          </Modal>
        </Portal>

        {/* Cart Modal */}
        <Portal>
          <Modal visible={isCartVisible} onDismiss={() => setIsCartVisible(false)} contentContainerStyle={styles.cartModal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Shopping Cart</Text>
              {cart.length > 0 ? (
                <FlatList
                  data={cart}
                  renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                      <Image source={item.image} style={styles.cartItemImage} />
                      <View style={styles.cartItemDetails}>
                        <Text style={styles.cartItemName}>{item.name}</Text>
                        <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
                        <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                      </View>
                      <TouchableOpacity onPress={() => removeFromCart(item)} style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={item => item.id}
                />
              ) : (
                <Text style={styles.emptyCartText}>Your cart is empty.</Text>
              )}
              <View style={styles.cartTotal}>
                <Text style={styles.cartTotalText}>Total: ${totalPrice.toFixed(2)}</Text>
              </View>
              <Button mode="contained" onPress={() => navigation.navigate('Checkout')} style={styles.checkoutButton}>
                Checkout
              </Button>
              <Button mode="contained" onPress={() => setIsCartVisible(false)} style={styles.modalCloseButton}>
                Close
              </Button>
            </View>
          </Modal>
        </Portal>

        {/* Item Details Modal */}
        {itemToView && (
          <Portal>
            <Modal visible={!!itemToView} onDismiss={() => setItemToView(null)} contentContainerStyle={styles.itemDetailsModal}>
              <View style={styles.modalContent}>
                <Image source={itemToView.image} style={styles.itemDetailsImage} />
                <Text style={styles.itemDetailsName}>{itemToView.name}</Text>
                <Text style={styles.itemDetailsPrice}>${itemToView.price.toFixed(2)}</Text>
                <Text style={styles.itemDetailsAvailable}>Available: {itemToView.available}</Text>
                <TouchableOpacity onPress={() => addToCart(itemToView)} style={styles.cartButton}>
                  <Text style={styles.cartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
                <Button mode="contained" onPress={() => setItemToView(null)} style={styles.modalCloseButton}>
                  Close
                </Button>
              </View>
            </Modal>
          </Portal>
        )}
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    color: '#007BFF',
  },
  iconButton: {
    marginLeft: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
  },
  banner: {
    width: '100%',
    height: 200,
    marginVertical: 16,
    resizeMode: 'cover',
  },
  bannerText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginTop: 80,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  productPrice: {
    fontSize: 14,
    color: '#007BFF',
    marginLeft: 16,
  },
  productAvailable: {
    fontSize: 12,
    color: '#666',
    marginLeft: 16,
  },
  locationModal: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalCloseButton: {
    marginTop: 16,
  },
  cartModal: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  modalContent: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#007BFF',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#FF6F61',
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#fff',
  },
  emptyCartText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  cartTotal: {
    marginTop: 16,
  },
  cartTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    marginTop: 16,
  },
  itemDetailsModal: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  itemDetailsImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  itemDetailsName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  itemDetailsPrice: {
    fontSize: 16,
    color: '#007BFF',
    marginTop: 8,
  },
  itemDetailsAvailable: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  cartButton: {
    marginTop: 16,
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
