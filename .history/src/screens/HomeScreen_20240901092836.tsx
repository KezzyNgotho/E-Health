import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, ScrollView, TextInput } from 'react-native';
import { Modal, Portal, Provider, Button as PaperButton } from 'react-native-paper'; // Import Button as PaperButton
import Geolocation from 'react-native-geolocation-service'; // Import Geolocation

const App = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [itemToView, setItemToView] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Example data for categories and products
  const categories = [
    { id: '1', name: 'Category 1', image: require('../assets/pexels-karolina-grabowska-5650026.jpg') },
    { id: '2', name: 'Category 2', image: require('../assets/pexels-tanya-nova-2593907-4371873.jpg') },
  ];
  
  const products = [
    { id: '1', name: 'Product 1', price: 10.00, available: 20, image: require('../assets/flu.jpg') },
    { id: '2', name: 'Product 2', price: 20.00, available: 15, image: require('../assets/stomach.jpg') },
  ];

  useEffect(() => {
    // Request location permission and fetch location when the component mounts
    Geolocation.requestAuthorization('whenInUse'); // For iOS only
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
      },
      (error) => console.log('Location Error:', error),
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
              {location ? `Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}` : 'Get Location'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.iconButton}>
              <Image source={require('../assets/icons8-cart-48.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.iconButton}>
              <Image source={require('../assets/icons8-search-50.png')} style={styles.icon} />
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

        <View style={styles.bannerContainer}>
          <Image source={require('../assets/pexels-tanya-nova-2593907-4371873.jpg')} style={styles.banner} />
          <Text style={styles.bannerText}>Welcome to the Pharmacy!</Text>
        </View>

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
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                  <Text style={styles.productAvailable}>Available: {item.available}</Text>
                </View>
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
                Latitude: {location.latitude.toFixed(4)}, Longitude: {location.longitude.toFixed(4)}
              </Text>
            ) : (
              <Text>Fetching location...</Text>
            )}
            <PaperButton mode="contained" onPress={handleLocationModal} style={styles.modalCloseButton}>
              Close
            </PaperButton>
          </Modal>
        </Portal>

        {/* Item Details Modal */}
        <Portal>
          <Modal visible={!!itemToView} onDismiss={() => setItemToView(null)} contentContainerStyle={styles.itemDetailsModal}>
            <View style={styles.modalContent}>
              <Image source={itemToView?.image} style={styles.itemDetailsImage} />
              <Text style={styles.itemDetailsName}>{itemToView?.name}</Text>
              <Text style={styles.itemDetailsPrice}>${itemToView?.price.toFixed(2)}</Text>
              <Text style={styles.itemDetailsAvailable}>Available: {itemToView?.available}</Text>
              <TouchableOpacity onPress={() => addToCart(itemToView)} style={styles.cartButton}>
                <Text style={styles.cartButtonText}>Add to Cart</Text>
              </TouchableOpacity>
              <PaperButton mode="contained" onPress={() => setItemToView(null)} style={styles.modalCloseButton}>
                Close
              </PaperButton>
            </View>
          </Modal>
        </Portal>
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
  bannerContainer: {
    position: 'relative',
    marginVertical: 16,
  },
  banner: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  bannerText: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
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
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#007BFF',
  },
  productAvailable: {
    fontSize: 14,
    color: '#555',
  },
  locationModal: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  itemDetailsModal: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    alignItems: 'center',
  },
  itemDetailsImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  itemDetailsName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  itemDetailsPrice: {
    fontSize: 16,
    color: '#007BFF',
  },
  itemDetailsAvailable: {
    fontSize: 16,
    color: '#555',
  },
  cartButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 10,
  },
});

export default App;
