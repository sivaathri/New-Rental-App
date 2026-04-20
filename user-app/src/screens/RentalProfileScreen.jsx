import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const RentalProfileScreen = ({ navigation }) => {
    const { user, logout } = useAuth();

    const ProfileOption = ({ icon, label, onPress, isDestructive }) => (
        <TouchableOpacity style={styles.optionRow} onPress={onPress}>
            <View style={styles.optionLeft}>
                <View style={[styles.iconContainer, isDestructive && styles.destructiveIconBg]}>
                   {icon}
                </View>
                <Text style={[styles.optionLabel, isDestructive && styles.destructiveLabel]}>{label}</Text>
            </View>
            <View style={styles.optionRight}>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation ? navigation.goBack() : console.log('back')} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <View style={styles.imageContainer}>
                        {user?.profile_image ? (
                            <Image 
                                source={{ uri: user.profile_image }} 
                                style={styles.profileImage} 
                            />
                        ) : (
                            <View style={styles.profilePlaceholderBig}>
                                <Ionicons name="person-circle" size={84} color="black" />
                            </View>
                        )}
                        
                    </View>
                    <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
                    <Text style={styles.userEmail}>{user?.mobile || ''}</Text>
                    
                    <TouchableOpacity 
                        style={styles.editProfileBtn}
                        onPress={() => navigation?.navigate('UserProfile')}
                    >
                        <Feather name="edit-2" size={12} color="#666" style={{marginRight: 6}}/>
                        <Text style={styles.editProfileText}>Edit profile</Text>
                    </TouchableOpacity>
                </View>

                {/* General Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>
                    
                    <ProfileOption 
                        icon={<Ionicons name="heart-outline" size={20} color="#333" />}
                        label="Favorite Cars"
                        onPress={() => navigation?.navigate('RentalFavorites')}
                    />
                    <ProfileOption 
                        icon={<MaterialIcons name="history" size={20} color="#333" />}
                        label="History"
                        onPress={() => navigation?.navigate('RentalHistory')}
                    />
                    <ProfileOption 
                        icon={<Ionicons name="notifications-outline" size={20} color="#333" />}
                        label="Notification"
                        onPress={() => navigation?.navigate('RentalNotification')}
                    />
                    <ProfileOption 
                        icon={<FontAwesome5 name="plug" size={16} color="#333" />}
                        label="Connected to QENT Partnerships"
                        onPress={() => {}}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>More</Text>
                    
                    <ProfileOption 
                        icon={<Ionicons name="document-text-outline" size={20} color="#333" />}
                        label="Privacy Policy"
                        onPress={() => navigation?.navigate('RentalPrivacyPolicy')}
                    />
                    <ProfileOption 
                        icon={<Feather name="headphones" size={20} color="#333" />}
                        label="Help Support"
                        onPress={() => navigation?.navigate('RentalHelpSupport')}
                    />
                    <ProfileOption 
                        icon={<MaterialIcons name="logout" size={20} color="red" />}
                        label="Logout"
                        isDestructive={true}
                        onPress={logout}
                    />
                </View>
               
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        
    },
    scrollContent: {
        paddingBottom: 30,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    profilePlaceholderBig: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#888',
        marginBottom: 12,
    },
    editProfileBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editProfileText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    section: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 15,
        color: '#000',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff', 
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    destructiveIconBg: {
        backgroundColor: '#fff',
        borderColor: '#fee',
    },
    optionLabel: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    destructiveLabel: {
        color: 'red',
    },
    optionRight: {
        
    },
});

export default RentalProfileScreen;
