import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

export default function AddNewCardScreen() {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [barcode, setBarcode] = useState('');
  const [notes, setNotes] = useState('');

  const pickImage = async (side: 'front' | 'back') => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (side === 'front') setFrontImage(result.assets[0].uri);
      else setBackImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      {/* Back Button */}
      <View className="pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.push('../add-card')}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold mb-6 text-center">Add New Card</Text>
        {/* Card Images */}
        <View className="flex-row justify-between mb-6">
          {/* Front Side */}
          <View className="items-center flex-1 mr-2">
            <View className="w-32 h-20 bg-gray-200 rounded-xl items-center justify-center mb-2 relative">
              {frontImage ? (
                <Image source={{ uri: frontImage }} className="w-full h-full rounded-xl" />
              ) : (
                <Ionicons name="card-outline" size={40} color="#9CA3AF" />
              )}
              <TouchableOpacity
                className="absolute bottom-1 right-1 bg-primary rounded-full p-1"
                onPress={() => pickImage('front')}
              >
                <Ionicons name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-gray-500">Front Side</Text>
          </View>
          {/* Back Side */}
          <View className="items-center flex-1 ml-2">
            <View className="w-32 h-20 bg-gray-200 rounded-xl items-center justify-center mb-2 relative">
              {backImage ? (
                <Image source={{ uri: backImage }} className="w-full h-full rounded-xl" />
              ) : (
                <Ionicons name="card-outline" size={40} color="#9CA3AF" />
              )}
              <TouchableOpacity
                className="absolute bottom-1 right-1 bg-primary rounded-full p-1"
                onPress={() => pickImage('back')}
              >
                <Ionicons name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-gray-500">Back Side</Text>
          </View>
        </View>
        {/* Card Form */}
        <View className="mb-4">
          <Text className="mb-1 font-semibold">Card Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
            placeholder="Enter card name"
            value={cardName}
            onChangeText={setCardName}
          />
          <Text className="mb-1 font-semibold">Card Number (optional)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
            placeholder="Enter card number"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
          />
          <Text className="mb-1 font-semibold">Barcode Number (optional)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
            placeholder="Enter barcode number"
            value={barcode}
            onChangeText={setBarcode}
            keyboardType="number-pad"
          />
        </View>
        {/* Notes Tab */}
        <View className="mb-6">
          <Text className="mb-1 font-semibold">Notes</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Add any notes (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>
        {/* Save Button (not implemented) */}
        <TouchableOpacity className="bg-primary rounded-lg py-3 items-center mb-8">
          <Text className="text-white font-bold text-lg">Save Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
