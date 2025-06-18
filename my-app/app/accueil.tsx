import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function AccueilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠️ Les différents Services</Text>

      <Text style={styles.title}>Implementer la fonction vocale</Text>


      <View style={styles.buttonContainer}>
        <Button
          title="🚌 Service Transport"
          onPress={() => router.push('/transport')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="👗 Service Habillement"
          onPress={() => alert("Service Habillement")}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="🏥 Service Santé"
          onPress={() => alert("Service Santé")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginVertical: 10,
  },
});
