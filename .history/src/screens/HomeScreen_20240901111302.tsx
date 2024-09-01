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
        // Fetch products and pharmacies from Firestore
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
    
    fetchData(); // Load initial data

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
    
    getUserLocation(); // Fetch user location
  }, []);

  const fetchNearbyPharmacies = async (location) => {
    try {
      const pharmaciesRef = firestore().collection('pharmacies');
      const querySnapshot = await pharmaciesRef.where('location', '==', location).get();
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
    fetchNearbyPharmacies(newLocation); // Pass the new location to fetch pharmacies
    handleLocationModal();
  };

  const addToCart = async (item) => {
    const user = auth().currentUser;
    if (user) {
      try {
        const userCartRef = firestore().collection('users').doc(user.uid).collection('cart').doc(item.id);
        const doc = await userCartRef.get();
        if (doc.exists) {
          // Update existing item quantity
          await userCartRef.update({
            quantity: doc.data().quantity + 1
          });
        } else {
          // Add new item to cart with quantity 1
          await userCartRef.set({
            ...item,
            quantity: 1
          });
        }
        setItemToView(null);
      } catch (error) {
        console.error("Error adding to cart: ", error);
      }
    } else {
      console.log("User not logged in");
    }
  };

  const removeFromCart = async (item) => {
    const user = auth().currentUser;
    if (user) {
      try {
        await firestore().collection('users').doc(user.uid).collection('cart').doc(item.id).delete();
      } catch (error) {
        console.error("Error removing from cart: ", error);
      }
    } else {
      console.log("User not logged in");
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
          <Modal visible={itemToView !== null} onDismiss={() => setItemToView(null)} contentContainerStyle={styles.itemDetailsModal}>
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
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconButton: {
    marginHorizontal: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  searchContainer: {
    padding: 10,
  },
  searchBar: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 5,
  },
  bannerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  banner: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  categoryImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  categoryName: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  productDetails: {
    marginLeft: 10,
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
    fontSize: 12,
    color: '#aaa',
  },
  pharmacyItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  pharmacyImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  pharmacyName: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  locationModal: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemDetailsModal: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
  },
  modalContent: {
    alignItems: 'center',
  },
  itemDetailsImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  itemDetailsName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  itemDetailsPrice: {
    fontSize: 16,
    color: '#888',
  },
  addToCartButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
