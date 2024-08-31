import React from 'react';
import { View, Text, Image, FlatList, ScrollView, TextInput, StyleSheet } from 'react-native';

const categories = [
  { id: '1', name: 'Pain Relief', image: require('./assets/pain_relief.png') },
  { id: '2', name: 'Cold & Flu', image: require('./assets/cold_flu.png') },
  { id: '3', name: 'Digestive Health', image: require('./assets/digestive_health.png') },
];

const skinCareProducts = [
  { id: '1', name: 'Cerave Cleanser', price: '$10.99', image: require('./assets/cerave_cleanser.png') },
  { id: '2', name: 'La Roche Serum', price: '$29.99', image: require('./assets/la_roche_serum.png') },
  { id: '3', name: 'Water Gel', price: '$15.99', image: require('./assets/water_gel.png') },
];

const hotDeals = [
  { id: '1', name: 'Eye Patches', price: '$5.99', image: require('./assets/eye_patches.png') },
  { id: '2', name: 'Vitamin C', price: '$8.99', image: require('./assets/vitamin_c.png') },
  { id: '3', name: 'Lip Balm', price: '$3.99', image: require('./assets/lip_balm.png') },
];

export default function App() {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.location}>El Etaby Pharmacy</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search For Medicines..."
        />
      </View>

      {/* Promotional Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Best Discounts</Text>
        <Image source={require('./assets/discount_banner.png')} style={styles.bannerImage} />
      </View>

      {/* Shop by Category */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop By Category</Text>
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => (
            <View style={styles.categoryItem}>
              <Image source={item.image} style={styles.categoryImage} />
              <Text style={styles.categoryName}>{item.name}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>

      {/* Skin Care Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skin Care Products</Text>
        <FlatList
          horizontal
          data={skinCareProducts}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Image source={item.image} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>

      {/* Hot Deals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hot Deals</Text>
        <FlatList
          horizontal
          data={hotDeals}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Image source={item.image} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </ScrollView>
  );
}

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
  location: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBar: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 8,
    width: '60%',
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
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 14,
  },
  productItem: {
    marginRight: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  productImage: {
    width: 80,
    height: 80,
  },
  productName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  productPrice: {
    marginTop: 4,
    fontSize: 14,
    color: '#28a745',
  },
});