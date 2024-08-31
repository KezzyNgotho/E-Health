import React, { useState } from 'react';
import { View, Text, Image, FlatList, ScrollView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const categories = [
  { id: '1', name: 'Pain Relief', image: require('./../assets/pain.jpg') },
  { id: '2', name: 'Cold & Flu', image: require('./../assets/flu.jpg') },
  { id: '3', name: 'Digestive Health', image: require('./../assets/stomach.jpg') },
  { id: '4', name: 'General', image: require('./../assets/pexels-tanya-nova-2593907-4371873.jpg')},
];

const drugs = {
  '1': [
    { id: '1', name: 'Aspirin', price: '$9.99', available: 10, image: require('./../assets/pexels-tanya-nova-2593907-4371873.jpg') },
    { id: '2', name: 'Ibuprofen', price: '$8.99', available: 15, image: require('./../assets/pexels-tanya-nova-2593907-4371873.jpg') },
  ],
  '2': [
    { id: '1', name: 'Cold Medicine', price: '$12.99', available: 8, image: require('./../assets/pexels-tanya-nova-2593907-4371873.jpg') },
    { id: '2', name: 'Cough Syrup', price: '$7.99', available: 20, image: require('./../assets/pexels-tanya-nova-2593907-4371873.jpg')},
  ],
  '3': [
    { id: '1', name: 'Antacid', price: '$6.99', available: 12, image: require('./../assets/pexels-tanya-nova-2593907-4371873.jpg') },
    { id: '2', name: 'Laxative', price: '$5.99', available: 5, image: require('./../assets/pexels-tanya-nova-2593907-4371873.jpg') },
  ],
  '4': [
    { id: '1', name: 'Multivitamins', price: '$14.99', available: 7, image: require('./../assets/pexels-tanya-nova-2593907-4371873.jpg') },
    { id: '2', name: 'First Aid Kit', price: '$19.99', available: 3, image: require('./../assets/pexels-tanya-nova-2593907-4371873.jpg') },
  ],
};

const App = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('4'); // Default to 'General'

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.location}>El Etaby Pharmacy</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Image source={require('./../assets/icons8-notifications-78.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Image source={require('./../assets/icons8-cart-48.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search For Medicines..."
      />

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
        <FlatList
          numColumns={3}
          data={drugs[selectedCategory]}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Image source={item.image} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
              <Text style={styles.productAvailable}>Available: {item.available}</Text>
              <TouchableOpacity onPress={() => addToCart(item)} style={styles.cartButton}>
                <Text style={styles.cartButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBar: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 8,
    margin: 16,
  },
  banner: {
    margin: 16,
    backgroundColor: '#dff0d8',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bannerImage: {
    width: 80,
    height: 80,
    marginLeft: 16,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  productItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    margin: 8,
    alignItems: 'center',
    flex: 1,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    color: '#333',
  },
  productAvailable: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  cartButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;
