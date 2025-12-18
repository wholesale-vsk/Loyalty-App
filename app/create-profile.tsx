import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { db } from "../lib/firestore";
import Button from "../components/Button";
import { useTheme } from '../contexts/ThemeContext';

const colorMap: Record<string, string> = {
  blue: '#3B82F6',
  purple: '#4F46E5',
  green: '#10B981',
  orange: '#F59E0B',
};

export default function CreateProfileScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    firstName: false,
    lastName: false,
    username: false,
    idNumber: false,
    email: false,
    contactNumber: false,
    birthday: false,
    address: false,
    city: false,
    country: false,
  });

  const { color } = useTheme();

  // Pick avatar from gallery
  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Permission to access gallery is required!");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) setAvatar(result.assets[0].uri);
    } catch (e) {
      console.log("ImagePicker Error:", e);
    }
  };

  const removeAvatar = () => setAvatar(null);

  const validateUsername = (text: string) => {
    if (text.includes(" ")) {
      setUsernameError("Username cannot contain spaces");
      return false;
    } else if (text.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    } else {
      setUsernameError("");
      return true;
    }
  };

  const handleSaveProfile = async () => {
    // Check for empty fields
    const errors = {
      firstName: !firstName.trim(),
      lastName: !lastName.trim(),
      username: !username.trim(),
      idNumber: !idNumber.trim(),
      email: !email.trim(),
      contactNumber: !contactNumber.trim(),
      birthday: !birthday.trim(),
      address: !address.trim(),
      city: !city.trim(),
      country: !country.trim(),
    };
    setFieldErrors(errors);

    // If any field is missing, show alert and stop
    if (Object.values(errors).some(Boolean)) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    if (!validateUsername(username)) return;

    setLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser!.uid);

      await setDoc(userRef, {
        firstName,
        lastName,
        username,
        idNumber,
        email,
        contactNumber,
        birthday,
        address,
        city,
        country,
        avatar: avatar || "",
        profileCompleted: true,
        updatedAt: new Date(),
      });

      router.replace("../(tabs)/index");
    } catch (error) {
      console.log("Failed to save profile:", error);
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Step progress */}
        <View className="mb-6">
          <Text className="text-gray-500 text-sm mb-1">Step 1 of 1</Text>
          <View className="h-2 w-full bg-gray-200 rounded-full">
            <View
              className="h-2 rounded-full w-full"
              style={{ backgroundColor: colorMap[color] }}
            />
          </View>
        </View>

        <Text className="text-3xl font-bold text-gray-900 mb-4">Create Profile</Text>
        <Text className="text-gray-600 mb-6">Complete your profile to get started</Text>

        {/* Avatar */}
        <View className="mb-6 items-center">
          <TouchableOpacity
            onPress={pickAvatar}
            className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center"
          >
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full" />
            ) : (
              <Ionicons name="camera" size={28} color="#666" />
            )}
          </TouchableOpacity>
          {avatar && (
            <TouchableOpacity onPress={removeAvatar} className="mt-2">
              <Text className="text-red-500 font-medium">Remove Avatar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* First Name */}
        <TextInput
          placeholder="First Name *"
          value={firstName}
          onChangeText={text => {
            setFirstName(text);
            setFieldErrors(prev => ({ ...prev, firstName: false }));
          }}
          className={`border p-3 rounded-md mb-4 ${fieldErrors.firstName ? "border-red-500" : ""}`}
        />
        {fieldErrors.firstName && <Text className="text-red-500 mb-2">First name is required</Text>}

        {/* Last Name */}
        <TextInput
          placeholder="Last Name *"
          value={lastName}
          onChangeText={text => {
            setLastName(text);
            setFieldErrors(prev => ({ ...prev, lastName: false }));
          }}
          className={`border p-3 rounded-md mb-4 ${fieldErrors.lastName ? "border-red-500" : ""}`}
        />
        {fieldErrors.lastName && <Text className="text-red-500 mb-2">Last name is required</Text>}

        {/* Username */}
        <TextInput
          placeholder="Username *"
          value={username}
          onChangeText={text => {
            setUsername(text);
            setFieldErrors(prev => ({ ...prev, username: false }));
            validateUsername(text);
          }}
          className={`border p-3 rounded-md mb-4 ${fieldErrors.username || usernameError ? "border-red-500" : ""}`}
        />
        {usernameError ? <Text className="text-red-500 mb-2">{usernameError}</Text> : null}
        {fieldErrors.username && <Text className="text-red-500 mb-2">Username is required</Text>}

        {/* ID Number */}
        <TextInput
          placeholder="ID Number *"
          value={idNumber}
          onChangeText={text => {
            setIdNumber(text);
            setFieldErrors(prev => ({ ...prev, idNumber: false }));
          }}
          className={`border p-3 rounded-md mb-4 ${fieldErrors.idNumber ? "border-red-500" : ""}`}
        />
        {fieldErrors.idNumber && <Text className="text-red-500 mb-2">ID number is required</Text>}

        {/* Email */}
        <TextInput
          placeholder="Email *"
          value={email}
          onChangeText={text => {
            setEmail(text);
            setFieldErrors(prev => ({ ...prev, email: false }));
          }}
          keyboardType="email-address"
          className={`border p-3 rounded-md mb-4 ${fieldErrors.email ? "border-red-500" : ""}`}
        />
        {fieldErrors.email && <Text className="text-red-500 mb-2">Email is required</Text>}

        {/* Contact Number */}
        <TextInput
          placeholder="Contact Number *"
          value={contactNumber}
          onChangeText={text => {
            setContactNumber(text);
            setFieldErrors(prev => ({ ...prev, contactNumber: false }));
          }}
          keyboardType="phone-pad"
          className={`border p-3 rounded-md mb-4 ${fieldErrors.contactNumber ? "border-red-500" : ""}`}
        />
        {fieldErrors.contactNumber && <Text className="text-red-500 mb-2">Contact number is required</Text>}

        {/* Birthday */}
        <TextInput
          placeholder="Birthday (YYYY-MM-DD) *"
          value={birthday}
          onChangeText={text => {
            setBirthday(text);
            setFieldErrors(prev => ({ ...prev, birthday: false }));
          }}
          className={`border p-3 rounded-md mb-4 ${fieldErrors.birthday ? "border-red-500" : ""}`}
        />
        {fieldErrors.birthday && <Text className="text-red-500 mb-2">Birthday is required</Text>}

        {/* Address */}
        <TextInput
          placeholder="Address *"
          value={address}
          onChangeText={text => {
            setAddress(text);
            setFieldErrors(prev => ({ ...prev, address: false }));
          }}
          className={`border p-3 rounded-md mb-4 ${fieldErrors.address ? "border-red-500" : ""}`}
        />
        {fieldErrors.address && <Text className="text-red-500 mb-2">Address is required</Text>}

        {/* City */}
        <TextInput
          placeholder="City *"
          value={city}
          onChangeText={text => {
            setCity(text);
            setFieldErrors(prev => ({ ...prev, city: false }));
          }}
          className={`border p-3 rounded-md mb-4 ${fieldErrors.city ? "border-red-500" : ""}`}
        />
        {fieldErrors.city && <Text className="text-red-500 mb-2">City is required</Text>}

        {/* Country */}
        <TextInput
          placeholder="Country *"
          value={country}
          onChangeText={text => {
            setCountry(text);
            setFieldErrors(prev => ({ ...prev, country: false }));
          }}
          className={`border p-3 rounded-md mb-4 ${fieldErrors.country ? "border-red-500" : ""}`}
        />
        {fieldErrors.country && <Text className="text-red-500 mb-2">Country is required</Text>}

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSaveProfile}
          disabled={loading}
          style={{
            backgroundColor: colorMap[color],
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            opacity: loading ? 0.6 : 1,
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            {loading ? "Saving..." : "Save Profile"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}