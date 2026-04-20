import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    Platform,
    Linking
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRentalFavorites } from '../context/RentalFavoritesContext';

const { width } = Dimensions.get('window');

const VehicleDetails = ({ route, navigation }) => {
    const { car } = route.params;
    const { toggleFavorite, isFavorite } = useRentalFavorites();
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const images = car.images && car.images.length > 0 
        ? car.images.map(img => img.startsWith('http') ? img : `http://192.168.0.157:5000${img}`)
        : [car.image];

    const handleCall = () => {
        // Since mobile is not in car object usually (it belongs to user), 
        // we might need to fetch it or use a default.
        // Assuming we might have mobile if joined in public/approved route.
        if (car.mobile_number) {
            Linking.openURL(`tel:${car.mobile_number}`);
        } else {
            alert('Owner contact not available');
        }
    };

    const SpecItem = ({ icon, label, value, library = 'MaterialCommunityIcons' }) => {
        const IconLib = library === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
        return (
            <View style={styles.specItem}>
                <View style={styles.specIconContainer}>
                    <IconLib name={icon} size={24} color="#000" />
                </View>
                <View>
                    <Text style={styles.specLabel}>{label}</Text>
                    <Text style={styles.specValue}>{value || 'N/A'}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Gallery */}
                <View style={styles.imageGallery}>
                    <ScrollView 
                        horizontal 
                        pagingEnabled 
                        showsHorizontalScrollIndicator={false}
                        onScroll={(e) => {
                            const x = e.nativeEvent.contentOffset.x;
                            setActiveImageIndex(Math.round(x / width));
                        }}
                        scrollEventThrottle={16}
                    >
                        {images.map((img, index) => (
                            <Image 
                                key={index} 
                                source={{ uri: img }} 
                                style={styles.carImage} 
                                resizeMode="cover" 
                            />
                        ))}
                    </ScrollView>
                    
                    {/* Floating Back & Favorite buttons */}
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.favoriteBtn} 
                        onPress={() => toggleFavorite(car.id.toString())}
                    >
                        <Ionicons 
                            name={isFavorite(car.id.toString()) ? "heart" : "heart-outline"} 
                            size={24} 
                            color={isFavorite(car.id.toString()) ? "#FF4D4D" : "#333"} 
                        />
                    </TouchableOpacity>

                    {/* Image Pagination */}
                    {images.length > 1 && (
                        <View style={styles.pagination}>
                            {images.map((_, index) => (
                                <View 
                                    key={index} 
                                    style={[
                                        styles.dot, 
                                        activeImageIndex === index && styles.activeDot
                                    ]} 
                                />
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={{flex: 1}}>
                            <Text style={styles.carTitle}>{car.brand_id} {car.name}</Text>
                            <View style={styles.locationRow}>
                                <Ionicons name="location" size={16} color="#666" />
                                <Text style={styles.locationText}>{car.pickup_location || car.landmark}</Text>
                            </View>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceValue}>₹{Math.floor(car.price)}</Text>
                            <Text style={styles.priceUnit}>/Day</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Specifications Grid */}
                    <Text style={styles.sectionTitle}>Specifications</Text>
                    <View style={styles.specsGrid}>
                        <SpecItem icon="gas-station" label="Fuel" value={car.fuel_type} />
                        <SpecItem icon="car-shift-lever" label="Transmission" value={car.transmission_type} />
                        <SpecItem icon="seat-passenger" label="Seats" value={`${car.seating_capacity} Seater`} />
                        <SpecItem icon="speedometer" label="Mileage" value={`${car.mileage} kmpl`} />
                    </View>

                    <View style={styles.divider} />

                    {/* Pricing Details */}
                    <Text style={styles.sectionTitle}>Pricing Structure</Text>
                    <View style={styles.pricingGrid}>
                        <View style={styles.pricingItem}>
                            <Text style={styles.pricingLabel}>Daily Rent</Text>
                            <Text style={styles.pricingValue}>₹{car.price_per_day}</Text>
                        </View>
                        <View style={styles.pricingItem}>
                            <Text style={styles.pricingLabel}>Hourly Rent</Text>
                            <Text style={styles.pricingValue}>₹{car.price_per_hour}</Text>
                        </View>
                        <View style={styles.pricingItem}>
                            <Text style={styles.pricingLabel}>Per KM Cost</Text>
                            <Text style={styles.pricingValue}>₹{car.price_per_km}</Text>
                        </View>
                        <View style={styles.pricingItem}>
                            <Text style={styles.pricingLabel}>Limit</Text>
                            <Text style={styles.pricingValue}>{car.max_km_per_day} KM/Day</Text>
                        </View>
                    </View>

                    {/* About Section (Mock description) */}
                    <View style={styles.divider} />
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>
                        This premium {car.brand_id} {car.name} is in excellent condition and perfect for city travel or long drives. 
                        It offers top-tier fuel efficiency and a comfortable {car.seating_capacity}-seater cabin. 
                        Pickup location is conveniently located at {car.pickup_location}.
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.chatBtn}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                    <Ionicons name="call" size={20} color="#FFF" style={{marginRight: 8}} />
                    <Text style={styles.callBtnText}>Call Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    imageGallery: {
        width: width,
        height: 300,
        backgroundColor: '#F5F5F5',
        position: 'relative',
    },
    carImage: {
        width: width,
        height: 300,
    },
    backBtn: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    favoriteBtn: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    pagination: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#000',
        width: 20,
    },
    content: {
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    carTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 5,
        textTransform: 'capitalize',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    priceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    priceUnit: {
        fontSize: 14,
        color: '#888',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#1a1a1a',
    },
    specsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    specItem: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#F9F9F9',
        padding: 12,
        borderRadius: 15,
    },
    specIconContainer: {
        marginRight: 10,
        backgroundColor: '#E8EAFD',
        padding: 8,
        borderRadius: 10,
    },
    specLabel: {
        fontSize: 12,
        color: '#888',
    },
    specValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 2,
    },
    pricingGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    pricingItem: {
        width: '48%',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EEE',
        padding: 12,
        borderRadius: 15,
        marginBottom: 10,
    },
    pricingLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    pricingValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: '#666',
        marginBottom: 100,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        alignItems: 'center',
    },
    chatBtn: {
        width: 56,
        height: 56,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    callBtn: {
        flex: 1,
        height: 56,
        backgroundColor: '#000',
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    callBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default VehicleDetails;
