import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL } from '../constants/api';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const RentalHistoryScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCarForReview, setSelectedCarForReview] = useState(null);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        if (!user) return;
        try {
            const response = await axios.get(`${API_URL}/vehicles/call-history/${user.id}`);
            const formatted = response.data.history.map(car => ({
                ...car,
                image: (car.image && car.image.startsWith('http')) 
                    ? car.image 
                    : (car.image ? `http://192.168.0.157:5000${car.image}` : 'https://via.placeholder.com/300'),
            }));
            setHistory(formatted);
        } catch (error) {
            console.error('Failed to fetch call history', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (reviewRating === 0) return alert('Please select a star rating');
        setIsSubmittingReview(true);
        try {
            await axios.post(`${API_URL}/vehicles/${selectedCarForReview.id}/reviews`, {
                rating: reviewRating,
                comment: reviewComment
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert('Review shared! Thank you for your feedback.');
            setSelectedCarForReview(null);
            setReviewRating(0);
            setReviewComment('');
        } catch (error) {
            console.error(error);
            alert('Review transmission interrupted. Please try again.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleOpenReview = async (car) => {
        setSelectedCarForReview(car);
        try {
            const response = await axios.get(`${API_URL}/vehicles/${car.id}/my-review`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.data.review) {
                setReviewRating(response.data.review.rating);
                setReviewComment(response.data.review.comment);
                setIsEditing(true);
            } else {
                setReviewRating(0);
                setReviewComment('');
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error fetching my review', error);
        }
    };

    const renderCarItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('VehicleDetails', { car: item })}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.carImage} resizeMode="cover" />
                <View style={styles.timeTag}>
                    <Text style={styles.timeTagText}>Called: {new Date(item.called_at).toLocaleDateString()}</Text>
                </View>
            </View>
            
            <View style={styles.cardContent}>
                <Text style={styles.carName}>{item.name}</Text>
                <View style={styles.ownerRow}>
                    <Ionicons name="person-outline" size={14} color="#888" />
                    <Text style={styles.ownerText}>Owner: {item.owner_name}</Text>
                </View>
                
                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="gas-station" size={16} color="#888" />
                        <Text style={styles.detailText}>{item.fuel_type}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="car-outline" size={16} color="#888" />
                        <Text style={styles.detailText}>{item.type}</Text>
                    </View>
                </View>
                
                <View style={styles.footer}>
                    <View>
                        <Text style={styles.priceLabel}>Last Price Checked</Text>
                        <Text style={styles.priceText}>₹{Math.floor(item.price_per_day)}<Text style={styles.periodText}>/Day</Text></Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.reconnectBtn}
                        onPress={() => navigation.navigate('VehicleDetails', { car: item })}
                    >
                        <Text style={styles.reconnectBtnText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.reviewBtn}
                        onPress={() => handleOpenReview(item)}
                    >
                        <Ionicons name="star" size={14} color="#FFF" style={{marginRight: 4}}/>
                        <Text style={styles.reviewBtnText}>Rate</Text>
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
                <Text style={styles.headerTitle}>Enquiry History</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            ) : history.length === 0 ? (
                <View style={styles.center}>
                    <MaterialCommunityIcons name="phone-clock" size={80} color="#DDD" />
                    <Text style={styles.emptyText}>No enquiries made yet</Text>
                    <TouchableOpacity 
                        style={styles.browseBtn}
                        onPress={() => navigation.navigate('RentalCar')}
                    >
                        <Text style={styles.browseBtnText}>Explore Vehicles</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderCarItem}
                    keyExtractor={item => item.id.toString() + item.called_at}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Review Modal */}
            <Modal
                visible={!!selectedCarForReview}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedCarForReview(null)}
            >
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <TouchableOpacity 
                        style={styles.modalOverlay} 
                        activeOpacity={1} 
                        onPress={() => setSelectedCarForReview(null)}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{isEditing ? 'Edit Your Experience' : 'Share Your Experience'}</Text>
                                    <TouchableOpacity onPress={() => setSelectedCarForReview(null)}>
                                        <Ionicons name="close" size={24} color="#000" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.modalSubTitle}>{isEditing ? 'Update your review for' : 'How was your enquiry for'} {selectedCarForReview?.name}?</Text>
                                
                                <View style={styles.starsContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity 
                                            key={star} 
                                            onPress={() => setReviewRating(star)}
                                        >
                                            <Ionicons 
                                                name={star <= reviewRating ? "star" : "star-outline"} 
                                                size={40} 
                                                color={star <= reviewRating ? "#FFD700" : "#CCC"} 
                                                style={{ marginHorizontal: 5 }}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TextInput
                                    style={styles.reviewInput}
                                    placeholder="Write your experience with this owner/vehicle..."
                                    placeholderTextColor="#999"
                                    multiline
                                    numberOfLines={4}
                                    value={reviewComment}
                                    onChangeText={setReviewComment}
                                />

                                <TouchableOpacity 
                                    style={[styles.submitReviewBtn, isSubmittingReview && { opacity: 0.7 }]}
                                    onPress={handleSubmitReview}
                                    disabled={isSubmittingReview}
                                >
                                    {isSubmittingReview ? (
                                        <ActivityIndicator color="#FFF" size="small" />
                                    ) : (
                                        <Text style={styles.submitReviewText}>Submit Review</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>
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
    imageContainer: {
        position: 'relative',
    },
    carImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#F5F5F5',
    },
    timeTag: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    timeTagText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardContent: {
        padding: 15,
    },
    carName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    ownerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    ownerText: {
        fontSize: 12,
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
        fontSize: 13,
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
    priceLabel: {
        fontSize: 10,
        color: '#888',
        marginBottom: 2,
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    periodText: {
        fontSize: 12,
        color: '#888',
        fontWeight: 'normal',
    },
    reconnectBtn: {
        backgroundColor: '#000',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
    },
    reconnectBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        marginTop: 20,
        marginBottom: 30,
    },
    browseBtn: {
        backgroundColor: '#000',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 15,
    },
    browseBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewBtn: {
        backgroundColor: '#FFB800',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    reviewBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    modalSubTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 25,
    },
    reviewInput: {
        backgroundColor: '#F8F9FA',
        borderRadius: 15,
        padding: 15,
        height: 120,
        textAlignVertical: 'top',
        fontSize: 14,
        color: '#333',
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    submitReviewBtn: {
        backgroundColor: '#000',
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    submitReviewText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RentalHistoryScreen;
