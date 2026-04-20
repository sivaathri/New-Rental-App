import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRentalFavorites } from '../context/RentalFavoritesContext';
import { API_URL } from '../constants/api';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const RentalFavoritesScreen = ({ navigation }) => {
    const { user } = useAuth();
    const { favorites, toggleFavorite } = useRentalFavorites();
    const [favoriteCars, setFavoriteCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavoriteCars();
    }, [favorites]);

    const fetchFavoriteCars = async () => {
        if (!user) return;
        try {
            const response = await axios.get(`${API_URL}/favorites/${user.id}`);
            const formatted = response.data.map(car => ({
                ...car,
                image: (car.image && car.image.startsWith('http')) 
                    ? car.image 
                    : (car.image ? `http://192.168.0.157:5000${car.image}` : 'https://via.placeholder.com/300'),
            }));
            setFavoriteCars(formatted);
        } catch (error) {
            console.error('Failed to fetch favorite cars', error);
        } finally {
            setLoading(false);
        }
    };

    const renderCarItem = ({ item }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            <Image source={{ uri: item.image }} style={styles.carImage} resizeMode="contain" />
            <TouchableOpacity 
                style={styles.favoriteBtn} 
                onPress={() => toggleFavorite(item.id.toString())}
            >
                <Ionicons name="heart" size={24} color="#FF4D4D" />
            </TouchableOpacity>
            
            <View style={styles.cardContent}>
                <Text style={styles.carName}>{item.name}</Text>
                <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color="#888" />
                    <Text style={styles.locationText}>{item.pickup_location || 'Unknown'}</Text>
                </View>
                
                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="gas-station" size={16} color="#888" />
                        <Text style={styles.detailText}>{item.fuel_type}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="seat-passenger" size={16} color="#888" />
                        <Text style={styles.detailText}>{item.seating_capacity}</Text>
                    </View>
                </View>
                
                <View style={styles.footer}>
                    <Text style={styles.priceText}>
                        ₹{Math.floor(item.price_per_day)}
                        <Text style={styles.periodText}>/Day</Text>
                    </Text>
                    <TouchableOpacity style={styles.bookBtn}>
                        <Text style={styles.bookBtnText}>Call Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Favorites</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#2E3192" />
                </View>
            ) : favoriteCars.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="heart-dislike-outline" size={80} color="#DDD" />
                    <Text style={styles.emptyText}>No favorites yet</Text>
                    <TouchableOpacity 
                        style={styles.browseBtn}
                        onPress={() => navigation.navigate('RentalCar')}
                    >
                        <Text style={styles.browseBtnText}>Browse Vehicles</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={favoriteCars}
                    renderItem={renderCarItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    carImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#F5F5F5',
    },
    favoriteBtn: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#FFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    cardContent: {
        padding: 15,
    },
    carName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    locationText: {
        fontSize: 14,
        color: '#888',
        marginLeft: 5,
    },
    detailsRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 6,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 15,
    },
    priceText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E3192',
    },
    periodText: {
        fontSize: 14,
        color: '#888',
        fontWeight: 'normal',
    },
    bookBtn: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    bookBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
        marginTop: 20,
        marginBottom: 30,
    },
    browseBtn: {
        backgroundColor: '#2E3192',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 15,
    },
    browseBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RentalFavoritesScreen;
