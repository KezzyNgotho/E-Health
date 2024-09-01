import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, ScrollView, TextInput } from 'react-native';
import { Modal, Portal, Provider, Button as PaperButton } from 'react-native-paper'; 
import Geolocation from 'react-native-geolocation-service';
import firestore from '../firebase';
import auth from '../firebase'; // Import Firebase Auth

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
    { id: '2', name: 'Cold & Flu', image: require('../assets/flu.jpg') },
    // Add more categories as needed
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products and pharmacies from Firestore
        const productsSnapshot = await firestore().collection('inentory').get();
        const fetchedProducts = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(fetchedProducts);
        
        // Fetch pharmacies from Firestore
        fetchNearbyPharmacies();
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    const getUserLocation = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          // Fetch user data from Firestore
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          
          if (userDoc.exists) {
            const userData = userDoc.data();
            const location = userData.location; // Assuming `location` is a field with the location name
        console.log ("location")
            if (location) {
              setLocation({ name: location });
              fetchNearbyPharmacies(location); // Fetch pharmacies based on the retrieved location
            } else {
              console.log("User location not found in Firestore");
            }
          } else {
            console.log("User document not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user location: ", error);
        }
      } else {
        console.log("User not logged in");
      }
    };
    
    

    fetchData();
    getUserLocation();
  }, []);

  const fetchNearbyPharmacies = async () => {
    try {
      const pharmaciesSnapshot = await firestore().collection('pharmacies')
        .where('Location', '==', 'Nairobi')
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
    fetchNearbyPharmacies();
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
          <Image source={require('../assets/pexels-karolina-grabowska-5650026.jpg')} style={styles.banner} />
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
                <TouchableOpacity onPress={() => addToCart(itemToView)} style={styles.addToCartButton}>
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            )}
          </Modal>
        </Portal>

        {/* Cart */}
        {cart.length > 0 && (
          <View style={styles.cart}>
            <Text style={styles.cartTitle}>Cart</Text>
            {cart.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item)} style={styles.removeFromCartButton}>
                  <Text style={styles.removeFromCartText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <Text style={styles.cartTotal}>Total: ${totalPrice.toFixed(2)}</Text>
          </View>
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
    padding: 16,
    justifyContent: 'space-between',
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
    fontWeight: 'bold',
    color: '#000',
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
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  bannerContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  banner: {
    width: '100%',
    height: 200,
  },
  bannerText: {
    position: 'absolute',
    top: 16,
    left: 16,
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
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  categoryName: {
    textAlign: 'center',
    marginTop: 4,
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
    justifyContent: 'center',
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
  },
  pharmacyImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  pharmacyName: {
    textAlign: 'center',
    marginTop: 4,
  },
  locationModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemDetailsModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
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
    marginVertical: 8,
  },
  itemDetailsPrice: {
    fontSize: 16,
    color: '#888',
  },
  addToCartButton: {
    marginTop: 16,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cart: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cartItemName: {
    fontSize: 16,
  },
  cartItemPrice: {
    fontSize: 16,
  },
  removeFromCartButton: {
    backgroundColor: '#dc3545',
    padding: 4,
    borderRadius: 4,
  },
  removeFromCartText: {
    color: '#fff',
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

export default App;
