import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { Audio } from 'expo-av';
import { router } from 'expo-router';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // A, B, C, D
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission de microphone requise');
      }
    })();
  }, []);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error('Erreur en démarrant l’enregistrement:', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
    } catch (error) {
      console.error('Erreur à l’arrêt de l’enregistrement:', error);
    }
  };

  const playSound = async () => {
    try {
      if (!recordingUri) return;

      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      await sound.playAsync();
    } catch (err) {
      console.error('Erreur à la lecture audio:', err);
    }
  };

  const handleOption = (option) => {
    setSelectedOption(option);

    switch (option) {
      case 'A':
        setMessage("Vous avez choisi l'option A : Bravo !");
        break;
      case 'B':
        setMessage("Option B sélectionnée. Essayez encore.");
        break;
      case 'C':
        setMessage("Option C - Pas tout à fait.");
        break;
      case 'D':
        setMessage("D ? Bonne tentative, mais non.");
        break;
      default:
        setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Aller vers /" onPress={() => router.push('/')} />

      <Text style={styles.title}>🎤 Enregistreur vocal</Text>
      <Button
        title={recording ? 'Arrêter l’enregistrement' : 'Démarrer l’enregistrement'}
        onPress={recording ? stopRecording : startRecording}
      />

      <View style={styles.spacer} />
      {recordingUri && <Button title="Écouter l’enregistrement" onPress={playSound} />}

      <View style={styles.spacer} />
      <Text style={styles.title}>❓ Choisissez une option :</Text>

      <View style={styles.options}>
        <Button title="Option A" onPress={() => handleOption('A')} />
        <Button title="Option B" onPress={() => handleOption('B')} />
        <Button title="Option C" onPress={() => handleOption('C')} />
        <Button title="Option D" onPress={() => handleOption('D')} />
      </View>

      {message !== '' && (
        <Text style={styles.result}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  spacer: {
    height: 20,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  options: {
    marginVertical: 10,
    gap: 10,
  },
  result: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'blue',
    fontWeight: 'bold',
  },
});
