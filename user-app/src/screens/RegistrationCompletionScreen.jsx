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
    ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants/api';
import axios from 'axios';

const RegistrationCompletionScreen = ({ route }) => {
    const { mobile, token } = route.params;
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSaveProfile = async () => {
        if (name.trim().length < 3) {
            Alert.alert('Error', 'Please enter your full name');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/update-name`, { mobile, full_name: name });
            const user = response.data.user;
            await login({ ...user, token });
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to save profile');
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
                    <Text style={styles.title}>Welcome! Just one more step</Text>
                    <Text style={styles.subtitle}>Please enter your name to continue</Text>
                </View>

                <View style={styles.inputSection}>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                    />

                    <TouchableOpacity
                        style={[styles.button, name.trim().length < 3 && styles.buttonDisabled]}
                        onPress={handleSaveProfile}
                        disabled={loading || name.trim().length < 3}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Get Started</Text>
                        )}
                    </TouchableOpacity>
                </View>
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
        paddingTop: 60,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    inputSection: {
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        height: 60,
        fontSize: 18,
        paddingHorizontal: 15,
        backgroundColor: '#F9F9F9',
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#C0C0C0',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RegistrationCompletionScreen;
