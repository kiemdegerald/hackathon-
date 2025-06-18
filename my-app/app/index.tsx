import { router } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bienvenue sur l’accueil</Text>

      <Button
        title="Aller vers /test"
        onPress={() => router.push("/test")}
      />
    
    </View>
  );
}
