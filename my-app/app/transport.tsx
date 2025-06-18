import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Speech from "expo-speech";
import { voyages } from "./mock-data/voyages";
import { agences } from "./mock-data/agences";

export default function TransportScreen() {
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [dateVoyage, setDateVoyage] = useState("");
  const [filteredVoyages, setFilteredVoyages] = useState(voyages);
  const [favorites, setFavorites] = useState<number[]>([]); // liste des id d'agences favorites

  useEffect(() => {
    Speech.speak("Bienvenue au service transport.");
  }, []);

  useEffect(() => {
    const filtered = voyages.filter((voyage) => {
      const matchDepart = depart
        ? voyage.depart.toLowerCase().includes(depart.toLowerCase())
        : true;
      const matchArrivee = arrivee
        ? voyage.arrivee.toLowerCase().includes(arrivee.toLowerCase())
        : true;
      const matchDate = dateVoyage ? voyage.date === dateVoyage : true;

      return matchDepart && matchArrivee && matchDate;
    });

    setFilteredVoyages(filtered);
  }, [depart, arrivee, dateVoyage]);

  const getAgenceName = (agenceId: number) => {
    const agence = agences.find((a) => a.id === agenceId);
    return agence ? agence.nom : "Inconnue";
  };

  const handleVoyagePress = (voyage: any) => {
    Alert.alert(
      "Voyage sélectionné",
      `${voyage.depart} ➜ ${voyage.arrivee} avec ${getAgenceName(voyage.agenceId)}\nQue souhaitez-vous faire ?`,
      [
        {
          text: "🛒 Réserver",
          onPress: () => {
            Alert.alert("Réservé !", `Voyage réservé pour le ${voyage.date} à ${voyage.heure}`);
          },
        },
        {
          text: "🗺 Voir l’itinéraire",
          onPress: () => {
            Speech.speak(`Pour aller à l'agence ${getAgenceName(voyage.agenceId)}, prenez votre moto ou taxi vers la gare.`);
          },
        },
        {
          text: "⭐ Ajouter agence aux favoris",
          onPress: () => {
            if (!favorites.includes(voyage.agenceId)) {
              setFavorites([...favorites, voyage.agenceId]);
              Alert.alert("Favoris", "Agence ajoutée aux favoris !");
            } else {
              Alert.alert("Favoris", "Cette agence est déjà dans vos favoris.");
            }
          },
        },
        {
          text: "❌ Annuler",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚌 Service Transport</Text>

      <TextInput
        style={styles.input}
        placeholder="🔍 Ville de départ"
        value={depart}
        onChangeText={setDepart}
      />

      <TextInput
        style={styles.input}
        placeholder="🔍 Ville d’arrivée"
        value={arrivee}
        onChangeText={setArrivee}
      />

      <TextInput
        style={styles.input}
        placeholder="📅 Date (ex: 2025-06-20)"
        value={dateVoyage}
        onChangeText={setDateVoyage}
      />

      <Text style={styles.resultTitle}>🗂 Résultats :</Text>

      <FlatList
        data={filteredVoyages}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun voyage trouvé</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleVoyagePress(item)}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {item.depart} ➜ {item.arrivee}
              </Text>
              <Text>Date : {item.date} à {item.heure}</Text>
              <Text>Prix : {item.prix} FCFA</Text>
              <Text>Agence : {getAgenceName(item.agenceId)} {favorites.includes(item.agenceId) ? "⭐" : ""}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "bold",
  },
  card: {
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
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
});
