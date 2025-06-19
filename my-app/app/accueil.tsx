import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { Button, StyleSheet, Text, View, Alert, Animated, Vibration } from "react-native";
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';

export default function AccueilScreen() {
  const shakeA = useRef(new Animated.Value(0)).current;
  const shakeB = useRef(new Animated.Value(0)).current;
  const shakeC = useRef(new Animated.Value(0)).current;

  const startShake = (animRef : any) => {
    Animated.sequence([
      Animated.timing(animRef, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(animRef, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(animRef, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(animRef, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(animRef, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // useEffect(() => {
  //   const message = "Bienvenue ! Veuillez choisir un service";
  //   Speech.speak(message, {
  //     onDone: () => {
  //       Speech.speak("Service Transport", { 
  //         onStart: () => {
  //           startShake(shakeA);
  //           Vibration.vibrate([0, 200, 100, 200]);
  //         }
  //       });
  //       setTimeout(() => {
  //         Speech.speak("Service Artisans", { 
  //           onStart: () => {
  //             startShake(shakeB);
  //             Vibration.vibrate([0, 200, 100, 200]);
  //           }
  //         });
  //       }, 2500);
  //       setTimeout(() => {
  //         Speech.speak("Service Santé", { 
  //           onStart: () => {
  //             startShake(shakeC);
  //             Vibration.vibrate([0, 200, 100, 200]);
  //           }
  //         });
  //       }, 5000);
  //     }
  //   });
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠️ Services de Faso Codeur</Text>

      <View style={styles.servicesRow}>
        <Animated.View style={[styles.serviceCard, { transform: [{ translateX: shakeA }] }]}>
          <MaterialIcons name="directions-bus" size={40} color="#F28C38" />
          <Button 
            title="Transport" 
            onPress={() => router.push('/transport')} 
            color="#000000"
          />
        </Animated.View>

        <Animated.View style={[styles.serviceCard, { transform: [{ translateX: shakeB }] }]}>
          <MaterialIcons name="build" size={40} color="#F28C38" />
          <Button 
            title="Artisans" 
            onPress={() => router.push("/artisans")} 
            color="#000000"
          />
        </Animated.View>
      </View>

      <View style={styles.servicesRow}>
        <Animated.View style={[styles.serviceCard, { transform: [{ translateX: shakeC }] }]}>
          <MaterialIcons name="local-hospital" size={40} color="#F28C38" />
          <Button 
            title="Santé" 
            onPress={() => router.push('/(tabs)/listeReservation')} 
            color="#000000"
          />
        </Animated.View>
        
        <View style={styles.serviceCard}>
          {/* Carte vide pour équilibrer la mise en page */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#F28C38',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  serviceCard: {
    flex: 1,
    margin: 15,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});