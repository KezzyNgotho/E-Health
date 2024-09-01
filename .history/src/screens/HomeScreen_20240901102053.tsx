import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, ScrollView, TextInput } from 'react-native';
import { Modal, Portal, Provider, Button as PaperButton } from 'react-native-paper'; 
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth

const App = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [itemToView, setItemToView] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [availablePharmacies, setAvailablePharmacies] = useState([]);
  const [products, setProducts] = useState([]);

  // Static categories definition
  const categories = [
    { id: '1', name: 'Pain Relief', image: require('../assets/pain.jpg') },
    { id: '2', name: 'Cold & Flu', image: require('../assets/cold-flu.png') },
    // Add more categories as needed
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products and pharmacies from Firestore
        const productsSnapshot = await firestore().collection('products').get();
        const pharmaciesSnapshot = await firestore().collection('pharmacies').get();

        const fetchedProducts = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const fetchedPharmacies = pharmaciesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProducts(fetchedProducts);
        setAvailablePharmacies(fetchedPharmacies);

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    const getUserLocation = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          Geolocation.requestAuthorization('whenInUse');
          Geolocation.getCurrentPosition(
            (position) => {
              setLocation(position.coords);
              fetchNearbyPharmacies(position.coords);
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } catch (error) {
          console.error("Error getting location: ", error);
        }
      } else {
        console.log("User not logged in");
      }
    };

    fetchData();
    getUserLocation();
  }, []);

  const fetchNearbyPharmacies = async (coords) => {
    try {
      const pharmaciesSnapshot = await firestore().collection('pharmacies')
        .where('location', '==', { lat: coords.latitude, lng: coords.longitude })
        .get();

      const pharmacies = pharmaciesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setAvailablePharmacies(pharmacies);
    } catch (error) {
      console.error("Error fetching pharmacies: ", error);
    }
  };

  const handleLocationModal = () => {
    setIsLocationModalVisible(!isLocationModalVisible);
  };

  const changeLocation = (newLocation) => {
    setLocation(newLocation);
    fetchNearbyPharmacies(newLocation);
    handleLocationModal();
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
                <Image source={{ uri: item.image }} style={styles.productImage} />
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

        {/* Pharmacies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pharmacies</Text>
          <FlatList
            horizontal
            data={availablePharmacies}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pharmacyItem}
                onPress={() => setSelectedPharmacy(item)}
              >
                <Image source={{ uri: item.image }} style={styles.pharmacyImage} />
                <Text style={styles.pharmacyName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>

        {/* Location Modal */}
        <Portal>
          <Modal visible={isLocationModalVisible} onDismiss={handleLocationModal} contentContainerStyle={styles.locationModal}>
            <Text style={styles.modalTitle}>Change Location</Text>
            {/* Add components for changing location */}
            <PaperButton onPress={() => changeLocation({ latitude: 0, longitude: 0 })}>Set Location</PaperButton>
          </Modal>
        </Portal>

        {/* Item Details Modal */}
        <Portal>
          <Modal visible={itemToView} onDismiss={() => setItemToView(null)} contentContainerStyle={styles.itemDetailsModal}>
            {itemToView && (
              <View style={styles.modalContent}>
                <Image source={{ uri: itemToView.image }} style={styles.itemDetailsImage} />
                <Text style={styles.itemDetailsName}>{itemToView.name}</Text>
                <Text style={styles.itemDetailsPrice}>${itemToView.price.toFixed(2)}</Text>
                <Text style={styles.itemDetailsAvailable}>Available: {itemToView.available}</Text>
                <TouchableOpacity style={styles.cartButton} onPress={() => addToCart(itemToView)}>
                  <Text style={styles.cartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            )}
          </Modal>
        </Portal>

        {/* Cart Section */}
        <View style={styles.cartContainer}>
          <Text style={styles.cartTitle}>Cart</Text>
          {cart.map(item => (
            <View key={item.id} style={styles.cartItem}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => removeFromCart(item)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          <Text style={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</Text>
        </View>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderRadius: 4,
    padding: 8,
  },
  bannerContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  banner: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  bannerText: {
    position: 'absolute',
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
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
    marginRight: 16,
    alignItems: 'center',
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  categoryName: {
    marginTop: 4,
    fontSize: 14,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productDetails: {
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
  productAvailable: {
    fontSize: 14,
    color: '#888',
  },
  pharmacyItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  pharmacyImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  pharmacyName: {
    marginTop: 4,
    fontSize: 14,
  },
  locationModal: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 32,
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
  itemDetailsModal: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 32,
    borderRadius: 8,
  },
  modalContent: {
    alignItems: 'center',
  },
  itemDetailsImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  itemDetailsName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  itemDetailsPrice: {
    fontSize: 16,
    color: '#888',
  },
  itemDetailsAvailable: {
    fontSize: 14,
    color: '#888',
  },
  cartButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cartContainer: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cartItemName: {
    fontSize: 16,
  },
  cartItemPrice: {
    fontSize: 16,
  },
  removeButton: {
    color: '#FF0000',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

export default App;
