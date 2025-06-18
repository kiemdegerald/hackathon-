import { StyleSheet, Text, View } from "react-native";

export default function TransportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚌 Service Transport</Text>
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
});