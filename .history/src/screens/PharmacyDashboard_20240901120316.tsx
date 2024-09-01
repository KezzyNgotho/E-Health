import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Animated, Modal } from 'react-native';
import { Card } from 'react-native-elements';
import { ProgressChart } from 'react-native-chart-kit';
import { Sidebar } from './Sidebar'; // Ensure the Sidebar component is correctly imported

export default function InventorySummaryScreen() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [animation] = useState(new Animated.Value(-250)); // Start animation from off-screen

  const data = {
    labels: ["Chicken Karage", "Beef Nyakinyo", "Chicken Katsu"],
    data: [0.6, 0.2, 0.1],
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    Animated.timing(animation, {
      toValue: isSidebarOpen ? -250 : 0, // Slide in/out effect
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar Modal */}
      <Modal
        transparent={true}
        visible={isSidebarOpen}
        animationType="slide"
        onRequestClose={() => setSidebarOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.sidebar}>
            <Sidebar onClose={() => setSidebarOpen(false)} onLogout={() => {/* handle logout */}} />
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.headerWrapper}>
          {/* Hamburger Menu Button */}
          <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
            <View style={styles.menuIcon} />
            <View style={styles.menuIcon} />
            <View style={styles.menuIcon} />
          </TouchableOpacity>
          
          {/* Notification Area */}
          <View style={styles.notificationWrapper}>
            <TouchableOpacity style={styles.notificationButton}>
              <Text style={styles.notificationText}>🔔</Text>
            </TouchableOpacity>
            <Text style={styles.notificationCount}>5</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollContent}>
          {/* Inventory Overview */}
          <Card containerStyle={styles.card}>
            <View style={styles.overview}>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewTitle}>Total Quantity</Text>
                <Text style={styles.overviewValue}>479 Items</Text>
              </View>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewTitle}>Total Value</Text>
                <Text style={styles.overviewValue}>$1,067.50</Text>
              </View>
            </View>

            {/* Chart */}
            <View style={styles.chartContainer}>
              <ProgressChart
                data={data}
                width={320}
                height={220}
                strokeWidth={16}
                radius={32}
                chartConfig={{
                  backgroundGradientFrom: "#f5f5f5",
                  backgroundGradientTo: "#f5f5f5",
                  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                }}
                hideLegend={false}
              />
            </View>

            {/* Best Selling Items */}
            <Text style={styles.sectionTitle}>Top 3 Best-Selling Items</Text>
            <View style={styles.bestSellingItems}>
              <Text style={styles.itemText}>240 Items - Chicken Karage</Text>
              <Text style={styles.itemText}>88 Items - Beef Nyakinyo</Text>
              <Text style={styles.itemText}>31 Items - Chicken Katsu</Text>
            </View>
          </Card>

          {/* Inventory List */}
          <Card containerStyle={styles.card}>
            <Text style={styles.sectionTitle}>Inventory List</Text>
            <View style={styles.item}>
              <Text style={styles.itemName}>Ekiddo Snack Pack</Text>
              <Text style={styles.itemPrice}>$66.75</Text>
              <Text style={styles.itemWeight}>250 g</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.itemName}>Dory Fillet</Text>
              <Text style={styles.itemPrice}>$1,500.00</Text>
              <Text style={styles.itemWeight}>3 KG</Text>
            </View>
          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: 250, // Width of the sidebar
    backgroundColor: '#',
    zIndex: 1, // Ensure sidebar is on top
    elevation: 5,
    flex: 1,
    paddingTop: 20, // Adjust for top padding
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 1, // Add shadow for elevation effect
  },
  menuButton: {
    backgroundColor: '#004d40',
    padding: 10,
    borderRadius: 5,
    elevation: 1,
  },
  menuIcon: {
    width: 30,
    height: 3,
    backgroundColor: '#fff',
    marginVertical: 3,
  },
  notificationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    backgroundColor: '#004d40',
    padding: 10,
    borderRadius: 5,
    elevation: 1,
  },
  notificationText: {
    fontSize: 18,
    color: '#fff',
  },
  notificationCount: {
    fontSize: 16,
    color: '#004d40',
    marginLeft: 8,
  },
  card: {
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    elevation: 2, // Add shadow to card
  },
  overview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewTitle: {
    fontSize: 16,
    color: '#333',
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004d40',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#004d40',
  },
  bestSellingItems: {
    marginTop: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    color: '#004d40',
  },
  itemWeight: {
    fontSize: 14,
    color: '#999',
  },
});
