import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { Card } from 'react-native-elements';
import { ProgressChart } from 'react-native-chart-kit';
import { Sidebar } from './Sidebar'; // Import the Sidebar component

export default function InventorySummaryScreen() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0)); // Initialize animation value

  const data = {
    labels: ["Chicken Karage", "Beef Nyakinyo", "Chicken Katsu"],
    data: [0.6, 0.2, 0.1],
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    Animated.timing(animation, {
      toValue: isSidebarOpen ? 0 : 250, // Change 250 to the width of your sidebar
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar */}
      {isSidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} onLogout={() => {/* handle logout */}} />}

      {/* Main Content */}
      <Animated.View style={[styles.mainContent, { marginLeft: animation }]}>
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
                <Text style={styles.overviewTitle}>Total Qty</Text>
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
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                }}
                hideLegend={false}
              />
            </View>

            {/* Best Selling Items */}
            <Text style={styles.sectionTitle}>3 Best Selling Items</Text>
            <View style={styles.bestSellingItems}>
              <Text style={styles.itemText}>240 Items - Chicken Karage</Text>
              <Text style={styles.itemText}>88 Items - Beef Nyakinyo</Text>
              <Text style={styles.itemText}>31 Items - Chicken Katsu</Text>
            </View>
          </Card>

          {/* Inventory List */}
          <Card containerStyle={styles.card}>
            <Text style={styles.sectionTitle}>Items Inventory List</Text>
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
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  menuButton: {
    backgroundColor: '#004d40',
    padding: 10,
    borderRadius: 5,
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
   // marginLeft: 10,
  },
  notificationText: {
    fontSize: 18,
    color: '#fff',
  },
  notificationCount: {
    fontSize: 16,
    color: '#004d40',
   // marginLeft: 5,
  },
  card: {
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  overview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
