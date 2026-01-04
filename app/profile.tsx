import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { doc, getDoc, getDocFromCache, updateDoc } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { db } from "../lib/firestore";

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [membershipType, setMembershipType] = useState('');
  const [memberSince, setMemberSince] = useState('');
  const [avatar, setAvatar] = useState('https://via.placeholder.com/100');
  const [loading, setLoading] = useState(false);

  // Fetch user profile from Firestore on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      const userRef = doc(db, "users", auth.currentUser.uid);
      let docSnap: any = null;
      try {
        docSnap = await getDoc(userRef);
      } catch (readErr) {
        console.warn('getDoc failed, attempting cache fallback', readErr);
        try {
          docSnap = await getDocFromCache(userRef);
        } catch (cacheErr) {
          console.warn('getDocFromCache failed', cacheErr);
          return;
        }
      }

      if (docSnap && docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
        setPhone(data.contactNumber || '');
        setDateOfBirth(data.birthday || '');
        setAddress(data.address || '');
        setMembershipType(data.membershipType || 'Gold Member');
        setMemberSince(data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'January 2024');
        if (data.avatar) setAvatar(data.avatar);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser!.uid);
      await updateDoc(userRef, {
        firstName,
        lastName,
        email,
        contactNumber: phone,
        birthday: dateOfBirth,
        address,
        updatedAt: new Date(),
      });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = () => {
    // TODO: Implement image picker
    Alert.alert('Image Picker', 'Select profile photo', [
      { text: 'Camera', onPress: () => console.log('Camera') },
      { text: 'Gallery', onPress: () => console.log('Gallery') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="Edit Profile"
        showBack={true}
        rightComponent={
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text className="text-blue-500 font-semibold">{isEditing ? 'Cancel' : 'Edit'}</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView className="px-4 mt-4">
        {/* Profile Photo */}
        <View className="items-center mb-6">
          <TouchableOpacity onPress={handleImagePick}>
            <Image
              source={{ uri: avatar }}
              className="w-24 h-24 rounded-full"
            />
          </TouchableOpacity>
          <Text className="mt-2 text-lg font-semibold">
            {firstName} {lastName}
          </Text>
          <Text className="text-gray-500">{membershipType}</Text>
        </View>

        {/* Personal Information */}
        <Text className="text-gray-700 font-semibold mb-2">Personal Information</Text>
        <Input label="First Name" value={firstName} onChangeText={setFirstName} editable={isEditing} />
        <Input label="Last Name" value={lastName} onChangeText={setLastName} editable={isEditing} />
        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          editable={isEditing}
          keyboardType="email-address"
        />
        <Input
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          editable={isEditing}
          keyboardType="phone-pad"
        />
        <Input label="Date of Birth" value={dateOfBirth} onChangeText={setDateOfBirth} editable={isEditing} />
        <Input label="Address" value={address} onChangeText={setAddress} editable={isEditing} multiline />

        {/* Membership Information */}
        <Text className="text-gray-700 font-semibold mt-6 mb-2">Membership Information</Text>
        <View className="bg-gray-100 p-4 rounded-lg mb-4">
          <Text className="text-gray-500">Current Plan</Text>
          <Text className="font-semibold">{membershipType}</Text>
        </View>
        <View className="bg-gray-100 p-4 rounded-lg mb-4">
          <Text className="text-gray-500">Member Since</Text>
          <Text className="font-semibold">{memberSince}</Text>
        </View>

        {/* Save Button */}
        {isEditing && (
          <Button title={loading ? 'Saving...' : 'Save Changes'} onPress={handleSave} disabled={loading} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}