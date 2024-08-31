import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PharmacyDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pharmacy Dashboard</Text>
      {/* Add content for Pharmacy Dashboard */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default PharmacyDashboard;
