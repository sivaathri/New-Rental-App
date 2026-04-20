import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, Image, 
  TouchableOpacity, FlatList, Dimensions, Keyboard, 
  RefreshControl, Modal, KeyboardAvoidingView, Platform, 
  Animated, LayoutAnimation, UIManager 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRentalFavorites } from '../context/RentalFavoritesContext';
import colors from '../constants/colors';
import RentalFilterModal from '../components/RentalFilterModal';
import * as Location from 'expo-location';
import axios from 'axios';
import { API_URL } from '../constants/api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MOCK_BRANDS = [
  { id: 'all', name: 'All', image_url: null },
];

const FadeInView = ({ children, delay = 0, style }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {children}
    </Animated.View>
  );
};

const RentalCarScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useRentalFavorites();
  const [brands, setBrands] = useState([]);
  const [cars, setCars] = useState([]); 
  const [filteredCars, setFilteredCars] = useState([]); 
  const [nearbyCars, setNearbyCars] = useState([]); 
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [locationName, setLocationName] = useState('Locating...');
  const [userLocation, setUserLocation] = useState(null); 
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [unreadCount, setUnreadCount] = useState(2);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [availableCities, setAvailableCities] = useState(['All Cities', 'Mumbai', 'Bangalore', 'Delhi']);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  
  const [isMapPickerVisible, setIsMapPickerVisible] = useState(false);
  const [mapRegion, setMapRegion] = useState({
      latitude: 19.0760,
      longitude: 72.8777,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
  });
  const [mapPickedAddress, setMapPickedAddress] = useState('');
  const geocodeTimeout = useRef(null);

  useEffect(() => {
    fetchBrands();
    fetchCars();
    getUserLocation();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get(`${API_URL}/vehicles/public/approved`);
      if (response.data.success) {
        const formattedCars = response.data.data.map(car => ({
          ...car,
          id: car.id.toString(),
          brand_id: car.brand_name, 
          price: parseFloat(car.price_per_day),
          rating: car.rating || "5.0",
          location: car.pickup_location || car.landmark || "Unknown",
          image: car.image.startsWith('http') ? car.image : `http://192.168.0.157:5000${car.image}`,
          is_best: car.is_best_car === 1,
          transmission_type: car.transmission_type,
          fuel_type: car.fuel_type,
          seating_capacity: car.seating_capacity,
          mileage: car.mileage,
          price_per_hour: car.price_per_hour,
          price_per_km: car.price_per_km,
          max_km_per_day: car.max_km_per_day,
          pickup_location: car.pickup_location,
          landmark: car.landmark,
          status: car.status,
          rejection_reason: car.rejection_reason,
          approved_at: car.approved_at,
          latitude: car.latitude,
          longitude: car.longitude,
          is_best_car: car.is_best_car,
        }));
        setCars(formattedCars);
        setFilteredCars(formattedCars);
        // console.log(formattedCars)
      }
    } catch (error) {
      console.log("Error fetching cars", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/vehicles/master`);
      if (response.data.vehicles) {
        const allOption = { id: 'all', name: 'All', image_url: null };
        const fetchedBrands = response.data.vehicles.map(v => ({
            id: v.name, 
            name: v.name,
            image_url: v.image_url ? `http://192.168.0.157:5000${v.image_url}` : null
        }));
        setBrands([allOption, ...fetchedBrands]);
      }
    } catch (error) {
      console.log("Error fetching brands", error);
    }
  };

  useEffect(() => {
    calculateNearbyCars();
  }, [userLocation, cars, selectedBrand]);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationName('Permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
      
      setUserLocation(coords);

      try {
        let address = await Location.reverseGeocodeAsync(coords);
        if (address && address.length > 0) {
          const { city, name, street } = address[0];
          const display = [name || street, city].filter(Boolean).join(', ');
          setLocationName(display);
        } else {
          setLocationName(`${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`);
        }
      } catch (geoError) {
        console.log("Geocoding failed:", geoError);
        // Fallback to coordinates if address lookup fails (e.g. rate limit)
        setLocationName(`${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`);
      }
    } catch (error) {
      console.log("Location error:", error);
      setLocationName('Location unavailable');
    }
  };

  const calculateNearbyCars = () => {
    if (!userLocation || !cars.length) return;
    
    let listToFilter = cars;
    if (selectedBrand !== 'all') {
      listToFilter = cars.filter(car => car.brand_id === selectedBrand);
    }
    
    const carsWithDistance = listToFilter
      .filter(car => car.latitude && car.longitude)
      .map(car => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          parseFloat(car.latitude),
          parseFloat(car.longitude)
        );
        return { ...car, distance };
      })
      .sort((a, b) => a.distance - b.distance);
    
    setNearbyCars(carsWithDistance);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
        setRefreshing(false);
        setAppliedFilters(null);
        setSearchQuery('');
        setIsSearching(false);
        setSelectedBrand('all');
    }, 1500);
  };

  useEffect(() => {
    let result = cars;

    if (selectedBrand !== 'all') {
        result = result.filter(c => c.brand_id === selectedBrand);
    }

    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(c => 
            c.name.toLowerCase().includes(query)
        );
    }

    if (selectedCity !== 'All Cities') {
        result = result.filter(c => 
            c.location.toLowerCase().includes(selectedCity.toLowerCase())
        );
    }

    if (appliedFilters) {
      // Mock filter logic
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilteredCars(result);
  }, [cars, selectedBrand, searchQuery, appliedFilters, selectedCity]);

  const renderBrand = ({ item, index }) => {
    const isSelected = selectedBrand === item.id;
    return (
        <FadeInView delay={index * 50}>
            <TouchableOpacity 
                style={styles.brandContainer} 
                activeOpacity={0.8}
                onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                    setSelectedBrand(item.id);
                    if (item.id !== 'all') {
                        setIsSearching(true);
                    } else {
                        setIsSearching(false);
                        setSearchQuery(''); 
                    }
                }}
            >
              <View style={[styles.brandIconContainer, isSelected && styles.brandSelected]}>
                {item.id === 'all' ? (
                     <Ionicons name="apps" size={28} color="black" />
                ) : item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={styles.brandImage} resizeMode="contain" />
                ) : (
                    <MaterialCommunityIcons name="car" size={32} color="black" />
                )}
                {isSelected && (
                    <View style={styles.brandTickBadge}>
                        <Ionicons name="checkmark" size={10} color="white" />
                    </View>
                )}
              </View>
              <Text style={[styles.brandName, isSelected && styles.brandNameSelected]}>{item.name}</Text>
            </TouchableOpacity>
        </FadeInView>
    );
  };

  const renderGridCard = ({ item, index }) => (
    <FadeInView delay={index * 100}>
        <TouchableOpacity style={styles.gridCard}>
          <TouchableOpacity style={styles.gridFavorite} onPress={() => toggleFavorite(item.id)}>
             <Ionicons 
               name={isFavorite(item.id) ? "heart" : "heart-outline"} 
               size={24} 
               color={isFavorite(item.id) ? "#FF4D4D" : "#333"} 
             />
          </TouchableOpacity>
          <View style={styles.gridImageContainer}>
              <Image source={{ uri: item.image }} style={styles.gridImage} resizeMode="contain" />
          </View>
          <View style={styles.gridContent}>
            <Text style={styles.gridTitle} numberOfLines={1}>
                {item.name.toLowerCase()} ({item.model_year || 2026})
            </Text>
            
            <View style={styles.gridLocationRow}>
                <Ionicons name="location-outline" size={14} color="#888" />
                <Text style={styles.gridLocationText} numberOfLines={1}>{item.location}</Text>
            </View>

            <View style={styles.gridStatsRow}>
                <View style={styles.gridStatItem}>
                    <MaterialCommunityIcons name="gas-station" size={16} color="#888" />
                    <Text style={styles.gridStatText}>{item.fuel_type}</Text>
                </View>
                <View style={styles.gridStatItem}>
                    <MaterialCommunityIcons name="seat-passenger" size={16} color="#888" />
                    <Text style={styles.gridStatText}>{item.seating_capacity}</Text>
                </View>
            </View>
            
            <View style={styles.gridFooter}>
                 <View style={styles.gridPriceContainer}>
                    <Text style={styles.gridPriceText}>₹{Math.floor(item.price)}</Text>
                    <Text style={styles.gridPeriodText}>/Day</Text>
                 </View>
                 <View style={styles.bookBtn}>
                     <Text style={styles.bookBtnText}>Call</Text>
                 </View>
            </View>
          </View>
        </TouchableOpacity>
    </FadeInView>
  );

  const renderCarCard = ({ item, index }) => (
    <FadeInView delay={index * 150}>
        <TouchableOpacity style={styles.card}>
          <TouchableOpacity style={styles.favoriteIcon} onPress={() => toggleFavorite(item.id)}>
             <Ionicons 
                name={isFavorite(item.id) ? "heart" : "heart-outline"} 
                size={20} 
                color={isFavorite(item.id) ? "#FF4D4D" : "#666"} 
             />
          </TouchableOpacity>
          <Image source={{ uri: item.image }} style={styles.carImage} resizeMode="contain" />
          <View style={styles.cardContent}>
            <Text style={styles.carName}>{item.name}</Text>
            <View style={styles.locationContainer}>
                 <Ionicons name="location-outline" size={14} color="#888" />
                 <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
            </View>
            <View style={styles.cardFooter}>
                 <View style={styles.featureItem}>
                     <MaterialCommunityIcons name="gas-station" size={16} color="#888" />
                     <Text style={styles.featureText}>{item.fuel_type}</Text>
                 </View>
                 <View style={styles.priceContainer}>
                     <Text style={styles.priceText}>₹{item.price}</Text>
                     <Text style={styles.dayText}>/Day</Text>
                 </View>
            </View>
          </View>
        </TouchableOpacity>
    </FadeInView>
  );

  const numColumns = width > 768 ? 3 : 2;
  const itemWidth = (width - (numColumns + 1) * 15) / numColumns;

  const renderHeader = () => (
    <>
        <View style={styles.header}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                 <View style={styles.logoContainer}>
                      <Ionicons name="car-sport" size={24} color="white" />
                 </View>
                 <TouchableOpacity onPress={() => setLocationModalVisible(true)}>
                     <View style={{flexDirection: 'row', alignItems: 'center', marginBottom:5}}>
                         <Ionicons name="location-sharp" size={20} color="#666" style={{marginRight: 2}} />
                         <Text style={{fontSize: 12, color: '#666', fontWeight: 'bold'}}>{selectedCity === 'All Cities' ? locationName : selectedCity}</Text>
                         <Ionicons name="chevron-down" size={14} color="#666" style={{marginLeft: 2}} />
                     </View>
                 </TouchableOpacity>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity style={styles.notificationBtn}>
                     <Ionicons name="notifications-outline" size={24} color="#333" />
                     {unreadCount > 0 && <View style={styles.badge} />}
                </TouchableOpacity>
                <View style={styles.profilePlaceholder}>
                    <Ionicons name="person-circle" size={42} color="black" />
                </View>
            </View>
        </View>

        <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
                <TextInput 
                    placeholder="Search your dream car..." 
                    style={styles.input}
                    value={searchQuery}
                    onChangeText={(val) => { setSearchQuery(val); setIsSearching(val.length > 0); }}
                />
            </View>
            <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModalVisible(true)}>
                <Ionicons name="options-outline" size={24} color="#333" />
            </TouchableOpacity>
        </View>

        <View style={{ marginTop: 20, marginBottom: 15 }}>
            <FlatList
                data={brands}
                renderItem={renderBrand}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
            />
        </View>

        {!isSearching && nearbyCars.filter(c => c.distance <= 5).length > 0 && (
            <>
                <View style={styles.sectionHeader}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.sectionTitle}>Nearby Vehicles</Text>
                        <View style={{backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop:10}}>
                             <Text style={{fontSize: 10, color: '#2E7D32', fontWeight: 'bold'}}>Within 5 km</Text>
                        </View>
                    </View>
                </View>
                <FlatList
                    data={nearbyCars.filter(c => c.distance <= 5)} 
                    renderItem={renderCarCard}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.carsList}
                />
            </>
        )}

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
                {isSearching ? (selectedBrand === 'all' ? 'All Vehicles' : ` All ${selectedBrand}`) : 'All Vehicles'}
            </Text>
        </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList 
        data={isSearching ? filteredCars : nearbyCars}
        renderItem={({ item, index }) => (
            <View style={{ width: itemWidth, marginLeft: 15, marginBottom: 15 }}>
                {renderGridCard({ item, index })}
            </View>
        )}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        key={numColumns} // Force re-render when numColumns changes
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#000']} />}
      />

      <RentalFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={(filters) => { setAppliedFilters(filters); setFilterModalVisible(false); }}
        onClear={() => { setAppliedFilters(null); setFilterModalVisible(false); }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  scrollContent: { paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  logoContainer: { backgroundColor: 'black', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  notificationBtn: { marginRight: 15, position: 'relative', width: 40, height: 40, borderWidth: 1, borderColor: '#eee', borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' },
  badge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#FF4D4D', width: 8, height: 8, borderRadius: 4 },
  profilePlaceholder: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  searchSection: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, alignItems: 'center' },
  searchContainer: { flex: 1, flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, height: 50, alignItems: 'center', borderWidth: 1, borderColor: '#eee', marginRight: 15 },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: '#333' },
  filterBtn: { width: 50, height: 50, backgroundColor: 'white', borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#eee' },
  brandContainer: { alignItems: 'center', marginHorizontal: 10 },
  brandIconContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1.5, borderColor: '#f0f0f0', position: 'relative' },
  brandSelected: { borderColor: 'black' },
  brandImage: { width: '80%', height: '80%' },
  brandTickBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: 'black', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white' },
  brandName: { fontSize: 12, color: '#666' },
  brandNameSelected: { fontWeight: 'bold', color: 'black' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 10 },
  gridCard: { width: '100%', backgroundColor: 'white', borderRadius: 20, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  gridFavorite: { position: 'absolute', top: 12, right: 12, zIndex: 1 },
  gridImageContainer: { height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  gridImage: { width: '100%', height: '100%' },
  gridContent: { flex: 1 },
  gridTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  gridLocationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  gridLocationText: { fontSize: 12, color: '#888', marginLeft: 4 },
  gridStatsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  gridStatItem: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  gridStatText: { fontSize: 12, color: '#888', marginLeft: 4 },
  gridFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gridPriceContainer: { flex: 1 },
  gridPriceText: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  gridPeriodText: { fontSize: 12, color: '#888' },
  bookBtn: { backgroundColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, minWidth: 80, alignItems: 'center' },
  bookBtnText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  sectionHeader: { paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: 'black',marginTop:10 },
  carsList: { paddingHorizontal: 15 },
  card: { width: width * 0.45, backgroundColor: 'white', borderRadius: 16, padding: 10, marginHorizontal: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  favoriteIcon: { position: 'absolute', top: 10, right: 10, zIndex: 1, backgroundColor: 'white', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  carImage: { width: '100%', height: 100, borderRadius: 12, marginBottom: 8 },
  cardContent: { paddingHorizontal: 5 },
  carName: { fontSize: 14, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationText: { fontSize: 11, color: '#888', marginLeft: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureText: { fontSize: 11, color: '#888', marginLeft: 4 },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline' },
  priceText: { fontSize: 13, fontWeight: 'bold', color: '#111' },
  dayText: { fontSize: 11, color: '#888' },
});

export default RentalCarScreen;
