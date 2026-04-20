import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../constants/api';
import { useAuth } from './AuthContext';

const RentalFavoritesContext = createContext();

export const RentalFavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchFavorites();
        } else {
            setFavorites([]);
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(`${API_URL}/favorites/${user.id}`);
            // Map to IDs for easier checking
            setFavorites(response.data.map(item => item.id));
        } catch (error) {
            console.error('Failed to fetch favorites', error);
        }
    };

    const toggleFavorite = async (vehicleId) => {
        if (!user) return;
        
        try {
            const response = await axios.post(`${API_URL}/favorites/toggle`, {
                userId: user.id,
                vehicleId
            });
            
            if (response.data.isFavorite) {
                setFavorites(prev => [...prev, vehicleId]);
            } else {
                setFavorites(prev => prev.filter(id => id !== vehicleId));
            }
        } catch (error) {
            console.error('Failed to toggle favorite', error);
        }
    };

    const isFavorite = (id) => favorites.includes(id);

    return (
        <RentalFavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, fetchFavorites }}>
            {children}
        </RentalFavoritesContext.Provider>
    );
};

export const useRentalFavorites = () => useContext(RentalFavoritesContext);
