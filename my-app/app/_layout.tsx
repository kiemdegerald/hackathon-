import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="test" options={{ title: "Test Screen" }} />
      <Stack.Screen name="accueil" options={{ title: "Accueil" }} />
      <Stack.Screen name="transport" options={{ title: "Transport" }} />
    </Stack>
  );
}
