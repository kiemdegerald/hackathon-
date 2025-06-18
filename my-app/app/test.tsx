import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';

export default function VoiceChoiceScreen() {
  const [spokenText, setSpokenText] = useState('');
  const [message, setMessage] = useState('');

  // Au montage : lire message de bienvenue et configurer Voice
  useEffect(() => {
    const speakWelcome = () => {
      Speech.speak(
        'Bienvenue. Veuillez dire A, B, C ou D pour faire votre choix.',
        { language: 'fr-FR' }
      );
    };

    // Configurer les événements
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    speakWelcome();
    startListening();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start('fr-FR');
    } catch (e) {
      console.error('Erreur démarrage Voice:', e);
    }
  };

  const onSpeechResults = (event) => {
    const results = event.value;
    if (results && results.length > 0) {
      const userInput = results[0].toLowerCase().trim();
      setSpokenText(userInput);

      // Vérifier les choix
      switch (userInput) {
        case 'a':
          setMessage("✅ Vous avez choisi l’option A : Bravo !");
          break;
        case 'b':
          setMessage("❌ Option B sélectionnée. Mauvais choix.");
          break;
        case 'c':
          setMessage("❌ Option C sélectionnée. Pas la bonne.");
          break;
        case 'd':
          setMessage("❌ Option D sélectionnée. Ce n’est pas ça.");
          break;
        default:
          setMessage("🚫 Choix non reconnu. Veuillez dire uniquement A, B, C ou D.");
          break;
      }
    }
  };

  const onSpeechError = (error) => {
    console.error('Erreur reconnaissance vocale:', error);
    setMessage("🚫 Erreur lors de la reconnaissance vocale.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗣 Reconnaissance vocale</Text>

      <Button title="Réécouter la consigne" onPress={() =>
        Speech.speak('Veuillez dire A, B, C ou D.', { language: 'fr-FR' })
      } />

      <View style={styles.spacer} />

      <Button title="Réessayer l’écoute" onPress={startListening} />

      <Text style={styles.spokenText}>Vous avez dit : {spokenText}</Text>

      <Text style={styles.result}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  spacer: {
    height: 20,
  },
  spokenText: {
    marginTop: 30,
    fontSize: 18,
    textAlign: 'center',
    color: 'gray',
  },
  result: {
    marginTop: 15,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'blue',
  },
});
