import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure you have react-native-vector-icons installed

export function Sidebar({ onClose, onLogout }) {
  return (
    <View style={styles.sidebar}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="close" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }} // Replace with actual profile image URL
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileRole}>Pharmacist</Text>
      </View>
      
      {/* Sidebar Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity style={styles.link}>
          <Icon name="list" size={20} color="#000" />
          <Text style={styles.linkText}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Icon name="search" size={20} color="#000" />
          <Text style={styles.linkText}>Track Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Icon name="bell" size={20} color="#000" />
          <Text style={styles.linkText}>Follow Ups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Icon name="exclamation-triangle" size={20} color="#000" />
          <Text style={styles.linkText}>Complaints</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Icon name="phone" size={20} color="#fff" />
          <Text style={styles.linkText}>Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Icon name="calendar" size={20} color="#fff" />
          <Text style={styles.linkText}>Appointments</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Icon name="sign-out" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 200, // Adjusted width
    backgroundColor: '#DDD', // Updated background color
    padding: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 2,
    elevation: 5,
    justifyContent: 'space-between',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileRole: {
    fontSize: 14,
    color: '#fff',
  },
  linksContainer: {
    flex: 1,
    marginTop: 20, // Added margin for spacing
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#fff',
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  closeButton: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
});
