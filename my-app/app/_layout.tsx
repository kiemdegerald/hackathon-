import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="accueil" options={{ headerShown: false }} />
      <Stack.Screen 
        name="index" 
        // options={{ 
        //   title: "SOS Artisans",
        // }} 
      />
      <Stack.Screen name="test" options={{ title: "Test Screen" }} />
      <Stack.Screen name="Artisan" options={{ title: "SOS Artisan" }} />
      <Stack.Screen name="transport" options={{ title: "Service Transport" }} />
      <Stack.Screen name="(tabs)"   options={{ headerShown: false }} />
    </Stack>
    </PaperProvider>

  );
}
