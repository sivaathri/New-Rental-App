import React, { createContext, useContext, useState } from 'react';

const RentalFavoritesContext = createContext();

export const RentalFavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    const toggleFavorite = (id) => {
        setFavorites(prev => 
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    const isFavorite = (id) => favorites.includes(id);

    return (
        <RentalFavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </RentalFavoritesContext.Provider>
    );
};

export const useRentalFavorites = () => useContext(RentalFavoritesContext);
