import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDqQeBQTn9R9MjL5wJdUmuCwGxG3bQmy5A",
  authDomain: "loyalty-app-2de94.firebaseapp.com",
  projectId: "loyalty-app-2de94",
  storageBucket: "loyalty-app-2de94.firebasestorage.app",
  messagingSenderId: "555953318226",
  appId: "1:555953318226:web:c4a40c099fcfadef9cf28b",
  measurementId: "G-RZ7YJJWHT5",
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
