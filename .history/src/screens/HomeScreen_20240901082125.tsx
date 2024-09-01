import React, { useState } from 'react';
import { View, Text, Image, FlatList, ScrollView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal, Portal, Provider, Button, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

const categories = [
  { id: '1', name: 'Pain Relief', image: require('./../assets/pain.jpg') },
  { id: '2', name: 'Cold & Flu', image: require('./../assets/flu.jpg') },
  { id: '3', name: 'Digestive Health', image: require('./../assets/stomach.jpg') },
  { id: '4', name: 'General', image: require('./../assets/pexels-tanya-nova-2593907-4371873.jpg') },
];

const drugs = {
  '1': [
    { id: '1', name: 'Aspirin', price: 9.99, available: 10, image: require('./../assets/pain.jpg') },
    { id: '2', name: 'Ibuprofen', price: 8.99, available: 15, image: require('./../assets/pain.jpg') },
  ],
  '2': [
    { id: '1', name: 'Cold Medicine', price: 12.99, available: 8, image: require('./../assets/pain.jpg') },
    { id: '2', name: 'Cough Syrup', price: 7.99, available: 20, image: require('./../assets/pain.jpg') },
  ],
  '3': [
    { id: '1', name: 'Antacid', price: 6.99, available: 12, image: require('./../assets/pain.jpg') },
    { id: '2', name: 'Laxative', price: 5.99, available: 5, image: require('./../assets/pain.jpg') },
  ],
  '4': [
    { id: '1', name: 'Multivitamins', price: 14.99, available: 7, image: require('./../assets/pain.jpg') },
    { id: '2', name: 'First Aid Kit', price: 19.99, available: 3, image: require('./../assets/pain.jpg') },
  ],
};

const App = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('4'); // Default to 'General'
  const [selectedLocation, setSelectedLocation] = useState('El Etaby Pharmacy');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartVisible, setIsCartVisible] = useState(false); // State for the cart modal
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false); // State for the location modal
  const [itemToView, setItemToView] = useState(null); // State for the item details modal
  const navigation = useNavigation();

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
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

  // Filter drugs based on search query
  const filteredDrugs = drugs[selectedCategory].filter(drug =>
    drug.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total price of items in the cart
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Provider>
      <ScrollView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.location}>{selectedLocation}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setIsCartVisible(true)} // Show cart modal
            >
              <Image
                source={require('./../assets/icons8-cart-48.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setIsLocationModalVisible(true)}>
              <Image source={require('./../assets/icons8-location-50.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Image source={require('./../assets/icons8-notifications-78.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search For Medicines..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Promotional Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Best Discounts</Text>
          <Image source={require('./../assets/pexels-karolina-grabowska-5650026.jpg')} style={styles.bannerImage} />
        </View>

        {/* Shop by Category */}
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

        {/* Drugs by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{categories.find(cat => cat.id === selectedCategory).name}</Text>
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

        {/* Location Selector Modal */}
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

        {/* Cart Modal */}
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
                        <Image source={item.image} style={styles.cartItemImage} />
                        <View style={styles.cartItemDetails}>
                          <Text style={styles.cartItemName}>{item.name}</Text>
                          <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
                          <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
                        </View>
                        <TouchableOpacity onPress={() => removeFromCart(item)} style={styles.cartItemButton}>
                          <Text style={styles.cartItemButtonText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={item => item.id}
                  />
                  <Text style={styles.cartTotal}>Total: ${totalPrice.toFixed(2)}</Text>
                </>
              ) : (
                <Text style={styles.emptyCartText}>Your cart is empty.</Text>
              )}
              <Button mode="contained" onPress={() => setIsCartVisible(false)} style={styles.modalCloseButton}>
                Close
              </Button>
            </View>
          </Modal>
        </Portal>

        {/* Item Details Modal */}
        <Portal>
          <Modal visible={itemToView !== null} onDismiss={() => setItemToView(null)} contentContainerStyle={styles.itemDetailsModal}>
            {itemToView && (
              <View style={styles.modalContent}>
                <Image source={itemToView.image} style={styles.itemDetailsImage} />
                <Title style={styles.modalTitle}>{itemToView.name}</Title>
                <Text style={styles.itemDetailsPrice}>${itemToView.price.toFixed(2)}</Text>
                <Text style={styles.itemDetailsAvailable}>Available: {itemToView.available}</Text>
                <Button mode="contained" onPress={() => addToCart(itemToView)} style={styles.modalButton}>
                  Add to Cart
                </Button>
                <Button mode="contained" onPress={() => setItemToView(null)} style={styles.modalCloseButton}>
                  Close
                </Button>
              </View>
            )}
          </Modal>
        </Portal>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#fff' },
  headerLeft: { flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  location: { fontSize: 16, fontWeight: 'bold' },
  iconButton: { marginHorizontal: 10 },
  icon: { width: 30, height: 30 },
  searchContainer: { padding: 10 },
  searchBar: { backgroundColor: '#f0f0f0', borderRadius: 5, padding: 10 },
  banner: { alignItems: 'center', marginVertical: 10 },
  bannerText: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  bannerImage: { width: '100%', height: 150, resizeMode: 'cover' },
  section: { padding: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  categoryItem: { marginRight: 10 },
  categoryImage: { width: 100, height: 100, borderRadius: 10 },
  categoryName: { textAlign: 'center', marginTop: 5 },
  productItem: { flex: 1, margin: 10 },
  productImage: { width: '100%', height: 100, borderRadius: 10 },
  productName: { fontWeight: 'bold', marginTop: 5 },
  productPrice: { color: '#00f', marginTop: 2 },
  productAvailable: { color: '#888', marginTop: 2 },
  cartButton: { marginTop: 10, backgroundColor: '#00f', padding: 10, borderRadius: 5 },
  cartButtonText: { color: '#fff', textAlign: 'center' },
  noResultsText: { textAlign: 'center', marginTop: 20 },
  locationModal: { padding: 20, backgroundColor: '#fff' },
  cartModal: { padding: 20, backgroundColor: '#fff' },
  itemDetailsModal: { padding: 20, backgroundColor: '#fff' },
  modalContent: { flex: 1 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalButton: { marginTop: 10 },
  modalCloseButton: { marginTop: 10 },
  cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cartItemImage: { width: 50, height: 50, borderRadius: 5 },
  cartItemDetails: { flex: 1, marginLeft: 10 },
  cartItemName: { fontWeight: 'bold' },
  cartItemPrice: { color: '#00f' },
  cartItemQuantity: { color: '#888' },
  cartItemButton: { backgroundColor: '#f00', padding: 5, borderRadius: 5 },
  cartItemButtonText: { color: '#fff', textAlign: 'center' },
  emptyCartText: { textAlign: 'center', marginTop: 20 },
  itemDetailsImage: { width: '100%', height: 150, resizeMode: 'cover' },
  itemDetailsPrice: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  itemDetailsAvailable: { color: '#888' },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
    paddingRight: 30,
  },
});

export default App;