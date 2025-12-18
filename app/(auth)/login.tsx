import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firestore";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { auth } from "../../firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedEmails, setSavedEmails] = useState<string[]>([]);
  const [emailFocused, setEmailFocused] = useState(false);

  // For overlay positioning
  const emailInputWrapperRef = useRef<View>(null);

  useEffect(() => {
    const loadEmails = async () => {
      const data = await AsyncStorage.getItem("savedEmails");
      if (!data) return;
      const localEmails: string[] = JSON.parse(data);
      // Query Firestore users collection for matching emails
      if (localEmails.length === 0) return setSavedEmails([]);
      try {
        const usersRef = collection(db, "users");
        // Firestore does not support 'in' queries with more than 10 items
        const chunks = [];
        for (let i = 0; i < localEmails.length; i += 10) {
          chunks.push(localEmails.slice(i, i + 10));
        }
        let foundEmails: string[] = [];
        for (const chunk of chunks) {
          const q = query(usersRef, where("email", "in", chunk));
          const snapshot = await getDocs(q);
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            if (data.email) foundEmails.push(data.email);
          });
        }
        setSavedEmails(foundEmails);
      } catch (e) {
        setSavedEmails([]);
      }
    };
    loadEmails();
  }, []);

  const saveEmail = async (email: string) => {
    const existing = await AsyncStorage.getItem("savedEmails");
    const emails: string[] = existing ? JSON.parse(existing) : [];
    const updated = [email, ...emails.filter(e => e !== email)];
    await AsyncStorage.setItem(
      "savedEmails",
      JSON.stringify(updated.slice(0, 5))
    );
  };

  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      await saveEmail(email);
      // router.replace("../(tabs)/index");
    } catch (error) {
      console.log("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        {/* <View className="px-6 pt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View> */}

        {/* Logo */}
        <View className="items-center mt-8 mb-8">
          <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center">
            <Text className="text-white text-2xl font-bold">LOGO</Text>
          </View>
        </View>

        {/* Title */}
        <View className="px-6 mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Welcome !
          </Text>
          <Text className="text-gray-600">Log in to your account</Text>
        </View>

        {/* Form */}
        <View className="px-6">
          <View ref={emailInputWrapperRef} style={{ position: "relative" }}>
            <Input
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />

            {/* Email suggestions as overlay */}
            {emailFocused && savedEmails.length > 0 && email.length === 0 && (
              <View
                style={{
                  position: "absolute",
                  top: 56, // adjust if your Input height is different
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                {savedEmails.map(item => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      setEmail(item);
                      setEmailFocused(false);
                    }}
                    style={{
                      padding: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: "#e5e7eb",
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Input
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Forgot Password */}
          <TouchableOpacity className="items-end mb-6">
            <Text className="text-primary font-medium">Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <Button title="SIGN IN" onPress={handleLogin} loading={loading} />

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("../(auth)/signup")}>
              <Text className="text-primary font-semibold">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}