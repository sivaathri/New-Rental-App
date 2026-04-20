import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { RentalFavoritesProvider } from './src/context/RentalFavoritesContext';
import RentalCarScreen from './src/screens/RentalCarScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RentalFavoritesProvider>
          <RentalCarScreen />
        </RentalFavoritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
