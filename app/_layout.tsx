import { Stack, useSegments, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

function RootNavigation() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    // Not logged in → go to auth welcome screen
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/welcome");
    }

    // Logged in → go to tabs
    if (user && inAuthGroup) {
      router.replace("../..");
    }
  }, [user, loading, segments]);

  // While auth state is loading, render nothing
  if (loading) return null;

  return (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(auth)" />
    <Stack.Screen name="(tabs)" />
  </Stack>
);
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <RootNavigation />
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
