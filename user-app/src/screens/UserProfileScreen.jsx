import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants/api';
import axios from 'axios';

const UserProfileScreen = ({ navigation }) => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(!!user?.email);

    const handleUpdateName = async () => {
        if (name.trim().length < 3) {
            Alert.alert('Error', 'Please enter a valid name');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/profile/update-name`, 
                { full_name: name },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            
            // Update local user state
            const updatedUser = { ...user, full_name: name };
            setUser(updatedUser);
            Alert.alert('Success', 'Name updated successfully');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to update name');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestEmailOtp = async () => {
        if (!email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/profile/request-email-change`, 
                { newEmail: email },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setShowOtpInput(true);
            Alert.alert('OTP Sent', response.data.message);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (otp.length < 6) {
            Alert.alert('Error', 'Please enter the 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/profile/verify-email-change`, 
                { newEmail: email, otp },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            
            const updatedUser = { ...user, email: email };
            setUser(updatedUser);
            setIsEmailVerified(true);
            setShowOtpInput(false);
            setOtp('');
            Alert.alert('Success', 'Email updated and verified');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                        />
                    </View>
                    <TouchableOpacity 
                        style={styles.saveBtn} 
                        onPress={handleUpdateName}
                        disabled={loading || name === user?.full_name}
                    >
                        <Text style={styles.saveBtnText}>Update Name</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.label}>Email Address (Optional)</Text>
                    <View style={[styles.inputContainer, isEmailVerified && styles.inputDisabled]}>
                        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (isEmailVerified) setIsEmailVerified(false);
                            }}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {isEmailVerified && (
                             <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        )}
                    </View>
                    
                    {!showOtpInput ? (
                        <TouchableOpacity 
                            style={[styles.verifyBtn, isEmailVerified && styles.btnDisabled]} 
                            onPress={handleRequestEmailOtp}
                            disabled={loading || isEmailVerified}
                        >
                            <Text style={styles.verifyBtnText}>
                                {user?.email ? 'Change Email' : 'Verify Email'}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.otpSection}>
                            <Text style={styles.otpLabel}>Enter 6-digit OTP sent to your email</Text>
                            <TextInput
                                style={styles.otpInput}
                                value={otp}
                                onChangeText={setOtp}
                                placeholder="000000"
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                            <TouchableOpacity 
                                style={styles.saveBtn} 
                                onPress={handleVerifyEmail}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Verify OTP</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.cancelBtn} 
                                onPress={() => setShowOtpInput(false)}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
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
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 56,
        backgroundColor: '#F9F9F9',
    },
    inputDisabled: {
        backgroundColor: '#F0F0F0',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    saveBtn: {
        backgroundColor: '#2E3192',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    saveBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    verifyBtn: {
        backgroundColor: '#FFF',
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2E3192',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    verifyBtnText: {
        color: '#2E3192',
        fontSize: 14,
        fontWeight: 'bold',
    },
    btnDisabled: {
        borderColor: '#CCC',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 30,
    },
    otpSection: {
        marginTop: 15,
        padding: 15,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
    },
    otpLabel: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    otpInput: {
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        letterSpacing: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    cancelBtn: {
        marginTop: 10,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#FF4D4D',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default UserProfileScreen;
