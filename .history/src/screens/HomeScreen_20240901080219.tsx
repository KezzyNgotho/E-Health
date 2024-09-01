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
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [itemToView, setItemToView] = useState(null);
  const navigation = useNavigation();

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

  const filteredDrugs = drugs[selectedCategory].filter(drug =>
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
                        <Image source={item.image} style={styles.cartItemImage} />
                        <View style={styles.cartItemDetails}>
                          <Text style={styles.cartItemName}>{item.name}</Text>
                          <Text style={styles.cartItemPrice}>${item.price.toFixed(2)} x {item.quantity}</Text>
                          <Text style={styles.cartItemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
                          <View style={styles.cartItemActions}>
                            <TouchableOpacity onPress={() => removeFromCart(item)} style={styles.cartItemButton}>
                              <Text style={styles.cartItemButtonText}>-</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => addToCart(item)} style={styles.cartItemButton}>
                              <Text style={styles.cartItemButtonText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}
                    keyExtractor={item => item.id}
                  />
                  <Text style={styles.cartTotal}>Total: ${totalPrice.toFixed(2)}</Text>
                </>
              ) : (
                <Text style={styles.noResultsText}>Your cart is empty.</Text>
              )}
              <Button mode="contained" onPress={() => setIsCartVisible(false)} style={styles.modalCloseButton}>
                Close
              </Button>
            </View>
          </Modal>
        </Portal>

        {itemToView && (
          <Modal visible={!!itemToView} onDismiss={() => setItemToView(null)} contentContainerStyle={styles.itemModal}>
            <View style={styles.modalContent}>
              <Title style={styles.modalTitle}>{itemToView.name}</Title>
              <Image source={itemToView.image} style={styles.itemModalImage} />
              <Text style={styles.itemModalPrice}>Price: ${itemToView.price.toFixed(2)}</Text>
              <Text style={styles.itemModalAvailable}>Available: {itemToView.available}</Text>
              <Button mode="contained" onPress={() => addToCart(itemToView)} style={styles.addToCartButton}>
                Add to Cart
              </Button>
              <Button mode="contained" onPress={() => setItemToView(null)} style={styles.modalCloseButton}>
                Close
              </Button>
            </View>
          </Modal>
        )}
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
  },
  location: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  searchContainer: {
    padding: 10,
  },
  searchBar: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    elevation: 2,
  },
  banner: {
    padding: 10,
    backgroundColor: '#ffffff',
    elevation: 2,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerImage: {
    width: '100%',
    height: 150,
    marginTop: 10,
  },
  section: {
    padding: 10,
    backgroundColor: '#ffffff',
    elevation: 2,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  categoryName: {
    marginTop: 5,
    fontSize: 14,
  },
  productItem: {
    width: '30%',
    margin: 5,
    backgroundColor: '#ffffff',
    elevation: 2,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
  productAvailable: {
    fontSize: 12,
    color: '#888',
  },
  cartButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  cartButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  cartModal: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 4,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#888',
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cartItemActions: {
    flexDirection: 'row',
    marginTop: 5,
  },
  cartItemButton: {
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  cartItemButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cartTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 10,
  },
  modalCloseButton: {
    marginTop: 10,
  },
  itemModal: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 4,
  },
  itemModalImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  itemModalPrice: {
    fontSize: 16,
    marginTop: 10,
  },
  itemModalAvailable: {
    fontSize: 16,
    marginTop: 5,
  },
  addToCartButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
  },
  locationModal: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 4,
  },
  pickerSelect: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    alignItems: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 4,
    color: '#000',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    color: '#000',
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default App;
