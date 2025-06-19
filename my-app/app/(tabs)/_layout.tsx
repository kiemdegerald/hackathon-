import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MesReservations from './mesReservations';
import ListeReservation from './listeReservation';


const FavorisScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Favoris</Text>
  </View>
);

// Création du navigateur à tabs
const Tab = createBottomTabNavigator();

const App = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'mesReservations') {
              iconName = 'calendar-outline'; // Icône plus attrayante
            } else if (route.name === 'listeReservation') {
              iconName = 'list-circle-outline'; // Icône plus moderne
            } else if (route.name === 'favoris') {
              iconName = 'heart-circle-outline'; // Icône plus stylée
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#f97316', // Couleur orange pour l'onglet actif
          tabBarInactiveTintColor: '#6b7280', // Couleur inactive
          tabBarStyle: styles.tabBar, // Style mis à jour de la barre de tabs
        })}
      >
        <Tab.Screen
          name="mesReservations"
          component={MesReservations}
          options={{ title: 'Mes Réservations' }}
        />
        <Tab.Screen
          name="listeReservation"
          component={ListeReservation}
          options={{ title: 'Liste Réservations' }}
        />
        <Tab.Screen
          name="favoris"
          component={FavorisScreen}
          options={{ title: 'Favoris' }}
        />
      </Tab.Navigator>
  );
};

// Styles avec StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    height: 60,
    paddingBottom: 5,
    marginBottom: 10, // Remonte la barre pour ne pas coller au bas
    elevation: 5, // Ombre pour Android
    shadowColor: '#000', // Ombre pour iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default App;