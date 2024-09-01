import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, ScrollView, TextInput } from 'react-native';
import { Modal, Portal, Provider, Button } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';

const App = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [itemToView, setItemToView] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { id: '1', name: 'Category 1', image: require('../assets/pexels-karolina-grabowska-5650026.jpg') },
    { id: '2', name: 'Category 2', image: require('../assets/pexels-tanya-nova-2593907-4371873.jpg') },
  ];
  
  const products = [
    { id: '1', name: 'Product 1', price: 10.00, available: 20, image: require('../assets/flu.jpg') },
    { id: '2', name: 'Product 2', price: 20.00, available: 15, image: require('../assets/stomach.jpg') },
  ];

  useEffect(() => {
    Geolocation.requestAuthorization('whenInUse');
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
            <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.iconButton}>
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
              <Button mode="contained" onPress={() => setItemToView(null)} style={styles.modalCloseButton}>
                Close
              </Button>
            </View>
          </Modal>
        </Portal>
      </ScrollView>
    </Provider>
  );
};
