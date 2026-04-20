import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { RentalFavoritesProvider } from './src/context/RentalFavoritesContext';
import RentalCarScreen from './src/screens/RentalCarScreen';
import RentalProfileScreen from './src/screens/RentalProfileScreen';
import RentalFavoritesScreen from './src/screens/RentalFavoritesScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import VehicleDetails from './src/screens/VehicleDetails';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationCompletionScreen from './src/screens/RegistrationCompletionScreen';
import RentalHistoryScreen from './src/screens/RentalHistoryScreen';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="RegistrationCompletion" component={RegistrationCompletionScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="RentalCar" component={RentalCarScreen} />
            <Stack.Screen name="RentalProfile" component={RentalProfileScreen} />
            <Stack.Screen name="RentalFavorites" component={RentalFavoritesScreen} />
            <Stack.Screen name="RentalHistory" component={RentalHistoryScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="VehicleDetails" component={VehicleDetails} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RentalFavoritesProvider>
          <Navigation />
        </RentalFavoritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
