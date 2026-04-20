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
    Image,
    ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants/api';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Mobile, 2: OTP
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSendOTP = async () => {
        if (mobile.length < 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/send-otp`, { mobile });
            setStep(2);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length < 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/verify-otp`, { mobile, otp });
            const { user, token } = response.data;
            
            if (user.isComplete) {
                await login({ ...user, token });
            } else {
                // If name is missing, go to completion screen
                navigation.navigate('RegistrationCompletion', { mobile, token });
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {step === 1 ? 'Verify mobile number to continue' : 'Enter OTP sent to your mobile'}
                    </Text>
                </View>

                {step === 1 ? (
                    <View style={styles.inputSection}>
                        <View style={styles.phoneInputContainer}>
                            <View style={styles.countryCode}>
                                <Image 
                                    source={{ uri: 'https://flagcdn.com/w40/in.png' }} 
                                    style={styles.flag} 
                                />
                                <Text style={styles.countryCodeText}>+91</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                keyboardType="number-pad"
                                maxLength={10}
                                value={mobile}
                                onChangeText={setMobile}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, mobile.length < 10 && styles.buttonDisabled]}
                            onPress={handleSendOTP}
                            disabled={loading || mobile.length < 10}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Proceed With OTP</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.inputSection}>
                        <TextInput
                            style={styles.otpInput}
                            placeholder="Enter 6-digit OTP"
                            keyboardType="number-pad"
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleVerifyOTP}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Verify & Continue</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => setStep(1)}
                        >
                            <Text style={styles.backText}>Change Mobile Number</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        lineHeight: 30,
    },
    inputSection: {
        width: '100%',
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        marginBottom: 24,
        height: 60,
        backgroundColor: '#F9F9F9',
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
    },
    flag: {
        width: 24,
        height: 16,
        marginRight: 8,
    },
    countryCodeText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
    },
    input: {
        flex: 1,
        fontSize: 18,
        paddingHorizontal: 15,
        color: '#333',
    },
    otpInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        height: 60,
        fontSize: 20,
        textAlign: 'center',
        letterSpacing: 8,
        backgroundColor: '#F9F9F9',
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#2E3192',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonDisabled: {
        backgroundColor: '#C0C0C0',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    backText: {
        color: '#2E3192',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default LoginScreen;
