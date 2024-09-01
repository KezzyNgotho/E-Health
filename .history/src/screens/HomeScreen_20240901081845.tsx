import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, ScrollView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal, Portal, Provider, Button, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import firebase from './../firebase';


// Ensure firebase is initialized in your project
// import firebaseConfig from './firebaseConfig';
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

const App = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('4'); // Default to 'General'
  const [selectedLocation, setSelectedLocation] = useState('El Etaby Pharmacy');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [itemToView, setItemToView] = useState(null);
  const [categories, setCategories] = useState([]);
  const [drugs, setDrugs] = useState({});

  const navigation = useNavigation();
  const firestore = firebase.firestore(); // Initialize Firestore

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await firestore.collection('categories').get();
        const fetchedCategories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0].id); // Default to the first category
        }
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };

    fetchCategories();
  }, [firestore]);

  // Fetch drugs based on selected category
  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const snapshot = await firestore.collection('drugs').where('categoryId', '==', selectedCategory).get();
        const fetchedDrugs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const drugsByCategory = {};
        fetchedDrugs.forEach(drug => {
          if (!drugsByCategory[drug.categoryId]) {
            drugsByCategory[drug.categoryId] = [];
          }
          drugsByCategory[drug.categoryId].push(drug);
        });
        setDrugs(drugsByCategory);
      } catch (error) {
        console.error('Error fetching drugs: ', error);
      }
    };

    if (selectedCategory) {
      fetchDrugs();
    }
  }, [selectedCategory, firestore]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      if (existingItem.quantity < item.available) {
        setCart(cart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        ));
      }
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== item.id));
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery(''); // Clear search query when changing category
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  const handleItemClick = (item) => {
    setItemToView(item);
  };

  const filteredDrugs = (drugs[selectedCategory] || []).filter(drug =>
    drug.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Provider>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.location}>{selectedLocation}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={() => setIsCartVisible(true)}>
              <Image source={require('./../assets/icons8-cart-48.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setIsLocationModalVisible(true)}>
              <Image source={require('./../assets/icons8-location-50.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Image source={require('./../assets/icons8-notifications-78.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search For Medicines..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>Best Discounts</Text>
          <Image source={require('./../assets/pexels-karolina-grabowska-5650026.jpg')} style={styles.bannerImage} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop By Category</Text>
          <FlatList
            horizontal
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCategoryChange(item.id)} style={styles.categoryItem}>
                <Image source={item.image} style={styles.categoryImage} />
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{categories.find(cat => cat.id === selectedCategory)?.name}</Text>
          {filteredDrugs.length > 0 ? (
            <FlatList
              numColumns={3}
              data={filteredDrugs}
              renderItem={({ item }) => (
                <View style={styles.productItem}>
                  <TouchableOpacity onPress={() => handleItemClick(item)}>
                    <Image source={item.image} style={styles.productImage} />
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                    <Text style={styles.productAvailable}>Available: {item.available}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => addToCart(item)} style={styles.cartButton}>
                    <Text style={styles.cartButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.id}
            />
          ) : (
            <Text style={styles.noResultsText}>No results found.</Text>
          )}
        </View>

        <Portal>
          <Modal visible={isLocationModalVisible} onDismiss={() => setIsLocationModalVisible(false)} contentContainerStyle={styles.locationModal}>
            <View style={styles.modalContent}>
              <Title style={styles.modalTitle}>Select Pharmacy</Title>
              <RNPickerSelect
                onValueChange={handleLocationChange}
                items={[
                  { label: 'El Etaby Pharmacy', value: 'El Etaby Pharmacy' },
                  { label: 'Gahwa Pharmacy', value: 'Gahwa Pharmacy' },
                  { label: 'Medypharm', value: 'Medypharm' },
                ]}
                style={pickerSelectStyles}
                value={selectedLocation}
              />
              <Button mode="contained" onPress={() => setIsLocationModalVisible(false)} style={styles.modalCloseButton}>
                Close
              </Button>
            </View>
          </Modal>
        </Portal>

        <Portal>
          <Modal visible={isCartVisible} onDismiss={() => setIsCartVisible(false)} contentContainerStyle={styles.cartModal}>
            <View style={styles.modalContent}>
              <Title style={styles.modalTitle}>Your Cart</Title>
              {cart.length > 0 ? (
                <>
                  <FlatList
                    data={cart}
                    renderItem={({ item }) => (
                      <View style={styles.cartItem}>
                        <Text style={styles.cartItemName}>{item.name}</Text>
                        <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
                        <Text style={styles.cartItemPrice}>Price: ${item.price.toFixed(2)}</Text>
                        <Button onPress={() => removeFromCart(item)} mode="outlined">Remove</Button>
                      </View>
                    )}
                    keyExtractor={item => item.id}
                  />
                  <View style={styles.cartTotal}>
                    <Text style={styles.cartTotalText}>Total Price: ${totalPrice.toFixed(2)}</Text>
                    <Button mode="contained" onPress={() => navigation.navigate('Checkout', { cart, totalPrice })}>Checkout</Button>
                  </View>
                </>
              ) : (
                <Text style={styles.emptyCartText}>Your cart is empty.</Text>
              )}
            </View>
          </Modal>
        </Portal>

        {itemToView && (
          <Portal>
            <Modal visible={Boolean(itemToView)} onDismiss={() => setItemToView(null)} contentContainerStyle={styles.itemModal}>
              <View style={styles.modalContent}>
                <Title style={styles.modalTitle}>{itemToView.name}</Title>
                <Image source={itemToView.image} style={styles.itemImage} />
                <Text style={styles.itemDescription}>{itemToView.description}</Text>
                <Text style={styles.itemPrice}>Price: ${itemToView.price.toFixed(2)}</Text>
                <Button mode="contained" onPress={() => addToCart(itemToView)}>Add to Cart</Button>
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
    padding: 15,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    marginLeft: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  searchContainer: {
    padding: 15,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  banner: {
    position: 'relative',
    marginVertical: 15,
  },
  bannerText: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerImage: {
    width: '100%',
    height: 200,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryItem: {
    marginRight: 10,
  },
  categoryImage: {
    width: 80,
    height: 80,
  },
  categoryName: {
    textAlign: 'center',
  },
  productItem: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    color: 'green',
  },
  productAvailable: {
    fontSize: 12,
    color: 'gray',
  },
  cartButton: {
    marginTop: 10,
    backgroundColor: '#ff5722',
    padding: 10,
    borderRadius: 5,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  locationModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  cartModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  itemModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalCloseButton: {
    marginTop: 20,
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  cartItem: {
    marginBottom: 15,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemQuantity: {
    color: 'gray',
  },
  cartItemPrice: {
    color: 'green',
  },
  cartTotal: {
    marginTop: 20,
  },
  cartTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  itemDescription: {
    marginVertical: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is not obscured by the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is not obscured by the icon
  },
});

export default App;
