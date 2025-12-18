import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Button from '../../components/Button';

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
      <View className="items-center">

        {/* Logo */}
        <Image
          source={require('../../assets/images/icon.png')}
          style={{ width: 120, height: 120, marginBottom: 20 }}
        />

        {/* Title */}
        <Text className="text-3xl font-bold text-center mb-2">
          Welcome to Expo Loyalty
        </Text>

        {/* Subtitle */}
        <Text className="text-base text-gray-600 text-center mb-10">
          Your exclusive access to rewards, offers {'\n'}and more. Let's get started!
        </Text>

        {/* Buttons */}
        <View className="w-full mt-4">
          <Button
            title="Log In"
            onPress={() => router.navigate('/(auth)/login')}
            variant="primary"
          />
        </View>

        <View className="w-full mt-4">
          <Button
            title="Sign Up"
            onPress={() => router.navigate("/(auth)/signup")}
            variant="primary"
          />
        </View>

      </View>
    </SafeAreaView>
  );
}
