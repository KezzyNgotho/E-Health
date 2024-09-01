import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure you have react-native-vector-icons installed
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { auth, firestore } from './../firebase'; // Adjust path as needed

export function Sidebar({ onClose, onLogout }) {
  const [userDetails, setUserDetails] = useState({ name: '', role: '' });
  const navigation = useNavigation(); // Get the navigation object

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Fetch user data from Firestore
          const userDoc = await firestore.collection('users').doc(user.uid).get();
          const userData = userDoc.data();

          if (userData) {
            setUserDetails({
              name: userData.name || '', // Default to 'John Doe' if name is not available
              role: userData.role || 'Ph', // Default to 'Pharmacist' if role is not available
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

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
        <Text style={styles.profileName}>{userDetails.name}</Text>
        <Text style={styles.profileRole}>{userDetails.role}</Text>
      </View>
      
      {/* Sidebar Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('Inventory')} // Navigate to Inventory screen
        >
          <Icon name="list" size={20} color="#fff" />
          <Text style={styles.linkText}>Inventory</Text>
        </TouchableOpacity>
        {/* Add other links here */}
        <TouchableOpacity style={styles.link}>
          <Icon name="search" size={20} color="#fff" />
          <Text style={styles.linkText}>Track Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Icon name="bell" size={20} color="#fff" />
          <Text style={styles.linkText}>Follow Ups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Icon name="exclamation-triangle" size={20} color="#fff" />
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
    width: 200,
    backgroundColor: '#DDD',
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
    marginTop: 20,
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
