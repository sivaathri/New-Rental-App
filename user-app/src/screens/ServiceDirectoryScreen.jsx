import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TouchableOpacity, ActivityIndicator, Linking, 
  Dimensions, TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../constants/api';

const { width } = Dimensions.get('window');

const ServiceDirectoryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Mechanic'); // Mechanic, Puncher, Acting Driver
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'Mechanic', name: 'Mechanic', icon: 'wrench' },
    { id: 'Puncher', name: 'Puncher', icon: 'hammer' },
    { id: 'Acting Driver', name: 'Drivers', icon: 'account-check' },
  ];

  useEffect(() => {
    fetchServices();
  }, [activeTab]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/services?type=${activeTab}`);
      setServices(response.data.services);
    } catch (error) {
      console.log('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleMap = (lat, lng) => {
    if (lat && lng) {
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      Linking.openURL(url);
    }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderServiceCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.imageContainer}>
          {item.image_url ? (
            <Image 
              source={{ uri: `http://192.168.0.157:5000${item.image_url}` }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="person" size={30} color="#ccc" />
            </View>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#2e7d32" />
            <Text style={styles.verifiedText}>VERIFIED</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.infoText} numberOfLines={2}>{item.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.mobile}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.callBtn]}
          onPress={() => handleCall(item.mobile)}
        >
          <Ionicons name="call" size={18} color="white" />
          <Text style={styles.callBtnText}>Call Now</Text>
        </TouchableOpacity>
        
        {item.latitude && (
          <TouchableOpacity 
            style={[styles.actionBtn, styles.mapBtn]}
            onPress={() => handleMap(item.latitude, item.longitude)}
          >
            <Ionicons name="map" size={18} color="#000" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick Services</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput 
          style={styles.searchInput}
          placeholder={`Search ${activeTab.toLowerCase()} by name or area...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <MaterialCommunityIcons 
              name={tab.icon} 
              size={20} 
              color={activeTab === tab.id ? 'white' : '#666'} 
            />
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FDD835" />
          <Text style={styles.loadingText}>Searching nearby {activeTab.toLowerCase()}s...</Text>
        </View>
      ) : (
        <FlatList 
          data={filteredServices}
          renderItem={renderServiceCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="search-outline" size={60} color="#ddd" />
              <Text style={styles.emptyText}>No {activeTab.toLowerCase()}s found in this area.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#000', letterSpacing: -0.5 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    height: 50,
    marginTop: 10,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#000' },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    width: (width - 60) / 3,
    justifyContent: 'center',
  },
  activeTab: { backgroundColor: '#000' },
  tabLabel: { fontSize: 11, fontWeight: 'bold', color: '#666', marginLeft: 6 },
  activeTabLabel: { color: 'white' },
  listContent: { padding: 20 },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  imageContainer: { width: 60, height: 60, borderRadius: 30, overflow: 'hidden', backgroundColor: '#f9f9f9' },
  profileImage: { width: '100%', height: '100%' },
  placeholderImage: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  headerInfo: { marginLeft: 15 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  verifiedBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#E8F5E9', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 10,
    marginTop: 4,
    alignSelf: 'flex-start'
  },
  verifiedText: { fontSize: 9, fontWeight: 'bold', color: '#2e7d32', marginLeft: 4 },
  cardBody: { marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#666', marginLeft: 10, flex: 1 },
  cardFooter: { flexDirection: 'row', gap: 10 },
  actionBtn: { 
    borderRadius: 15, 
    height: 45, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  callBtn: { backgroundColor: '#000', flex: 1 },
  callBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 14 },
  mapBtn: { backgroundColor: '#FAD02C', width: 45 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  loadingText: { marginTop: 15, color: '#666', fontSize: 14, fontWeight: '500' },
  emptyText: { marginTop: 20, color: '#999', fontSize: 15, textAlign: 'center' },
});

export default ServiceDirectoryScreen;
