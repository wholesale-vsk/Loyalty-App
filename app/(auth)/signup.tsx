// app/(auth)/signup.tsx
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword } from "firebase/auth";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { auth } from "../../firebaseConfig";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [savedEmails, setSavedEmails] = useState<string[]>([]);
  const [emailFocused, setEmailFocused] = useState(false);

    // For overlay positioning
  const emailInputWrapperRef = useRef<View>(null);

  // Load saved emails for suggestions
  useEffect(() => {
    const loadEmails = async () => {
      const data = await AsyncStorage.getItem("savedEmails");
      if (data) setSavedEmails(JSON.parse(data));
    };
    loadEmails();
  }, []);

  // Save email after signup
  const saveEmail = async (email: string) => {
    const existing = await AsyncStorage.getItem("savedEmails");
    const emails: string[] = existing ? JSON.parse(existing) : [];
    const updated = [email, ...emails.filter(e => e !== email)];
    await AsyncStorage.setItem(
      "savedEmails",
      JSON.stringify(updated.slice(0, 5))
    );
  };

  // Sign up handler
  const handleSignUp = async () => {
    if (!email || !password) return;

    setLoading(true);
    try {
      // Create user with email/password
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Optional: save email for suggestions
      await saveEmail(email);

      // Redirect to create profile screen after signup, passing email as param
      router.replace({
        pathname: "../create-profile",
        params: { email },
      });
    } catch (error) {
      console.log("Sign Up failed:", error);
      const code = (error as any)?.code;
      if (code === 'auth/network-request-failed' || (error as any)?.message?.toLowerCase?.().includes('network')) {
        Alert.alert('Network Error', 'Network request failed. Check your internet connection and try again.');
      } else {
        Alert.alert('Sign Up Failed', (error as any)?.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View className="items-center mt-8 mb-8">
          <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center">
            <Text className="text-white text-2xl font-bold">LOGO</Text>
          </View>
        </View>

        {/* Title */}
        <View className="px-6 mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Sign Up</Text>
          <Text className="text-gray-600">Create your account</Text>
        </View>

        {/* Form */}
        <View className="px-6">
          <Input
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Input
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Input
            placeholder="Enter Phone Number (Optional)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {/* Sign Up Button */}
          <View style={{ marginVertical: 16 }}>
            <Button
              title={loading ? "Signing Up..." : "Sign Up"}
              onPress={handleSignUp}
              disabled={loading}
            />
          </View>

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("../(auth)/login")}>
              <Text className="text-primary font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
