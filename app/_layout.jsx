import { Stack } from "expo-router";
import { AuthProvider } from "@/context/auth-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="result"
          options={{ headerShown: true, title: "Scan Result" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
