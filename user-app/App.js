import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import { RentalFavoritesProvider } from './src/context/RentalFavoritesContext';
import RentalCarScreen from './src/screens/RentalCarScreen';
import RentalProfileScreen from './src/screens/RentalProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RentalFavoritesProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="RentalCar" component={RentalCarScreen} />
              <Stack.Screen name="RentalProfile" component={RentalProfileScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </RentalFavoritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
