import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerificationScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold mb-4">Verification</Text>
      <Text className="text-gray-600 text-center mb-8">
        Please enter the verification code sent to your email or phone.
      </Text>
      {/* Add your verification form here */}
    </SafeAreaView>
  );
}
