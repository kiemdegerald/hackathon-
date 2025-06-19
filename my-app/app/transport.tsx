import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import * as Speech from "expo-speech";
import * as Location from "expo-location";
import * as Network from "expo-network";
import { voyages } from "./mock-data/voyages";
import { voyagesSync } from "./mock-data/voyages-sync";
import { agences } from "./mock-data/agences";
import { MaterialIcons } from "@expo/vector-icons";

interface Voyage {
  id: number;
  agenceId: number;
  depart: string;
  arrivee: string;
  date: string; // ISO format : '2025-06-20'
  heure: string;
  prix: number;
  placesDisponibles: number;
}

interface Agence {
  id: number;
  nom: string;
  telephone: string;
  email: string;
  ville: string;
  latitude: number;
  longitude: number;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function TransportScreen() {
  const [depart, setDepart] = useState<string>("");
  const [arrivee, setArrivee] = useState<string>("");
  const [dateVoyage, setDateVoyage] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [filteredVoyages, setFilteredVoyages] = useState<Voyage[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedVoyage, setSelectedVoyage] = useState<Voyage | null>(null);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(true); // Simulation de l'état de connexion
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Fonction pour calculer la distance en kilomètres avec la formule de Haversine
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Number(distance.toFixed(1)); // Arrondi à 1 décimale
  };

  useEffect(() => {
    const initialize = async () => {
      Speech.speak("Bienvenue au service transport.");

      // Demander la permission de géolocalisation au chargement
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        try {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } catch (error) {
          console.error("Erreur lors de la récupération de la position:", error);
        }
      }

      // Simuler le chargement des données
      setTimeout(() => {
        setFilteredVoyages(voyages);
        setIsLoading(false);
      }, 1500);
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const filtered = voyages.filter((voyage) => {
        const matchDepart = depart
          ? voyage.depart.toLowerCase().includes(depart.toLowerCase())
          : true;
        const matchArrivee = arrivee
          ? voyage.arrivee.toLowerCase().includes(arrivee.toLowerCase())
          : true;
        const matchDate = dateVoyage ? voyage.date === dateVoyage : true;
        const matchMinPrice = minPrice
          ? voyage.prix >= parseFloat(minPrice) || isNaN(parseFloat(minPrice))
          : true;
        const matchMaxPrice = maxPrice
          ? voyage.prix <= parseFloat(maxPrice) || isNaN(parseFloat(maxPrice))
          : true;

        return matchDepart && matchArrivee && matchDate && matchMinPrice && matchMaxPrice;
      });

      setFilteredVoyages(filtered);
    }
  }, [depart, arrivee, dateVoyage, minPrice, maxPrice, isLoading]);

  const getAgenceName = (agenceId: number): string => {
    const agence = agences.find((a) => a.id === agenceId);
    return agence ? agence.nom : "Inconnue";
  };

  const getAgenceCoords = (agenceId: number): { latitude: number; longitude: number } | null => {
    const agence = agences.find((a) => a.id === agenceId);
    return agence ? { latitude: agence.latitude, longitude: agence.longitude } : null;
  };

  const getAgenceDistance = (agenceId: number): string => {
    if (!userLocation) return "";
    const coords = getAgenceCoords(agenceId);
    if (!coords) return "";
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      coords.latitude,
      coords.longitude
    );
    return `${distance} km`;
  };

  const handleVoyagePress = (voyage: Voyage) => {
    setSelectedVoyage(voyage);
    setModalVisible(true);
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  };

  const handleSync = async () => {
    if (!isUserLoggedIn) {
      Alert.alert("Connexion requise", "Vous devez être connecté pour synchroniser les données.");
      return;
    }

    setIsSyncing(true);

    try {
      const networkState = await Network.getNetworkStateAsync();
      const isConnected = networkState.isConnected;

      if (isConnected) {
        // Simuler la synchronisation avec la BDD
        setTimeout(() => {
          // Remplacer les données existantes par les nouvelles
          voyages.length = 0; // Vider le tableau original
          voyages.push(...voyagesSync); // Remplacer par les nouvelles données
          setFilteredVoyages([...voyagesSync]);
          setIsSyncing(false);
          Speech.speak("Synchronisation réussie. Nouvelles données chargées.");
          Alert.alert("Succès", "Les données ont été synchronisées avec la base de données.");
        }, 2000);
      } else {
        // Simuler une synchronisation hors ligne
        setTimeout(() => {
          setIsSyncing(false);
          Speech.speak("Aucune connexion. Synchronisation hors ligne enregistrée.");
          Alert.alert(
            "Hors ligne",
            "Aucune connexion réseau. La synchronisation sera retentée lorsque vous serez en ligne."
          );
        }, 2000);
      }
    } catch (error) {
      setIsSyncing(false);
      Speech.speak("Erreur lors de la synchronisation.");
      Alert.alert("Erreur", "Une erreur s'est produite lors de la synchronisation.");
    }
  };

  const handleItinerary = async () => {
    if (!selectedVoyage) return;

    const agence = agences.find((a) => a.id === selectedVoyage.agenceId);
    if (!agence) {
      Speech.speak("Impossible de trouver les coordonnées de l'agence.");
      return;
    }

    let permissionGranted = await requestLocationPermission();

    if (!permissionGranted) {
      Speech.speak("Permission de géolocalisation refusée.");
      Alert.alert(
        "Permission refusée",
        "L'accès à la localisation est nécessaire pour afficher l'itinéraire. Voulez-vous réessayer ?",
        [
          {
            text: "Réessayer",
            onPress: async () => {
              permissionGranted = await requestLocationPermission();
              if (permissionGranted) {
                await handleItinerary();
              } else {
                Speech.speak("Permission de géolocalisation refusée à nouveau.");
                Alert.alert(
                  "Permission refusée",
                  "Veuillez activer la localisation dans les paramètres de votre appareil."
                );
              }
            },
          },
          {
            text: "Annuler",
            style: "cancel",
            onPress: () => setModalVisible(false),
          },
        ]
      );
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const userLat = location.coords.latitude;
      const userLon = location.coords.longitude;
      const coords = getAgenceCoords(selectedVoyage.agenceId);
      if (!coords) return;

      const { latitude: destLat, longitude: destLon } = coords;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${destLat},${destLon}&travelmode=driving`;
      const supported = await Linking.canOpenURL(googleMapsUrl);

      if (supported) {
        await Linking.openURL(googleMapsUrl);
        Speech.speak(`Ouverture de l'itinéraire vers l'agence ${getAgenceName(selectedVoyage.agenceId)}.`);
      } else {
        Speech.speak("Impossible d'ouvrir l'application de carte.");
        Alert.alert("Erreur", "Impossible d'ouvrir l'application de carte.");
      }
    } catch (error) {
      Speech.speak("Une erreur s'est produite lors de la récupération de votre position.");
      Alert.alert("Erreur", "Impossible de récupérer votre position.");
    }

    setModalVisible(false);
  };

  const handleReserve = () => {
    if (selectedVoyage) {
      Speech.speak(`Voyage réservé pour le ${selectedVoyage.date} à ${selectedVoyage.heure}`);
      setModalVisible(false);
    }
  };

  const handleFavorite = () => {
    if (selectedVoyage) {
      if (!favorites.includes(selectedVoyage.agenceId)) {
        setFavorites([...favorites, selectedVoyage.agenceId]);
        Speech.speak("Agence ajoutée aux favoris !");
      } else {
        Speech.speak("Cette agence est déjà dans vos favoris.");
      }
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Services de Transport</Text>
        <TouchableOpacity onPress={handleSync} disabled={isSyncing}>
          <MaterialIcons
            name="sync"
            size={28}
            color={isSyncing ? "#aaa" : "#F28C38"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Filtres de recherche</Text>
        <TextInput
          style={styles.input}
          placeholder="Ville de départ"
          value={depart}
          onChangeText={setDepart}
        />
        <TextInput
          style={styles.input}
          placeholder="Ville d’arrivée"
          value={arrivee}
          onChangeText={setArrivee}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (ex: 2025-06-20)"
          value={dateVoyage}
          onChangeText={setDateVoyage}
        />
        {/* <TextInput
          style={styles.input}
          placeholder="Prix minimum (FCFA)"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Prix maximum (FCFA)"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
        /> */}
      </View>

      <Text style={styles.resultTitle}>Résultats</Text>

      {isSyncing && (
        <View style={styles.syncLoaderContainer}>
          <ActivityIndicator size="large" color="#F28C38" />
          <Text style={styles.syncLoaderText}>Synchronisation en cours...</Text>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#F28C38" />
          <Text style={styles.loaderText}>Chargement des voyages...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVoyages}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.empty}>Aucun voyage trouvé</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleVoyagePress(item)}>
              <View style={styles.card}>
                <MaterialIcons name="directions-bus" size={30} color="#F28C38" />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>
                    {item.depart} ➜ {item.arrivee}
                  </Text>
                  <Text>Date : {item.date} à {item.heure}</Text>
                  <Text>Prix : {item.prix} FCFA</Text>
                  <Text>Places disponibles : {item.placesDisponibles}</Text>
                  <Text>
                    Agence : {getAgenceName(item.agenceId)} {favorites.includes(item.agenceId) ? "⭐" : ""}
                  </Text>
                  {userLocation && (
                    <Text>Distance : {getAgenceDistance(item.agenceId)}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedVoyage && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedVoyage.depart} ➜ {selectedVoyage.arrivee}
              </Text>
              <Text style={styles.modalSubtitle}>Agence : {getAgenceName(selectedVoyage.agenceId)}</Text>
              <Text style={styles.modalSubtitle}>Date : {selectedVoyage.date} à {selectedVoyage.heure}</Text>
              <Text style={styles.modalSubtitle}>Places disponibles : {selectedVoyage.placesDisponibles}</Text>
              <View style={styles.modalButtons}>
                <Pressable style={styles.modalButton} onPress={handleReserve}>
                  <MaterialIcons name="shopping-cart" size={24} color="#F28C38" />
                  <Text style={styles.modalButtonText}>Réserver</Text>
                </Pressable>
                <Pressable style={styles.modalButton} onPress={handleItinerary}>
                  <MaterialIcons name="map" size={24} color="#F28C38" />
                  <Text style={styles.modalButtonText}>Voir l’itinéraire</Text>
                </Pressable>
                <Pressable style={styles.modalButton} onPress={handleFavorite}>
                  <MaterialIcons name="star" size={24} color="#F28C38" />
                  <Text style={styles.modalButtonText}>Ajouter aux favoris</Text>
                </Pressable>
                <Pressable style={[styles.modalButton, styles.closeButton]} onPress={() => setModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#333" />
                  <Text style={styles.modalButtonText}>Fermer</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F28C38",
  },
  filterSection: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  resultTitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  empty: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    color: "#333",
    fontSize: 16,
  },
  syncLoaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 10,
  },
  syncLoaderText: {
    marginTop: 10,
    color: "#333",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  modalButtons: {
    marginTop: 20,
    width: "100%",
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  closeButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
});