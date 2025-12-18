import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';

export default function PaymentSuccessScreen() {
  const { color } = useTheme();

  // You may want to dynamically set these values in a real app
  const amountPaid = '$99.00';
  const transactionDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const transactionId = 'TXN123456789';

  const colorMap: Record<string, string> = {
    blue: '#3B82F6',
    purple: '#4F46E5',
    green: '#10B981',
    orange: '#F59E0B',
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        {/* Success Icon */}
        <View className="w-32 h-32 rounded-full items-center justify-center mb-8" style={{ backgroundColor: colorMap.green + '20' }}>
          <View className="w-24 h-24 rounded-full items-center justify-center" style={{ backgroundColor: colorMap.green }}>
            <Ionicons name="checkmark" size={60} color="#fff" />
          </View>
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-gray-900 mb-3 text-center">
          Payment Successful
        </Text>

        {/* Message */}
        <Text className="text-gray-600 text-center mb-8 px-4">
          Your membership has been renewed.{'\n'}Welcome back!
        </Text>

        {/* Payment Details */}
        <View className="w-full bg-gray-50 rounded-2xl p-6 mb-8">
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Amount Paid</Text>
            <Text className="text-gray-900 font-bold text-lg">{amountPaid}</Text>
          </View>
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Date</Text>
            <Text className="text-gray-900 font-semibold">{transactionDate}</Text>
          </View>
          
          <View className="border-t border-gray-200 my-3" />
          
          <View className="items-center">
            <Text className="text-gray-600 text-sm mb-2">Transaction ID</Text>
            <Text className="text-gray-900 font-mono">{transactionId}</Text>
          </View>
        </View>

        {/* Buttons */}
        <View className="w-full space-y-4">
          <Button
            title="Go to Home"
            onPress={() => router.replace('../(index)')}
          />
          
          <TouchableOpacity
            onPress={() => router.push('/membership')}
            className="py-4 items-center"
          >
            <Text style={{ color: colorMap[color], fontWeight: '600' }}>
              View Membership Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}