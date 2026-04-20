import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RentalFilterModal = ({ visible, onClose, onApply, onClear }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.title}>Filters</Text>
                    <TouchableOpacity onPress={() => onApply({})} style={styles.button}>
                        <Text style={styles.buttonText}>Apply (Mock)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClear} style={[styles.button, styles.clearButton]}>
                        <Text style={styles.buttonText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    content: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 20, alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    button: { backgroundColor: '#111', padding: 10, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 10 },
    clearButton: { backgroundColor: '#888' },
    buttonText: { color: 'white', fontWeight: 'bold' },
    closeButton: { marginTop: 10 }
});

export default RentalFilterModal;
