import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, ScrollView, TextInput } from 'react-native';
import { Modal, Portal, Provider, Button as PaperButton } from 'react-native-paper'; 
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
        // Fetch products from Firestore
        const productsSnapshot = await firestore().collection('inventory').get();
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
    
    fetchData();
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          const location = userData.location;
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

  const fetchNearbyPharmacies = async (location) => {
    try {
      const pharmaciesRef = firestore().collection('pharmacies');
      const querySnapshot = await pharmaciesRef.where('location', '==', location?.name).get();
      if (!querySnapshot.empty) {
        const fetchedPharmacies = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAvailablePharmacies(fetchedPharmacies);
      } else {
        console.log("No pharmacies found for this location");
      }
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

  const addToCart = async (item) => {
    setCart([...cart, { ...item, quantity: 1 }]);
    setItemToView(null);

    // Save to Firestore
    const user = auth().currentUser;
    if (user) {
      try {
        await firestore().collection('users').doc(user.uid).collection('cart').add({
          ...item,
          quantity: 1
        });
      } catch (error) {
        console.error("Error adding item to cart: ", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCart(cart.filter(cartItem => cartItem.id !== itemId));

    // Remove from Firestore
    const user = auth().currentUser;
    if (user) {
      try {
        const cartItemsSnapshot = await firestore().collection('users').doc(user.uid).collection('cart').where('id', '==', itemId).get();
        cartItemsSnapshot.forEach(async (doc) => {
          await doc.ref.delete();
        });
      } catch (error) {
        console.error("Error removing item from cart: ", error);
      }
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Provider>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.location} onPress={handleLocationModal}>
              {location ? location.name : 'Get Location'}
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
            <PaperButton onPress={() => changeLocation({ name: 'New Location' })}>Set Location</PaperButton>
          </Modal>
        </Portal>

        {/* Item Details Modal */}
        <Portal>
          <Modal visible={itemToView} onDismiss={() => setItemToView(null)} contentContainerStyle={styles.itemDetailsModal}>
            {itemToView && (
              <View style={styles.itemDetailsContainer}>
                <Image source={{ uri: itemToView.image }} style={styles.itemDetailsImage} />
                <Text style={styles.itemDetailsName}>{itemToView.name}</Text>
                <Text style={styles.itemDetailsPrice}>${itemToView.price.toFixed(2)}</Text>
                <Text style={styles.itemDetailsAvailable}>Available: {itemToView.available}</Text>
                <Text style={styles.itemDetailsDescription}>{itemToView.description}</Text>
                <TouchableOpacity onPress={() => addToCart(itemToView)} style={styles.addToCartButton}>
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            )}
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
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginHorizontal: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  location: {
    fontSize: 16,
    color: '#007BFF',
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
    height: 200,
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerText: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  categoryItem: {
    marginHorizontal: 8,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
    color: '#007BFF',
  },
  productAvailable: {
    fontSize: 12,
    color: '#777',
  },
  pharmacyItem: {
    marginHorizontal: 8,
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
    padding: 20,
    marginHorizontal: 16,
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
    marginHorizontal: 16,
    borderRadius: 8,
  },
  itemDetailsContainer: {
    alignItems: 'center',
  },
  itemDetailsImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  itemDetailsName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  itemDetailsPrice: {
    fontSize: 16,
    color: '#007BFF',
    marginVertical: 4,
  },
  itemDetailsAvailable: {
    fontSize: 14,
    color: '#777',
  },
  itemDetailsDescription: {
    fontSize: 14,
    color: '#333',
    marginVertical: 8,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
